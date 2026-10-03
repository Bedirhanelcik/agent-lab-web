import type { AgentToolCall, ToolStatus } from "@/lib/agent-contract";

const STATUS_TONE: Record<ToolStatus, string> = {
  ok: "text-accent",
  empty: "text-muted",
  failed: "text-fg",
};

/** Agent'ın yaptığı tool çağrıları. Sıfır çağrı da anlamlı bir sonuçtur. */
export function ToolCalls({ calls }: { calls: AgentToolCall[] }) {
  if (calls.length === 0) {
    return (
      <div className="border border-line bg-surface p-4">
        <p className="mono-label text-fg">
          tool_calls: <span className="text-accent tabular-nums">0</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Agent bu soru için retrieval&apos;a hiç başvurmadı. Sabit bir boru hattı olsaydı
          arama her durumda çalışacaktı; burada aramamak da bir karardır.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      <p className="mono-label bg-surface px-4 py-2 text-faint">
        tool_calls: <span className="text-fg tabular-nums">{calls.length}</span>
      </p>
      <ul className="space-y-px">
        {calls.map((call, index) => (
          <li
            key={`${call.tool}-${index}`}
            className="reveal bg-surface p-4"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <code className="font-mono text-sm text-fg">{call.tool}</code>
              <span className={`mono-label ${STATUS_TONE[call.status]}`}>{call.status}</span>
            </div>

            <p className="mt-3 break-words text-sm text-muted">
              <span className="font-mono text-xs text-faint">query </span>
              <span className="text-fg">&ldquo;{call.query}&rdquo;</span>
            </p>

            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
              <div className="flex gap-2">
                <dt>top_k</dt>
                <dd className="text-muted tabular-nums">{call.top_k}</dd>
              </div>
              <div className="flex gap-2">
                <dt>passages_found</dt>
                <dd className="text-muted tabular-nums">{call.passages_found}</dd>
              </div>
              {call.source_file ? (
                <div className="flex gap-2">
                  <dt>source_file</dt>
                  <dd className="break-all text-muted">{call.source_file}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
