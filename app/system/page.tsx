import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { SystemFlow } from "@/components/system-flow";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.systemTitle, description: t.meta.systemDescription };
}

export default async function SystemPage() {
  const { t } = await getI18n();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">{t.system.heroEyebrow}</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-6xl">
            {t.system.heroTitle}
          </h1>
          <p
            className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {t.system.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.system.retrievalEyebrow}
            title={t.system.retrievalTitle}
            description={t.system.retrievalDescription}
          />

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {t.system.retrievalParts.map((part) => (
              <div key={part.title} className="card border-0 p-6">
                {/* Teknik adlar (gemini-embedding-001 gibi) boşluk içermeyen
                    uzun tek parça olabiliyor; `break-words` olmadan kartı
                    taşırıyorlar. */}
                <dt className="mono-label break-words text-fg">{part.title}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{part.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.system.agentEyebrow}
            title={t.system.agentTitle}
            description={t.system.agentDescription}
          />
          <div className="mt-12">
            <SystemFlow />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.system.evalEyebrow}
            title={t.system.evalTitle}
            description={t.system.evalDescription}
          />

          <dl className="mt-12 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
            {t.system.evalParts.map((part) => (
              <div key={part.label} className="bg-surface p-6">
                <dt className="sr-only">{part.label}</dt>
                <dd>
                  <span className="display block text-3xl text-fg tabular-nums sm:text-4xl">
                    {part.value}
                  </span>
                  <span className="mono-label mt-3 block break-words text-faint">
                    {part.label}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-muted">
                    {part.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-2xl border-s border-line ps-5 text-sm leading-relaxed text-faint">
            {t.system.evalNote}
          </p>
        </div>
      </section>
    </>
  );
}
