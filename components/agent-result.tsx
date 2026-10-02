import { AgentTrace } from "@/components/agent-trace";
import { PassageList } from "@/components/passage-list";
import { ToolCalls } from "@/components/tool-calls";
import { STATUS_EXPLANATIONS, STATUS_LABELS } from "@/lib/agent-labels";
import type { AgentRun, AgentStatus, DemoRunView } from "@/lib/agent-contract";

const STATUS_TONE: Record<AgentStatus, string> = {
  answered: "border-accent/40 text-accent",
  answered_without_retrieval: "border-line-bright text-fg",
  insufficient_context: "border-line-bright text-fg",
  tool_failure: "border-line-bright text-fg",
};

function Panel({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h3 className="eyebrow mb-3">{label}</h3>
      {children}
    </section>
  );
}

/**
 * Bir agent koşusunun gövdesi: soru, status, cevap, karar izi, tool çağrıları
 * ve kaynaklar.
 *
 * Demo ve canlı yol bu bileşeni paylaşır -- ikisi de aynı `AgentRun` modeline
 * normalize edildiği için tek bir render yolu yeterli. Köken etiketi (demo /
 * synthetic) kasıtlı olarak buraya değil, yalnızca demo sarmalayıcısına ait;
 * böylece canlı bir sonuçta "prepared demo run" ibaresi görünmesi mümkün değil.
 */
export function AgentRunPanels({ run, question }: { run: AgentRun; question: string }) {
  return (
    <div className="space-y-10">
      <Panel label="Question">
        <p className="text-lg leading-snug text-fg">{question}</p>
      </Panel>

      <Panel label="Status">
        <div className="flex flex-col gap-3">
          <span
            className={`mono-label inline-flex w-fit items-center gap-2 border px-3 py-1.5 ${STATUS_TONE[run.status]}`}
          >
            {STATUS_LABELS[run.status]}
            <code className="text-faint">{run.status}</code>
          </span>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {STATUS_EXPLANATIONS[run.status]}
          </p>
        </div>
      </Panel>

      <Panel label="Answer">
        <div className="border border-line bg-surface p-5">
          <p className="leading-relaxed text-fg">{run.answer}</p>
        </div>
      </Panel>

      <div className="grid gap-10 lg:grid-cols-2">
        <Panel label={`Agent trace — ${run.steps.length} adım`}>
          <div className="border border-line">
            <AgentTrace steps={run.steps} />
          </div>
        </Panel>

        <Panel label="Tool calls">
          <div className={run.tool_calls.length > 0 ? "border border-line" : ""}>
            <ToolCalls calls={run.tool_calls} />
          </div>
        </Panel>
      </div>

      <Panel label={`Sources — ${run.sources.length}`}>
        <div className={run.sources.length > 0 ? "border border-line" : ""}>
          <PassageList sources={run.sources} />
        </div>
      </Panel>
    </div>
  );
}

export function AgentResult({ view }: { view: DemoRunView }) {
  const { run } = view;

  return (
    <div className="space-y-10">
      {/* Köken: bu çıktı canlı bir model çağrısı değil. */}
      <div
        className={`border p-4 ${
          view.synthetic ? "border-accent/50 bg-surface-2" : "border-line bg-surface"
        }`}
      >
        <p className="mono-label text-fg">
          {view.synthetic ? (
            <>
              <span className="text-accent">Synthetic</span> — prepared demo run
            </>
          ) : (
            <>Prepared demo run</>
          )}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {view.synthetic
            ? "Bu koşu elle kurgulanmıştır ve hiç çalıştırılmamıştır. Yalnızca başarılı sorgu yenileme akışını göstermek için vardır; gerçek bir model çıktısı değildir."
            : "Bu çıktı daha önce gerçekten çalıştırılmış bir koşudan türetilmiştir ve burada canlı olarak üretilmemiştir."}
        </p>
        {view.reconstructedFields.length > 0 ? (
          <p className="mt-3 font-mono text-xs text-faint">
            yeniden kurulan alanlar: {view.reconstructedFields.join(", ")}
          </p>
        ) : (
          <p className="mt-3 font-mono text-xs text-faint">
            tüm alanlar gözlemlendi (yeniden kurulan alan yok)
          </p>
        )}
      </div>

      <AgentRunPanels run={run} question={view.question} />
    </div>
  );
}
