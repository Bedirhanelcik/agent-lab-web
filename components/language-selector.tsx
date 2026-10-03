"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useI18n } from "@/components/i18n-provider";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_INFO,
  isLocale,
} from "@/lib/i18n";

/**
 * Dil seçici.
 *
 * Kontrolün kendisi yerel bir `<select>`: klavye, ekran okuyucu ve mobil
 * tarayıcıların kendi seçim arayüzü bedavaya geliyor; elle yazılmış bir açılır
 * menünün odak tuzağı, ok tuşları ve `aria-expanded` yükümlülüklerini taşımak
 * gerekmiyor.
 *
 * Görünen etiket ise ayrı bir `<span>`: yerel bir `select` kutusu EN UZUN
 * seçeneğe göre boyutlanır, yani "Türkçe" seçiliyken bile kutu
 * "中文（简体）" kadar geniş kalır ve metinle ok arasında kocaman bir boşluk
 * oluşur. Select şeffaf olarak üstte duruyor (tüm davranışı o taşıyor),
 * genişliği ise görünen metin belirliyor.
 *
 * Her dil kendi adıyla yazılıyor ("Français", "العربية"); yalnızca bayrak
 * kullanılmıyor çünkü bayrak ülke gösterir, dil göstermez.
 *
 * Seçim bir çerezde saklanıyor ve `router.refresh()` sunucu bileşenlerini yeni
 * dille yeniden render ediyor. Böylece sayfa yenilendiğinde de, yeni bir sekme
 * açıldığında da dil korunuyor ve `<html lang/dir>` sunucuda doğru üretiliyor.
 */
export function LanguageSelector() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: string) {
    if (!isLocale(next) || next === locale) return;

    // `Secure` bilerek yok: yerel geliştirme http üzerinden çalışıyor ve bu
    // çerez bir sır değil, yalnızca görsel bir tercih taşıyor.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="group relative inline-flex items-center rounded-md transition-colors hover:bg-surface-2 has-[select:focus-visible]:outline has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-accent">
      <label className="sr-only" htmlFor="locale">
        {t.language.label}
      </label>

      {/* Görünen etiket. `aria-hidden`: erişilebilirlik ağacında select zaten
          var, aynı metni iki kez okutmanın anlamı yok. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none py-1.5 ps-2 pe-6 text-sm whitespace-nowrap transition-colors group-hover:text-fg ${
          pending ? "text-faint" : "text-muted"
        }`}
      >
        {LOCALE_INFO[locale].nativeName}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-[0.6rem] text-faint"
      >
        ▾
      </span>

      <select
        id="locale"
        name="locale"
        value={locale}
        disabled={pending}
        onChange={(event) => change(event.target.value)}
        aria-label={t.language.label}
        className="absolute inset-0 w-full cursor-pointer opacity-0 disabled:cursor-wait"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-surface text-fg">
            {LOCALE_INFO[code].nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
