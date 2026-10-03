import { Architecture } from "@/components/architecture";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { getI18n } from "@/lib/i18n/server";

export default async function Home() {
  const { t } = await getI18n();

  return (
    <>
      <Hero />
      <Architecture />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow={t.home.whyEyebrow}
            title={t.home.whyTitle}
            description={t.home.whyDescription}
          />

          <dl className="mt-14 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {t.home.facts.map((fact) => (
              <div key={fact.label} className="bg-surface p-6 sm:p-7">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="display block text-4xl text-fg tabular-nums sm:text-5xl">
                    {fact.value}
                  </span>
                  {/* Etiketler dile göre uzuyor (örn. "retrieval yöntemi" ve
                      "retrieval methods" farklı uzunlukta); `break-words`
                      olmadan iki kolonlu mobil ızgarada taşabiliyorlar. */}
                  <span className="mt-3 block break-words text-xs text-faint">
                    {fact.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
