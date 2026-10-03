"use client";

import { createContext, useContext, type ReactNode } from "react";

import { getDirection, type Direction, type Locale, type Messages } from "@/lib/i18n";

interface I18nValue {
  locale: Locale;
  dir: Direction;
  t: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Seçili dili istemci bileşenlerine taşır.
 *
 * Sözlük sunucuda seçilip prop olarak veriliyor; istemci paketine yedi dilin
 * tamamı değil, yalnızca aktif dilin metinleri giriyor. Dil değiştiğinde
 * sunucu yeniden render ediyor ve bu sağlayıcı yeni sözlükle geliyor.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dir: getDirection(locale), t: messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (value === null) {
    // Sağlayıcı dışında kullanılırsa sessizce varsayılana düşmek yerine
    // patlıyoruz: eksik bir sarmalayıcı, çevrilmemiş bir ekran olarak
    // gözden kaçabilir.
    throw new Error("useI18n, I18nProvider içinde çağrılmalı");
  }
  return value;
}
