import { NextResponse } from "next/server";

import { askAgent } from "@/lib/agent-api";
import { AGENT_API_TIMEOUT_MS, AGENT_API_URL, APP_MODE } from "@/lib/config";

/**
 * Playground'un canlı modda konuştuğu tek uç nokta.
 *
 * Tarayıcı yalnızca bu yolu bilir; `AGENT_API_URL` ve backend'in sırları
 * sunucuda kalır. Demo modunda bu uç nokta kasıtlı olarak hiçbir şey
 * çağırmaz -- demo yolu tamamen istemci tarafında yerel veriyle çalışır, bu
 * yüzden buraya düşen bir istek yapılandırma hatasıdır.
 */
export async function POST(request: Request) {
  if (APP_MODE === "demo") {
    return NextResponse.json(
      { ok: false, kind: "not_configured" as const },
      { status: 409 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, kind: "invalid_request" as const }, { status: 400 });
  }

  const body = (payload ?? {}) as { question?: unknown; top_k?: unknown };
  const question = typeof body.question === "string" ? body.question : "";
  const topK = typeof body.top_k === "number" ? body.top_k : null;

  const result = await askAgent(question, {
    baseUrl: AGENT_API_URL,
    topK,
    timeoutMs: AGENT_API_TIMEOUT_MS,
  });

  // Durum kodu bilgilendirici; istemci kararını gövdedeki ayrıştırılmış
  // `kind` alanına göre verir.
  const status = result.ok
    ? 200
    : result.kind === "invalid_request"
      ? 400
      : result.kind === "timeout"
        ? 504
        : 502;

  return NextResponse.json(result, { status });
}
