"use client";

import { useSyncExternalStore } from "react";

import { useI18n } from "@/components/i18n-provider";

export const THEME_STORAGE_KEY = "agentlab_theme";

/** Tema değiştiğinde dinleyicilere haber veren olay. */
const THEME_EVENT = "agentlab:theme";

type Theme = "light" | "dark";

/**
 * Sayfa boyanmadan ÖNCE çalışan betik.
 *
 * Tema seçimi localStorage'da duruyor ve yalnızca tarayıcıda okunabiliyor.
 * React hidrasyonunu beklersek, kullanıcı koyu tema seçmiş olsa bile ilk kare
 * aydınlık çıkar ve göz alıcı bir yanıp sönme olur. Bu yüzden seçim
 * `<head>` içinde, senkron olarak kök elemana yazılıyor.
 *
 * Kayıtlı seçim yoksa hiçbir şey yazılmaz: CSS `prefers-color-scheme` ile
 * sistem tercihini zaten uyguluyor.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
    }
  } catch (error) {
    /* Depolama kapalıysa sistem tercihi geçerli kalır. */
  }
})();
`;

/**
 * Tema, React'in dışında yaşayan bir durum: kök elemanın `data-theme`
 * niteliğinde ve işletim sisteminin tercihinde. Bu yüzden `useState` yerine
 * `useSyncExternalStore` ile okunuyor -- durum nerede yaşıyorsa orayı tek
 * kaynak kabul etmek, kopyasını bir efektle senkron tutmaya çalışmaktan daha
 * az kırılgan.
 */
function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Sunucuda tema bilinemez; ilk render nötr kalır. */
function getServerSnapshot(): Theme | null {
  return null;
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
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
      className="size-4"
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
 * Düğme, TIKLANDIĞINDA geçilecek temanın simgesini gösterir (karanlıktayken
 * güneş); erişilebilir adı da o eylemi söyler, böylece simgenin anlamı ekran
 * okuyucuda tahmine kalmaz.
 */
export function ThemeToggle() {
  const { t } = useI18n();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Depolama kapalıysa seçim bu oturumla sınırlı kalır. */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const isDark = theme === "dark";
  const label = theme === null ? t.theme.label : isDark ? t.theme.toLight : t.theme.toDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-8 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-line-bright hover:text-fg"
    >
      {/* Tema okunana kadar ikon yerine boşluk: yanlış simgeyi bir kare
          gösterip değiştirmek, hiç göstermemekten daha rahatsız edici. */}
      {theme === null ? <span className="size-4" /> : isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
