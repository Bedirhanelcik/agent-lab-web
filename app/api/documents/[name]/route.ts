import { NextResponse } from "next/server";

import { AGENT_API_TIMEOUT_MS, AGENT_API_URL, APP_MODE, UPLOAD_ENABLED } from "@/lib/config";
import { removeDocument } from "@/lib/documents-api";

/**
 * Tek bir dokümanı korpustan kaldırır.
 *
 * Üç kapı da sunucuda: demo modunda korpus yoktur, UPLOAD_ENABLED kapalıysa
 * istek backend'e hiç gitmez, backend de aynı bayrağı kendi tarafında bir kez
 * daha kontrol eder. Yazma yetkisi "yükleyebilen silebilir" kuralına bağlı;
 * operatör token'ı bu yola hiç girmez.
 */
export async function DELETE(_request: Request, context: RouteContext<"/api/documents/[name]">) {
  if (APP_MODE === "demo") {
    return NextResponse.json({ ok: false, kind: "not_configured" as const }, { status: 409 });
  }
  if (!UPLOAD_ENABLED) {
    return NextResponse.json({ ok: false, kind: "read_only" as const }, { status: 403 });
  }

  const { name } = await context.params;
  const result = await removeDocument(decodeURIComponent(name), {
    baseUrl: AGENT_API_URL,
    timeoutMs: AGENT_API_TIMEOUT_MS,
  });

  const status = result.ok
    ? 200
    : result.kind === "read_only"
      ? 403
      : result.kind === "not_found"
        ? 404
        : 502;

  return NextResponse.json(result, { status });
}
