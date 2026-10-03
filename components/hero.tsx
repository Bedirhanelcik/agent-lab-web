import Link from "next/link";

import { getI18n } from "@/lib/i18n/server";

export async function Hero() {
  const { t } = await getI18n();
  const pillars = t.home.pillars;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-texture" />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <p className="eyebrow reveal">{t.home.heroEyebrow}</p>

        {/* Başlık iki satıra bölünüyor ama satır sonu `<br>` ile zorlanmıyor:
            diller farklı uzunlukta ve zorlanan bir satır sonu bir dilde güzel,
            ötekinde ortada kesilmiş görünür. `block` ile iki parça olarak
            diziliyor, dar ekranda ise kendi içinde sarıyor. */}
        <h1
          className="display reveal mt-6 text-[2.75rem] text-fg sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          <span className="block">{t.home.heroTitleLine1}</span>
          <span className="block">{t.home.heroTitleLine2}</span>
        </h1>

        <p
          className="reveal mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          {t.home.heroSubtitle}
        </p>

        <div
          className="reveal mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/playground"
            className="mono-label inline-flex items-center gap-2 border border-accent/50 bg-surface-2 px-5 py-3 text-accent transition-colors hover:border-accent hover:bg-surface"
          >
            {t.home.ctaPlayground}
            {/* RTL'de ok kendiliğinden ters dönmeli: `rtl:rotate-180` yön
                değiştiğinde sağ oku sola çevirir. */}
            <span aria-hidden="true" className="rtl:rotate-180">
              →
            </span>
          </Link>

          <Link
            href="/system"
            className="mono-label inline-flex items-center gap-2 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {t.home.ctaSystem}
            <span aria-hidden="true" className="rtl:rotate-180">
              →
            </span>
          </Link>
        </div>

        <ul className="mt-20 grid gap-px border border-line bg-line sm:mt-24 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <li
              key={pillar.title}
              className="card reveal border-0 p-6 sm:p-7"
              style={{ animationDelay: `${320 + i * 80}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="mono-label text-fg">{pillar.title}</h2>
                <span className="eyebrow tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
