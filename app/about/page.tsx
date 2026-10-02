import type { Metadata } from "next";

import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "SENG360 dersinde görülen agentic AI konularından yola çıkarak geliştirilen bağımsız bir mühendislik projesi.",
};

const STACK = [
  { group: "Arayüz", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Servis", items: ["FastAPI", "Python", "Pydantic"] },
  { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "multilingual-e5-small"] },
  { group: "Muhakeme", items: ["Gemini", "Agentic workflow", "RAG"] },
] as const;

export default function AboutPage() {
  const links = [
    GITHUB_URL ? { href: GITHUB_URL, label: "GitHub" } : null,
    LINKEDIN_URL ? { href: LINKEDIN_URL, label: "LinkedIn" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">The project</p>
          <h1 className="display reveal mt-6 max-w-3xl text-4xl text-fg sm:text-5xl lg:text-6xl">
            Built as an experiment in agentic AI.
          </h1>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-20">
            <div className="space-y-6 text-sm leading-relaxed text-muted sm:text-base">
              <p>
                SENG360 dersinde agentic AI konularını görmeye başladım. Bu konular ilgimi
                çekti ve dersin müfredatını referans alarak, kendi AI geliştirme
                çalışmalarımı daha ileri bir seviyeye taşımak için bağımsız bir proje
                geliştirmeye başladım.
              </p>
              <p>
                Proje bir ödev teslimi değil: ders bir başlangıç noktası oldu, sistemin
                tamamı ondan bağımsız olarak tasarlandı ve yazıldı. Amaç genel amaçlı bir
                sohbet arayüzü üretmek değil, retrieval’ı bir tool olarak kullanan, ne
                zaman arayacağına kendi karar veren ve kaynak göstermeden cevap vermeyen
                bir sistem kurmak.
              </p>
              <p>
                Üç parça bağımsız olarak çalışır ve bağımsız olarak test edilir: hibrit
                retrieval katmanı, karar döngüsüne sahip agent, ve agent’ın davranışını
                ölçen değerlendirme sistemi. Bu site onları tek bir anlatı altında
                birleştiriyor.
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <h2 className="eyebrow">Teknoloji</h2>
                <dl className="mt-5 space-y-5">
                  {STACK.map((entry) => (
                    <div key={entry.group} className="border-l border-line pl-5">
                      <dt className="mono-label text-fg">{entry.group}</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {entry.items.map((item) => (
                          <span
                            key={item}
                            className="border border-line px-2.5 py-1 font-mono text-xs text-muted"
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
                  <h2 className="eyebrow">Bağlantılar</h2>
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
