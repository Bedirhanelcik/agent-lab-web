"use client";

import { useState } from "react";

import { AgentResult } from "@/components/agent-result";
import { DEMO_DATA_PROBLEMS, DEMO_QUESTIONS, resolveDemoRun } from "@/lib/demo-runs";
import type { DemoRunView } from "@/lib/agent-contract";

type Phase =
  | { kind: "idle" }
  | { kind: "resolving"; question: string }
  | { kind: "result"; view: DemoRunView }
  | { kind: "not-found"; question: string };

/**
 * Demo playground.
 *
 * Hiçbir backend veya model çağrısı yapılmaz: sorular, önceden hazırlanmış
 * koşular arasında eşleştirilir. Canlı moda bağlanma ayrı bir aşamanın işi;
 * o aşamada yalnızca bu bileşenin veri kaynağı değişecek, görüntüleme yolu
 * aynı kalacak çünkü demo verisi canlı yanıtla aynı şekli taşıyor.
 */
export function Playground() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const dataBroken = DEMO_DATA_PROBLEMS.length > 0;

  function run(value: string) {
    const trimmed = value.trim();
    if (!trimmed || dataBroken) return;

    setPhase({ kind: "resolving", question: trimmed });

    // Kısa bir geçiş: yerel veriyi çözmek anlıktır, bu bekleme yalnızca izin
    // sırayla belirmesini okunur kılmak için var ve bir model çağrısı değil.
    window.setTimeout(() => {
      const view = resolveDemoRun(trimmed);
      setPhase(view ? { kind: "result", view } : { kind: "not-found", question: trimmed });
    }, 220);
  }

  function pick(example: string) {
    setQuestion(example);
    run(example);
  }

  if (dataBroken) {
    return (
      <div className="border border-line bg-surface p-5">
        <h2 className="mono-label text-fg">Demo verisi okunamadı</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Hazırlanmış koşular beklenen şekli taşımıyor, bu yüzden hiçbir örnek
          gösterilmiyor. Bozuk veriyi yine de render etmek yanıltıcı olurdu.
        </p>
        <ul className="mt-3 space-y-1 font-mono text-xs text-faint">
          {DEMO_DATA_PROBLEMS.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </div>
    );
  }

  const busy = phase.kind === "resolving";

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
          Question
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="question"
            name="question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Bir soru yazın veya aşağıdaki hazır örneklerden birini seçin"
            autoComplete="off"
            className="min-w-0 flex-1 border border-line bg-surface px-4 py-3 text-fg placeholder:text-faint focus:border-line-bright focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || question.trim().length === 0}
            className="mono-label shrink-0 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
          >
            {busy ? "Resolving…" : "Submit"}
          </button>
        </div>

        <div>
          <p className="eyebrow mb-3">Prepared questions</p>
          <ul className="flex flex-wrap gap-2">
            {DEMO_QUESTIONS.map((example) => (
              <li key={example.id}>
                <button
                  type="button"
                  onClick={() => pick(example.question)}
                  className="flex max-w-full items-center gap-2 border border-line px-3 py-2 text-left text-xs text-muted transition-colors hover:border-line-bright hover:text-fg"
                >
                  <span className="truncate">{example.question}</span>
                  {example.synthetic ? (
                    <span className="mono-label shrink-0 text-accent">synthetic</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>

      <div aria-live="polite" aria-busy={busy}>
        {phase.kind === "idle" ? (
          <div className="border border-line border-dashed p-6">
            <p className="text-sm leading-relaxed text-muted">
              Demo modunda yalnızca yukarıdaki hazır sorular yanıtlanır. Bir soru seçin;
              agent&apos;ın o soru için verdiği karar, yaptığı aramalar, getirdiği pasajlar ve
              kaynak gösteren cevabı aşağıda görünecek.
            </p>
          </div>
        ) : null}

        {phase.kind === "resolving" ? (
          <div className="border border-line bg-surface p-6">
            <p className="mono-label text-faint">
              <span className="pulse-dot mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              Hazırlanmış koşu çözümleniyor
            </p>
            <p className="mt-2 truncate text-sm text-muted">{phase.question}</p>
          </div>
        ) : null}

        {phase.kind === "not-found" ? (
          <div className="border border-line bg-surface p-6">
            <h2 className="mono-label text-fg">Hazırlanmış örnek bulunamadı</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Bu demo sorusu için hazırlanmış bir örnek bulunamadı. Demo modu canlı model
              çağrısı yapmadığı için, sorulmayan bir soruya yakın duran başka bir koşuyu
              göstermek yerine hiçbir şey göstermiyoruz. Yukarıdaki hazır sorulardan birini
              seçebilirsiniz.
            </p>
            <p className="mt-3 font-mono text-xs text-faint">
              aranan: &ldquo;{phase.question}&rdquo;
            </p>
          </div>
        ) : null}

        {phase.kind === "result" ? <AgentResult view={phase.view} /> : null}
      </div>
    </div>
  );
}
