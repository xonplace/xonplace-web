import type { AssessmentV2Answers } from "./adapter";

export type MaturityFactorStatus =
  | "fortaleza"
  | "parcial"
  | "brecha"
  | "desconocido";

export type MaturityFactor = {
  label: string;
  status: MaturityFactorStatus;
  detail: string;
};

export type MaturityDimension = {
  score: number;
  level: string;
  rationale: string;
  factors: MaturityFactor[];
  actions: string[];
};

export type MaturityResult = {
  procesos: MaturityDimension;
  informacion: MaturityDimension;
  integracion: MaturityDimension;
  automatizacion: MaturityDimension;
  ia: MaturityDimension;
};

function getString(
  answers: AssessmentV2Answers,
  key: string,
): string {
  const value = answers[key];

  return typeof value === "string"
    ? value
    : "";
}

function getArray(
  answers: AssessmentV2Answers,
  key: string,
): string[] {
  const value = answers[key];

  return Array.isArray(value)
    ? value
    : [];
}

function getNumber(
  answers: AssessmentV2Answers,
  key: string,
): number | undefined {
  const value = getString(answers, key);

  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function clamp(value: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function getLevel(score: number): string {
  if (score >= 80) {
    return "Madurez avanzada";
  }

  if (score >= 60) {
    return "Madurez intermedia";
  }

  if (score >= 40) {
    return "Madurez básica";
  }

  return "Etapa inicial";
}

function calculateProcesses(
  answers: AssessmentV2Answers,
): MaturityDimension {
  const rulesKnown = getString(
    answers,
    "rulesKnown",
  );

  const exceptionsLevel = getString(
    answers,
    "exceptionsLevel",
  );

  const reworkLevel = getString(
    answers,
    "reworkLevel",
  );

  const requiresApproval = getString(
    answers,
    "requiresApproval",
  );

  let rulesScore = 25;

  if (rulesKnown === "all") {
    rulesScore = 100;
  } else if (rulesKnown === "most") {
    rulesScore = 85;
  } else if (rulesKnown === "some") {
    rulesScore = 55;
  } else if (rulesKnown === "none") {
    rulesScore = 20;
  }

  let exceptionsScore = 50;

  if (exceptionsLevel === "low") {
    exceptionsScore = 90;
  } else if (exceptionsLevel === "medium") {
    exceptionsScore = 60;
  } else if (exceptionsLevel === "high") {
    exceptionsScore = 25;
  }

  let reworkScore = 50;

  if (reworkLevel === "rare") {
    reworkScore = 95;
  } else if (reworkLevel === "sometimes") {
    reworkScore = 70;
  } else if (reworkLevel === "frequent") {
    reworkScore = 40;
  } else if (reworkLevel === "constant") {
    reworkScore = 15;
  }

  let approvalScore = 60;

  if (requiresApproval === "no") {
    approvalScore = 90;
  } else if (requiresApproval === "sometimes") {
    approvalScore = 65;
  } else if (requiresApproval === "yes") {
    approvalScore = 45;
  }

  const score = clamp(
    rulesScore * 0.4 +
      exceptionsScore * 0.25 +
      reworkScore * 0.25 +
      approvalScore * 0.1,
  );

  const factors: MaturityFactor[] = [
    {
      label: "Reglas de negocio",
      status:
        rulesScore >= 80
          ? "fortaleza"
          : rulesScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        rulesKnown === "all"
          ? "Las decisiones siguen reglas prácticamente en su totalidad."
          : rulesKnown === "most"
            ? "La mayoría de las decisiones sigue reglas conocidas."
            : rulesKnown === "some"
              ? "Solo una parte de las decisiones sigue reglas conocidas."
              : "No se identificaron reglas suficientemente estructuradas.",
    },
    {
      label: "Excepciones",
      status:
        exceptionsScore >= 80
          ? "fortaleza"
          : exceptionsScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        exceptionsLevel === "low"
          ? "Se reportan pocas excepciones."
          : exceptionsLevel === "medium"
            ? "Existen excepciones que requieren revisión humana."
            : "Existe una alta dependencia de criterio humano para resolver excepciones.",
    },
    {
      label: "Errores y retrabajos",
      status:
        reworkScore >= 80
          ? "fortaleza"
          : reworkScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        reworkLevel === "rare"
          ? "Los errores y retrabajos son poco frecuentes."
          : reworkLevel === "sometimes"
            ? "Existen retrabajos ocasionales."
            : "Los errores o retrabajos afectan de forma relevante la operación.",
    },
    {
      label: "Aprobaciones humanas",
      status:
        approvalScore >= 80
          ? "fortaleza"
          : approvalScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        requiresApproval === "no"
          ? "El proceso no depende de aprobaciones humanas obligatorias."
          : "Existen aprobaciones humanas que deben considerarse dentro del flujo.",
    },
  ];

  return {
    score,
    level: getLevel(score),
    rationale:
      score >= 80
        ? "El proceso presenta reglas claras, pocas excepciones y un nivel de estabilidad favorable para automatización."
        : score >= 60
          ? "El proceso cuenta con una base razonablemente estructurada, aunque todavía existen excepciones, aprobaciones o retrabajos que limitan su madurez."
          : "El proceso requiere mayor estandarización antes de automatizar etapas de mayor complejidad.",
    factors,
    actions: [
      "Documentar y formalizar reglas de negocio.",
      "Clasificar las excepciones más frecuentes.",
      "Reducir causas recurrentes de retrabajo.",
      "Definir claramente qué aprobaciones deben mantenerse bajo control humano.",
    ],
  };
}

function calculateInformation(
  answers: AssessmentV2Answers,
): MaturityDimension {
  const usesDocuments =
    getString(
      answers,
      "usesDocuments",
    ) === "yes";

  const manualExtraction = getString(
    answers,
    "manualDataExtraction",
  );

  const documentTypes = getArray(
    answers,
    "documentTypes",
  );

  let digitalScore = usesDocuments
    ? 75
    : 85;

  if (
    usesDocuments &&
    documentTypes.length === 0
  ) {
    digitalScore = 55;
  }

  let extractionScore = 80;

  if (manualExtraction === "yes") {
    extractionScore = 25;
  } else if (
    manualExtraction === "sometimes"
  ) {
    extractionScore = 55;
  } else if (manualExtraction === "no") {
    extractionScore = 90;
  }

  const varietyScore =
    documentTypes.length >= 4
      ? 65
      : documentTypes.length >= 1
        ? 80
        : 70;

  const score = clamp(
    digitalScore * 0.35 +
      extractionScore * 0.45 +
      varietyScore * 0.2,
  );

  const factors: MaturityFactor[] = [
    {
      label: "Información digital",
      status:
        digitalScore >= 80
          ? "fortaleza"
          : digitalScore >= 55
            ? "parcial"
            : "brecha",
      detail:
        usesDocuments
          ? "El proceso utiliza información digital y documentos estructurables."
          : "El proceso no depende significativamente de documentos.",
    },
    {
      label: "Extracción de datos",
      status:
        extractionScore >= 80
          ? "fortaleza"
          : extractionScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        manualExtraction === "yes"
          ? "La información se extrae o copia manualmente desde documentos."
          : manualExtraction === "sometimes"
            ? "Parte de la información todavía requiere extracción manual."
            : "No se detectó una dependencia relevante de extracción manual.",
    },
    {
      label: "Variedad documental",
      status:
        varietyScore >= 75
          ? "fortaleza"
          : "parcial",
      detail:
        documentTypes.length > 0
          ? `Se utilizan ${documentTypes.length} tipos de documentos o fuentes de información.`
          : "No se informaron fuentes documentales específicas.",
    },
  ];

  return {
    score,
    level: getLevel(score),
    rationale:
      score >= 80
        ? "La información presenta buenas condiciones para ser utilizada por automatizaciones y soluciones de IA."
        : score >= 60
          ? "Existe una base digital suficiente, aunque todavía hay actividades manuales de extracción o manipulación de información."
          : "La gestión de información requiere mayor estructuración y reducción de tareas manuales.",
    factors,
    actions: [
      "Reducir la extracción manual de datos.",
      "Estandarizar formatos documentales cuando sea posible.",
      "Definir campos obligatorios y reglas de validación.",
      "Centralizar información crítica en fuentes controladas.",
    ],
  };
}

function calculateIntegration(
  answers: AssessmentV2Answers,
): MaturityDimension {
  const usesMultipleSystems =
    getString(
      answers,
      "usesMultipleSystems",
    ) === "yes";

  const doubleEntry = getString(
    answers,
    "doubleEntry",
  );

  const systemsIntegrated = getString(
    answers,
    "systemsIntegrated",
  );

  const apiAvailability = getString(
    answers,
    "apiAvailability",
  );

  if (!usesMultipleSystems) {
    return {
      score: 85,
      level: getLevel(85),
      rationale:
        "El proceso no depende de múltiples sistemas, por lo que la complejidad de integración actual es reducida.",
      factors: [
        {
          label: "Cantidad de sistemas",
          status: "fortaleza",
          detail:
            "No se reportó dependencia de múltiples aplicaciones.",
        },
      ],
      actions: [
        "Mantener interfaces y fuentes de datos estandarizadas.",
        "Validar mecanismos de integración antes de incorporar nuevos sistemas.",
      ],
    };
  }

  let integrationScore = 50;

  if (systemsIntegrated === "most") {
    integrationScore = 90;
  } else if (
    systemsIntegrated === "some"
  ) {
    integrationScore = 65;
  } else if (
    systemsIntegrated === "none"
  ) {
    integrationScore = 25;
  } else if (
    systemsIntegrated === "unknown"
  ) {
    integrationScore = 45;
  }

  let doubleEntryScore = 60;

  if (doubleEntry === "no") {
    doubleEntryScore = 90;
  } else if (
    doubleEntry === "sometimes"
  ) {
    doubleEntryScore = 55;
  } else if (
    doubleEntry === "frequent"
  ) {
    doubleEntryScore = 20;
  }

  let apiScore = 50;

  if (apiAvailability === "most") {
    apiScore = 90;
  } else if (
    apiAvailability === "some"
  ) {
    apiScore = 65;
  } else if (
    apiAvailability === "none"
  ) {
    apiScore = 25;
  } else if (
    apiAvailability === "unknown"
  ) {
    apiScore = 45;
  }

  const score = clamp(
    integrationScore * 0.45 +
      doubleEntryScore * 0.35 +
      apiScore * 0.2,
  );

  const factors: MaturityFactor[] = [
    {
      label: "Integración automática",
      status:
        integrationScore >= 80
          ? "fortaleza"
          : integrationScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        systemsIntegrated === "most"
          ? "La mayoría de los sistemas intercambia información automáticamente."
          : systemsIntegrated === "some"
            ? "Existen algunas integraciones automáticas."
            : systemsIntegrated === "none"
              ? "No se identificaron integraciones automáticas entre sistemas."
              : "El nivel de integración automática no pudo ser confirmado.",
    },
    {
      label: "Doble digitación",
      status:
        doubleEntryScore >= 80
          ? "fortaleza"
          : doubleEntryScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        doubleEntry === "frequent"
          ? "La misma información debe ingresarse frecuentemente en más de un sistema."
          : doubleEntry === "sometimes"
            ? "Existe doble digitación en algunos casos."
            : "No se detectó doble digitación relevante.",
    },
    {
      label: "Disponibilidad de API",
      status:
        apiScore >= 80
          ? "fortaleza"
          : apiScore >= 50
            ? "parcial"
            : "brecha",
      detail:
        apiAvailability === "most"
          ? "La mayoría de los sistemas dispone de mecanismos de integración."
          : apiAvailability === "some"
            ? "Solo algunos sistemas disponen de API o conectores."
            : apiAvailability === "none"
              ? "No se identificaron APIs o mecanismos de integración disponibles."
              : "La disponibilidad de APIs todavía debe validarse.",
    },
  ];

  return {
    score,
    level: getLevel(score),
    rationale:
      score >= 80
        ? "Los sistemas presentan un nivel de integración favorable y baja dependencia de transferencias manuales."
        : score >= 60
          ? "Existe integración parcial, pero todavía hay transferencias manuales o sistemas sin conectividad suficiente."
          : score >= 40
            ? "La integración es limitada y representa una barrera relevante para escalar automatización."
            : "La operación depende fuertemente de sistemas desconectados y transferencias manuales.",
    factors,
    actions: [
      "Identificar APIs, conectores y mecanismos de integración disponibles.",
      "Eliminar doble digitación entre aplicaciones prioritarias.",
      "Definir un flujo maestro de datos entre sistemas.",
      "Priorizar integraciones según impacto operacional.",
    ],
  };
}

function calculateAutomation(
  answers: AssessmentV2Answers,
): MaturityDimension {
  const manualPercentage =
    getNumber(
      answers,
      "manualPercentage",
    ) ?? 50;

  const rulesKnown = getString(
    answers,
    "rulesKnown",
  );

  const manualScore = clamp(
    100 - manualPercentage,
  );

  let rulesScore = 40;

  if (rulesKnown === "all") {
    rulesScore = 95;
  } else if (rulesKnown === "most") {
    rulesScore = 80;
  } else if (rulesKnown === "some") {
    rulesScore = 55;
  } else if (rulesKnown === "none") {
    rulesScore = 25;
  }

  const score = clamp(
    manualScore * 0.7 +
      rulesScore * 0.3,
  );

  return {
    score,
    level: getLevel(score),
    rationale:
      score >= 80
        ? "El proceso presenta baja dependencia de intervención manual y una estructura favorable para automatización."
        : score >= 60
          ? "Existe cierto nivel de automatización o estructuración, aunque todavía persisten actividades manuales relevantes."
          : "El proceso depende en gran medida de intervención humana y presenta un nivel bajo de automatización actual.",
    factors: [
      {
        label: "Intervención manual",
        status:
          manualPercentage <= 25
            ? "fortaleza"
            : manualPercentage <= 50
              ? "parcial"
              : "brecha",
        detail: `${manualPercentage}% del proceso se reporta como manual.`,
      },
      {
        label: "Reglas automatizables",
        status:
          rulesScore >= 80
            ? "fortaleza"
            : rulesScore >= 50
              ? "parcial"
              : "brecha",
        detail:
          rulesKnown === "all" ||
          rulesKnown === "most"
            ? "Las reglas conocidas facilitan la automatización."
            : "La falta de reglas suficientemente definidas limita la automatización.",
      },
    ],
    actions: [
      "Automatizar primero tareas repetitivas y basadas en reglas.",
      "Reducir intervención humana en actividades de bajo valor.",
      "Mantener supervisión humana para excepciones y aprobaciones críticas.",
    ],
  };
}

function calculateAI(
  answers: AssessmentV2Answers,
): MaturityDimension {
  const usesDocuments =
    getString(
      answers,
      "usesDocuments",
    ) === "yes";

  const rulesKnown = getString(
    answers,
    "rulesKnown",
  );

  const exceptionsLevel = getString(
    answers,
    "exceptionsLevel",
  );

  const executionsPerMonth =
    getNumber(
      answers,
      "executionsPerMonth",
    ) ?? 0;

  let dataScore = usesDocuments
    ? 80
    : 65;

  let rulesScore = 40;

  if (rulesKnown === "all") {
    rulesScore = 95;
  } else if (rulesKnown === "most") {
    rulesScore = 85;
  } else if (rulesKnown === "some") {
    rulesScore = 55;
  } else if (rulesKnown === "none") {
    rulesScore = 25;
  }

  let exceptionScore = 60;

  if (exceptionsLevel === "low") {
    exceptionScore = 90;
  } else if (
    exceptionsLevel === "medium"
  ) {
    exceptionScore = 60;
  } else if (
    exceptionsLevel === "high"
  ) {
    exceptionScore = 30;
  }

  let volumeScore = 40;

  if (executionsPerMonth >= 300) {
    volumeScore = 90;
  } else if (
    executionsPerMonth >= 100
  ) {
    volumeScore = 75;
  } else if (
    executionsPerMonth >= 30
  ) {
    volumeScore = 60;
  }

  const score = clamp(
    dataScore * 0.3 +
      rulesScore * 0.3 +
      exceptionScore * 0.2 +
      volumeScore * 0.2,
  );

  return {
    score,
    level: getLevel(score),
    rationale:
      score >= 80
        ? "El proceso presenta buenas condiciones para incorporar capacidades de IA de forma controlada."
        : score >= 60
          ? "Existen condiciones favorables para casos de IA específicos, aunque deben validarse datos, excepciones y gobernanza."
          : "La aplicación de IA requiere mayor estructuración del proceso y de la información disponible.",
    factors: [
      {
        label: "Información disponible",
        status:
          dataScore >= 75
            ? "fortaleza"
            : "parcial",
        detail:
          usesDocuments
            ? "Existen documentos e información que pueden alimentar soluciones de IA."
            : "No se identificó una fuerte dependencia documental.",
      },
      {
        label: "Reglas y contexto",
        status:
          rulesScore >= 80
            ? "fortaleza"
            : rulesScore >= 50
              ? "parcial"
              : "brecha",
        detail:
          "La claridad de reglas influye directamente en la capacidad de supervisar decisiones asistidas por IA.",
      },
      {
        label: "Excepciones",
        status:
          exceptionScore >= 80
            ? "fortaleza"
            : exceptionScore >= 50
              ? "parcial"
              : "brecha",
        detail:
          "Un nivel alto de excepciones aumenta la necesidad de supervisión humana.",
      },
      {
        label: "Volumen operacional",
        status:
          volumeScore >= 75
            ? "fortaleza"
            : volumeScore >= 55
              ? "parcial"
              : "brecha",
        detail:
          `${executionsPerMonth} ejecuciones mensuales informadas.`,
      },
    ],
    actions: [
      "Aplicar IA primero en tareas acotadas y medibles.",
      "Definir criterios de confianza y revisión humana.",
      "Registrar resultados para validar precisión y calidad.",
      "Evitar automatizar decisiones críticas sin supervisión.",
    ],
  };
}

export function calculateMaturityDimensions(
  answers: AssessmentV2Answers,
): MaturityResult {
  return {
    procesos:
      calculateProcesses(answers),

    informacion:
      calculateInformation(answers),

    integracion:
      calculateIntegration(answers),

    automatizacion:
      calculateAutomation(answers),

    ia:
      calculateAI(answers),
  };
}