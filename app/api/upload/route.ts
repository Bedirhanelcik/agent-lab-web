import { NextResponse } from "next/server";

import { APP_MODE, AGENT_API_TIMEOUT_MS, AGENT_API_URL, UPLOAD_ENABLED } from "@/lib/config";
import { uploadDocuments } from "@/lib/upload-api";

/**
 * Doküman yüklemenin tek giriş noktası.
 *
 * Üç kapı var ve hepsi sunucuda: demo modunda yükleme yoktur, UPLOAD_ENABLED
 * kapalıysa istek backend'e hiç gitmez, ve backend de aynı bayrağı kendi
 * tarafında bir kez daha kontrol eder. Tarayıcı backend adresini görmez.
 */
export async function POST(request: Request) {
  if (APP_MODE === "demo") {
    return NextResponse.json({ ok: false, kind: "upload_disabled" as const }, { status: 409 });
  }

  if (!UPLOAD_ENABLED) {
    return NextResponse.json({ ok: false, kind: "upload_disabled" as const }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, kind: "invalid_request" as const }, { status: 400 });
  }

  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File);

  const result = await uploadDocuments(files, {
    baseUrl: AGENT_API_URL,
    enabled: true,
    timeoutMs: AGENT_API_TIMEOUT_MS * 3,
  });

  const status = result.ok
    ? 200
    : result.kind === "upload_disabled"
      ? 403
      : result.kind === "file_too_large"
        ? 413
        : result.kind === "unsupported_file_type" ||
            result.kind === "invalid_request" ||
            result.kind === "no_files"
          ? 400
          : result.kind === "timeout"
            ? 504
            : 502;

  return NextResponse.json(result, { status });
}
