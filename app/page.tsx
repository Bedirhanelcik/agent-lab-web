import { Architecture } from "@/components/architecture";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";

const FACTS = [
  { value: "179", label: "yerel test" },
  { value: "6", label: "değerlendirme vakası" },
  { value: "2", label: "retrieval yöntemi" },
  { value: "0", label: "framework katmanı" },
] as const;

export default function Home() {
  return (
    <>
      <Hero />
      <Architecture />

      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Why it exists"
            title="Sadece bir RAG demosu değil"
            description="Çoğu örnek soruyu alır, vektör aramasına verir ve sonucu bir dil modeline iletir. Buradaki fark karar katmanı: sistem aramanın gerekip gerekmediğine, dönen sonucun yeterli olup olmadığına ve tekrar denemeye değip değmeyeceğine kendi karar veriyor. Yetersiz bağlamda cevap üretmeyi reddediyor."
          />

          <dl className="mt-14 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="bg-surface p-6 sm:p-7">
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="display block text-4xl text-fg tabular-nums sm:text-5xl">
                    {fact.value}
                  </span>
                  <span className="mt-3 block text-xs text-faint">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
