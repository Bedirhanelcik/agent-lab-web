"use client";

import { useI18n } from "@/components/i18n-provider";
import type { AppMode } from "@/lib/ui-config";

/**
 * Hangi veriye baktığımızı her sayfada görünür kılar. Demo verisi canlı bir
 * sonuç gibi sunulmamalı; bu etiket o dürüstlüğün arayüzdeki karşılığıdır.
 */
export function ModeBadge({ mode }: { mode: AppMode }) {
  const { t } = useI18n();
  const isDemo = mode === "demo";

  return (
    <span
      className="mono-label inline-flex items-center gap-2 border border-line px-2.5 py-1 text-faint"
      title={isDemo ? t.mode.demoHint : t.mode.liveHint}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${isDemo ? "bg-accent pulse-dot" : "bg-fg"}`}
      />
      {/* Dar ekranlarda etiket metni gizlenir: nokta ve durum sözcüğü zaten
          anlamı taşıyor, etiket ise başlığı taşıracak kadar yer kaplıyor. */}
      <span className="hidden text-muted sm:inline">{t.mode.label}:</span>
      <span className="text-fg">{isDemo ? t.mode.demo : t.mode.live}</span>
    </span>
  );
}
