/**
 * İstemciye gidebilen yapılandırma.
 *
 * Bilinçli olarak `lib/config.ts`'ten ayrı: o modül sunucu tarafı ortam
 * değişkenlerini (AGENT_API_URL gibi) okur ve bir istemci bileşeni ondan değer
 * import ettiğinde modülün tamamı tarayıcı paketine giriyor. Değer sızmıyor
 * (Next, NEXT_PUBLIC_ olmayan değişkenleri istemciye koymaz) ama sunucuya ait
 * bir modülün istemci paketinde bulunması istenmez: ileride biri o
 * değişkenlerden birini NEXT_PUBLIC_ yaparsa gerçek bir sızıntıya dönüşür.
 *
 * Burada yalnızca herkese açık, ortamdan okunmayan sabitler durur.
 */

export type AppMode = "demo" | "live";

/**
 * Gezinme sirasi. Etiketler burada DURMAZ: her dilin sozlugunden okunur
 * (`messages.nav`). Burada yalnizca yol ve sira var, cunku bunlar dilden
 * bagimsiz.
 */
export const NAV_ITEMS = [
  { href: "/" },
  { href: "/system" },
  { href: "/playground" },
  { href: "/evaluation" },
  { href: "/about" },
] as const;
