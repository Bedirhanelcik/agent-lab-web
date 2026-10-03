import { SectionHeading } from "@/components/section-heading";
import { getI18n } from "@/lib/i18n/server";
import type { FlowStep } from "@/lib/i18n";

/**
 * İki akışın adım adım anlatımı ve terim sözlüğü.
 *
 * Diyagram yerine numaralı liste kullanılıyor: metin seçilebilir kalıyor,
 * ekran okuyucu sıralı bir akış olarak okuyabiliyor, dar ekranda ölçeklenen
 * bir SVG gibi okunamaz hale gelmiyor ve sekiz dile çevrildiğinde taşmıyor.
 */
function FlowList({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="mt-8 space-y-px border border-line bg-line">
      {steps.map((step, index) => (
        <li key={step.title} className="bg-surface p-5 sm:p-6">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-6">
            <div className="flex shrink-0 items-center gap-3 sm:w-44">
              <span className="mono-label flex size-7 shrink-0 items-center justify-center border border-line-bright text-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="mono-label min-w-0 break-words text-fg">{step.title}</h4>
            </div>
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted">{step.body}</p>
          </div>

          {/* Bir sonraki adıma bağlayan ok; yalnızca görsel. */}
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="mono-label mt-4 ms-1 block text-faint sm:ms-[0.6rem]"
            >
              ↓
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export async function HowItWorks() {
  const { t } = await getI18n();
  const h = t.howItWorks;

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading eyebrow={h.eyebrow} title={h.heading} description={h.intro} />

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <h3 className="display text-2xl text-fg">{h.ingestTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{h.ingestIntro}</p>
              <FlowList steps={h.ingestSteps} />
            </div>

            <div className="min-w-0">
              <h3 className="display text-2xl text-fg">{h.askTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{h.askIntro}</p>
              <FlowList steps={h.askSteps} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={h.eyebrow}
            title={h.glossaryTitle}
            description={h.glossaryIntro}
          />

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {h.glossary.map((entry) => (
              <div key={entry.term} className="card border-0 p-6">
                {/* Terim sözleşme değeri: her dilde aynı kalır. */}
                <dt className="mono-label break-words text-accent" dir="ltr">
                  {entry.term}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{entry.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
