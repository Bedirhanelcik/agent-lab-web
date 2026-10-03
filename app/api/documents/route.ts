import { NextResponse } from "next/server";

import { AGENT_API_TIMEOUT_MS, AGENT_API_URL, APP_MODE } from "@/lib/config";
import { fetchCorpus } from "@/lib/documents-api";

/**
 * Korpusun durumunu okur.
 *
 * Tarayıcı backend'in adresini görmez; istek bu sunucu üzerinden geçer.
 * Demo modunda backend'e hiç gidilmez: o modda korpus kavramı yoktur,
 * gösterilen koşular hazır veridir.
 */
export async function GET() {
  if (APP_MODE === "demo") {
    return NextResponse.json({ ok: false, kind: "not_configured" as const }, { status: 409 });
  }

  const result = await fetchCorpus({
    baseUrl: AGENT_API_URL,
    timeoutMs: AGENT_API_TIMEOUT_MS,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
