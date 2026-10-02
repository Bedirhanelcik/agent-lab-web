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

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/system", label: "System" },
  { href: "/playground", label: "Playground" },
  { href: "/evaluation", label: "Evaluation" },
  { href: "/about", label: "About" },
] as const;
