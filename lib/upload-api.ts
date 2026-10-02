/**
 * Doküman yükleme istemcisi.
 *
 * Sunucu tarafında FastAPI'nin `/upload` uç noktasını çağırmak için, istemci
 * tarafında ise gönderim öncesi hızlı doğrulama için kullanılır. Bu modül hiçbir
 * şey içe aktarmaz, böylece Node'un dahili test runner'ı tarafından doğrudan
 * yüklenebiliyor ve `fetch` enjekte edilerek ağ erişimi olmadan test ediliyor.
 *
 * Yükleme bilinçli olarak varsayılan kapalı bir özellik: mevcut korpus
 * ziyaretçiler arasında paylaşımlı, kullanıcı izolasyonu yok.
 */

export const ACCEPTED_UPLOAD_EXTENSIONS = [".pdf", ".txt", ".md"] as const;

/** Backend'in varsayılanıyla aynı (10 MiB). */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const DEFAULT_UPLOAD_TIMEOUT_MS = 120_000;

export const UPLOAD_ERROR_KINDS = [
  "not_configured",
  "upload_disabled",
  "no_files",
  "unsupported_file_type",
  "file_too_large",
  "invalid_request",
  "upstream_error",
  "bad_response",
  "timeout",
  "network",
] as const;

export type UploadErrorKind = (typeof UPLOAD_ERROR_KINDS)[number];

export interface UploadedFileResult {
  filename: string;
  chunks_created: number;
  status: "ingested" | "failed";
}

export type UploadOutcome =
  | { ok: true; files: UploadedFileResult[]; total_chunks: number; corpus_chunks: number }
  | { ok: false; kind: UploadErrorKind };

export interface UploadOptions {
  baseUrl?: string | null;
  enabled?: boolean;
  timeoutMs?: number;
  maxBytes?: number;
  fetchImpl?: typeof fetch;
}

/**
 * Uzantıyı küçük harfe çevirir.
 *
 * Burada `toLowerCase()` güvenli: uzantılar ASCII ve JavaScript'in
 * `toLowerCase()` fonksiyonu locale'den bağımsızdır (locale'e duyarlı olan
 * `toLocaleLowerCase`). Türkçe metin eşleştirmesinde kaçındığımız i/ı sorunu
 * burada geçerli değil.
 */
export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

export function isAcceptedUploadName(name: string): boolean {
  return (ACCEPTED_UPLOAD_EXTENSIONS as readonly string[]).includes(fileExtension(name));
}

/** Gönderim öncesi hızlı doğrulama; sorun yoksa null döner. */
export function validateUploadFiles(
  files: readonly { name: string; size: number }[],
  maxBytes: number = MAX_UPLOAD_BYTES,
): UploadErrorKind | null {
  if (files.length === 0) return "no_files";
  for (const file of files) {
    if (!isAcceptedUploadName(file.name)) return "unsupported_file_type";
    if (file.size > maxBytes) return "file_too_large";
  }
  return null;
}

/** Backend'in `detail.code` değerini hata türüne eşler. */
export function mapUploadError(status: number, body: unknown): UploadErrorKind {
  const detail = (body as { detail?: { code?: unknown } } | null)?.detail;
  const code = typeof detail?.code === "string" ? detail.code : null;

  if (code === "upload_disabled") return "upload_disabled";
  if (code === "file_too_large") return "file_too_large";
  if (code === "unsupported_file_type") return "unsupported_file_type";
  if (code === "invalid_filename") return "invalid_request";

  if (status === 403) return "upload_disabled";
  if (status === 413) return "file_too_large";
  if (status === 400 || status === 422) return "invalid_request";
  return "upstream_error";
}

/** Yanıtı doğrular ve yalnızca sözleşme alanlarını geçirir. */
export function normalizeUploadResponse(raw: unknown): UploadOutcome | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as { files?: unknown; total_chunks?: unknown; corpus_chunks?: unknown };
  if (!Array.isArray(data.files)) return null;

  const files: UploadedFileResult[] = [];
  for (const entry of data.files) {
    const item = (entry ?? {}) as Partial<UploadedFileResult>;
    if (typeof item.filename !== "string") return null;
    if (item.status !== "ingested" && item.status !== "failed") return null;
    files.push({
      filename: item.filename,
      chunks_created: typeof item.chunks_created === "number" ? item.chunks_created : 0,
      status: item.status,
    });
  }

  return {
    ok: true,
    files,
    total_chunks: typeof data.total_chunks === "number" ? data.total_chunks : 0,
    corpus_chunks: typeof data.corpus_chunks === "number" ? data.corpus_chunks : 0,
  };
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/u, "")}${path}`;
}

/**
 * Dosyaları ingestion pipeline'ına gönderir. İstisna fırlatmaz; her sonuç
 * ayrıştırılmış bir tür olarak döner.
 */
export async function uploadDocuments(
  files: readonly File[],
  options: UploadOptions = {},
): Promise<UploadOutcome> {
  // Kapalıyken hiç istek atılmaz: bayrak sunucu tarafında da kontrol edilir,
  // bu yalnızca gereksiz turu engellemek için.
  if (options.enabled === false) return { ok: false, kind: "upload_disabled" };

  const baseUrl = options.baseUrl?.trim();
  if (!baseUrl) return { ok: false, kind: "not_configured" };

  const maxBytes = options.maxBytes ?? MAX_UPLOAD_BYTES;
  const problem = validateUploadFiles(files, maxBytes);
  if (problem) return { ok: false, kind: problem };

  const form = new FormData();
  for (const file of files) form.append("files", file, file.name);

  const doFetch = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await doFetch(joinUrl(baseUrl, "/upload"), {
      method: "POST",
      body: form,
      // Ingestion embedding üretimi içerdiği için sorgudan uzun sürebilir,
      // ama sonsuz beklemiyoruz.
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS),
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

  if (!response.ok) return { ok: false, kind: mapUploadError(response.status, body) };

  return normalizeUploadResponse(body) ?? { ok: false, kind: "bad_response" };
}
