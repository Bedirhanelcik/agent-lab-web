import type { AgentSource } from "@/lib/agent-contract";

/** Retrieve edilen pasajlar: kaynak dosya, chunk kimliği, sayfa, rank, skor. */
export function PassageList({ sources }: { sources: AgentSource[] }) {
  if (sources.length === 0) {
    return (
      <p className="border border-line bg-surface p-4 text-sm text-muted">
        Bu koşuda kaynak gösterilmedi. Agent ya arama yapmadı ya da dönen pasajları
        yeterli bulmadığı için cevabı hiçbir pasaja dayandırmadı.
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
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="mono-label text-fg">{source.source_file}</span>
            <code className="font-mono text-xs text-accent">{source.chunk_id}</code>
          </div>

          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
            <div className="flex gap-2">
              <dt>rank</dt>
              <dd className="text-muted tabular-nums">{source.rank}</dd>
            </div>
            <div className="flex gap-2">
              <dt>score</dt>
              <dd className="text-muted tabular-nums">{source.score.toFixed(4)}</dd>
            </div>
            <div className="flex gap-2">
              <dt>page</dt>
              <dd className="text-muted tabular-nums">
                {source.page_number === null ? "—" : source.page_number}
              </dd>
            </div>
          </dl>

          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{source.text}</p>
        </li>
      ))}
    </ul>
  );
}
