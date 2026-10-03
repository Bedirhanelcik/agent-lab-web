/**
 * Tema seçimi.
 *
 * Seçim bir ÇEREZDE saklanıyor, localStorage'da değil. Sebebi hydration:
 * localStorage yalnızca tarayıcıda okunabildiği için sunucu, kullanıcının
 * seçimini bilemez. O durumda yalnızca iki seçenek kalır ve ikisi de kötüdür:
 *
 *   1. Sunucu temayı hiç yazmaz, bir inline betik `<html>` üzerindeki
 *      `data-theme`'i boyamadan önce değiştirir. Ama `<html>` React'in
 *      hydrate ettiği bir eleman: sunucunun ürettiği HTML'de olmayan bir
 *      öznitelik istemcide belirince React "attributes didn't match" uyarısı
 *      verir. `suppressHydrationWarning` bunu yalnızca gizler, uyuşmazlığı
 *      ortadan kaldırmaz.
 *   2. Tema hydration sonrasında uygulanır -- bu da ilk karede yanlış tema,
 *      yani göz alıcı bir flash demektir.
 *
 * Çerez sunucuda okunabildiği için ikisi de gerekmiyor: sunucu `data-theme`'i
 * doğru değerle üretiyor, istemcinin ilk render'ı birebir aynı oluyor ve ilk
 * boyama zaten doğru temada yapılıyor. Dil seçimi de aynı nedenle çerezde
 * duruyor.
 */

export const THEMES = ["dark", "light"] as const;

export type Theme = (typeof THEMES)[number];

/**
 * Uygulamanın varsayılanı KOYU.
 *
 * İşletim sistemi tercihi bilinçli olarak dikkate alınmıyor: bu arayüz koyu
 * görünüm için tasarlandı ve ilk ziyaretin hangi temada açılacağı uygulamanın
 * kararı. Kullanıcı aydınlığı seçerse tercihi çerezde saklanır ve sonraki
 * ziyaretlerde korunur.
 */
export const DEFAULT_THEME: Theme = "dark";

export const THEME_COOKIE = "agentlab_theme";

/** Bir yıl: tema tercihi kalıcı bir tercih, oturumluk değil. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** Tanınmayan veya eksik bir değer uygulamanın varsayılanına düşer. */
export function normalizeTheme(value: string | null | undefined): Theme {
  return isTheme(value) ? value : DEFAULT_THEME;
}

/** Tarayıcıda seçimi saklar. Sunucu bir sonraki render'da bunu okur. */
export function persistTheme(theme: Theme): void {
  // `Secure` bilerek yok: yerel geliştirme http üzerinden çalışıyor ve bu
  // çerez bir sır değil, yalnızca görsel bir tercih taşıyor.
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}
