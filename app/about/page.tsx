import type { Metadata } from "next";

import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.aboutTitle, description: t.meta.aboutDescription };
}

export default async function AboutPage() {
  const { t } = await getI18n();

  const links = [
    GITHUB_URL ? { href: GITHUB_URL, label: "GitHub" } : null,
    LINKEDIN_URL ? { href: LINKEDIN_URL, label: "LinkedIn" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">{t.about.heroEyebrow}</p>
          <h1 className="display reveal mt-6 max-w-3xl text-4xl text-fg sm:text-5xl lg:text-6xl">
            {t.about.heroTitle}
          </h1>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-20">
            <div className="space-y-6 text-sm leading-relaxed text-muted sm:text-base">
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="eyebrow">{t.about.stackHeading}</h2>
                <dl className="mt-5 space-y-5">
                  {t.about.stackGroups.map((entry) => (
                    <div key={entry.group} className="border-s border-line ps-5">
                      <dt className="mono-label text-fg">{entry.group}</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {entry.items.map((item) => (
                          <span
                            key={item}
                            className="border border-line px-2.5 py-1 font-mono text-xs break-all text-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {links.length > 0 ? (
                <div>
                  <h2 className="eyebrow">{t.about.linksHeading}</h2>
                  <ul className="mt-5 flex flex-wrap gap-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mono-label inline-flex items-center gap-2 border border-line-bright px-4 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
                        >
                          {link.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
