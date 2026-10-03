"use client";

import { useState } from "react";

import { AgentResult, AgentRunPanels } from "@/components/agent-result";
import { useI18n } from "@/components/i18n-provider";
import { DocumentWorkspace } from "@/components/document-workspace";
import { DEMO_DATA_PROBLEMS, DEMO_QUESTIONS, resolveDemoRun } from "@/lib/demo-runs";
import { normalizeAgentRun, type AgentRun, type DemoRunView } from "@/lib/agent-contract";
import type { AgentApiErrorKind } from "@/lib/agent-api";
import type { AppMode } from "@/lib/ui-config";

type Phase =
  | { kind: "idle" }
  | { kind: "running"; question: string }
  | { kind: "demo-result"; view: DemoRunView }
  | { kind: "live-result"; question: string; run: AgentRun }
  | { kind: "not-found"; question: string }
  | { kind: "error"; code: AgentApiErrorKind | "bad_response" };

/**
 * Playground.
 *
 * Demo modunda hiçbir ağ isteği yapılmaz: sorular yerel olarak hazırlanmış
 * koşularla eşleştirilir. Canlı modda istek Next.js route handler'ına gider;
 * backend adresi ve sırlar tarayıcıya hiç ulaşmaz. İki yol da aynı
 * `AgentRun` modeline normalize edildiği için render bileşenleri paylaşılır.
 *
 * Seçili arayüz dili istekle birlikte gönderilir (`language`), böylece Gemini
 * cevabı o dilde üretir. Bu EK bir model çağrısı değildir: soru çevrilmez,
 * yalnızca backend'in system prompt'una bir dil direktifi eklenir.
 */
