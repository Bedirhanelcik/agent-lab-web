"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { persistTheme, type Theme } from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[1.05rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M4.3 4.3l1.5 1.5M18.2 18.2l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.3 19.7l1.5-1.5M18.2 5.8l1.5-1.5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[1.05rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />
    </svg>
  );
}

/**
 * Aydınlık/karanlık geçişi.
 *
 * Başlangıç değeri SUNUCUDAN prop olarak geliyor ve sunucu onu çerezden
 * okuyor. Bu yüzden sunucunun ürettiği HTML ile istemcinin ilk render'ı
 * birebir aynı: bileşen render sırasında ne `localStorage`'a ne de
 * `document`'a bakıyor, dolayısıyla hydration uyuşmazlığı üretemez.
 *
 * Tıklamada iki şey yapılıyor: kök elemanın `data-theme` niteliği hemen
 * güncelleniyor (geçiş anında görünür olsun diye) ve çerez yazılıyor (sonraki
 * istekte sunucu aynı değeri üretsin diye). Bu mutasyon hydration'dan SONRA
 * ve bir olay işleyicisinde gerçekleştiği için React'in uyuşmazlık kontrolüne
 * takılmıyor.
 *
 * Düğme, TIKLANDIĞINDA geçilecek temanın simgesini gösterir (karanlıktayken
 * güneş); erişilebilir adı da o eylemi söyler.
 */
export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    persistTheme(next);
    setTheme(next);
  }

  const label = theme === "dark" ? t.theme.toLight : t.theme.toDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
