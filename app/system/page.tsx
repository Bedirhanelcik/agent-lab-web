import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { SystemFlow } from "@/components/system-flow";

export const metadata: Metadata = {
  title: "The System",
  description:
    "Hibrit retrieval, agent karar döngüsü ve değerlendirme katmanının teknik dökümü.",
};

const RAG_PARTS = [
  {
    name: "Chroma",
    detail: "Kalıcı vektör deposu. Chunk metni ve metadata diskte tutulur.",
  },
  {
    name: "BM25",
    detail: "Tam kelime eşleşmesi. Bellekte yaşar, açılışta Chroma'dan yeniden kurulur.",
  },
  {
    name: "Reciprocal Rank Fusion",
    detail: "Skor ölçeklerini yok sayar, yalnızca sıralamayı kullanır (k = 60).",
  },
  {
    name: "multilingual-e5-small",
    detail: "Yerel embedding modeli. Sorgu ve pasaj önekleri ayrı uygulanır.",
  },
  {
    name: "Deterministik chunk kimlikleri",
    detail: "source_file::chunk_index. Atıf ve yeniden getirme anahtarı olarak kullanılır.",
  },
] as const;

const EVAL_PARTS = [
  { value: "179", label: "yerel test", detail: "Tamamı fake bileşenlerle; sıfır API çağrısı." },
  { value: "6", label: "değerlendirme vakası", detail: "Davranış ölçer, tek string eşleşmesi değil." },
  {
    value: "25",
    label: "yapısal assertion",
    detail: "Status, kullanılan tool, kaynak, atıf biçimi, uydurma kontrolü.",
  },
  { value: "1", label: "LLM judge çağrısı", detail: "Yalnızca anlamsal değerlendirme gereken vakada." },
] as const;

export default function SystemPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">Technical breakdown</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-6xl">The system</h1>
          <p
            className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            Üç katman: bilgiyi bulan retrieval, ne zaman ve nasıl arayacağına karar veren
            agent, ve davranışın ölçüldüğü değerlendirme.
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Layer 01 — Retrieval"
            title="Hibrit arama"
            description="Vektör araması anlamsal yakınlığı yakalar ama nadir terimleri ve özel adları bulanıklaştırır; BM25 tam eşleşmede güçlüdür ama çekim eklerini kaçırır. İkisi ayrı çalışır ve sıralamaları birleştirilir."
          />

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {RAG_PARTS.map((part) => (
              <div key={part.name} className="card border-0 p-6">
                <dt className="mono-label text-fg">{part.name}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{part.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Layer 02 — Agent"
            title="Karar döngüsü"
            description="Sabit bir boru hattı değil, sınırları açıkça tanımlı küçük bir durum makinesi. Her adımda bir karar var ve bu kararlar akışı değiştirir."
          />
          <div className="mt-12">
            <SystemFlow />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Layer 03 — Evaluation"
            title="Ölçülmüş davranış"
            description="Amaç 'agent'ı yaptım' değil, 'davranışını ölçtüm' diyebilmek. Değerlendirme cevabın metnine değil, agent'ın gözlemlenebilir davranışına bakar."
          />

          <dl className="mt-12 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
            {EVAL_PARTS.map((part) => (
              <div key={part.label} className="bg-surface p-6">
                <dt className="sr-only">{part.label}</dt>
                <dd>
                  <span className="display block text-3xl text-fg tabular-nums sm:text-4xl">
                    {part.value}
                  </span>
                  <span className="mono-label mt-3 block text-faint">{part.label}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-muted">
                    {part.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-2xl border-l border-line pl-5 text-sm leading-relaxed text-faint">
            Değerlendirme, ayrı bir proje olan bir prompt değerlendirme CLI’ı üzerine kurulu;
            assertion mantığı orada tanımlı ve burada yeniden yazılmıyor. Değerlendirme
            sonuçlarının arayüze taşınması sonraki aşamada yapılacak.
          </p>
        </div>
      </section>
    </>
  );
}
