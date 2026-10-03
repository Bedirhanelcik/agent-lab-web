import { format, type Messages } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import type { EvalCase, EvalReport } from "@/lib/eval-report";

type ReportMessages = Messages["evaluation"]["report"];

function Metric({
  value,
  label,
  note,
  tone = "default",
}: {
  value: string | number;
  label: string;
  note?: string;
  tone?: "default" | "accent";
}) {
  return (
    <div className="bg-surface p-6">
      <span
        className={`display block text-3xl tabular-nums sm:text-4xl ${
          tone === "accent" ? "text-accent" : "text-fg"
        }`}
      >
        {value}
      </span>
      <span className="mono-label mt-3 block break-words text-faint">{label}</span>
      {note ? <span className="mt-2 block text-xs text-muted">{note}</span> : null}
    </div>
  );
}

function CaseRow({ evalCase, r }: { evalCase: EvalCase; r: ReportMessages }) {
  const passedAssertions = evalCase.assertions.filter((assertion) => assertion.passed).length;

  return (
    <li className="bg-surface p-5 sm:p-6">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        {/* Vaka kimliği bir sözleşme değeri: çevrilmez, olduğu gibi gösterilir. */}
        <code className="font-mono text-sm break-all text-fg">{evalCase.id}</code>
        <span
          className={`mono-label border px-2.5 py-1 ${
            evalCase.passed ? "border-accent/40 text-accent" : "border-line-bright text-fg"
          }`}
        >
          {evalCase.passed ? r.pass : r.fail}
        </span>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
        <div className="flex gap-2">
          <dt>{r.status}</dt>
          <dd className="text-muted">{evalCase.status ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt>{r.assertions}</dt>
          <dd className="text-muted tabular-nums">
            {passedAssertions}/{evalCase.assertions.length}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>{r.agentCalls}</dt>
          <dd className="text-muted tabular-nums">{evalCase.llm_calls ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt>{r.judgeCalls}</dt>
          <dd className="text-muted tabular-nums">{evalCase.judge_calls}</dd>
        </div>
        {evalCase.latency_ms !== null ? (
          <div className="flex gap-2">
            <dt>{r.latency}</dt>
            <dd className="text-muted tabular-nums">{Math.round(evalCase.latency_ms)} ms</dd>
          </div>
        ) : null}
      </dl>

      {evalCase.error ? (
        <p className="mt-4 border-s border-line-bright ps-4 text-sm leading-relaxed break-words text-muted">
          <span className="mono-label text-fg">{r.error} </span>
          <span dir="auto">{evalCase.error}</span>
        </p>
      ) : null}

      {evalCase.assertions.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {evalCase.assertions.map((assertion, index) => (
            <li
              key={`${assertion.type}-${index}`}
              className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
            >
              <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${
                  assertion.passed ? "bg-accent" : "bg-faint"
                }`}
              />
              <code className="font-mono text-xs break-all text-fg">{assertion.type}</code>
              <span className="sr-only">
                {assertion.passed ? r.assertionPassed : r.assertionFailed}
              </span>
              {assertion.score !== null ? (
                <span className="font-mono text-xs text-faint tabular-nums">
                  {r.score} {assertion.score}
                </span>
              ) : null}
              {assertion.detail ? (
                <span className="min-w-0 flex-1 break-words text-muted" dir="auto">
                  {assertion.detail}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export async function EvaluationReport({ report }: { report: EvalReport }) {
  const { t } = await getI18n();
  const r = t.evaluation.report;
  const { totals } = report;

  return (
    <div className="space-y-12">
      <div>
        <dl className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-5">
          <Metric value={totals.cases} label={r.cases} />
          <Metric value={totals.passed} label={r.passed} tone="accent" />
          <Metric value={totals.failed} label={r.failed} />
          <Metric
            value={`${totals.assertions_passed}/${totals.assertions}`}
            label={r.assertions}
          />
          <Metric
            value={totals.gemini_calls.total}
            label={r.geminiCalls}
            note={format(r.callsNote, {
              agent: totals.gemini_calls.agent,
              judge: totals.gemini_calls.judge,
            })}
          />
        </dl>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-faint">
          <div className="flex gap-2">
            <dt>{r.suite}</dt>
            <dd className="break-all text-muted">{report.suite || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt>{r.model}</dt>
            <dd className="break-all text-muted">{report.model || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt>{r.generatedAt}</dt>
            <dd className="break-all text-muted">{report.generated_at || "—"}</dd>
          </div>
          {totals.avg_latency_ms !== null ? (
            <div className="flex gap-2">
              <dt>{r.avgLatency}</dt>
              <dd className="text-muted tabular-nums">
                {Math.round(totals.avg_latency_ms)} ms
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <section>
        <h2 className="eyebrow mb-4">{r.casesHeading}</h2>
        <ul className="space-y-px border border-line">
          {report.cases.map((evalCase) => (
            <CaseRow key={evalCase.id} evalCase={evalCase} r={r} />
          ))}
        </ul>
      </section>
    </div>
  );
}
