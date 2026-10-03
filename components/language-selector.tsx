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
 * Bilinçli olarak yerel bir `<select>`: klavye, ekran okuyucu ve mobil
 * tarayıcıların kendi seçim arayüzü bedavaya geliyor; elle yazılmış bir açılır
 * menünün odak tuzağı, ok tuşları ve `aria-expanded` yükümlülüklerini taşımak
 * gerekmiyor. Her dil kendi adıyla yazılıyor ("Français", "العربية") ve yanında
 * kodu duruyor; yalnızca bayrak kullanılmıyor çünkü bayrak ülke gösterir, dil
 * göstermez.
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
    <div className="relative">
      <label className="sr-only" htmlFor="locale">
        {t.language.label}
      </label>
      <select
        id="locale"
        name="locale"
        value={locale}
        disabled={pending}
        onChange={(event) => change(event.target.value)}
        aria-label={t.language.label}
        className="mono-label cursor-pointer appearance-none border border-line-field bg-surface py-1 ps-2.5 pe-7 text-fg transition-colors hover:border-line-bright focus:border-accent focus:outline-none disabled:cursor-wait disabled:text-muted"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-surface text-fg">
            {LOCALE_INFO[code].nativeName} ({code.toUpperCase()})
          </option>
        ))}
      </select>

      {/* Açılır menü oku. `appearance-none` yerel oku kaldırdığı için elle
          konuyor; `end-2` sayesinde RTL'de sola geçiyor. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-[0.625rem] text-faint"
      >
        ▾
      </span>
    </div>
  );
}
