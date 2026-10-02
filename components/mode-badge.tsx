import type { AppMode } from "@/lib/ui-config";

/**
 * Hangi veriye baktığımızı her sayfada görünür kılar. Demo verisi canlı bir
 * sonuç gibi sunulmamalı; bu etiket o dürüstlüğün arayüzdeki karşılığıdır.
 */
export function ModeBadge({ mode }: { mode: AppMode }) {
  const isDemo = mode === "demo";

  return (
    <span
      className="inline-flex items-center gap-2 border border-line px-2.5 py-1 mono-label text-faint"
      title={
        isDemo
          ? "Hazırlanmış örnek koşular gösterilir; canlı model çağrısı yapılmaz."
          : "Canlı agent çağrıları etkin."
      }
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${isDemo ? "bg-accent pulse-dot" : "bg-fg"}`}
      />
      <span className="text-muted">Status:</span>
      <span className="text-fg">{isDemo ? "Demo" : "Live"}</span>
    </span>
  );
}
