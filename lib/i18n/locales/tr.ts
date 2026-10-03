/**
 * Türkçe — referans sözlük.
 *
 * Diğer altı dil bunun çevirisidir; bir anahtar eklendiğinde önce buraya
 * yazılır. Teknik terimler (RAG, BM25, RRF, Chunk, Embedding, Agent, API,
 * Playground, Evaluation, Gemini, Chroma, Vector Search, Hybrid Retrieval)
 * olduğu gibi kalır.
 */

import type { Messages } from "../types.ts";

export const tr = {
  meta: {
    siteTitle: "Agent Lab — aramanın ne zaman gerektiğini bilen bir agent",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "Hybrid Retrieval, uyarlanabilir muhakeme ve kaynak gösteren cevaplar üzerine kurulu bağımsız bir agentic AI mühendislik denemesi.",
    ogDescription:
      "Hybrid Retrieval. Uyarlanabilir muhakeme. Kaynağa dayanan cevaplar. Bağımsız bir agentic AI mühendislik denemesi.",
    systemTitle: "Sistem",
    systemDescription:
      "Hybrid Retrieval, agent karar döngüsü ve değerlendirme katmanının teknik dökümü.",
    playgroundTitle: "Playground",
    playgroundDescription:
      "Agent koşuları: karar izi, yapılan aramalar, getirilen pasajlar ve kaynak gösteren cevap.",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "Agent davranışının nasıl ölçüldüğü: vakalar, yapısal assertion'lar, sonuçlar ve sınırlar.",
    aboutTitle: "Hakkında",
    aboutDescription:
      "Retrieval, araç tabanlı karar verme ve değerlendirmeyi tek mimaride birleştiren bağımsız bir AI mühendislik projesi.",
    apiSetupTitle: "API Kurulumu",
    apiSetupDescription:
      "Sistemi kendi Gemini API anahtarınızla yerel olarak veya Render üzerinde çalıştırma rehberi.",
  },

  nav: {
    skipToContent: "İçeriğe geç",
    ariaLabel: "Ana gezinme",
    home: "Ana sayfa",
    system: "Nasıl çalışır",
    playground: "Playground",
    evaluation: "Evaluation",
    apiSetup: "API Kurulumu",
    about: "Hakkında",
  },

  language: {
    label: "Dil",
    current: "Seçili dil",
  },

  mode: {
    label: "Durum",
    demo: "Demo",
    live: "Canlı",
    demoHint: "Hazırlanmış örnek koşular gösterilir; canlı model çağrısı yapılmaz.",
    liveHint: "Canlı agent çağrıları etkin.",
  },

  home: {
    heroEyebrow: "Agentic retrieval sistemi",
    heroTitleLine1: "Aramanın ne zaman gerektiğini",
    heroTitleLine2: "bilen bir agent.",
    heroSubtitle: "Hybrid Retrieval. Uyarlanabilir muhakeme. Kaynağa dayanan cevaplar.",
    ctaPlayground: "Dokümanlarınızı yükleyin",
    ctaSystem: "Sistemi incele",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search ve BM25 ayrı ayrı çalışır, sonuçlar Reciprocal Rank Fusion ile birleşir. Chunk kimlikleri deterministiktir.",
      },
      {
        title: "Agent",
        body: "Arama yapıp yapmayacağına kendi karar verir, dönen pasajları denetler, gerekirse sorguyu yeniden formülleyip tekrar arar.",
      },
      {
        title: "Evaluation",
        body: "Davranış ölçülür: hangi status döndü, RAG gerçekten çağrıldı mı, kaynak doğru mu, korpus dışı soruda uydurma var mı.",
      },
    ],
    whyEyebrow: "Neden var",
    whyTitle: "Sadece bir RAG demosu değil",
    whyDescription:
      "Kendi dokümanlarınızı yükleyin, sistem onları aranabilir hale getirsin ve onlara soru sorun. Çoğu örnek soruyu alıp Vector Search'e verir ve sonucu bir dil modeline iletir; buradaki fark karar katmanı: sistem aramanın gerekip gerekmediğine, dönen sonucun yeterli olup olmadığına ve tekrar denemeye değip değmeyeceğine kendi karar veriyor. Yetersiz bağlamda cevap üretmeyi reddediyor.",
    facts: [
      { value: "475", label: "yerel test" },
      { value: "6", label: "değerlendirme vakası" },
      { value: "2", label: "retrieval yöntemi" },
      { value: "0", label: "framework katmanı" },
    ],
  },

  architecture: {
    eyebrow: "Mimari",
    title: "Bir sorunun sistemden geçtiği yol",
    description:
      "Agent önce arama gerekip gerekmediğine karar verir. Arama gerekiyorsa iki farklı retrieval yöntemi paralel çalışır, sonuçlar rank bazlı birleştirilir ve yalnızca yeterli bağlam bulunduğunda cevap üretilir.",
    nodes: {
      user: "soru",
      agent: "değerlendir · denetle · yenile",
      ragSearch: "rag_search tool",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · kaynak · rank",
      synthesis: "kaynağa dayalı sentez",
      answer: "atıflı cevap",
      answerLabel: "Kaynaklı cevap",
    },
    points: [
      {
        title: "Karar katmanı",
        body: "Agent, soruyu yanıtlamak için arşive bakmanın gerekip gerekmediğine karar verir. Selamlama gibi girdilerde retrieval hiç çağrılmaz; tool çağrısı sayısı sıfır kalır.",
      },
      {
        title: "Paralel retrieval",
        body: "Vector Search anlamsal yakınlığı, BM25 tam kelime eşleşmesini yakalar. İkisi birbirinin zayıf noktasını kapatır; Türkçe çekim ekleri bu yüzden önemlidir.",
      },
      {
        title: "Rank bazlı birleştirme",
        body: "Cosine benzerliği ile BM25 skoru aynı ölçekte değildir. RRF skorları tamamen yok sayıp yalnızca sıralamayı kullanır, böylece kırılgan bir normalizasyona gerek kalmaz.",
      },
      {
        title: "Kaynağa dayanan cevap",
        body: "Sentez yalnızca getirilen pasajlarla yapılır ve her iddia bir chunk kimliğine bağlanır. Yeterli bağlam yoksa agent cevap üretmeyi reddeder.",
      },
    ],
  },

  system: {
    heroEyebrow: "Teknik döküm",
    heroTitle: "Sistem",
    heroSubtitle:
      "Üç katman: bilgiyi bulan retrieval, ne zaman ve nasıl arayacağına karar veren agent, ve davranışın ölçüldüğü değerlendirme.",
    retrievalEyebrow: "Katman 01 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "Vector Search anlamsal yakınlığı yakalar ama nadir terimleri ve özel adları bulanıklaştırır; BM25 tam eşleşmede güçlüdür ama çekim eklerini kaçırır. İkisi ayrı çalışır ve sıralamaları birleştirilir.",
    retrievalParts: [
      {
        title: "Chroma",
        body: "Kalıcı vektör deposu. Chunk metni ve metadata diskte tutulur.",
      },
      {
        title: "BM25",
        body: "Tam kelime eşleşmesi. Bellekte yaşar, açılışta Chroma'dan yeniden kurulur.",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "Skor ölçeklerini yok sayar, yalnızca sıralamayı kullanır (k = 60).",
      },
      {
        title: "gemini-embedding-001",
        body: "Embedding Gemini API üzerinden üretilir (768 boyut); sorgu ve pasaj için ayrı task type kullanılır. Yerel ML modeli yüklenmediği için servis 512 MB bellek sınırının altında kalır.",
      },
      {
        title: "Deterministik chunk kimlikleri",
        body: "source_file::chunk_index. Citation ve yeniden getirme anahtarı olarak kullanılır.",
      },
    ],
    agentEyebrow: "Katman 02 — Agent",
    agentTitle: "Karar döngüsü",
    agentDescription:
      "Sabit bir boru hattı değil, sınırları açıkça tanımlı küçük bir durum makinesi. Her adımda bir karar var ve bu kararlar akışı değiştirir.",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "Arama gerekli mi?",
          detail:
            "Soru analiz edilir. Doküman bilgisi gerekmiyorsa retrieval hiç çağrılmaz ve akış doğrudan cevaba gider.",
        },
        {
          label: "Search",
          summary: "rag_search çağrılır",
          detail:
            "Agent kendi arama sorgusunu üretir; kullanıcının cümlesini olduğu gibi aktarmak zorunda değildir. Sorgu, korpusun dilinde yazılır.",
        },
        {
          label: "Inspect",
          summary: "Pasajlar yeterli mi?",
          detail:
            "Dönen pasajlar sorunun cevabını taşıyor mu diye denetlenir. Bu adım olmadan 'yetersiz bağlam' kavramı da olmazdı.",
        },
        {
          label: "Refine",
          summary: "Sorgu yeniden formüllenir",
          detail:
            "Yetersiz sonuçta sorgu değiştirilip tekrar aranır. Deneme sayısı sınırlıdır ve aynı sorgu iki kez çalıştırılmaz.",
        },
        {
          label: "Answer",
          summary: "Yalnızca yeterli bağlamda",
          detail:
            "Cevap getirilen pasajlara dayanır ve kaynak gösterir. Bağlam yetersizse sentez hiç çağrılmaz; durum açıkça bildirilir.",
        },
      ],
      nextStates: "Sonraki olası durumlar:",
      terminal: "terminal",
    },
    evalEyebrow: "Katman 03 — Evaluation",
    evalTitle: "Ölçülmüş davranış",
    evalDescription:
      "Amaç 'agent'ı yaptım' değil, 'davranışını ölçtüm' diyebilmek. Değerlendirme cevabın metnine değil, agent'ın gözlemlenebilir davranışına bakar.",
    evalParts: [
      {
        value: "475",
        label: "yerel test",
        detail: "Tamamı fake bileşenlerle; sıfır API çağrısı.",
      },
      {
        value: "6",
        label: "değerlendirme vakası",
        detail: "Davranış ölçer, tek string eşleşmesi değil.",
      },
      {
        value: "25",
        label: "yapısal assertion",
        detail: "Status, kullanılan tool, kaynak, citation biçimi, uydurma kontrolü.",
      },
      {
        value: "1",
        label: "LLM judge çağrısı",
        detail: "Yalnızca anlamsal değerlendirme gereken vakada.",
      },
    ],
    evalNote:
      "Değerlendirme, ayrı bir proje olan bir prompt değerlendirme CLI'ı üzerine kurulu; assertion mantığı orada tanımlı ve burada yeniden yazılmıyor.",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "Agent'ı iş başında gör.",
    heroDemoSubtitle:
      "Bu sayfa demo modunda çalışıyor: hiçbir model çağrısı yapılmaz, gösterilen her koşu önceden hazırlanmıştır.",
    heroLiveSubtitle:
      "Canlı mod etkin: sorunuz agent servisine gönderilir ve cevap seçtiğiniz dilde üretilir.",
    questionLabel: "Soru",
    placeholderDemo: "Bir soru yazın veya aşağıdaki hazır örneklerden birini seçin",
    placeholderLive: "Bir soru yazın ve Enter'a basın",
    submit: "Gönder",
    submittingDemo: "Çözümleniyor…",
    submittingLive: "Çalışıyor…",
    examplesDemo: "Örnek korpusu deneyin",
    examplesLive: "Örnek sorular",
    syntheticTag: "synthetic",
    idleDemo:
      "Demo modunda yalnızca yukarıdaki hazır sorular yanıtlanır. Bir soru seçin; agent'ın o soru için verdiği karar, yaptığı aramalar, getirdiği pasajlar ve kaynak gösteren cevabı aşağıda görünecek.",
    idleLive:
      "Canlı mod açık: sorunuz agent servisine gönderilir, agent arama yapıp yapmayacağına kendi karar verir ve cevabı yalnızca bulduğu pasajlara dayandırır.",
    runningDemo: "Hazırlanmış koşu çözümleniyor",
    runningLive: "Agent çalışıyor",
    runningHint:
      "Karar, arama ve cevap üretme adımları sırayla çalışıyor; bu birkaç saniye sürebilir.",
    notFoundTitle: "Hazırlanmış örnek bulunamadı",
    notFoundBody:
      "Bu demo sorusu için hazırlanmış bir örnek bulunamadı. Demo modu canlı model çağrısı yapmadığı için, sorulmayan bir soruya yakın duran başka bir koşuyu göstermek yerine hiçbir şey göstermiyoruz. Yukarıdaki hazır sorulardan birini seçebilirsiniz.",
    notFoundQuery: "aranan:",
    demoDataTitle: "Demo verisi okunamadı",
    demoDataBody:
      "Hazırlanmış koşular beklenen şekli taşımıyor, bu yüzden hiçbir örnek gösterilmiyor. Bozuk veriyi yine de render etmek yanıltıcı olurdu.",
    originSynthetic: "Synthetic — hazırlanmış demo koşusu",
    originPrepared: "Hazırlanmış demo koşusu",
    originSyntheticBody:
      "Bu koşu elle kurgulanmıştır ve hiç çalıştırılmamıştır. Yalnızca başarılı sorgu yenileme akışını göstermek için vardır; gerçek bir model çıktısı değildir.",
    originPreparedBody:
      "Bu çıktı daha önce gerçekten çalıştırılmış bir koşudan türetilmiştir ve burada canlı olarak üretilmemiştir.",
    originLanguageNote:
      "Hazırlanmış koşular Türkçe korpusla üretildi: arayüz dili değişse de kayıtlı cevap metni orijinal dilinde kalır. Seçtiğiniz dilde cevap almak için canlı mod gerekir.",
    reconstructedFields: "yeniden kurulan alanlar:",
    reconstructedNone: "tüm alanlar gözlemlendi (yeniden kurulan alan yok)",
  },

  result: {
    question: "Soru",
    status: "Status",
    answer: "Cevap",
    trace: "Agent trace",
    traceSteps: "adım",
    toolCalls: "Tool çağrıları",
    sources: "Kaynaklar",
    noSources:
      "Bu koşuda kaynak gösterilmedi. Agent ya arama yapmadı ya da dönen pasajları yeterli bulmadığı için cevabı hiçbir pasaja dayandırmadı.",
    noSteps: "Bu koşu için kayıtlı adım yok.",
    noToolCalls: "tool_calls:",
    noToolCallsBody:
      "Agent bu soru için retrieval'a hiç başvurmadı. Sabit bir boru hattı olsaydı arama her durumda çalışacaktı; burada aramamak da bir karardır.",
    toolCallCount: "tool_calls:",
    attemptOf: "arama",
    fieldRank: "rank",
    fieldScore: "score",
    fieldPage: "sayfa",
    fieldQuery: "sorgu",
    fieldTopK: "top_k",
    fieldPassagesFound: "bulunan pasaj",
    fieldSourceFile: "kaynak dosya",
    statusLabels: {
      answered: "Cevaplandı",
      answered_without_retrieval: "Arama yapılmadan cevaplandı",
      insufficient_context: "Yetersiz bağlam",
      tool_failure: "Tool hatası",
    },
    statusExplanations: {
      answered:
        "Agent arama yaptı, dönen pasajları yeterli buldu ve cevabı yalnızca o pasajlara dayandırdı.",
      answered_without_retrieval:
        "Agent bu soru için arşive bakmanın gerekmediğine karar verdi; retrieval hiç çağrılmadı.",
      insufficient_context:
        "Arama yapıldı ama dönen pasajlar soruyu cevaplamaya yetmedi. Agent cevap üretmeyi reddetti.",
      tool_failure:
        "Retrieval katmanında hata oluştu. Agent bu durumda tekrar denemez ve cevap üretmez.",
    },
    actionLabels: {
      assessed_question: "Soru değerlendirildi",
      searched_rag: "RAG'da arandı",
      refined_query: "Sorgu yenilendi",
      answered_from_context: "Bağlamdan cevaplandı",
      answered_without_retrieval: "Arama yapılmadan cevaplandı",
      declared_insufficient_context: "Yetersiz bağlam bildirildi",
      tool_failed: "Tool başarısız",
    },
  },

  errors: {
    title: {
      not_configured: "Agent servisi yapılandırılmamış",
      invalid_request: "Soru gönderilemedi",
      quota_exhausted: "Ücretsiz kota doldu",
      generation_error: "Cevap üretilemedi",
      corpus_empty: "Henüz doküman yüklenmedi",
      agent_unavailable: "Agent şu an kullanılamıyor",
      upstream_error: "Agent servisi hata döndürdü",
      bad_response: "Yanıt beklenen biçimde değil",
      timeout: "Süre aşıldı",
      network: "Agent servisine ulaşılamadı",
    },
    body: {
      not_configured:
        "Canlı mod açık görünüyor ama agent servisinin adresi tanımlı değil. Sunucu tarafındaki yapılandırma tamamlanana kadar canlı sorgu yapılamaz.",
      invalid_request:
        "İstek agent servisi tarafından kabul edilmedi. Sorunun boş olmadığından emin olun ve tekrar deneyin.",
      quota_exhausted:
        "Model sağlayıcısının ücretsiz kullanım hakkı şu an tükenmiş durumda. Kota yenilendiğinde canlı sorgu yeniden çalışır; bu arada demo modundaki hazır koşulara bakabilirsiniz.",
      generation_error:
        "Retrieval tamamlandı ama cevap üretme adımı başarısız oldu. Bu genellikle geçici bir sorundur; tekrar denemek mantıklı.",
      corpus_empty:
        "Agent arama yapabileceği bir doküman bulamadı: arşiv şu an boş. Bir doküman eklendikten sonra sorular yanıtlanabilir.",
      agent_unavailable:
        "Agent servisi ayakta ama sorgu alabilecek durumda değil. Sunucu yapılandırması tamamlandığında bu uç nokta yanıt verecek.",
      upstream_error:
        "İstek agent servisine ulaştı ama beklenmeyen bir hatayla sonuçlandı. Tekrar denemek yardımcı olmayabilir.",
      bad_response:
        "Agent servisi bir yanıt döndürdü ama sözleşmeye uymuyor. Bozuk bir yanıtı cevap gibi göstermek yanıltıcı olurdu, bu yüzden hiçbir şey render edilmiyor.",
      timeout:
        "Agent beklenen süre içinde yanıt vermedi. İstek iptal edildi; sonsuz bekleme yapılmıyor.",
      network:
        "Bağlantı kurulamadı. Agent servisinin çalıştığından emin olun ve tekrar deneyin.",
    },
  },

  upload: {
    heading: "Doküman yükleme",
    availableBody:
      "PDF, TXT veya MD yükleyin. Doküman mevcut ingestion pipeline'ından geçer: sayfalara ayrılır, chunk'lanır, embedding üretilir ve hem vektör hem keyword index'ine yazılır. Sonrasında yukarıdaki soru alanından aranabilir.",
    disabledDemo:
      "Demo modunda doküman yükleme yapılmaz; gösterilen koşular hazırlanmış örneklerdir.",
    disabledEnv: "Doküman yükleme bu ortamda kapalı.",
    disabledReason:
      "Yükleme yalnızca yerel geliştirmede açılır. Sebebi mimari: korpus şu an tüm ziyaretçiler arasında paylaşımlı, yani bir ziyaretçinin yüklediği doküman diğerlerinin aramalarına da girer. Kullanıcı bazlı izolasyon eklenmeden yükleme internete açık bırakılmamalı.",
    fileInputLabel: "Yüklenecek dokümanlar",
    submit: "Yükle",
    submitting: "Ekleniyor…",
    runningTitle: "Ingestion çalışıyor",
    runningHint:
      "Chunk'lama ve embedding üretimi dosya boyutuna göre birkaç saniye sürebilir.",
    doneTitle: "Eklendi",
    doneBody:
      "Doküman artık aranabilir. Yukarıdan bir soru sorduğunuzda agent bu içeriği de arayabilir.",
    chunkUnit: "chunk",
    failedTitle: "Yükleme başarısız",
    errors: {
      not_configured: "Agent servisinin adresi tanımlı değil, bu yüzden doküman gönderilemedi.",
      upload_disabled: "Doküman yükleme bu ortamda kapalı.",
      no_files: "Önce bir dosya seçin.",
      unsupported_file_type: "Yalnızca PDF, TXT ve MD dosyaları kabul ediliyor.",
      file_too_large: "Dosya çok büyük. En fazla {max} MB.",
      invalid_request: "Dosya adı veya istek kabul edilmedi. Farklı bir dosya adıyla deneyin.",
      upstream_error: "Agent servisi yükleme sırasında hata döndürdü.",
      bad_response: "Yükleme yanıtı beklenen biçimde değil, bu yüzden sonuç gösterilmiyor.",
      timeout: "Yükleme beklenen süre içinde tamamlanmadı ve iptal edildi.",
      network: "Agent servisine ulaşılamadı. Servisin çalıştığından emin olun.",
    },
  },

  evaluation: {
    heroEyebrow: "Ölçülmüş davranış",
    heroTitle: "Evaluation",
    heroSubtitle:
      "Amaç 'agent'ı yaptım' değil, 'davranışını ölçtüm' diyebilmek. Değerlendirme cevabın güzelliğine değil, agent'ın gözlemlenebilir davranışına bakar: hangi status döndü, retrieval gerçekten çağrıldı mı, doğru kaynak gösterildi mi, korpus dışı soruda uydurma yapıldı mı.",
    methodologyEyebrow: "Yöntem",
    methodologyTitle: "Suite yapısı",
    methodologyDescription:
      "Her vaka tek bir string eşleşmesi yerine agent'ın gözlemlenebilir davranışını denetler. Kontroller, ayrı bir projede tanımlı assertion checker'ları tarafından yürütülür; burada yeniden yazılmaz.",
    suiteShape: [
      {
        value: "6",
        label: "vaka",
        detail:
          "Olgusal RAG sorusu, korpus dışı soru, doğrudan cevap, citation doğruluğu, eksik belirtilmiş sorgu, anlamsal kalite.",
      },
      {
        value: "25",
        label: "assertion",
        detail:
          "Status, çağrılan tool, kaynak kimliği, aksiyon izi, citation biçimi ve uydurma kontrolü.",
      },
      {
        value: "1",
        label: "LLM judge çağrısı",
        detail:
          "Yalnızca anlamsal değerlendirme gereken tek vakada. Diğer her kontrol deterministik ve ücretsiz.",
      },
    ],
    suiteNote:
      "Bu sayılar suite tanımından gelir (yapılandırma), bir koşunun sonucundan değil.",
    resultsEyebrow: "Sonuçlar",
    resultsTitle: "Son koşu",
    resultsDescription:
      "Sonuçlar yalnızca gerçek bir değerlendirme koşusunun ürettiği artefakttan okunur. Artefakt yoksa burada hiçbir sayı gösterilmez.",
    missingTitle: "Gösterilecek değerlendirme artefaktı yok",
    missingBody:
      "Bu sitede gösterilecek bir değerlendirme artefaktı bulunmuyor. Sonuç uydurmak yerine yokluğu bildiriyoruz: aşağıdaki dosya yerine konduğunda sayfa gerçek sayıları okuyup gösterecek.",
    missingExpectedFile: "beklenen dosya:",
    missingHowTo:
      "Artefakt, agent servisinin bulunduğu projede değerlendirme koşusu çalıştırılarak üretilir. O koşu Gemini kotası harcadığı için burada tetiklenmez; bu sayfa yalnızca hazır artefaktı tüketir.",
    invalidTitle: "Artefakt geçersiz",
    invalidBody:
      "Dosya bulundu ama beklenen değerlendirme raporu şeklini taşımıyor. Bozuk veya yanlış bir dosyayı sonuç gibi göstermek yanıltıcı olurdu, bu yüzden hiçbir sayı render edilmiyor.",
    limitationsTitle: "Sınırlar",
    limitations: [
      "Değerlendirme küçük bir korpus üzerinde çalışır; bu ölçekte retrieval sıralaması zorlanmaz ve sonuçlar bir üretim sistemi için temsil edici sayılmamalıdır.",
      "Canlı koşu ücretsiz kotayla sınırlıdır: dakikada az sayıda istek hakkı olduğundan, vakalar arası beklemeye rağmen bir koşu kota tükenmesi yüzünden yarıda kalabilir. Böyle bir durumda ilgili vakalar 'fail' olarak değil, kota hatası olarak raporlanır.",
      "Bu sayfadaki sonuçlar, playground'daki hazırlanmış demo koşularından tamamen ayrıdır. Demo verisi hiçbir koşulda değerlendirme sonucu olarak sayılmaz; iki veri kaynağı ayrı dosyalarda durur ve ayrı şemalarla doğrulanır.",
    ],
    report: {
      cases: "vaka",
      passed: "geçen",
      failed: "başarısız",
      assertions: "assertion",
      geminiCalls: "Gemini çağrısı",
      callsNote: "{agent} agent + {judge} judge",
      suite: "suite",
      model: "model",
      generatedAt: "üretim zamanı",
      avgLatency: "ortalama gecikme",
      casesHeading: "Vakalar",
      pass: "geçti",
      fail: "başarısız",
      status: "status",
      agentCalls: "agent çağrısı",
      judgeCalls: "judge çağrısı",
      latency: "gecikme",
      error: "hata",
      score: "skor",
      assertionPassed: "geçti",
      assertionFailed: "başarısız",
    },
  },

  about: {
    heroEyebrow: "Proje",
    heroTitle: "Agentic AI üzerine bir mühendislik denemesi.",
    paragraphs: [
      "Bu proje, bir yapay zekâ sisteminin düz metin üretmenin ötesine nasıl geçebileceğini araştırıyor: retrieval, araç tabanlı karar verme ve ölçülebilir değerlendirme tek bir mimaride birleştiriliyor.",
      "Sistem genel amaçlı bir sohbet arayüzü değil. Kullanıcı kendi dokümanlarını getiriyor, bu dokümanlar aranabilir bir bilgi tabanına dönüştürülüyor; agent retrieval'ın gerekip gerekmediğine kendi karar veriyor, hibrit aramayı bir tool olarak kullanıyor ve cevabı yalnızca bulduğu kanıta dayandırıyor.",
      "Üç parça bağımsız çalışır ve bağımsız test edilir: Hybrid Retrieval katmanı, karar döngüsüne sahip agent ve agent davranışını öznel izlenimlerle değil ölçülebilir test vakalarıyla değerlendiren sistem. Bu arayüz üçünü tek bir etkileşimli uygulamada birleştiriyor.",
    ],
    stackHeading: "Teknoloji",
    stackGroups: [
      { group: "Arayüz", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Servis", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "Muhakeme", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "Bağlantılar",
  },

  theme: {
    label: "Tema",
    toLight: "Aydınlık temaya geç",
    toDark: "Karanlık temaya geç",
  },

  documents: {
    eyebrow: "Kendi dokümanlarınız",
    heading: "Dokümanlarınızı yükleyin, onlara soru sorun",
    intro:
      "Yüklediğiniz dosya metnine ayrıştırılır, chunk'lara bölünür, Gemini ile embedding'e çevrilir ve hem vektör hem keyword index'ine yazılır. Bu işlem bittiği anda agent artık sizin dokümanlarınızda arama yapar.",
    dropTitle: "Dosyaları buraya sürükleyin",
    dropHint: "veya bilgisayarınızdan seçin",
    browse: "Dosya seç",
    accepted: "PDF, TXT, MD",
    maxSize: "dosya başına en fazla {max} MB",
    selectedTitle: "Seçilen dosyalar",
    clearSelection: "Seçimi temizle",
    upload: "Yükle ve indeksle",
    uploading: "Yükleniyor…",
    indexing: "İndeksleniyor",
    indexingHint:
      "Metin çıkarma, chunk'lama ve embedding üretimi sırayla çalışıyor; dosya boyutuna göre birkaç saniye sürebilir.",
    successTitle: "Korpusa eklendi",
    successBody: "Dokümanlarınız artık retrieval korpusunun parçası.",
    corpusNote: "Korpusta toplam {chunks} chunk var.",
    askNow: "Hemen soru sorun",
    failedTitle: "Yükleme başarısız",
    listTitle: "Korpustaki dokümanlar",
    listEmptyTitle: "Korpus boş",
    listEmptyBody:
      "Henüz indekslenmiş doküman yok. Bir dosya yükleyin; agent sorularınızı yanıtlayabilmek için arayacağı metne o zaman sahip olur.",
    chunkCount: "{count} chunk",
    remove: "Kaldır",
    removing: "Kaldırılıyor…",
    removeFailed: "Doküman kaldırılamadı.",
    resetTitle: "Korpusu sıfırla",
    resetBody:
      "Bütün dokümanları hem vektör hem keyword index'inden siler. Bu işlem geri alınamaz.",
    reset: "Korpusu sıfırla",
    resetting: "Sıfırlanıyor…",
    resetDone: "Korpus boşaltıldı.",
    resetFailed: "Korpus sıfırlanamadı.",
    corpusSize: "korpus",
    keywordIndex: "keyword index",
    readOnlyTitle: "Korpus salt okunur",
    readOnlyBody:
      "Bu ortamda doküman ekleme ve silme kapalı. Korpus bütün ziyaretçiler arasında paylaşımlı olduğu için, kullanıcı bazlı izolasyon eklenmeden yazma işlemleri internete açılmıyor. Projeyi kendi makinenizde çalıştırdığınızda UPLOAD_ENABLED=true ile açabilirsiniz.",
    demoTitle: "Demo modunda yükleme yapılmaz",
    demoBody:
      "Bu sayfa şu an hazırlanmış örnek koşuları gösteriyor ve hiçbir model çağrısı yapmıyor. Kendi dokümanlarınızı yüklemek için sistemi canlı modda çalıştırın.",
    loading: "Korpus okunuyor…",
    loadFailed: "Korpus durumu okunamadı.",
  },

  howItWorks: {
    eyebrow: "Nasıl çalışır",
    heading: "Bir dokümandan kaynaklı cevaba",
    intro:
      "Sistem iki ayrı akıştan oluşuyor: dokümanlarınızı aranabilir hale getiren indeksleme ve bir soruyu kaynaklı cevaba çeviren sorgulama. Aşağıda ikisi de adım adım anlatılıyor.",
    stepLabel: "Adım",
    ingestTitle: "1. Doküman indeksleme",
    ingestIntro: "Bir dosya yüklediğinizde sırayla şunlar oluyor:",
    ingestSteps: [
      {
        title: "Yükleme",
        body: "PDF, TXT veya MD dosyanız tarayıcıdan sunucuya gider. Tarayıcı backend'in adresini veya anahtarlarını hiç görmez; istek Next.js sunucusu üzerinden geçer.",
      },
      {
        title: "Metin çıkarma",
        body: "Dosyanın içindeki düz metin okunur. PDF'lerde sayfa numarası korunur, böylece sonradan bir cevabın hangi sayfadan geldiği gösterilebilir.",
      },
      {
        title: "Chunking",
        body: "Metin, yaklaşık 1000 karakterlik parçalara bölünür ve parçalar 150 karakter örtüşür. Örtüşme, bir cümlenin tam sınırda ikiye bölünüp bağlamını kaybetmesini engeller.",
      },
      {
        title: "Gemini Embedding",
        body: "Her chunk, anlamını temsil eden bir sayı dizisine (embedding) çevrilir. Benzer anlamlı metinler bu uzayda birbirine yakın düşer.",
      },
      {
        title: "Chroma vektör index'i",
        body: "Embedding'ler chunk metni ve kaynak bilgisiyle birlikte kalıcı vektör veritabanına yazılır.",
      },
      {
        title: "BM25 keyword index'i",
        body: "Aynı chunk'lar bir de kelime bazlı index'e eklenir. Vektör araması anlamı, BM25 tam kelimeyi yakalar; ikisi birlikte çalışır.",
      },
    ],
    askTitle: "2. Soru cevaplama",
    askIntro: "Bir soru sorduğunuzda akış şöyle ilerler:",
    askSteps: [
      {
        title: "Soru",
        body: "Sorunuzu kendi dilinizde yazarsınız. Cevap da seçtiğiniz arayüz dilinde üretilir.",
      },
      {
        title: "Agent soruyu değerlendirir",
        body: "Agent önce şunu sorar: bu soruyu cevaplamak için dokümanlara bakmam gerekiyor mu? Selamlama ya da basit bir hesap için gerekmez.",
      },
      {
        title: "Retrieval kararı",
        body: "Gerekmiyorsa arama hiç çalışmaz ve tool çağrısı sayısı sıfır kalır. Bu, sabit bir boru hattından farkıdır: aramamak da bir karardır.",
      },
      {
        title: "Retrieval tool",
        body: "Gerekiyorsa agent kendi arama sorgusunu yazar — sizin cümlenizi olduğu gibi aktarmak zorunda değildir — ve rag_search tool'unu çağırır.",
      },
      {
        title: "Vector Search + BM25",
        body: "İki arama paralel çalışır: biri anlamsal yakınlığı, diğeri tam kelime eşleşmesini bulur.",
      },
      {
        title: "RRF birleştirme",
        body: "İki listenin sıralamaları tek bir sıralamada birleştirilir. Skorlar farklı ölçeklerde olduğu için yalnızca sıra kullanılır.",
      },
      {
        title: "Gemini ile kaynaklı cevap",
        body: "Cevap yalnızca getirilen pasajlara dayanarak üretilir ve her iddia bir chunk kimliğine bağlanır. Pasajlar yetersizse agent cevap üretmeyi reddeder.",
      },
    ],
    glossaryTitle: "Terimler",
    glossaryIntro:
      "Arayüzde geçen teknik terimlerin kısa karşılıkları. Terimlerin kendisi İngilizce kalıyor çünkü literatürde bu adlarla geçiyorlar.",
    glossary: [
      {
        term: "RAG",
        body: "Retrieval-Augmented Generation. Yapay zekâya yalnızca kendi iç bilgisinden cevap verdirmek yerine, sistem önce sizin dokümanlarınızdan ilgili bilgiyi bulur ve cevabı ona dayandırır.",
      },
      {
        term: "Vector Search",
        body: "Dokümanları birebir kelime eşleşmesiyle değil, anlam yakınlığıyla bulan arama.",
      },
      {
        term: "BM25",
        body: "Sorgudaki önemli kelimeleri birebir içeren dokümanları bulan, kelime tabanlı klasik arama yöntemi.",
      },
      {
        term: "RRF",
        body: "Reciprocal Rank Fusion. Farklı arama yöntemlerinden gelen sonuçları tek bir sıralamada birleştirir.",
      },
      {
        term: "Agent",
        body: "Cevap vermeden önce bir retrieval tool'una başvurup başvurmayacağına kendi karar verebilen yapay zekâ karar katmanı.",
      },
      {
        term: "Embedding",
        body: "Metnin sayısal temsili. Anlamca benzer içeriklerin birbirine yakın düşmesini ve bulunabilmesini sağlar.",
      },
      {
        term: "Chunk",
        body: "Dokümandan ayrılmış küçük bir bölüm. Arama bütün bir dosya yerine işe yarar parçalar üzerinde çalışsın diye oluşturulur.",
      },
      {
        term: "Citation",
        body: "Cevabın hangi dokümandan ve hangi chunk'tan desteklendiğini gösteren kaynak referansı.",
      },
    ],
  },

  apiSetup: {
    navBadge: "API",
    heroEyebrow: "Kurulum rehberi",
    heroTitle: "Sistemi kendi Gemini API anahtarınızla çalıştırın",
    heroIntro:
      "Bu proje hem cevap üretimi hem embedding için Gemini kullanıyor. Kendi anahtarınızla çalıştırdığınızda istekler sizin projenizin kotasına yazılır ve sistemi baştan sona kendi ortamınızda deneyebilirsiniz.",
    whyTitle: "Neden kendi anahtarım gerekiyor?",
    whyBody: [
      "Uygulama iki yerde model çağrısı yapıyor: dokümanlarınızı indekslerken embedding üretiyor, soru sorduğunuzda ise agent kararı ve cevap sentezi için Gemini'ye başvuruyor. İkisi de bir API anahtarı gerektiriyor.",
      "Anahtar yalnızca sunucu tarafında okunur ve tarayıcıya hiçbir zaman gönderilmez. Kendi anahtarınızı kullanmak, isteklerin sizin kotanıza ve sizin limitlerinize tabi olması demektir.",
    ],
    quotaTitle: "Kota ve ücretlendirme",
    quotaBody:
      "Gemini API'nin kullanılabilirliği, ücretsiz katman kotaları ve fiyatlandırması Google'ın güncel politikalarına, seçtiğiniz modele ve hesabınıza göre değişir. Dağıtım yapmadan önce Google'ın güncel bilgilerini kontrol edin.",
    quotaLink: "Gemini API fiyatlandırma ve kota bilgisi",
    quotaNote:
      "Bu proje sınırsız veya kalıcı olarak ücretsiz kullanım vaat etmez. Kotanız dolduğunda uygulama bunu açık bir hata mesajıyla bildirir ve sessizce yanlış cevap üretmez.",
    githubTitle: "Kaynak kod",
    githubBody:
      "Projeyi klonlayıp kendi makinenizde çalıştırabilir, kendi dokümanlarınızla deneyebilir ve istediğiniz gibi değiştirebilirsiniz.",
    githubButton: "GitHub'da görüntüle",
    githubMissing: "Depo adresi bu dağıtımda yapılandırılmamış.",
    localTitle: "Yerel kurulum",
    localIntro: "Dört adımda kendi makinenizde çalışır hale getirin.",
    localSteps: [
      {
        title: "Depoyu klonlayın",
        body: "Kaynak kodu indirin ve proje dizinine girin.",
      },
      {
        title: "API anahtarını alın",
        body: "Google AI Studio üzerinden bir Gemini API anahtarı oluşturun.",
      },
      {
        title: ".env dosyasını oluşturun",
        body: "Depodaki .env.example dosyasını .env olarak kopyalayın ve anahtarınızı yazın. Bu dosya .gitignore içinde olduğu için depoya gönderilmez.",
      },
      {
        title: "Servisi başlatın",
        body: "Bağımlılıkları kurun ve API'yi ayağa kaldırın; ardından arayüzü başlatın.",
      },
    ],
    envTitle: "Backend ortam değişkenleri",
    envIntro:
      "Zorunlu olan tek alan API anahtarıdır; diğerlerinin makul varsayılanları vardır. Aşağıdaki adlar projedeki .env.example dosyasındaki adlarla birebir aynıdır.",
    envRequired: "zorunlu",
    envOptional: "opsiyonel",
    envSecret: "gizli",
    envVars: [
      {
        name: "GEMINI_API_KEY",
        example: "YOUR_API_KEY",
        required: true,
        secret: true,
        description: "Gemini API anahtarınız. Hem cevap üretimi hem embedding bu anahtarla çalışır.",
      },
      {
        name: "GEMINI_AGENT_MODEL",
        example: "gemini-2.5-flash",
        required: false,
        secret: false,
        description: "Agent kararları ve cevap sentezi için kullanılan model.",
      },
      {
        name: "EMBEDDING_MODEL_NAME",
        example: "gemini-embedding-001",
        required: false,
        secret: false,
        description: "Embedding modeli. Yerel bir model adı değil, bir Gemini embedding modeli olmalıdır.",
      },
      {
        name: "EMBEDDING_DIMENSIONS",
        example: "768",
        required: false,
        secret: false,
        description: "Embedding boyutu. Mevcut index ile aynı olmalıdır.",
      },
      {
        name: "CHROMA_PERSIST_DIR",
        example: "data/chroma",
        required: false,
        secret: false,
        description: "Vektör veritabanının diskte durduğu dizin.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Arayüzden doküman yükleme ve silme. Korpus paylaşımlı olduğu için dağıtımda varsayılan olarak kapalıdır.",
      },
      {
        name: "INGEST_API_TOKEN",
        example: "rastgele-uzun-bir-değer",
        required: false,
        secret: true,
        description: "Operatör ingestion uç noktasını korur. Tanımlı değilse o uç nokta hizmet vermez. Tarayıcıya hiçbir zaman gönderilmez.",
      },
      {
        name: "ALLOWED_ORIGINS",
        example: "https://ornek.vercel.app",
        required: false,
        secret: false,
        description: "Yalnızca tarayıcı backend'e doğrudan konuşacaksa gerekir. Önerilen kurulumda boş kalır.",
      },
    ],
    renderTitle: "Render üzerinde dağıtım",
    renderIntro:
      "Backend'i Render'a dağıtırsanız ortam değişkenleri dosyaya değil, servisin kendi ayarlarına girilir.",
    renderSteps: [
      { title: "Render", body: "Hesabınızda projeyi bir web servisi olarak oluşturun." },
      { title: "Service", body: "Depodaki render.yaml blueprint'i plan, Docker dosyası ve sağlık kontrolünü zaten tanımlar." },
      { title: "Environment", body: "Servis ayarlarında Environment bölümüne geçin." },
      {
        title: "Environment Variables",
        body: "GEMINI_API_KEY değerini buraya girin. Blueprint bu değişkeni senkronize edilmeyecek şekilde işaretler, yani değeri depoda değil yalnızca panelde durur.",
      },
    ],
    secretsTitle: "Neyi asla depoya göndermemeli?",
    secretsBody: [
      "GEMINI_API_KEY ve INGEST_API_TOKEN gizli değerlerdir. Yalnızca yerel .env dosyanızda veya dağıtım sağlayıcınızın ortam değişkeni panelinde durmalıdırlar.",
      ".env dosyası .gitignore içindedir ve depoya gönderilmez. Depoda yalnızca gerçek değer taşımayan .env.example bulunur.",
      "Bu değerlerin hiçbiri tarayıcıya gönderilmez: model çağrıları sunucu tarafında yapılır, arayüz yalnızca kendi sunucusuyla konuşur.",
    ],
    frontendTitle: "Arayüz ortam değişkenleri",
    frontendBody:
      "Arayüz hiçbir API anahtarı taşımaz. Yalnızca kendi sunucusunun backend'i nerede bulacağını bilmesi yeterlidir.",
    frontendVars: [
      {
        name: "AGENT_API_URL",
        example: "http://localhost:8000",
        required: true,
        secret: false,
        description: "Backend adresi. NEXT_PUBLIC_ önekli DEĞİLDİR: yalnızca sunucu tarafında okunur, tarayıcı bu adresi görmez.",
      },
      {
        name: "DEMO_MODE",
        example: "false",
        required: false,
        secret: false,
        description: "false yapıldığında canlı mod açılır ve sorular gerçekten agent'a gider.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Doküman alanının arayüzde etkin olup olmayacağı. Backend'deki aynı adlı ayarla birlikte çalışır.",
      },
      {
        name: "NEXT_PUBLIC_GITHUB_URL",
        example: "https://github.com/kullanici/depo",
        required: false,
        secret: false,
        description: "Herkese açık depo bağlantısı. Gizli bir değer olmadığı için NEXT_PUBLIC_ önekiyle tarayıcıya verilebilir.",
      },
    ],
    runTitle: "Çalıştırma komutları",
    runIntro: "Backend ve arayüz ayrı süreçlerdir; iki terminalde çalıştırın.",
    copy: "Kopyala",
    copied: "Kopyalandı",
  },

  footer: {
    tagline: "Agent Lab — bağımsız bir agentic AI mühendislik denemesi",
    about: "Hakkında",
  },
} satisfies Messages;
