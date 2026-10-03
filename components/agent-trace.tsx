"use client";

import { useI18n } from "@/components/i18n-provider";
import type { AgentStep } from "@/lib/agent-contract";

/**
 * Agent'ın karar izi.
 *
 * Yalnızca public aksiyon etiketi ve zaten kısaltılmış `detail` gösterilir.
 * Modelin ham çıktısı, promptu veya düşünce zinciri bu veriye hiç girmez.
 *
 * `detail` metni backend'den gelir ve backend onu istekle birlikte gönderilen
 * dilde üretir; burada yeniden çevrilmez. Aksiyon etiketi ise sözleşme değeri
 * olduğu için arayüz sözlüğünden okunur.
 */
export function AgentTrace({ steps }: { steps: AgentStep[] }) {
  const { t } = useI18n();

  if (steps.length === 0) {
    return <p className="text-sm text-faint">{t.result.noSteps}</p>;
  }

  // Birden fazla arama varsa kaçıncı arama olduğunu göstermek, yeniden
  // formülleme akışını okunur kılıyor. Sıralama render öncesinde hesaplanır;
  // render sırasında hiçbir değişken mutasyona uğramaz.
  const searchTotal = steps.filter((step) => step.action === "searched_rag").length;
  const searchOrdinals = steps.reduce<number[]>((acc, step, index) => {
    const previous = index > 0 ? acc[index - 1] : 0;
    acc.push(step.action === "searched_rag" ? previous + 1 : previous);
    return acc;
  }, []);

  return (
    <ol className="space-y-px">
      {steps.map((step, index) => {
        const isSearch = step.action === "searched_rag";
        const isRefine = step.action === "refined_query";
        const searchIndex = searchOrdinals[index];

        return (
          <li
            key={`${step.action}-${index}`}
            className={`reveal flex flex-col gap-2 border-s-2 bg-surface p-4 sm:flex-row sm:items-baseline sm:gap-5 ${
              isRefine ? "border-s-accent" : "border-s-line-bright"
            }`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="eyebrow shrink-0 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <h4 className={`mono-label ${isRefine ? "text-accent" : "text-fg"}`}>
                {t.result.actionLabels[step.action] ?? step.action}
                {isSearch && searchTotal > 1 ? (
                  <span className="ms-2 text-faint tabular-nums">
                    {searchIndex}/{searchTotal}
                  </span>
                ) : null}
              </h4>
              {step.detail ? (
                <p
                  className="mt-1.5 break-words text-sm leading-relaxed text-muted"
                  dir="auto"
                >
                  {step.detail}
                </p>
              ) : null}
            </div>

            {/* Aksiyon kodu sözleşme değeri: her dilde aynı kalır ve yön
                bağımsız okunması için ltr işaretlenir. */}
            <code className="shrink-0 font-mono text-xs text-faint" dir="ltr">
              {step.action}
            </code>
          </li>
        );
      })}
    </ol>
  );
}
