"use client";

import { useI18n } from "@/components/i18n-provider";
import type { AppMode } from "@/lib/ui-config";

/**
 * Hangi veriye baktığımızı her sayfada görünür kılar. Demo verisi canlı bir
 * sonuç gibi sunulmamalı; bu etiket o dürüstlüğün arayüzdeki karşılığıdır.
 *
 * Kompakt tutuluyor: gezinme çubuğunda bir durum göstergesinin bağlantılarla
 * aynı görsel ağırlığa sahip olması için bir sebep yok. Çerçeve kaldırıldı,
 * "Durum:" ön eki tooltip'e taşındı; geriye nokta ve tek kelime kaldı.
 */
export function ModeBadge({
  mode,
  className = "inline-flex",
}: {
  mode: AppMode;
  className?: string;
}) {
  const { t } = useI18n();
  const isDemo = mode === "demo";

  return (
    <span
      // Display sınıfı BİLİNÇLİ olarak burada yok: çağıran `hidden md:inline-flex`
      // gibi bir değer verdiğinde, bileşenin kendi `inline-flex`'i aynı
      // özgüllükte olduğu için hangisinin kazanacağını sınıf sırası değil
      // Tailwind'in ürettiği CSS sırası belirliyordu ve rozet mobilde de
      // görünüyordu. Görünürlük kararı artık tek bir yerde.
      className={`items-center gap-1.5 rounded-md px-2 py-1 text-xs text-faint ${className}`}
      title={`${t.mode.label}: ${isDemo ? t.mode.demo : t.mode.live} — ${
        isDemo ? t.mode.demoHint : t.mode.liveHint
      }`}
    >
      <span className="sr-only">{t.mode.label}: </span>
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${isDemo ? "bg-accent pulse-dot" : "bg-fg"}`}
      />
      {isDemo ? t.mode.demo : t.mode.live}
    </span>
  );
}
