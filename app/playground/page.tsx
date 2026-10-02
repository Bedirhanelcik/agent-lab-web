import type { Metadata } from "next";

import { Playground } from "@/components/playground";
import { APP_MODE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Hazırlanmış agent koşuları: karar izi, yapılan aramalar, getirilen pasajlar ve kaynak gösteren cevap.",
};

export default function PlaygroundPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">Playground</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-5xl">
            Agent&apos;ı iş başında gör.
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {APP_MODE === "demo"
              ? "Bu sayfa demo modunda çalışıyor: hiçbir model çağrısı yapılmaz, gösterilen her koşu önceden hazırlanmıştır. Canlı mod ayrı bir aşamada eklenecek."
              : "Canlı mod etkin."}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Playground />
        </div>
      </section>
    </>
  );
}
