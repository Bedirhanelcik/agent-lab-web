"use client";

import { AgentTrace } from "@/components/agent-trace";
import { useI18n } from "@/components/i18n-provider";
import { PassageList } from "@/components/passage-list";
import { ToolCalls } from "@/components/tool-calls";
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
      <h3 className="eyebrow mb-3 break-words">{label}</h3>
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
 *
 * Cevap metni ve pasajlar backend'den geldiği gibi gösterilir: canlı modda
 * backend onları seçilen dilde üretir, demo modunda ise kayıtlı koşunun
 * orijinal dilinde kalırlar.
 */
export function AgentRunPanels({ run, question }: { run: AgentRun; question: string }) {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <Panel label={t.result.question}>
        <p className="break-words text-lg leading-snug text-fg" dir="auto">
          {question}
        </p>
      </Panel>

      <Panel label={t.result.status}>
        <div className="flex flex-col gap-3">
          <span
            className={`mono-label inline-flex w-fit max-w-full flex-wrap items-center gap-2 border px-3 py-1.5 ${STATUS_TONE[run.status]}`}
          >
            {t.result.statusLabels[run.status] ?? run.status}
            <code className="text-faint" dir="ltr">
              {run.status}
            </code>
          </span>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {t.result.statusExplanations[run.status] ?? ""}
          </p>
        </div>
      </Panel>

      <Panel label={t.result.answer}>
        <div className="border border-line bg-surface p-5">
          <p className="break-words leading-relaxed text-fg" dir="auto">
            {run.answer}
          </p>
        </div>
      </Panel>

      <div className="grid gap-10 lg:grid-cols-2">
        <Panel label={`${t.result.trace} — ${run.steps.length} ${t.result.traceSteps}`}>
          <div className="border border-line">
            <AgentTrace steps={run.steps} />
          </div>
        </Panel>

        <Panel label={t.result.toolCalls}>
          <div className={run.tool_calls.length > 0 ? "border border-line" : ""}>
            <ToolCalls calls={run.tool_calls} />
          </div>
        </Panel>
      </div>

      <Panel label={`${t.result.sources} — ${run.sources.length}`}>
        <div className={run.sources.length > 0 ? "border border-line" : ""}>
          <PassageList sources={run.sources} />
        </div>
      </Panel>
    </div>
  );
}

export function AgentResult({ view }: { view: DemoRunView }) {
  const { t } = useI18n();
  const { run } = view;

  return (
    <div className="space-y-10">
      {/* Köken: bu çıktı canlı bir model çağrısı değil. */}
      <div
        className={`border p-4 ${
          view.synthetic ? "border-accent/50 bg-surface-2" : "border-line bg-surface"
        }`}
      >
        <p className="mono-label break-words text-fg">
          {view.synthetic ? (
            <span className="text-accent">{t.playground.originSynthetic}</span>
          ) : (
            t.playground.originPrepared
          )}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {view.synthetic
            ? t.playground.originSyntheticBody
            : t.playground.originPreparedBody}
        </p>
        {/* Kayıtlı koşuların metni korpusun dilinde: arayüz dili değiştiğinde
            cevabın da değişmediğini açıkça söylemek, kullanıcıyı yanıltmamanın
            tek dürüst yolu. */}
        <p className="mt-2 text-sm leading-relaxed text-faint">
          {t.playground.originLanguageNote}
        </p>
        {view.reconstructedFields.length > 0 ? (
          <p className="mt-3 font-mono text-xs break-words text-faint">
            {t.playground.reconstructedFields} {view.reconstructedFields.join(", ")}
          </p>
        ) : (
          <p className="mt-3 font-mono text-xs text-faint">
            {t.playground.reconstructedNone}
          </p>
        )}
      </div>

      <AgentRunPanels run={run} question={view.question} />
    </div>
  );
}