export function Playground({
  mode,
  uploadEnabled,
}: {
  mode: AppMode;
  uploadEnabled: boolean;
}) {
  const { t, locale } = useI18n();
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const isLive = mode === "live";
  const dataBroken = !isLive && DEMO_DATA_PROBLEMS.length > 0;
  const busy = phase.kind === "running";

  async function runLive(value: string) {
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: value, language: locale }),
      });
      const payload = (await response.json()) as
        | { ok: true; run: unknown }
        | { ok: false; kind: AgentApiErrorKind };

      if (!payload.ok) {
        setPhase({ kind: "error", code: payload.kind });
        return;
      }

      // İstemci tarafında bir kez daha normalize edilir: beklenmeyen bir alan
      // (ham çıktı, prompt, demo meta verisi) render yoluna giremez.
      const normalized = normalizeAgentRun(payload.run);
      setPhase(
        normalized.ok
          ? { kind: "live-result", question: value, run: normalized.run }
          : { kind: "error", code: "bad_response" },
      );
    } catch {
      setPhase({ kind: "error", code: "network" });
    }
  }

  function run(value: string) {
    const trimmed = value.trim();
    // Çift gönderimi engeller: istek sürerken yeni istek başlatılmaz.
    if (!trimmed || busy || dataBroken) return;

    setPhase({ kind: "running", question: trimmed });

    if (isLive) {
      void runLive(trimmed);
      return;
    }

    // Yerel veriyi çözmek anlıktır; bu kısa bekleme yalnızca izin sırayla
    // belirmesini okunur kılmak için var ve bir model çağrısı değil.
    window.setTimeout(() => {
      const view = resolveDemoRun(trimmed);
      setPhase(view ? { kind: "demo-result", view } : { kind: "not-found", question: trimmed });
    }, 220);
  }

  if (dataBroken) {
    return (
      <div className="border border-line bg-surface p-5">
        <h2 className="mono-label text-fg">{t.playground.demoDataTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t.playground.demoDataBody}
        </p>
        <ul className="mt-3 space-y-1 font-mono text-xs break-words text-faint">
          {DEMO_DATA_PROBLEMS.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          run(question);
        }}
        className="space-y-4"
      >
        <label htmlFor="question" className="eyebrow block">
          {t.playground.questionLabel}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="question"
            name="question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              isLive ? t.playground.placeholderLive : t.playground.placeholderDemo
            }
            autoComplete="off"
            // Kullanici hangi dilde yazarsa yazsin dogru yonde gorunsun.
            dir="auto"
            disabled={busy}
            className="min-w-0 flex-1 border border-line-field bg-surface px-4 py-3 text-fg placeholder:text-faint focus:border-accent focus:outline-none disabled:border-line-bright disabled:text-muted"
          />
          <button
            type="submit"
            disabled={busy || question.trim().length === 0}
            className="mono-label shrink-0 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
          >
            {busy
              ? isLive
                ? t.playground.submittingLive
                : t.playground.submittingDemo
              : t.playground.submit}
          </button>
        </div>

        <div>
          <p className="eyebrow mb-3">
            {isLive ? t.playground.examplesLive : t.playground.examplesDemo}
          </p>
          {/* Hazır sorular korpusun dilinde kalır: Türkçe arşivde cevabı olan
              sorular bunlar ve çevrilmiş halleri demo eşleşmesini bozar. */}
          <ul className="flex flex-wrap gap-2">
            {DEMO_QUESTIONS.map((example) => (
              <li key={example.id} className="min-w-0 max-w-full">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setQuestion(example.question);
                    run(example.question);
                  }}
                  className="flex max-w-full items-center gap-2 border border-line px-3 py-2 text-start text-xs text-muted transition-colors hover:border-line-bright hover:text-fg disabled:cursor-not-allowed disabled:text-faint"
                >
                  <span className="truncate" dir="auto">
                    {example.question}
                  </span>
                  {/* Synthetic etiketi yalnızca hazır koşuları işaretler;
                      canlı modda hazır koşu diye bir şey yok. */}
                  {!isLive && example.synthetic ? (
                    <span className="mono-label shrink-0 text-accent">
                      {t.playground.syntheticTag}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>

      <DocumentWorkspace mode={mode} uploadEnabled={uploadEnabled} />

      <div aria-live="polite" aria-busy={busy}>
        {phase.kind === "idle" ? (
          <div className="border border-line border-dashed p-6">
            <p className="text-sm leading-relaxed text-muted">
              {isLive ? t.playground.idleLive : t.playground.idleDemo}
            </p>
          </div>
        ) : null}

        {phase.kind === "running" ? (
          <div className="border border-line bg-surface p-6">
            <p className="mono-label text-faint">
              <span className="pulse-dot me-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              {isLive ? t.playground.runningLive : t.playground.runningDemo}
            </p>
            <p className="mt-2 truncate text-sm text-muted" dir="auto">
              {phase.question}
            </p>
            {isLive ? (
              <p className="mt-3 text-xs leading-relaxed text-faint">
                {t.playground.runningHint}
              </p>
            ) : null}
          </div>
        ) : null}

        {phase.kind === "not-found" ? (
          <div className="border border-line bg-surface p-6">
            <h2 className="mono-label text-fg">{t.playground.notFoundTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t.playground.notFoundBody}
            </p>
            <p className="mt-3 font-mono text-xs break-words text-faint">
              {t.playground.notFoundQuery}{" "}
              <span dir="auto">&ldquo;{phase.question}&rdquo;</span>
            </p>
          </div>
        ) : null}

        {phase.kind === "error" ? (
          <div className="border border-line bg-surface p-6">
            <h2 className="mono-label text-fg">{t.errors.title[phase.code]}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {t.errors.body[phase.code]}
            </p>
            {/* Makine kodu teknik bir etiket: her dilde aynı kalır ki hata
                bildirimi ve log arama anlamlı olsun. */}
            <p className="mt-3 font-mono text-xs text-faint" dir="ltr">
              {phase.code}
            </p>
          </div>
        ) : null}

        {phase.kind === "demo-result" ? <AgentResult view={phase.view} /> : null}

        {phase.kind === "live-result" ? (
          <AgentRunPanels run={phase.run} question={phase.question} />
        ) : null}
      </div>
    </div>
  );
}
