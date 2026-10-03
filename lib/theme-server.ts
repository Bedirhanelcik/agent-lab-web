/**
 * Seçili temayı sunucu tarafında çözer. YALNIZCA sunucu bileşenlerinden
 * çağrılabilir (`cookies()` kullanıyor).
 *
 * Çerez yoksa uygulamanın varsayılanı olan koyu tema döner: işletim sistemi
 * tercihine bakılmaz, ilk ziyaretin hangi temada açılacağı uygulamanın kararı.
 */

import { cookies } from "next/headers";

import { normalizeTheme, THEME_COOKIE, type Theme } from "./theme";

export async function resolveTheme(): Promise<Theme> {
  return normalizeTheme((await cookies()).get(THEME_COOKIE)?.value);
}
