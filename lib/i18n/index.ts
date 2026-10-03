/**
 * Dil katmanının ortak yüzeyi.
 *
 * Sözlükler statik olarak içe aktarılıyor: dinamik `import()` yerine düz bir
 * kayıt kullanmak, seçilen dilin sunucuda senkron olarak çözülmesini sağlıyor
 * ve her sayfanın ilk render'ında doğru metinlerle gelmesini garanti ediyor.
 *
 * `t` olarak bütün sözlük nesnesi aktarılıyor; nokta ayrılmış anahtar yolu
 * (`t("home.heroTitle")`) bilinçli olarak kullanılmadı. Nesne erişimi
 * TypeScript tarafından denetlenir, yani yazım hatası derleme zamanında
 * yakalanır; string anahtar yolu ise ancak çalışma zamanında patlar.
 */

import { ar } from "./locales/ar.ts";
import { en } from "./locales/en.ts";
import { es } from "./locales/es.ts";
import { fr } from "./locales/fr.ts";
import { hi } from "./locales/hi.ts";
import { tr } from "./locales/tr.ts";
import { zh } from "./locales/zh.ts";
import {
  LOCALES,
  LOCALE_INFO,
  type Direction,
  type Locale,
  type Messages,
} from "./types.ts";

export { LOCALES, LOCALE_INFO };
export type { Direction, Locale, LocaleInfo, Messages } from "./types.ts";

/** Korpusun dili ve varsayılan arayüz dili. */
export const DEFAULT_LOCALE: Locale = "tr";

/** Seçimin saklandığı çerez. Sunucu tarafında okunabildiği için localStorage
 *  yerine çerez kullanılıyor: ilk render doğru dilde geliyor, yanlış dilde bir
 *  kare görünüp sonra değişmiyor ve sayfa başlıkları da çevrilebiliyor. */
export const LOCALE_COOKIE = "agentlab_locale";

/** Bir yıl: dil tercihi kalıcı bir tercih, oturumluk değil. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const DICTIONARIES: Record<Locale, Messages> = { tr, en, fr, ar, es, zh, hi };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Bir dil etiketini desteklenen bir koda indirger.
 *
 * `en-US`, `zh-Hans` gibi bölgeli etiketlerin yalnızca dil kısmı dikkate
 * alınır; tanınmayan bir değer sessizce varsayılana düşer çünkü dil seçimi
 * görsel bir tercihtir ve bir sayfayı hata vermeye değmez.
 */
export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  const base = value.trim().replace(/_/gu, "-").split("-")[0].toLowerCase();
  return isLocale(base) ? base : DEFAULT_LOCALE;
}

export function getMessages(locale: Locale): Messages {
  return DICTIONARIES[locale];
}

export function getDirection(locale: Locale): Direction {
  return LOCALE_INFO[locale].dir;
}

/**
 * `{ad}` biçimindeki yer tutucuları doldurur.
 *
 * Çeviri dosyalarında sayı ve dosya adı gibi değerler cümlenin ortasına
 * giriyor ve her dilde farklı yerde duruyor; bu yüzden metni parçalayıp
 * birleştirmek yerine tek bir şablon tutuluyor.
 */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/gu, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * `Accept-Language` başlığından en uygun dili seçer.
 *
 * Çerez yokken ilk ziyarette kullanılır: tarayıcısı Fransızca olan bir
 * ziyaretçiyi Türkçe karşılamak için bir sebep yok. Ağırlık (`q`) sırası
 * dikkate alınır.
 */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const weight = quality ? Number.parseFloat(quality.slice(2)) : 1;
      return { tag, weight: Number.isFinite(weight) ? weight : 0 };
    })
    .filter((candidate) => candidate.tag && candidate.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  for (const candidate of candidates) {
    const base = candidate.tag.replace(/_/gu, "-").split("-")[0].toLowerCase();
    if (isLocale(base)) return base;
  }
  return null;
}
