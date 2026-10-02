import Link from "next/link";

const PILLARS = [
  {
    index: "01",
    title: "RAG",
    body: "Vektör araması ve BM25 ayrı ayrı çalışır, sonuçlar Reciprocal Rank Fusion ile birleşir. Chunk kimlikleri deterministiktir.",
  },
  {
    index: "02",
    title: "Agent",
    body: "Arama yapıp yapmayacağına kendi karar verir, dönen pasajları denetler, gerekirse sorguyu yeniden formülleyip tekrar arar.",
  },
  {
    index: "03",
    title: "Evaluation",
    body: "Davranış ölçülür: hangi status döndü, RAG gerçekten çağrıldı mı, kaynak doğru mu, korpus dışı soruda uydurma var mı.",
  },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-texture" />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <p className="eyebrow reveal">Agentic retrieval system</p>

        <h1
          className="display reveal mt-6 text-[2.75rem] text-fg sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          An agent that
          <br />
          knows when to search.
        </h1>

        <p
          className="reveal mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Hybrid retrieval. Adaptive reasoning. Grounded answers.
        </p>

        <div
          className="reveal mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/playground"
            className="mono-label inline-flex items-center gap-2 border border-accent/50 bg-surface-2 px-5 py-3 text-accent transition-colors hover:border-accent hover:bg-surface"
          >
            Try the agent
            <span aria-hidden="true">→</span>
          </Link>

          <Link
            href="/system"
            className="mono-label inline-flex items-center gap-2 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Explore the system
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-20 grid gap-px border border-line bg-line sm:mt-24 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <li
              key={pillar.title}
              className="card reveal border-0 p-6 sm:p-7"
              style={{ animationDelay: `${320 + i * 80}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="mono-label text-fg">{pillar.title}</h2>
                <span className="eyebrow">{pillar.index}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
