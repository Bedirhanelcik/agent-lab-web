/**
 * Sunucu tarafında okunan yapılandırma.
 *
 * DEMO_MODE bilinçli olarak NEXT_PUBLIC_ değildir: mod kararı sunucuda verilir
 * ve arayüze yalnızca sonucu aktarılır. P2'de canlı mod henüz yok, bu yüzden
 * varsayılan demo'dur ve açıkça "false" yazılmadıkça demo kalır.
 */
export type AppMode = "demo" | "live";

export const APP_MODE: AppMode = process.env.DEMO_MODE === "false" ? "live" : "demo";

/** Boş/tanımsız ise link hiç render edilmez. */
function publicUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const GITHUB_URL = publicUrl(process.env.NEXT_PUBLIC_GITHUB_URL);
export const LINKEDIN_URL = publicUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL);

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/system", label: "System" },
  { href: "/playground", label: "Playground" },
  { href: "/about", label: "About" },
] as const;
