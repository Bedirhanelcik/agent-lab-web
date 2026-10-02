const STATES = [
  {
    id: "assess",
    label: "Assess",
    summary: "Arama gerekli mi?",
    detail:
      "Soru analiz edilir. Doküman bilgisi gerekmiyorsa retrieval hiç çağrılmaz ve akış doğrudan cevaba gider.",
    exits: ["search", "answer"],
  },
  {
    id: "search",
    label: "Search",
    summary: "rag_search çağrılır",
    detail:
      "Agent kendi arama sorgusunu üretir; kullanıcının cümlesini olduğu gibi aktarmak zorunda değildir.",
    exits: ["inspect"],
  },
  {
    id: "inspect",
    label: "Inspect",
    summary: "Pasajlar yeterli mi?",
    detail:
      "Dönen pasajlar sorunun cevabını taşıyor mu diye denetlenir. Bu adım olmadan 'yetersiz bağlam' kavramı da olmazdı.",
    exits: ["refine", "answer"],
  },
  {
    id: "refine",
    label: "Refine",
    summary: "Sorgu yeniden formüllenir",
    detail:
      "Yetersiz sonuçta sorgu değiştirilip tekrar aranır. Deneme sayısı sınırlıdır ve aynı sorgu iki kez çalıştırılmaz.",
    exits: ["search"],
  },
  {
    id: "answer",
    label: "Answer",
    summary: "Yalnızca yeterli bağlamda",
    detail:
      "Cevap getirilen pasajlara dayanır ve kaynak gösterir. Bağlam yetersizse sentez hiç çağrılmaz; durum açıkça bildirilir.",
    exits: [],
  },
] as const;

export function SystemFlow() {
  return (
    <ol className="grid gap-px border border-line bg-line">
      {STATES.map((state, i) => (
        <li key={state.id} className="card border-0 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex shrink-0 items-center gap-4 sm:w-56">
              <span className="eyebrow tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="mono-label text-fg">{state.label}</h3>
                <p className="mt-1 text-xs text-faint">{state.summary}</p>
              </div>
            </div>

            <p className="flex-1 text-sm leading-relaxed text-muted">{state.detail}</p>

            <div className="shrink-0 sm:w-40 sm:text-right">
              {state.exits.length > 0 ? (
                <p className="font-mono text-xs text-faint">
                  <span className="sr-only">Sonraki olası durumlar: </span>
                  <span aria-hidden="true">→ </span>
                  {state.exits.join(" | ")}
                </p>
              ) : (
                <p className="font-mono text-xs text-accent">terminal</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
