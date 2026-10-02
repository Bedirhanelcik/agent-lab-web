import { SectionHeading } from "@/components/section-heading";

/**
 * Mimari akış.
 *
 * Bilinçli olarak SVG değil, anlamsal HTML + CSS: metin seçilebilir kalıyor,
 * ekran okuyucu sıralı bir boru hattı olarak okuyabiliyor ve dar ekranda
 * ölçeklenen SVG metni gibi okunamaz hale gelmiyor. Bağlayıcı çizgiler
 * dekoratiftir ve erişilebilirlik ağacından çıkarılmıştır.
 */

function Connector({ className = "h-6" }: { className?: string }) {
  return <div aria-hidden="true" className={`flow-line mx-auto ${className}`} />;
}

function Node({
  label,
  note,
  tone = "default",
}: {
  label: string;
  note?: string;
  tone?: "default" | "accent" | "terminal";
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent/40 bg-surface-2"
      : tone === "terminal"
        ? "border-line-bright bg-surface-2"
        : "border-line bg-surface";

  return (
    <div className={`border px-4 py-3 text-center ${toneClass}`}>
      <span
        className={`mono-label ${tone === "accent" ? "text-accent" : "text-fg"}`}
      >
        {label}
      </span>
      {note ? <span className="mt-1 block text-xs text-faint">{note}</span> : null}
    </div>
  );
}

export function Architecture() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Architecture"
          title="Bir sorunun sistemden geçtiği yol"
          description="Agent önce arama gerekip gerekmediğine karar verir. Arama gerekiyorsa iki farklı retrieval yöntemi paralel çalışır, sonuçlar rank bazlı birleştirilir ve yalnızca yeterli bağlam bulunduğunda cevap üretilir."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <ol className="mx-auto w-full max-w-sm lg:mx-0">
            <li>
              <Node label="User" note="soru" />
            </li>
            <li>
              <Connector />
              <Node label="Research Agent" note="assess · inspect · refine" tone="accent" />
            </li>
            <li>
              <Connector />
              <Node label="RAG Search" note="rag_search tool" />
            </li>

            {/* paralel retrieval kolu */}
            <li aria-hidden="true">
              <Connector className="h-5" />
              <div className="relative mx-auto h-5 w-1/2">
                <div className="flow-line-h absolute top-0 right-0 left-0" />
                <div className="flow-line absolute top-0 bottom-0 left-0" />
                <div className="flow-line absolute top-0 right-0 bottom-0" />
              </div>
            </li>
            <li>
              <ul className="grid grid-cols-2 gap-3">
                <li>
                  <Node label="Vector" note="Chroma · e5" />
                </li>
                <li>
                  <Node label="BM25" note="rank-bm25" />
                </li>
              </ul>
            </li>
            <li aria-hidden="true">
              <div className="relative mx-auto h-5 w-1/2">
                <div className="flow-line absolute top-0 bottom-0 left-0" />
                <div className="flow-line absolute top-0 right-0 bottom-0" />
                <div className="flow-line-h absolute right-0 bottom-0 left-0" />
              </div>
              <Connector className="h-5" />
            </li>

            <li>
              <Node label="RRF" note="reciprocal rank fusion" />
            </li>
            <li>
              <Connector />
              <Node label="Passages" note="chunk_id · source · rank" />
            </li>
            <li>
              <Connector />
              <Node label="Gemini" note="grounded synthesis" tone="accent" />
            </li>
            <li>
              <Connector />
              <Node label="Grounded Answer" note="atıflı cevap" tone="terminal" />
            </li>
          </ol>

          <dl className="space-y-8 self-center">
            {[
              {
                term: "Karar katmanı",
                detail:
                  "Agent, soruyu yanıtlamak için arşive bakmanın gerekip gerekmediğine karar verir. Selamlama gibi girdilerde retrieval hiç çağrılmaz; tool çağrısı sayısı sıfır kalır.",
              },
              {
                term: "Paralel retrieval",
                detail:
                  "Vektör araması anlamsal yakınlığı, BM25 tam kelime eşleşmesini yakalar. İkisi birbirinin zayıf noktasını kapatır; Türkçe çekim ekleri bu yüzden önemlidir.",
              },
              {
                term: "Rank bazlı birleştirme",
                detail:
                  "Cosine benzerliği ile BM25 skoru aynı ölçekte değildir. RRF skorları tamamen yok sayıp yalnızca sıralamayı kullanır, böylece kırılgan bir normalizasyona gerek kalmaz.",
              },
              {
                term: "Temellendirilmiş cevap",
                detail:
                  "Sentez yalnızca getirilen pasajlarla yapılır ve her iddia bir chunk kimliğine bağlanır. Yeterli bağlam yoksa agent cevap üretmeyi reddeder.",
              },
            ].map((item) => (
              <div key={item.term} className="border-l border-line pl-5">
                <dt className="mono-label text-fg">{item.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
