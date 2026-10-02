/**
 * Sunucu tarafında okunan yapılandırma.
 *
 * DEMO_MODE bilinçli olarak NEXT_PUBLIC_ değildir: mod kararı sunucuda verilir
 * ve arayüze yalnızca sonucu aktarılır. P2'de canlı mod henüz yok, bu yüzden
 * varsayılan demo'dur ve açıkça "false" yazılmadıkça demo kalır.
 */
// Tip ui-config modulunden geliyor; buradan yeniden ihrac ediliyor ki
// sunucu tarafindaki cagiranlar tek yerden import edebilsin.
export type { AppMode } from "./ui-config";
import type { AppMode } from "./ui-config";

export const APP_MODE: AppMode = process.env.DEMO_MODE === "false" ? "live" : "demo";

/** Boş/tanımsız ise link hiç render edilmez. */
function publicUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Backend adresi bilinçli olarak NEXT_PUBLIC_ DEĞİLDİR: tarayıcı backend'in
 * nerede olduğunu hiç öğrenmez, istekler Next.js route handler'ı üzerinden
 * geçer. Hiçbir API anahtarı bu dosyadan tarayıcıya taşınmaz.
 */
export const AGENT_API_URL = process.env.AGENT_API_URL?.trim() || null;

const parsedTimeout = Number.parseInt(process.env.AGENT_API_TIMEOUT_MS ?? "", 10);
export const AGENT_API_TIMEOUT_MS = Number.isFinite(parsedTimeout) && parsedTimeout > 0
  ? parsedTimeout
  : 45_000;

/**
 * Doküman yükleme varsayılan olarak KAPALI.
 *
 * Mevcut korpus tüm ziyaretçiler arasında paylaşımlı; kullanıcı izolasyonu bu
 * aşamanın kapsamında değil. Bu yüzden yükleme yalnızca yerel geliştirmede
 * açılır ve dağıtımda kapalı kalır.
 */
export const UPLOAD_ENABLED = process.env.UPLOAD_ENABLED === "true";

export const GITHUB_URL = publicUrl(process.env.NEXT_PUBLIC_GITHUB_URL);
export const LINKEDIN_URL = publicUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL);

