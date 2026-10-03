/**
 * FastAPI `/agent/ask` istemcisi. YALNIZCA sunucu tarafında çalışır.
 *
 * Tarayıcı bu modülü hiç görmez: istekler Next.js route handler'ı üzerinden
 * geçer, böylece `AGENT_API_URL` ve backend'in tuttuğu sırlar istemciye
 * sızmaz ve CORS'a ihtiyaç kalmaz. Gemini hiçbir zaman buradan çağrılmaz;
 * tek muhatap FastAPI'dir.
 *
 * `./agent-contract.ts` açık uzantıyla içe aktarılıyor: modül bu sayede
 * Node'un dahili test runner'ı tarafından da yüklenebiliyor ve fetch enjekte
 * edilerek ağ erişimi olmadan test edilebiliyor.
 */

import { normalizeAgentRun, type AgentRun } from "./agent-contract.ts";

export const AGENT_API_ERROR_KINDS = [
  "not_configured",
  "invalid_request",
  "quota_exhausted",
  "generation_error",
  "agent_unavailable",
  "corpus_empty",
  "upstream_error",
  "bad_response",
  "timeout",
  "network",
] as const;

export type AgentApiErrorKind = (typeof AGENT_API_ERROR_KINDS)[number];

export type AgentApiResult =
  | { ok: true; run: AgentRun }
  | { ok: false; kind: AgentApiErrorKind };

export const DEFAULT_TIMEOUT_MS = 45_000;

export interface AskAgentOptions {
  baseUrl?: string | null;
  topK?: number | null;
  /**
   * Cevabin dili. Backend bunu system prompt'una bir direktif olarak
   * ekler; soru cevrilmez ve EK bir model cagrisi yapilmaz. Verilmezse
   * backend korpusun dilini kullanir.
   */
  language?: string | null;
  timeoutMs?: number;
  /** Testlerde ağ erişimi olmadan çalışmak için enjekte edilir. */
  fetchImpl?: typeof fetch;
}

/** Backend'in `detail.code` değerini hata türüne eşler. */
export function mapErrorResponse(status: number, body: unknown): AgentApiErrorKind {
  const detail = (body as { detail?: { code?: unknown } } | null)?.detail;
  const code = typeof detail?.code === "string" ? detail.code : null;

  if (code === "quota_exhausted") return "quota_exhausted";
  if (code === "generation_error") return "generation_error";
  if (code === "agent_unavailable") return "agent_unavailable";
  if (code === "corpus_empty") return "corpus_empty";
  if (code === "retrieval_error") return "upstream_error";

  // Kod gelmezse HTTP durumuna düşülür; backend sözleşmesiyle aynı eşleme.
  if (status === 429) return "quota_exhausted";
  if (status === 502) return "generation_error";
  if (status === 503) return "agent_unavailable";
  if (status === 409) return "corpus_empty";
  if (status === 422 || status === 400) return "invalid_request";
  return "upstream_error";
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/u, "")}${path}`;
}

/**
 * Agent'a bir soru sorar. Hiçbir durumda istisna fırlatmaz: her sonuç
 * ayrıştırılmış bir tür olarak döner, böylece arayüz her duruma karşılık
 * anlamlı bir şey gösterebilir.
 */
export async function askAgent(
  question: string,
  options: AskAgentOptions = {},
): Promise<AgentApiResult> {
  const baseUrl = options.baseUrl?.trim();
  if (!baseUrl) return { ok: false, kind: "not_configured" };

  const trimmed = question.trim();
  if (!trimmed) return { ok: false, kind: "invalid_request" };
  if (options.topK !== undefined && options.topK !== null) {
    if (!Number.isInteger(options.topK) || options.topK < 1) {
      return { ok: false, kind: "invalid_request" };
    }
  }

  const payload: { question: string; top_k?: number; language?: string } = {
    question: trimmed,
  };
  if (options.topK !== undefined && options.topK !== null) payload.top_k = options.topK;
  const language = options.language?.trim();
  if (language) payload.language = language;

  const doFetch = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let response: Response;
  try {
    response = await doFetch(joinUrl(baseUrl, "/agent/ask"), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      // Sonsuz bekleme olmasın; agent birkaç model çağrısı yapabildiği için
      // eşik cömert tutuluyor ama sınırsız değil.
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (error) {
    const name = (error as { name?: string } | null)?.name;
    if (name === "TimeoutError" || name === "AbortError") return { ok: false, kind: "timeout" };
    return { ok: false, kind: "network" };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) return { ok: false, kind: mapErrorResponse(response.status, body) };

  const normalized = normalizeAgentRun(body);
  if (!normalized.ok) return { ok: false, kind: "bad_response" };

  return { ok: true, run: normalized.run };
}
