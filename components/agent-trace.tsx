import { ACTION_LABELS } from "@/lib/agent-labels";
import type { AgentStep } from "@/lib/agent-contract";

/**
 * Agent'ın karar izi.
 *
 * Yalnızca public aksiyon etiketi ve zaten kısaltılmış `detail` gösterilir.
 * Modelin ham çıktısı, promptu veya düşünce zinciri bu veriye hiç girmez.
 */
export function AgentTrace({ steps }: { steps: AgentStep[] }) {
  if (steps.length === 0) {
    return <p className="text-sm text-faint">Bu koşu için kayıtlı adım yok.</p>;
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
            className={`reveal flex flex-col gap-2 border-l-2 bg-surface p-4 sm:flex-row sm:items-baseline sm:gap-5 ${
              isRefine ? "border-l-accent" : "border-l-line-bright"
            }`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="eyebrow shrink-0 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex-1">
              <h4
                className={`mono-label ${isRefine ? "text-accent" : "text-fg"}`}
              >
                {ACTION_LABELS[step.action]}
                {isSearch && searchTotal > 1 ? (
                  <span className="ml-2 text-faint">
                    #{searchIndex}/{searchTotal}
                  </span>
                ) : null}
              </h4>
              {step.detail ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.detail}</p>
              ) : null}
            </div>

            <code className="shrink-0 font-mono text-xs text-faint">{step.action}</code>
          </li>
        );
      })}
    </ol>
  );
}
