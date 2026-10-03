import { SectionHeading } from "@/components/section-heading";
import { getI18n } from "@/lib/i18n/server";

/**
 * Mimari akış.
 *
 * Bilinçli olarak SVG değil, anlamsal HTML + CSS: metin seçilebilir kalıyor,
 * ekran okuyucu sıralı bir boru hattı olarak okuyabiliyor ve dar ekranda
 * ölçeklenen SVG metni gibi okunamaz hale gelmiyor. Bağlayıcı çizgiler
 * dekoratiftir ve erişilebilirlik ağacından çıkarılmıştır.
 *
 * Düğüm adları (User, RAG Search, BM25, RRF, Gemini) teknik terim oldukları
 * için çevrilmiyor; altlarındaki açıklama notları çevriliyor.
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
      <span className={`mono-label ${tone === "accent" ? "text-accent" : "text-fg"}`}>
        {label}
      </span>
      {note ? <span className="mt-1 block text-xs text-faint">{note}</span> : null}
    </div>
  );
}

export async function Architecture() {
  const { t } = await getI18n();
  const nodes = t.architecture.nodes;

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow={t.architecture.eyebrow}
          title={t.architecture.title}
          description={t.architecture.description}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <ol className="mx-auto w-full max-w-sm lg:mx-0">
            <li>
              <Node label="User" note={nodes.user} />
            </li>
            <li>
              <Connector />
              <Node label="Research Agent" note={nodes.agent} tone="accent" />
            </li>
            <li>
              <Connector />
              <Node label="RAG Search" note={nodes.ragSearch} />
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
                  <Node label="Vector" note={nodes.vector} />
                </li>
                <li>
                  <Node label="BM25" note={nodes.keyword} />
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
              <Node label="RRF" note={nodes.fusion} />
            </li>
            <li>
              <Connector />
              <Node label="Passages" note={nodes.passages} />
            </li>
            <li>
              <Connector />
              <Node label="Gemini" note={nodes.synthesis} tone="accent" />
            </li>
            <li>
              <Connector />
              <Node label={nodes.answerLabel} note={nodes.answer} tone="terminal" />
            </li>
          </ol>

          <dl className="space-y-8 self-center">
            {t.architecture.points.map((item) => (
              <div key={item.title} className="border-s border-line ps-5">
                <dt className="mono-label text-fg">{item.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
