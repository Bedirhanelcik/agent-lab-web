"use client";

import { useState } from "react";

import { AgentResult, AgentRunPanels } from "@/components/agent-result";
import { UploadPanel } from "@/components/upload-panel";
import { DEMO_DATA_PROBLEMS, DEMO_QUESTIONS, resolveDemoRun } from "@/lib/demo-runs";
import { normalizeAgentRun, type AgentRun, type DemoRunView } from "@/lib/agent-contract";
import type { AgentApiErrorKind } from "@/lib/agent-api";
import type { AppMode } from "@/lib/config";

type Phase =
  | { kind: "idle" }
  | { kind: "running"; question: string }
  | { kind: "demo-result"; view: DemoRunView }
  | { kind: "live-result"; question: string; run: AgentRun }
  | { kind: "not-found"; question: string }
  | { kind: "error"; code: AgentApiErrorKind | "bad_response" };

/**
 * Hata türlerinin insan-okunur karşılıkları. Kullanıcıya önce ne olduğu
 * anlatılır; makine kodu yalnızca ikincil, küçük bir teknik etiket olarak
 * durur.
 */
const ERROR_COPY: Record<AgentApiErrorKind | "bad_response", { title: string; body: string }> = {
  not_configured: {
    title: "Agent servisi yapılandırılmamış",
    body: "Canlı mod açık görünüyor ama agent servisinin adresi tanımlı değil. Sunucu tarafındaki yapılandırma tamamlanana kadar canlı sorgu yapılamaz.",
  },
  invalid_request: {
    title: "Soru gönderilemedi",
    body: "İstek agent servisi tarafından kabul edilmedi. Sorunun boş olmadığından emin olun ve tekrar deneyin.",
  },
  quota_exhausted: {
    title: "Ücretsiz kota doldu",
    body: "Model sağlayıcısının ücretsiz kullanım hakkı şu an tükenmiş durumda. Kota yenilendiğinde canlı sorgu yeniden çalışır; bu arada demo modundaki hazır koşulara bakabilirsiniz.",
  },
  generation_error: {
    title: "Cevap üretilemedi",
    body: "Retrieval tamamlandı ama cevap üretme adımı başarısız oldu. Bu genellikle geçici bir sorundur; tekrar denemek mantıklı.",
  },
  agent_unavailable: {
    title: "Agent şu an kullanılamıyor",
    body: "Agent servisi ayakta ama sorgu alabilecek durumda değil. Sunucu yapılandırması tamamlandığında bu uç nokta yanıt verecek.",
  },
  upstream_error: {
    title: "Agent servisi hata döndürdü",
    body: "İstek agent servisine ulaştı ama beklenmeyen bir hatayla sonuçlandı. Tekrar denemek yardımcı olmayabilir.",
  },
  bad_response: {
    title: "Yanıt beklenen biçimde değil",
    body: "Agent servisi bir yanıt döndürdü ama sözleşmeye uymuyor. Bozuk bir yanıtı cevap gibi göstermek yanıltıcı olurdu, bu yüzden hiçbir şey render edilmiyor.",
  },
  timeout: {
    title: "Süre aşıldı",
    body: "Agent beklenen süre içinde yanıt vermedi. İstek iptal edildi; sonsuz bekleme yapılmıyor.",
  },
  network: {
    title: "Agent servisine ulaşılamadı",
    body: "Bağlantı kurulamadı. Agent servisinin çalıştığından emin olun ve tekrar deneyin.",
  },
};

/**
 * Playground.
 *
 * Demo modunda hiçbir ağ isteği yapılmaz: sorular yerel olarak hazırlanmış
 * koşularla eşleştirilir. Canlı modda istek Next.js route handler'ına gider;
 * backend adresi ve sırlar tarayıcıya hiç ulaşmaz. İki yol da aynı
 * `AgentRun` modeline normalize edildiği için render bileşenleri paylaşılır.
 */
export function Playground({
  mode,
  uploadEnabled,
}: {
  mode: AppMode;
  uploadEnabled: boolean;
}) {
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
        body: JSON.stringify({ question: value }),
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
            placeholder={
              isLive
                ? "Bir soru yazın ve Enter'a basın"
                : "Bir soru yazın veya aşağıdaki hazır örneklerden birini seçin"
            }
            autoComplete="off"
            disabled={busy}
            className="min-w-0 flex-1 border border-line bg-surface px-4 py-3 text-fg placeholder:text-faint focus:border-line-bright focus:outline-none disabled:text-muted"
          />
          <button
            type="submit"
            disabled={busy || question.trim().length === 0}
            className="mono-label shrink-0 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
          >
            {busy ? (isLive ? "Running…" : "Resolving…") : "Submit"}
          </button>
        </div>

        <div>
          <p className="eyebrow mb-3">{isLive ? "Example questions" : "Prepared questions"}</p>
          <ul className="flex flex-wrap gap-2">
            {DEMO_QUESTIONS.map((example) => (
              <li key={example.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setQuestion(example.question);
                    run(example.question);
                  }}
                  className="flex max-w-full items-center gap-2 border border-line px-3 py-2 text-left text-xs text-muted transition-colors hover:border-line-bright hover:text-fg disabled:cursor-not-allowed disabled:text-faint"
                >
                  <span className="truncate">{example.question}</span>
                  {/* Synthetic etiketi yalnızca hazır koşuları işaretler;
                      canlı modda hazır koşu diye bir şey yok. */}
                  {!isLive && example.synthetic ? (
                    <span className="mono-label shrink-0 text-accent">synthetic</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>

      <UploadPanel mode={mode} uploadEnabled={uploadEnabled} />

      <div aria-live="polite" aria-busy={busy}>
        {phase.kind === "idle" ? (
          <div className="border border-line border-dashed p-6">
            <p className="text-sm leading-relaxed text-muted">
              {isLive
                ? "Canlı mod açık: sorunuz agent servisine gönderilir, agent arama yapıp yapmayacağına kendi karar verir ve cevabı yalnızca bulduğu pasajlara dayandırır."
                : "Demo modunda yalnızca yukarıdaki hazır sorular yanıtlanır. Bir soru seçin; agent'ın o soru için verdiği karar, yaptığı aramalar, getirdiği pasajlar ve kaynak gösteren cevabı aşağıda görünecek."}
            </p>
          </div>
        ) : null}

        {phase.kind === "running" ? (
          <div className="border border-line bg-surface p-6">
            <p className="mono-label text-faint">
              <span className="pulse-dot mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              {isLive ? "Agent çalışıyor" : "Hazırlanmış koşu çözümleniyor"}
            </p>
            <p className="mt-2 truncate text-sm text-muted">{phase.question}</p>
            {isLive ? (
              <p className="mt-3 text-xs leading-relaxed text-faint">
                Karar, arama ve cevap üretme adımları sırayla çalışıyor; bu birkaç saniye
                sürebilir.
              </p>
            ) : null}
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

        {phase.kind === "error" ? (
          <div className="border border-line bg-surface p-6">
            <h2 className="mono-label text-fg">{ERROR_COPY[phase.code].title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {ERROR_COPY[phase.code].body}
            </p>
            <p className="mt-3 font-mono text-xs text-faint">{phase.code}</p>
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
