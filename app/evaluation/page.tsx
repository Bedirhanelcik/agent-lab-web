import type { Metadata } from "next";

import { EvaluationReport } from "@/components/evaluation-report";
import { SectionHeading } from "@/components/section-heading";
import { getI18n } from "@/lib/i18n/server";
import { EVAL_RESULTS_RELATIVE_PATH, loadEvalReport } from "@/lib/eval-results";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.evaluationTitle, description: t.meta.evaluationDescription };
}

export default async function EvaluationPage() {
  const { t } = await getI18n();
  const state = loadEvalReport();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">{t.evaluation.heroEyebrow}</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-5xl">
            {t.evaluation.heroTitle}
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {t.evaluation.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Metodoloji ve suite yapısı: bunlar repodaki YAML'dan doğrulanabilir
          yapılandırma bilgisidir, bir koşunun sonucu değildir. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.evaluation.methodologyEyebrow}
            title={t.evaluation.methodologyTitle}
            description={t.evaluation.methodologyDescription}
          />

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
            {t.evaluation.suiteShape.map((item) => (
              <div key={item.label} className="bg-surface p-6">
                <dt>
                  <span className="display block text-3xl text-fg tabular-nums">
                    {item.value}
                  </span>
                  <span className="mono-label mt-3 block break-words text-faint">
                    {item.label}
                  </span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-faint">
            {t.evaluation.suiteNote}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.evaluation.resultsEyebrow}
            title={t.evaluation.resultsTitle}
            description={t.evaluation.resultsDescription}
          />

          <div className="mt-12">
            {state.status === "ok" ? <EvaluationReport report={state.report} /> : null}

            {state.status === "missing" ? (
              <div className="border border-line border-dashed p-6 sm:p-8">
                <h2 className="mono-label text-fg">{t.evaluation.missingTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {t.evaluation.missingBody}
                </p>
                <p className="mt-4 font-mono text-xs break-all text-faint">
                  {t.evaluation.missingExpectedFile} {EVAL_RESULTS_RELATIVE_PATH}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                  {t.evaluation.missingHowTo}
                </p>
              </div>
            ) : null}

            {state.status === "invalid" ? (
              <div className="border border-line bg-surface p-6 sm:p-8">
                <h2 className="mono-label text-fg">{t.evaluation.invalidTitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {t.evaluation.invalidBody}
                </p>
                <ul className="mt-4 space-y-1 font-mono text-xs break-words text-faint">
                  {state.problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-16 max-w-2xl space-y-4 border-s border-line ps-5">
            <h2 className="eyebrow">{t.evaluation.limitationsTitle}</h2>
            {t.evaluation.limitations.map((limitation) => (
              <p key={limitation.slice(0, 32)} className="text-sm leading-relaxed text-muted">
                {limitation}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
