"use client";

import { useI18n } from "@/components/i18n-provider";
import type { AgentToolCall, ToolStatus } from "@/lib/agent-contract";

const STATUS_TONE: Record<ToolStatus, string> = {
  ok: "text-accent",
  empty: "text-muted",
  failed: "text-fg",
};

/**
 * Agent'ın yaptığı tool çağrıları. Sıfır çağrı da anlamlı bir sonuçtur.
 *
 * Tool adı (`rag_search`), status değeri ve `top_k` sözleşme değerleridir ve
 * çevrilmez; arama sorgusu da modelin ürettiği korpus dilindeki metindir.
 */
export function ToolCalls({ calls }: { calls: AgentToolCall[] }) {
  const { t } = useI18n();

  if (calls.length === 0) {
    return (
      <div className="border border-line bg-surface p-4">
        <p className="mono-label text-fg">
          {t.result.noToolCalls} <span className="text-accent tabular-nums">0</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.result.noToolCallsBody}</p>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      <p className="mono-label bg-surface px-4 py-2 text-faint">
        {t.result.toolCallCount}{" "}
        <span className="text-fg tabular-nums">{calls.length}</span>
      </p>
      <ul className="space-y-px">
        {calls.map((call, index) => (
          <li
            key={`${call.tool}-${index}`}
            className="reveal bg-surface p-4"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <code className="font-mono text-sm break-all text-fg">{call.tool}</code>
              <span className={`mono-label ${STATUS_TONE[call.status]}`}>{call.status}</span>
            </div>

            <p className="mt-3 break-words text-sm text-muted">
              <span className="font-mono text-xs text-faint">{t.result.fieldQuery} </span>
              <span className="text-fg" dir="auto">
                &ldquo;{call.query}&rdquo;
              </span>
            </p>

            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
              <div className="flex gap-2">
                <dt>{t.result.fieldTopK}</dt>
                <dd className="text-muted tabular-nums">{call.top_k}</dd>
              </div>
              <div className="flex gap-2">
                <dt>{t.result.fieldPassagesFound}</dt>
                <dd className="text-muted tabular-nums">{call.passages_found}</dd>
              </div>
              {call.source_file ? (
                <div className="flex gap-2">
                  <dt>{t.result.fieldSourceFile}</dt>
                  <dd className="break-all text-muted" dir="auto">
                    {call.source_file}
                  </dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
