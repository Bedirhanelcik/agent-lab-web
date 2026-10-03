/**
 * Seçili dili sunucu tarafında çözer. YALNIZCA sunucu bileşenlerinden ve route
 * handler'lardan çağrılabilir (`cookies()`/`headers()` kullanıyor).
 *
 * Sıra: çerez → tarayıcının `Accept-Language` başlığı → varsayılan. Çerez
 * kullanıcının açık tercihi olduğu için her zaman önce gelir; başlık yalnızca
 * henüz bir tercih yapılmamışsa devreye girer.
 */

import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getDirection,
  getMessages,
  isLocale,
  pickLocaleFromAcceptLanguage,
  type Direction,
  type Locale,
  type Messages,
} from "./index.ts";

export async function resolveLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(stored)) return stored;

  const header = (await headers()).get("accept-language");
  return pickLocaleFromAcceptLanguage(header) ?? DEFAULT_LOCALE;
}

export interface ServerI18n {
  locale: Locale;
  dir: Direction;
  t: Messages;
}

export async function getI18n(): Promise<ServerI18n> {
  const locale = await resolveLocale();
  return { locale, dir: getDirection(locale), t: getMessages(locale) };
}
