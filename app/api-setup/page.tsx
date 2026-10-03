import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { SectionHeading } from "@/components/section-heading";
import { GITHUB_URL } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";
import type { EnvVar } from "@/lib/i18n";

/** Google'ın resmî fiyatlandırma/kota sayfası. Kota bilgisi burada tekrar
 *  edilmiyor: Google'ın politikası değişebilir, kaynak gösterilir. */
const GEMINI_PRICING_URL = "https://ai.google.dev/gemini-api/docs/pricing";
const AI_STUDIO_URL = "https://aistudio.google.com/apikey";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.apiSetupTitle, description: t.meta.apiSetupDescription };
}

function StepNumber({ index }: { index: number }) {
  return (
    <span className="mono-label flex size-7 shrink-0 items-center justify-center border border-line-bright text-faint tabular-nums">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function EnvTable({
  vars,
  labels,
}: {
  vars: EnvVar[];
  labels: { required: string; optional: string; secret: string };
}) {
  return (
    <ul className="divide-y divide-line border border-line">
      {vars.map((item) => (
        <li key={item.name} className="p-5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <code className="font-mono text-sm break-all text-fg" dir="ltr">
              {item.name}
            </code>
            <span
              className={`mono-label border px-2 py-0.5 text-[0.625rem] ${
                item.required ? "border-accent/40 text-accent" : "border-line text-faint"
              }`}
            >
              {item.required ? labels.required : labels.optional}
            </span>
            {item.secret ? (
              <span className="mono-label border border-danger/40 px-2 py-0.5 text-[0.625rem] text-danger">
                {labels.secret}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

          <p className="mt-3 font-mono text-xs break-all text-faint" dir="ltr">
            {item.name}={item.example}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function ApiSetupPage() {
  const { t } = await getI18n();
  const a = t.apiSetup;

  const envFile = a.envVars
    .map((item) => `${item.name}=${item.example}`)
    .join("\n");

  const frontendEnvFile = a.frontendVars
    .map((item) => `${item.name}=${item.example}`)
    .join("\n");

  const cloneCommand = `git clone ${GITHUB_URL}.git\ncd rag`;

  const runCommands = [
    "# backend",
    "uv sync --no-editable",
    "uv run uvicorn rag_tr.api.main:app --port 8000",
    "",
    "# interface",
    "npm install",
    "npm run dev",
  ].join("\n");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-texture" />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-14 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="eyebrow reveal">{a.heroEyebrow}</p>
          <h1 className="display reveal mt-6 max-w-3xl text-4xl text-fg sm:text-5xl">
            {a.heroTitle}
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-muted"
            style={{ animationDelay: "120ms" }}
          >
            {a.heroIntro}
          </p>

          <div
            className="reveal mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-label inline-flex items-center gap-2 border border-accent/50 bg-surface-2 px-5 py-3 text-accent transition-colors hover:border-accent hover:bg-surface"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              {a.githubButton}
            </a>

            <a
              href={AI_STUDIO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-label inline-flex items-center gap-2 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {a.localSteps[1]?.title ?? "API key"}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* --- neden kendi anahtarım --- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-20">
            <div>
              <SectionHeading eyebrow={a.heroEyebrow} title={a.whyTitle} />
              <div className="mt-6 space-y-4">
                {a.whyBody.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-5 self-center">
              <div className="border border-line bg-surface p-5">
                <h3 className="mono-label text-fg">{a.quotaTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a.quotaBody}</p>
                <a
                  href={GEMINI_PRICING_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mono-label mt-4 inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline"
                >
                  {a.quotaLink}
                  <span aria-hidden="true">↗</span>
                </a>
                <p className="mt-4 text-sm leading-relaxed text-faint">{a.quotaNote}</p>
              </div>

              <div className="border border-line bg-surface p-5">
                <h3 className="mono-label text-fg">{a.githubTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a.githubBody}</p>
                <p className="mt-3 font-mono text-xs break-all text-faint" dir="ltr">
                  {GITHUB_URL}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- yerel kurulum --- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading eyebrow={a.heroEyebrow} title={a.localTitle} description={a.localIntro} />

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
            <ol className="space-y-6">
              {a.localSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <StepNumber index={index} />
                  <div className="min-w-0">
                    <h3 className="mono-label text-fg">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="min-w-0 space-y-6">
              <CodeBlock
                label="terminal"
                code={cloneCommand}
                copyLabel={a.copy}
                copiedLabel={a.copied}
              />
              <CodeBlock label=".env" code={envFile} copyLabel={a.copy} copiedLabel={a.copied} />
              <div>
                <h3 className="mono-label text-fg">{a.runTitle}</h3>
                <p className="mt-2 mb-4 text-sm leading-relaxed text-muted">{a.runIntro}</p>
                <CodeBlock
                  label="terminal"
                  code={runCommands}
                  copyLabel={a.copy}
                  copiedLabel={a.copied}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- backend ortam değişkenleri --- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading eyebrow="Backend" title={a.envTitle} description={a.envIntro} />
          <div className="mt-12">
            <EnvTable
              vars={a.envVars}
              labels={{ required: a.envRequired, optional: a.envOptional, secret: a.envSecret }}
            />
          </div>
        </div>
      </section>

      {/* --- Render --- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading eyebrow="Render" title={a.renderTitle} description={a.renderIntro} />

          {/* Render panelindeki yol: ekrandaki menü adları çevrilmez, çünkü
              kullanıcı onları orada İngilizce görecek. */}
          <ol className="no-scrollbar mt-12 flex items-stretch gap-0 overflow-x-auto">
            {a.renderSteps.map((step, index) => (
              <li key={step.title} className="flex min-w-[15rem] flex-1 items-stretch">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="flex items-center px-3 text-faint rtl:rotate-180"
                  >
                    →
                  </span>
                ) : null}
                <div className="card flex-1 p-5">
                  <span className="eyebrow tabular-nums">
                    {t.howItWorks.stepLabel} {index + 1}
                  </span>
                  <h3 className="mono-label mt-3 text-fg" dir="ltr">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <CodeBlock
              label="Render · Environment Variables"
              code={a.envVars
                .filter((item) => item.required || item.secret)
                .map((item) => `${item.name}=${item.secret ? "••••••••" : item.example}`)
                .join("\n")}
              copyLabel={a.copy}
              copiedLabel={a.copied}
            />

            <div className="border border-line bg-surface p-5">
              <h3 className="mono-label text-danger">{a.secretsTitle}</h3>
              <ul className="mt-4 space-y-3">
                {a.secretsBody.map((item) => (
                  <li
                    key={item.slice(0, 24)}
                    className="border-s border-line-bright ps-4 text-sm leading-relaxed text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- arayüz değişkenleri --- */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Frontend"
            title={a.frontendTitle}
            description={a.frontendBody}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
            <EnvTable
              vars={a.frontendVars}
              labels={{ required: a.envRequired, optional: a.envOptional, secret: a.envSecret }}
            />
            <div className="min-w-0 self-start">
              <CodeBlock
                label=".env.local"
                code={frontendEnvFile}
                copyLabel={a.copy}
                copiedLabel={a.copied}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
