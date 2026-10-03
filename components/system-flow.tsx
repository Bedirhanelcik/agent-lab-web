import { getI18n } from "@/lib/i18n/server";

/**
 * Agent durum makinesi.
 *
 * Durum adları (Assess, Search, Inspect, Refine, Answer) ve çıkış hedefleri
 * sözleşme değerleridir, çevrilmez; özet ve açıklama metinleri çevrilir.
 */
const EXITS: readonly (readonly string[])[] = [
  ["search", "answer"],
  ["inspect"],
  ["refine", "answer"],
  ["search"],
  [],
];

export async function SystemFlow() {
  const { t } = await getI18n();
  const states = t.system.flow.states;

  return (
    <ol className="grid gap-px border border-line bg-line">
      {states.map((state, i) => {
        const exits = EXITS[i] ?? [];

        return (
          <li key={state.label} className="card border-0 p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex shrink-0 items-center gap-4 sm:w-56">
                <span className="eyebrow tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="mono-label text-fg">{state.label}</h3>
                  <p className="mt-1 text-xs text-faint">{state.summary}</p>
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted">{state.detail}</p>

              <div className="shrink-0 sm:w-40 sm:text-end">
                {exits.length > 0 ? (
                  <p className="font-mono text-xs text-faint">
                    <span className="sr-only">{t.system.flow.nextStates} </span>
                    <span aria-hidden="true" className="rtl:hidden">
                      →{" "}
                    </span>
                    <span aria-hidden="true" className="hidden rtl:inline">
                      ←{" "}
                    </span>
                    {exits.join(" | ")}
                  </p>
                ) : (
                  <p className="font-mono text-xs text-accent">{t.system.flow.terminal}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
