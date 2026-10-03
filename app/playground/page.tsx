import type { Metadata } from "next";

import { Playground } from "@/components/playground";
import { APP_MODE, UPLOAD_ENABLED } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.playgroundTitle, description: t.meta.playgroundDescription };
}

export default async function PlaygroundPage() {
  const { t } = await getI18n();

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">{t.playground.heroEyebrow}</p>
          <h1 className="display reveal mt-6 text-4xl text-fg sm:text-5xl">
            {t.playground.heroTitle}
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {APP_MODE === "demo"
              ? t.playground.heroDemoSubtitle
              : t.playground.heroLiveSubtitle}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Playground mode={APP_MODE} uploadEnabled={UPLOAD_ENABLED} />
        </div>
      </section>
    </>
  );
}
