"use client";

import { useI18n } from "@/components/i18n-provider";
import type { AgentSource } from "@/lib/agent-contract";

/**
 * Retrieve edilen pasajlar.
 *
 * Dosya adı, chunk kimliği ve pasaj metni ÇEVRİLMEZ: bunlar korpustan gelen
 * veridir ve atıfın doğrulanabilir olması onların birebir gösterilmesine
 * bağlıdır. Çevrilen şey yalnızca alan etiketleridir.
 */
export function PassageList({ sources }: { sources: AgentSource[] }) {
  const { t } = useI18n();

  if (sources.length === 0) {
    return (
      <p className="border border-line bg-surface p-4 text-sm text-muted">
        {t.result.noSources}
      </p>
    );
  }

  return (
    <ul className="space-y-px">
      {sources.map((source, index) => (
        <li
          key={source.chunk_id}
          className="reveal bg-surface p-4"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
            {/* break-all: dosya adı boşluksuz ve uzun olabilir. */}
            <span className="mono-label break-all text-fg" dir="auto">
              {source.source_file}
            </span>
            <code className="break-all font-mono text-xs text-accent" dir="ltr">
              {source.chunk_id}
            </code>
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
            <div className="flex gap-2">
              <dt>{t.result.fieldRank}</dt>
              <dd className="text-muted tabular-nums">{source.rank}</dd>
            </div>
            <div className="flex gap-2">
              <dt>{t.result.fieldScore}</dt>
              <dd className="text-muted tabular-nums">{source.score.toFixed(4)}</dd>
            </div>
            <div className="flex gap-2">
              <dt>{t.result.fieldPage}</dt>
              <dd className="text-muted tabular-nums">
                {source.page_number === null ? "—" : source.page_number}
              </dd>
            </div>
          </dl>

          {/* Pasaj metni korpusun dilinde kalır: arayüz dili değişse de
              gösterilen alıntı kaynaktaki metnin aynısı olmalı. */}
          <p
            className="mt-3 line-clamp-4 break-words text-sm leading-relaxed text-muted"
            dir="auto"
          >
            {source.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
