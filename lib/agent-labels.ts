/** Arayüzde gösterilen insan-okunur etiketler. Sözleşme değerleri değişmez. */

import type { AgentAction, AgentStatus } from "@/lib/agent-contract";

export const STATUS_LABELS: Record<AgentStatus, string> = {
  answered: "Answered",
  answered_without_retrieval: "Answered without retrieval",
  insufficient_context: "Insufficient context",
  tool_failure: "Tool failure",
};

export const STATUS_EXPLANATIONS: Record<AgentStatus, string> = {
  answered:
    "Agent arama yaptı, dönen pasajları yeterli buldu ve cevabı yalnızca o pasajlara dayandırdı.",
  answered_without_retrieval:
    "Agent bu soru için arşive bakmanın gerekmediğine karar verdi; retrieval hiç çağrılmadı.",
  insufficient_context:
    "Arama yapıldı ama dönen pasajlar soruyu cevaplamaya yetmedi. Agent cevap üretmeyi reddetti.",
  tool_failure:
    "Retrieval katmanında hata oluştu. Agent bu durumda tekrar denemez ve cevap üretmez.",
};

export const ACTION_LABELS: Record<AgentAction, string> = {
  assessed_question: "Assessed question",
  searched_rag: "Searched RAG",
  refined_query: "Refined query",
  answered_from_context: "Answered from context",
  answered_without_retrieval: "Answered without retrieval",
  declared_insufficient_context: "Declared insufficient context",
  tool_failed: "Tool failed",
};
