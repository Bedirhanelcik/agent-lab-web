/** Français. Les termes techniques restent en anglais ; seule la prose est traduite. */

import type { Messages } from "../types.ts";

export const fr = {
  meta: {
    siteTitle: "Agent Lab — un agent qui sait quand chercher",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "Une expérience d'ingénierie indépendante en IA agentique, construite sur le Hybrid Retrieval, un raisonnement adaptatif et des réponses sourcées.",
    ogDescription:
      "Hybrid Retrieval. Raisonnement adaptatif. Réponses sourcées. Une expérience d'ingénierie indépendante en IA agentique.",
    systemTitle: "Le système",
    systemDescription:
      "Le détail technique du Hybrid Retrieval, de la boucle de décision de l'agent et de la couche d'évaluation.",
    playgroundTitle: "Playground",
    playgroundDescription:
      "Exécutions de l'agent : trace de décision, recherches effectuées, passages récupérés et réponse sourcée.",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "Comment le comportement de l'agent est mesuré : cas, assertions structurelles, résultats et limites.",
    aboutTitle: "À propos",
    aboutDescription:
      "Un projet d'ingénierie indépendant né d'un cours sur l'IA agentique.",
  },

  nav: {
    skipToContent: "Aller au contenu",
    ariaLabel: "Navigation principale",
    home: "Accueil",
    system: "Système",
    playground: "Playground",
    evaluation: "Evaluation",
    about: "À propos",
  },

  language: {
    label: "Langue",
    current: "Langue sélectionnée",
  },

  mode: {
    label: "État",
    demo: "Démo",
    live: "Direct",
    demoHint: "Des exécutions préparées sont affichées ; aucun appel de modèle en direct.",
    liveHint: "Les appels à l'agent en direct sont activés.",
  },

  home: {
    heroEyebrow: "Système de retrieval agentique",
    heroTitleLine1: "Un agent qui sait",
    heroTitleLine2: "quand chercher.",
    heroSubtitle: "Hybrid Retrieval. Raisonnement adaptatif. Réponses sourcées.",
    ctaPlayground: "Essayer l'agent",
    ctaSystem: "Explorer le système",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search et BM25 fonctionnent séparément et leurs résultats sont fusionnés par Reciprocal Rank Fusion. Les identifiants de chunk sont déterministes.",
      },
      {
        title: "Agent",
        body: "Il décide lui-même s'il doit chercher, inspecte les passages obtenus et, si nécessaire, reformule la requête et cherche à nouveau.",
      },
      {
        title: "Evaluation",
        body: "Le comportement est mesuré : quel status est revenu, le RAG a-t-il vraiment été appelé, la source est-elle correcte, une question hors corpus a-t-elle produit une invention.",
      },
    ],
    whyEyebrow: "Pourquoi ce projet",
    whyTitle: "Pas une simple démo RAG",
    whyDescription:
      "La plupart des exemples prennent une question, la donnent au Vector Search et transmettent le résultat à un modèle de langue. La différence ici est la couche de décision : le système décide lui-même si une recherche est nécessaire, si ce qui revient est suffisant et si une nouvelle tentative en vaut la peine. Il refuse de répondre sur un contexte insuffisant.",
    facts: [
      { value: "475", label: "tests locaux" },
      { value: "6", label: "cas d'évaluation" },
      { value: "2", label: "méthodes de retrieval" },
      { value: "0", label: "couche de framework" },
    ],
  },

  architecture: {
    eyebrow: "Architecture",
    title: "Le chemin d'une question dans le système",
    description:
      "L'agent décide d'abord si une recherche est nécessaire. Si elle l'est, deux méthodes de retrieval s'exécutent en parallèle, les résultats sont fusionnés par rang, et une réponse n'est produite que si le contexte est suffisant.",
    nodes: {
      user: "question",
      agent: "évaluer · inspecter · affiner",
      ragSearch: "outil rag_search",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · source · rang",
      synthesis: "synthèse sourcée",
      answer: "réponse avec citations",
      answerLabel: "Réponse sourcée",
    },
    points: [
      {
        title: "La couche de décision",
        body: "L'agent décide s'il faut consulter l'archive. Pour une entrée comme une salutation, le retrieval n'est jamais appelé et le nombre d'appels d'outil reste à zéro.",
      },
      {
        title: "Retrieval parallèle",
        body: "Vector Search capte la proximité sémantique, BM25 la correspondance exacte des mots. Chacun couvre la faiblesse de l'autre, ce qui compte d'autant plus que le turc modifie la fin des mots par flexion.",
      },
      {
        title: "Fusion par rang",
        body: "La similarité cosinus et un score BM25 ne sont pas à la même échelle. RRF ignore totalement les scores et n'utilise que les rangs, ce qui évite une normalisation fragile.",
      },
      {
        title: "Réponse sourcée",
        body: "La synthèse n'utilise que les passages récupérés et chaque affirmation est rattachée à un identifiant de chunk. Sans contexte suffisant, l'agent refuse de répondre.",
      },
    ],
  },

  system: {
    heroEyebrow: "Détail technique",
    heroTitle: "Le système",
    heroSubtitle:
      "Trois couches : le retrieval qui trouve l'information, l'agent qui décide quand et comment chercher, et l'évaluation qui mesure le comportement.",
    retrievalEyebrow: "Couche 01 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "Vector Search capte la proximité sémantique mais brouille les termes rares et les noms propres ; BM25 excelle sur la correspondance exacte mais rate les formes fléchies. Les deux s'exécutent séparément et leurs classements sont fusionnés.",
    retrievalParts: [
      {
        title: "Chroma",
        body: "Le magasin vectoriel persistant. Le texte des chunks et les métadonnées sont sur disque.",
      },
      {
        title: "BM25",
        body: "Correspondance exacte des mots. Il vit en mémoire et est reconstruit depuis Chroma au démarrage.",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "Ignore les échelles de score et n'utilise que le rang (k = 60).",
      },
      {
        title: "gemini-embedding-001",
        body: "Les embeddings sont produits via l'API Gemini (768 dimensions), avec des task types distincts pour les requêtes et les passages. Aucun modèle ML local n'est chargé, ce qui maintient le service sous une limite de 512 Mo de mémoire.",
      },
      {
        title: "Identifiants de chunk déterministes",
        body: "source_file::chunk_index. Utilisé comme clé pour la citation et la récupération.",
      },
    ],
    agentEyebrow: "Couche 02 — Agent",
    agentTitle: "La boucle de décision",
    agentDescription:
      "Pas un pipeline figé, mais une petite machine à états aux frontières explicites. Il y a une décision à chaque étape, et ces décisions changent le flux.",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "Une recherche est-elle nécessaire ?",
          detail:
            "La question est analysée. Si aucune connaissance documentaire n'est requise, le retrieval n'est jamais appelé et le flux va directement à la réponse.",
        },
        {
          label: "Search",
          summary: "rag_search est appelé",
          detail:
            "L'agent rédige sa propre requête ; il n'est pas obligé de transmettre la phrase de l'utilisateur telle quelle. La requête est écrite dans la langue du corpus.",
        },
        {
          label: "Inspect",
          summary: "Les passages suffisent-ils ?",
          detail:
            "On vérifie si les passages renvoyés répondent réellement à la question. Sans cette étape, la notion de « contexte insuffisant » n'existerait pas.",
        },
        {
          label: "Refine",
          summary: "La requête est reformulée",
          detail:
            "Si le résultat est insuffisant, la requête est modifiée et la recherche relancée. Le nombre de tentatives est borné et la même requête n'est jamais exécutée deux fois.",
        },
        {
          label: "Answer",
          summary: "Seulement sur contexte suffisant",
          detail:
            "La réponse s'appuie sur les passages récupérés et les cite. Si le contexte est insuffisant, la synthèse n'est jamais appelée et la situation est énoncée clairement.",
        },
      ],
      nextStates: "États suivants possibles :",
      terminal: "terminal",
    },
    evalEyebrow: "Couche 03 — Evaluation",
    evalTitle: "Comportement mesuré",
    evalDescription:
      "L'objectif n'est pas de dire « j'ai fait un agent » mais « j'ai mesuré son comportement ». L'évaluation regarde le comportement observable, pas la formulation de la réponse.",
    evalParts: [
      {
        value: "475",
        label: "tests locaux",
        detail: "Tous avec des doublures ; zéro appel d'API.",
      },
      {
        value: "6",
        label: "cas d'évaluation",
        detail: "Ils mesurent un comportement, pas une simple correspondance de chaîne.",
      },
      {
        value: "25",
        label: "assertions structurelles",
        detail: "Status, outil utilisé, source, format de citation, contrôle d'invention.",
      },
      {
        value: "1",
        label: "appel au LLM juge",
        detail: "Uniquement dans le cas qui demande réellement un jugement sémantique.",
      },
    ],
    evalNote:
      "L'évaluation repose sur une CLI d'évaluation de prompts qui vit dans un projet séparé ; la logique des assertions y est définie et n'est pas réécrite ici.",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "Voir l'agent à l'œuvre.",
    heroDemoSubtitle:
      "Cette page fonctionne en mode démo : aucun appel de modèle n'est fait et chaque exécution affichée a été préparée à l'avance.",
    heroLiveSubtitle:
      "Le mode direct est actif : votre question est envoyée au service de l'agent et la réponse est produite dans la langue que vous avez choisie.",
    questionLabel: "Question",
    placeholderDemo: "Écrivez une question ou choisissez un exemple préparé ci-dessous",
    placeholderLive: "Écrivez une question et appuyez sur Entrée",
    submit: "Envoyer",
    submittingDemo: "Résolution…",
    submittingLive: "En cours…",
    examplesDemo: "Questions préparées",
    examplesLive: "Exemples de questions",
    syntheticTag: "synthetic",
    idleDemo:
      "En mode démo, seules les questions préparées ci-dessus reçoivent une réponse. Choisissez-en une : la décision prise par l'agent, les recherches effectuées, les passages récupérés et la réponse sourcée apparaîtront ci-dessous.",
    idleLive:
      "Le mode direct est actif : votre question est envoyée au service de l'agent, l'agent décide lui-même s'il doit chercher et ne fonde la réponse que sur les passages trouvés.",
    runningDemo: "Résolution de l'exécution préparée",
    runningLive: "L'agent travaille",
    runningHint:
      "Les étapes de décision, de recherche et de synthèse s'exécutent l'une après l'autre ; cela peut prendre quelques secondes.",
    notFoundTitle: "Aucun exemple préparé trouvé",
    notFoundBody:
      "Il n'y a pas d'exemple préparé pour cette question. Comme le mode démo ne fait aucun appel de modèle en direct, nous n'affichons rien plutôt que de proposer une exécution qui ressemble vaguement à votre demande. Choisissez l'une des questions préparées ci-dessus.",
    notFoundQuery: "recherché :",
    demoDataTitle: "Les données de démo n'ont pas pu être lues",
    demoDataBody:
      "Les exécutions préparées n'ont pas la forme attendue, aucun exemple n'est donc affiché. Afficher malgré tout des données corrompues serait trompeur.",
    originSynthetic: "Synthetic — exécution de démo préparée",
    originPrepared: "Exécution de démo préparée",
    originSyntheticBody:
      "Cette exécution a été composée à la main et n'a jamais été lancée. Elle n'existe que pour montrer le flux de reformulation réussi ; ce n'est pas une véritable sortie de modèle.",
    originPreparedBody:
      "Cette sortie est dérivée d'une exécution réellement lancée auparavant et n'a pas été produite en direct ici.",
    originLanguageNote:
      "Les exécutions préparées ont été produites sur un corpus turc : changer la langue de l'interface ne change pas le texte de réponse enregistré. Pour obtenir une réponse dans la langue choisie, le mode direct est nécessaire.",
    reconstructedFields: "champs reconstruits :",
    reconstructedNone: "tous les champs ont été observés (rien de reconstruit)",
  },

  result: {
    question: "Question",
    status: "Status",
    answer: "Réponse",
    trace: "Trace de l'agent",
    traceSteps: "étapes",
    toolCalls: "Appels d'outil",
    sources: "Sources",
    noSources:
      "Aucune source n'a été citée dans cette exécution. Soit l'agent n'a pas cherché, soit il n'a pas jugé les passages suffisants et n'a donc fondé la réponse sur aucun passage.",
    noSteps: "Aucune étape n'a été enregistrée pour cette exécution.",
    noToolCalls: "tool_calls :",
    noToolCallsBody:
      "L'agent n'a jamais recouru au retrieval pour cette question. Un pipeline figé aurait cherché quand même ; ici, ne pas chercher est aussi une décision.",
    toolCallCount: "tool_calls :",
    attemptOf: "recherche",
    fieldRank: "rang",
    fieldScore: "score",
    fieldPage: "page",
    fieldQuery: "requête",
    fieldTopK: "top_k",
    fieldPassagesFound: "passages trouvés",
    fieldSourceFile: "fichier source",
    statusLabels: {
      answered: "Répondu",
      answered_without_retrieval: "Répondu sans retrieval",
      insufficient_context: "Contexte insuffisant",
      tool_failure: "Échec de l'outil",
    },
    statusExplanations: {
      answered:
        "L'agent a cherché, a jugé les passages suffisants et a fondé la réponse uniquement sur ces passages.",
      answered_without_retrieval:
        "L'agent a décidé qu'il n'était pas nécessaire de consulter l'archive pour cette question ; le retrieval n'a jamais été appelé.",
      insufficient_context:
        "Une recherche a eu lieu mais les passages renvoyés ne suffisaient pas à répondre. L'agent a refusé de répondre.",
      tool_failure:
        "La couche de retrieval a échoué. Dans ce cas l'agent ne réessaie pas et ne produit pas de réponse.",
    },
    actionLabels: {
      assessed_question: "Question évaluée",
      searched_rag: "Recherche dans le RAG",
      refined_query: "Requête reformulée",
      answered_from_context: "Répondu depuis le contexte",
      answered_without_retrieval: "Répondu sans retrieval",
      declared_insufficient_context: "Contexte insuffisant déclaré",
      tool_failed: "Échec de l'outil",
    },
  },

  errors: {
    title: {
      not_configured: "Le service de l'agent n'est pas configuré",
      invalid_request: "La question n'a pas pu être envoyée",
      quota_exhausted: "Le quota gratuit est épuisé",
      generation_error: "La réponse n'a pas pu être produite",
      corpus_empty: "Aucun document n'a encore été ajouté",
      agent_unavailable: "L'agent est indisponible pour le moment",
      upstream_error: "Le service de l'agent a renvoyé une erreur",
      bad_response: "La réponse n'a pas la forme attendue",
      timeout: "Délai dépassé",
      network: "Le service de l'agent est injoignable",
    },
    body: {
      not_configured:
        "Le mode direct semble actif mais l'adresse du service de l'agent n'est pas définie. Aucune requête en direct n'est possible tant que la configuration côté serveur n'est pas terminée.",
      invalid_request:
        "Le service de l'agent n'a pas accepté la requête. Vérifiez que la question n'est pas vide et réessayez.",
      quota_exhausted:
        "Le quota gratuit du fournisseur de modèle est actuellement épuisé. Les requêtes en direct fonctionneront à nouveau après sa réinitialisation ; en attendant, vous pouvez consulter les exécutions préparées en mode démo.",
      generation_error:
        "Le retrieval s'est terminé mais l'étape de synthèse a échoué. C'est en général temporaire ; réessayer a du sens.",
      corpus_empty:
        "L'agent n'a trouvé aucun document à chercher : l'archive est vide pour le moment. Les questions pourront être traitées dès qu'un document aura été ajouté.",
      agent_unavailable:
        "Le service de l'agent est en ligne mais n'est pas en état d'accepter des requêtes. Ce point d'entrée répondra dès que la configuration du serveur sera terminée.",
      upstream_error:
        "La requête a atteint le service de l'agent mais s'est terminée par une erreur inattendue. Réessayer n'aidera peut-être pas.",
      bad_response:
        "Le service de l'agent a renvoyé une réponse qui ne respecte pas le contrat. Présenter une réponse malformée comme un résultat serait trompeur, rien n'est donc affiché.",
      timeout:
        "L'agent n'a pas répondu dans le délai prévu. La requête a été annulée ; il n'y a pas d'attente illimitée.",
      network:
        "Aucune connexion n'a pu être établie. Vérifiez que le service de l'agent fonctionne et réessayez.",
    },
  },

  upload: {
    heading: "Téléversement de documents",
    availableBody:
      "Téléversez un fichier PDF, TXT ou MD. Le document passe par le pipeline d'ingestion existant : découpage en pages, chunking, génération d'embeddings et écriture dans l'index vectoriel et l'index de mots-clés. Il devient ensuite interrogeable depuis le champ de question ci-dessus.",
    disabledDemo:
      "Le téléversement ne fait rien en mode démo ; les exécutions affichées sont des exemples préparés.",
    disabledEnv: "Le téléversement de documents est désactivé dans cet environnement.",
    disabledReason:
      "Le téléversement n'est activé qu'en développement local. La raison est architecturale : le corpus est pour l'instant partagé entre tous les visiteurs, donc un document téléversé par l'un entre dans les recherches des autres. Le téléversement ne devrait pas être exposé publiquement avant l'isolation par utilisateur.",
    fileInputLabel: "Documents à téléverser",
    submit: "Téléverser",
    submitting: "Ingestion…",
    runningTitle: "L'ingestion est en cours",
    runningHint:
      "Le chunking et les embeddings peuvent prendre quelques secondes selon la taille du fichier.",
    doneTitle: "Ingéré",
    doneBody:
      "Le document est maintenant interrogeable. Lorsque vous posez une question ci-dessus, l'agent peut aussi chercher dans ce contenu.",
    chunkUnit: "chunks",
    failedTitle: "Téléversement échoué",
    errors: {
      not_configured:
        "L'adresse du service de l'agent n'est pas définie, le document n'a donc pas pu être envoyé.",
      upload_disabled: "Le téléversement de documents est désactivé dans cet environnement.",
      no_files: "Choisissez d'abord un fichier.",
      unsupported_file_type: "Seuls les fichiers PDF, TXT et MD sont acceptés.",
      file_too_large: "Le fichier est trop volumineux. Maximum {max} Mo.",
      invalid_request:
        "Le nom de fichier ou la requête a été refusé. Essayez un autre nom de fichier.",
      upstream_error: "Le service de l'agent a renvoyé une erreur pendant le téléversement.",
      bad_response:
        "La réponse du téléversement n'a pas la forme attendue, aucun résultat n'est affiché.",
      timeout: "Le téléversement ne s'est pas terminé dans le délai prévu et a été annulé.",
      network: "Le service de l'agent est injoignable. Vérifiez qu'il fonctionne.",
    },
  },

  evaluation: {
    heroEyebrow: "Comportement mesuré",
    heroTitle: "Evaluation",
    heroSubtitle:
      "L'objectif n'est pas de dire « j'ai fait un agent » mais « j'ai mesuré son comportement ». L'évaluation ne regarde pas l'élégance de la réponse mais le comportement observable : quel status est revenu, le retrieval a-t-il vraiment été appelé, la bonne source a-t-elle été citée, une question hors corpus a-t-elle produit une invention.",
    methodologyEyebrow: "Méthode",
    methodologyTitle: "Structure de la suite",
    methodologyDescription:
      "Chaque cas vérifie le comportement observable de l'agent plutôt qu'une simple correspondance de chaîne. Les contrôles sont exécutés par des assertion checkers définis dans un projet séparé ; ils ne sont pas réécrits ici.",
    suiteShape: [
      {
        value: "6",
        label: "cas",
        detail:
          "Une question RAG factuelle, une question hors corpus, une réponse directe, l'exactitude des citations, une requête sous-spécifiée, la qualité sémantique.",
      },
      {
        value: "25",
        label: "assertions",
        detail:
          "Status, outil appelé, identité de la source, trace des actions, format de citation et contrôle d'invention.",
      },
      {
        value: "1",
        label: "appel au LLM juge",
        detail:
          "Uniquement dans le seul cas qui demande un jugement sémantique. Tous les autres contrôles sont déterministes et gratuits.",
      },
    ],
    suiteNote:
      "Ces nombres viennent de la définition de la suite (configuration), pas du résultat d'une exécution.",
    resultsEyebrow: "Résultats",
    resultsTitle: "Dernière exécution",
    resultsDescription:
      "Les résultats ne sont lus que depuis l'artefact produit par une véritable exécution d'évaluation. Sans artefact, aucun nombre n'est affiché ici.",
    missingTitle: "Aucun artefact d'évaluation disponible",
    missingBody:
      "Il n'y a pas d'artefact d'évaluation à afficher sur ce site. Plutôt que d'inventer un résultat, nous signalons son absence : dès que le fichier ci-dessous sera en place, cette page lira et affichera les vrais nombres.",
    missingExpectedFile: "fichier attendu :",
    missingHowTo:
      "L'artefact est produit en lançant la suite d'évaluation dans le projet qui héberge le service de l'agent. Cette exécution consomme du quota Gemini, elle n'est donc pas déclenchée ici ; cette page ne consomme qu'un artefact prêt.",
    invalidTitle: "L'artefact est invalide",
    invalidBody:
      "Le fichier a été trouvé mais n'a pas la forme attendue d'un rapport d'évaluation. Présenter un fichier corrompu ou erroné comme un résultat serait trompeur, aucun nombre n'est donc affiché.",
    limitationsTitle: "Limites",
    limitations: [
      "L'évaluation porte sur un petit corpus ; à cette échelle le classement du retrieval n'est pas mis sous tension et les résultats ne doivent pas être pris comme représentatifs d'un système de production.",
      "Une exécution en direct est limitée par le quota gratuit : comme seules quelques requêtes par minute sont permises, une exécution peut s'arrêter en cours de route malgré les attentes entre les cas. Dans ce cas les cas concernés sont rapportés comme une erreur de quota, pas comme un « fail ».",
      "Les résultats de cette page sont entièrement distincts des exécutions de démo préparées du playground. Les données de démo ne comptent jamais comme un résultat d'évaluation ; les deux sources vivent dans des fichiers séparés et sont validées par des schémas séparés.",
    ],
    report: {
      cases: "cas",
      passed: "réussis",
      failed: "échoués",
      assertions: "assertions",
      geminiCalls: "appels Gemini",
      callsNote: "{agent} agent + {judge} juge",
      suite: "suite",
      model: "modèle",
      generatedAt: "généré le",
      avgLatency: "latence moyenne",
      casesHeading: "Cas",
      pass: "réussi",
      fail: "échoué",
      status: "status",
      agentCalls: "appels agent",
      judgeCalls: "appels juge",
      latency: "latence",
      error: "erreur",
      score: "score",
      assertionPassed: "réussi",
      assertionFailed: "échoué",
    },
  },

  about: {
    heroEyebrow: "Le projet",
    heroTitle: "Conçu comme une expérience en IA agentique.",
    paragraphs: [
      "J'ai découvert les sujets d'IA agentique dans un cours de génie logiciel. Ils m'ont intéressé et, en prenant le programme comme référence, j'ai lancé un projet indépendant pour faire progresser mon propre travail en développement d'IA.",
      "Le projet n'est pas un devoir rendu : le cours a été un point de départ, et tout le système a été conçu et écrit indépendamment de lui. Le but n'était pas de produire une interface de chat généraliste mais de construire un système qui utilise le retrieval comme un outil, décide lui-même quand chercher, et ne répond pas sans citer de source.",
      "Les trois parties fonctionnent et sont testées indépendamment : la couche Hybrid Retrieval, l'agent avec sa boucle de décision, et le système d'évaluation qui mesure son comportement. Ce site les réunit en un seul récit.",
    ],
    stackHeading: "Technologies",
    stackGroups: [
      { group: "Interface", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Service", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "Raisonnement", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "Liens",
  },

  footer: {
    tagline: "Agent Lab — une expérience d'ingénierie indépendante en IA agentique",
    about: "À propos",
  },
} satisfies Messages;
