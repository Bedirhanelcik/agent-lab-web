/**
 * Korpus yönetimi istemcisi.
 *
 * `/documents` uç noktalarını YALNIZCA sunucu tarafında çağırır. Tarayıcı
 * backend'in adresini hiç görmez; istekler Next.js route handler'larından
 * geçer. Burada hiçbir sır okunmaz: silme ve sıfırlama yetkisi backend'de
 * `UPLOAD_ENABLED` bayrağına bağlı, operatör token'ına değil.
 *
 * Bu modül hiçbir şey içe aktarmaz, böylece Node'un dahili test runner'ı
 * tarafından doğrudan yüklenebiliyor ve `fetch` enjekte edilerek ağ erişimi
 * olmadan test edilebiliyor.
 */

export const DOCUMENT_ERROR_KINDS = [
  "not_configured",
  "read_only",
  "not_found",
  "upstream_error",
  "bad_response",
  "timeout",
  "network",
] as const;

export type DocumentErrorKind = (typeof DOCUMENT_ERROR_KINDS)[number];

export const DEFAULT_DOCUMENTS_TIMEOUT_MS = 30_000;

export interface DocumentItem {
  source_file: string;
  chunk_count: number;
}

export interface CorpusState {
  documents: DocumentItem[];
  total_chunks: number;
  keyword_index_size: number;
  can_modify: boolean;
}

export type CorpusOutcome =
  | { ok: true; corpus: CorpusState }
  | { ok: false; kind: DocumentErrorKind };

export interface DocumentsOptions {
  baseUrl?: string | null;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/u, "")}${path}`;
}

/** HTTP durumunu ve backend'in hata kodunu tek bir türe indirger. */
export function mapDocumentError(status: number, body: unknown): DocumentErrorKind {
  const detail = (body as { detail?: { code?: unknown } } | null)?.detail;
  const code = typeof detail?.code === "string" ? detail.code : null;

  if (code === "upload_disabled") return "read_only";
  if (code === "document_not_found") return "not_found";
  if (status === 403) return "read_only";
  if (status === 404) return "not_found";
  return "upstream_error";
}

/** Gelen gövdenin beklenen şekli taşıdığını doğrular. */
export function normalizeCorpus(body: unknown): CorpusState | null {
  if (body === null || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;

  if (!Array.isArray(raw.documents)) return null;
  if (typeof raw.total_chunks !== "number") return null;
  if (typeof raw.keyword_index_size !== "number") return null;
  if (typeof raw.can_modify !== "boolean") return null;

  const documents: DocumentItem[] = [];
  for (const entry of raw.documents) {
    if (entry === null || typeof entry !== "object") return null;
    const item = entry as Record<string, unknown>;
    if (typeof item.source_file !== "string" || typeof item.chunk_count !== "number") {
      return null;
    }
    documents.push({ source_file: item.source_file, chunk_count: item.chunk_count });
  }

  return {
    documents,
    total_chunks: raw.total_chunks,
    keyword_index_size: raw.keyword_index_size,
    can_modify: raw.can_modify,
  };
}

async function call(
  path: string,
  method: "GET" | "DELETE" | "POST",
  options: DocumentsOptions,
): Promise<{ status: number; body: unknown } | { kind: DocumentErrorKind }> {
  const baseUrl = options.baseUrl?.trim();
  if (!baseUrl) return { kind: "not_configured" };

  const doFetch = options.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await doFetch(joinUrl(baseUrl, path), {
      method,
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_DOCUMENTS_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const name = (error as { name?: string } | null)?.name;
    if (name === "TimeoutError" || name === "AbortError") return { kind: "timeout" };
    return { kind: "network" };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

/** Korpusun güncel durumunu okur. */
export async function fetchCorpus(options: DocumentsOptions = {}): Promise<CorpusOutcome> {
  const result = await call("/documents", "GET", options);
  if ("kind" in result) return { ok: false, kind: result.kind };
  if (result.status !== 200) {
    return { ok: false, kind: mapDocumentError(result.status, result.body) };
  }

  const corpus = normalizeCorpus(result.body);
  return corpus ? { ok: true, corpus } : { ok: false, kind: "bad_response" };
}

/**
 * Bir dokümanı korpustan kaldırır.
 *
 * Dosya adı yol bileşeni taşıyamaz: backend de ayrıca sanitize ediyor ama
 * burada da kodlanıyor, böylece `../` içeren bir ad hiç gönderilmiyor.
 */
export async function removeDocument(
  sourceFile: string,
  options: DocumentsOptions = {},
): Promise<{ ok: true } | { ok: false; kind: DocumentErrorKind }> {
  const name = sourceFile.trim();
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) {
    return { ok: false, kind: "not_found" };
  }

  const result = await call(`/documents/${encodeURIComponent(name)}`, "DELETE", options);
  if ("kind" in result) return { ok: false, kind: result.kind };
  if (result.status !== 200) {
    return { ok: false, kind: mapDocumentError(result.status, result.body) };
  }
  return { ok: true };
}

/** Korpusu tamamen boşaltır. */
export async function resetCorpus(
  options: DocumentsOptions = {},
): Promise<{ ok: true } | { ok: false; kind: DocumentErrorKind }> {
  const result = await call("/documents/reset", "POST", options);
  if ("kind" in result) return { ok: false, kind: result.kind };
  if (result.status !== 200) {
    return { ok: false, kind: mapDocumentError(result.status, result.body) };
  }
  return { ok: true };
}
