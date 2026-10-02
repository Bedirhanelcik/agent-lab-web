import type { EvalCase, EvalReport } from "@/lib/eval-report";

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
      <span className="mono-label mt-3 block text-faint">{label}</span>
      {note ? <span className="mt-2 block text-xs text-muted">{note}</span> : null}
    </div>
  );
}

function CaseRow({ evalCase }: { evalCase: EvalCase }) {
  const passedAssertions = evalCase.assertions.filter((assertion) => assertion.passed).length;

  return (
    <li className="bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <code className="font-mono text-sm text-fg">{evalCase.id}</code>
        <span
          className={`mono-label border px-2.5 py-1 ${
            evalCase.passed ? "border-accent/40 text-accent" : "border-line-bright text-fg"
          }`}
        >
          {evalCase.passed ? "pass" : "fail"}
        </span>
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
        <div className="flex gap-2">
          <dt>status</dt>
          <dd className="text-muted">{evalCase.status ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt>assertions</dt>
          <dd className="text-muted tabular-nums">
            {passedAssertions}/{evalCase.assertions.length}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt>agent calls</dt>
          <dd className="text-muted tabular-nums">{evalCase.llm_calls ?? "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt>judge calls</dt>
          <dd className="text-muted tabular-nums">{evalCase.judge_calls}</dd>
        </div>
        {evalCase.latency_ms !== null ? (
          <div className="flex gap-2">
            <dt>latency</dt>
            <dd className="text-muted tabular-nums">{Math.round(evalCase.latency_ms)} ms</dd>
          </div>
        ) : null}
      </dl>

      {evalCase.error ? (
        <p className="mt-4 border-l border-line-bright pl-4 text-sm leading-relaxed text-muted">
          <span className="mono-label text-fg">error </span>
          {evalCase.error}
        </p>
      ) : null}

      {evalCase.assertions.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {evalCase.assertions.map((assertion, index) => (
            <li
              key={`${assertion.type}-${index}`}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
            >
              <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${
                  assertion.passed ? "bg-accent" : "bg-faint"
                }`}
              />
              <code className="font-mono text-xs text-fg">{assertion.type}</code>
              <span className="sr-only">{assertion.passed ? "geçti" : "başarısız"}</span>
              {assertion.score !== null ? (
                <span className="font-mono text-xs text-faint tabular-nums">
                  score {assertion.score}
                </span>
              ) : null}
              {assertion.detail ? (
                <span className="min-w-0 flex-1 text-muted">{assertion.detail}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function EvaluationReport({ report }: { report: EvalReport }) {
  const { totals } = report;

  return (
    <div className="space-y-12">
      <div>
        <dl className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-5">
          <Metric value={totals.cases} label="cases" />
          <Metric value={totals.passed} label="passed" tone="accent" />
          <Metric value={totals.failed} label="failed" />
          <Metric
            value={`${totals.assertions_passed}/${totals.assertions}`}
            label="assertions"
          />
          <Metric
            value={totals.gemini_calls.total}
            label="gemini calls"
            note={`${totals.gemini_calls.agent} agent + ${totals.gemini_calls.judge} judge`}
          />
        </dl>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-faint">
          <div className="flex gap-2">
            <dt>suite</dt>
            <dd className="text-muted">{report.suite || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt>model</dt>
            <dd className="text-muted">{report.model || "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt>generated_at</dt>
            <dd className="text-muted">{report.generated_at || "—"}</dd>
          </div>
          {totals.avg_latency_ms !== null ? (
            <div className="flex gap-2">
              <dt>avg latency</dt>
              <dd className="text-muted tabular-nums">
                {Math.round(totals.avg_latency_ms)} ms
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <section>
        <h2 className="eyebrow mb-4">Cases</h2>
        <ul className="space-y-px border border-line">
          {report.cases.map((evalCase) => (
            <CaseRow key={evalCase.id} evalCase={evalCase} />
          ))}
        </ul>
      </section>
    </div>
  );
}
