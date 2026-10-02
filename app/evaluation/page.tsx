import type { Metadata } from "next";

import { EvaluationReport } from "@/components/evaluation-report";
import { SectionHeading } from "@/components/section-heading";
import { EVAL_RESULTS_RELATIVE_PATH, loadEvalReport } from "@/lib/eval-results";

export const metadata: Metadata = {
  title: "Evaluation",
  description:
    "Agent davranışının nasıl ölçüldüğü: vakalar, yapısal assertion'lar, sonuçlar ve sınırlar.",
};

const SUITE_SHAPE = [
  {
    value: "6",
    label: "vaka",
    detail:
      "Olgusal RAG sorusu, korpus dışı soru, doğrudan cevap, atıf doğruluğu, eksik belirtilmiş sorgu, anlamsal kalite.",
  },
  {
    value: "25",
    label: "assertion",
    detail:
      "Status, çağrılan tool, kaynak kimliği, aksiyon izi, atıf biçimi ve uydurma kontrolü.",
  },
  {
    value: "1",
    label: "LLM judge çağrısı",
    detail:
      "Yalnızca anlamsal değerlendirme gereken tek vakada. Diğer her kontrol deterministik ve ücretsiz.",
  },
] as const;

export default function EvaluationPage() {
  const state = loadEvalReport();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">Measured behaviour</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-5xl">Evaluation</h1>
          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            Amaç &ldquo;agent&apos;ı yaptım&rdquo; değil, &ldquo;davranışını ölçtüm&rdquo;
            diyebilmek. Değerlendirme cevabın güzelliğine değil, agent&apos;ın
            gözlemlenebilir davranışına bakar: hangi status döndü, retrieval gerçekten
            çağrıldı mı, doğru kaynak gösterildi mi, korpus dışı soruda uydurma yapıldı mı.
          </p>
        </div>
      </section>

      {/* Metodoloji ve suite yapısı: bunlar repodaki YAML'dan doğrulanabilir
          yapılandırma bilgisidir, bir koşunun sonucu değildir. */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Methodology"
            title="Suite yapısı"
            description="Her vaka tek bir string eşleşmesi yerine agent'ın gözlemlenebilir davranışını denetler. Kontroller, ayrı bir projede tanımlı assertion checker'ları tarafından yürütülür; burada yeniden yazılmaz."
          />

          <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
            {SUITE_SHAPE.map((item) => (
              <div key={item.label} className="bg-surface p-6">
                <dt>
                  <span className="display block text-3xl text-fg tabular-nums">
                    {item.value}
                  </span>
                  <span className="mono-label mt-3 block text-faint">{item.label}</span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-faint">
            Bu sayılar suite tanımından gelir (yapılandırma), bir koşunun sonucundan değil.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Results"
            title="Son koşu"
            description="Sonuçlar yalnızca gerçek bir değerlendirme koşusunun ürettiği artefakttan okunur. Artefakt yoksa burada hiçbir sayı gösterilmez."
          />

          <div className="mt-12">
            {state.status === "ok" ? <EvaluationReport report={state.report} /> : null}

            {state.status === "missing" ? (
              <div className="border border-line border-dashed p-6 sm:p-8">
                <h2 className="mono-label text-fg">No live evaluation artifact available</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  Bu sitede gösterilecek bir değerlendirme artefaktı bulunmuyor. Sonuç
                  uydurmak yerine yokluğu bildiriyoruz: aşağıdaki dosya yerine konduğunda
                  sayfa gerçek sayıları okuyup gösterecek.
                </p>
                <p className="mt-4 font-mono text-xs text-faint">
                  beklenen dosya: {EVAL_RESULTS_RELATIVE_PATH}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                  Artefakt, agent servisinin bulunduğu projede değerlendirme koşusu
                  çalıştırılarak üretilir. O koşu Gemini kotası harcadığı için burada
                  tetiklenmez; bu sayfa yalnızca hazır artefaktı tüketir.
                </p>
              </div>
            ) : null}

            {state.status === "invalid" ? (
              <div className="border border-line bg-surface p-6 sm:p-8">
                <h2 className="mono-label text-fg">Artefakt geçersiz</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  Dosya bulundu ama beklenen değerlendirme raporu şeklini taşımıyor. Bozuk
                  veya yanlış bir dosyayı sonuç gibi göstermek yanıltıcı olurdu, bu yüzden
                  hiçbir sayı render edilmiyor.
                </p>
                <ul className="mt-4 space-y-1 font-mono text-xs text-faint">
                  {state.problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-16 max-w-2xl space-y-4 border-l border-line pl-5">
            <h2 className="eyebrow">Limitations</h2>
            <p className="text-sm leading-relaxed text-muted">
              Değerlendirme küçük bir korpus üzerinde çalışır; bu ölçekte retrieval
              sıralaması zorlanmaz ve sonuçlar bir üretim sistemi için temsil edici
              sayılmamalıdır.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Canlı koşu ücretsiz kotayla sınırlıdır: dakikada az sayıda istek hakkı
              olduğundan, vakalar arası beklemeye rağmen bir koşu kota tükenmesi yüzünden
              yarıda kalabilir. Böyle bir durumda ilgili vakalar &ldquo;fail&rdquo; olarak
              değil, kota hatası olarak raporlanır.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Bu sayfadaki sonuçlar, playground&apos;daki hazırlanmış demo koşularından
              tamamen ayrıdır. Demo verisi hiçbir koşulda değerlendirme sonucu olarak
              sayılmaz; iki veri kaynağı ayrı dosyalarda durur ve ayrı şemalarla doğrulanır.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
