import type {
  AssessmentEvidence,
  EvidenceType,
} from "@/lib/assessment/intelligence";

import type { AssessmentV2Answers } from "./adapter";

type V2EvidenceRule = {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  strength: number;
  sourceQuestions: string[];
  matches: (answers: AssessmentV2Answers) => boolean;
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

function getNumber(
  answers: AssessmentV2Answers,
  key: string,
): number | undefined {
  const value = getString(answers, key);

  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
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

const rules: V2EvidenceRule[] = [
  {
    id: "v2-high-manual-percentage",
    type: "manual-work",
    title: "Proceso altamente manual",
    description:
      "Más del 75% del proceso depende actualmente de intervención humana.",
    strength: 95,
    sourceQuestions: ["manualPercentage"],
    matches: (answers) =>
      Number(getString(answers, "manualPercentage")) >= 75,
  },

  {
    id: "v2-high-volume",
    type: "volume",
    title: "Alto volumen operacional",
    description:
      "El proceso presenta un volumen mensual suficientemente alto como para justificar automatización.",
    strength: 85,
    sourceQuestions: ["executionsPerMonth"],
    matches: (answers) =>
      (getNumber(answers, "executionsPerMonth") ?? 0) >= 300,
  },

  {
    id: "v2-high-frequency",
    type: "volume",
    title: "Ejecución frecuente",
    description:
      "El proceso se ejecuta diariamente o varias veces al día.",
    strength: 80,
    sourceQuestions: ["frequency"],
    matches: (answers) =>
      ["daily-many", "daily"].includes(
        getString(answers, "frequency"),
      ),
  },

  {
    id: "v2-document-processing",
    type: "documents",
    title: "Procesamiento documental relevante",
    description:
      "El proceso utiliza documentos, formularios o correos como parte importante de su ejecución.",
    strength: 85,
    sourceQuestions: [
      "usesDocuments",
      "documentTypes",
    ],
    matches: (answers) =>
      getString(answers, "usesDocuments") === "yes",
  },

  {
    id: "v2-manual-data-extraction",
    type: "data-entry",
    title: "Extracción manual de información",
    description:
      "Las personas deben leer documentos y copiar información manualmente.",
    strength: 95,
    sourceQuestions: ["manualDataExtraction"],
    matches: (answers) =>
      ["yes", "sometimes"].includes(
        getString(
          answers,
          "manualDataExtraction",
        ),
      ),
  },

  {
    id: "v2-multiple-systems",
    type: "integration",
    title: "Múltiples sistemas involucrados",
    description:
      "El proceso requiere operar sobre más de una aplicación o plataforma.",
    strength: 80,
    sourceQuestions: [
      "usesMultipleSystems",
      "systemsUsed",
    ],
    matches: (answers) =>
      getString(
        answers,
        "usesMultipleSystems",
      ) === "yes" &&
      getArray(
        answers,
        "systemsUsed",
      ).length >= 2,
  },

  {
    id: "v2-double-entry",
    type: "data-entry",
    title: "Doble digitación",
    description:
      "La misma información debe registrarse manualmente en más de un sistema.",
    strength: 95,
    sourceQuestions: ["doubleEntry"],
    matches: (answers) =>
      getString(
        answers,
        "doubleEntry",
      ) === "frequent",
  },

  {
    id: "v2-rules-defined",
    type: "rules",
    title: "Reglas de decisión estructuradas",
    description:
      "La mayoría de las decisiones del proceso sigue reglas conocidas.",
    strength: 90,
    sourceQuestions: ["rulesKnown"],
    matches: (answers) =>
      ["all", "most"].includes(
        getString(answers, "rulesKnown"),
      ),
  },

  {
    id: "v2-human-approval",
    type: "approvals",
    title: "Aprobación humana requerida",
    description:
      "El proceso contiene etapas que requieren aprobación de una persona.",
    strength: 70,
    sourceQuestions: ["requiresApproval"],
    matches: (answers) =>
      ["yes", "sometimes"].includes(
        getString(
          answers,
          "requiresApproval",
        ),
      ),
  },

  {
    id: "v2-process-exceptions",
    type: "exceptions",
    title: "Excepciones operacionales",
    description:
      "Existen situaciones que requieren criterio humano o tratamiento especial.",
    strength: 70,
    sourceQuestions: ["exceptionsLevel"],
    matches: (answers) =>
      ["medium", "high"].includes(
        getString(
          answers,
          "exceptionsLevel",
        ),
      ),
  },

  {
    id: "v2-rework",
    type: "errors",
    title: "Errores o retrabajos frecuentes",
    description:
      "La operación presenta errores o reprocesos de manera recurrente.",
    strength: 90,
    sourceQuestions: ["reworkLevel"],
    matches: (answers) =>
      ["frequent", "constant"].includes(
        getString(
          answers,
          "reworkLevel",
        ),
      ),
  },

  {
    id: "v2-multiple-people",
    type: "people",
    title: "Participación de múltiples personas",
    description:
      "El proceso requiere coordinación o intervención de varias personas.",
    strength: 70,
    sourceQuestions: ["peopleInvolved"],
    matches: (answers) =>
      (getNumber(
        answers,
        "peopleInvolved",
      ) ?? 0) >= 2,
  },

  {
    id: "v2-time-intensive",
    type: "time",
    title: "Consumo operacional relevante",
    description:
      "La combinación de volumen y tiempo por ejecución genera una carga operacional significativa.",
    strength: 85,
    sourceQuestions: [
      "executionsPerMonth",
      "minutesPerExecution",
    ],
    matches: (answers) => {
      const executions =
        getNumber(
          answers,
          "executionsPerMonth",
        ) ?? 0;

      const minutes =
        getNumber(
          answers,
          "minutesPerExecution",
        ) ?? 0;

      return executions * minutes >= 3000;
    },
  },
];

export function generateV2Evidence(
  answers: AssessmentV2Answers,
): AssessmentEvidence[] {
  return rules
    .filter((rule) =>
      rule.matches(answers),
    )
    .map((rule) => ({
      id: rule.id,
      type: rule.type,
      title: rule.title,
      description: rule.description,
      strength: rule.strength,
      sourceQuestions:
        rule.sourceQuestions,
    }));
}