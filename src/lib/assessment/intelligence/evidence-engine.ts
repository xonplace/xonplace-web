import type {
  AssessmentEvidence,
  EvidenceType,
} from "./types";

export type AssessmentAnswers = Record<string, string>;

type EvidenceRule = {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  strength: number;
  sourceQuestions: string[];
  matches: (answers: AssessmentAnswers) => boolean;
};

const evidenceRules: EvidenceRule[] = [
  {
    id: "high-manual-work",
    type: "manual-work",
    title: "Alta carga de trabajo manual",
    description:
      "La organización declara una presencia importante de tareas manuales y repetitivas.",
    strength: 90,
    sourceQuestions: ["manualWork"],
    matches: (answers) =>
      answers.manualWork === "high" ||
      answers.manualWork === "very-high",
  },
  {
    id: "moderate-manual-work",
    type: "manual-work",
    title: "Carga manual relevante",
    description:
      "Existe una cantidad moderada de actividades manuales que pueden ser candidatas a automatización.",
    strength: 65,
    sourceQuestions: ["manualWork"],
    matches: (answers) => answers.manualWork === "medium",
  },
  {
    id: "document-heavy-operation",
    type: "documents",
    title: "Alta dependencia de documentos y correos",
    description:
      "La operación depende significativamente de documentos, formularios, correos o archivos.",
    strength: 90,
    sourceQuestions: ["documents"],
    matches: (answers) =>
      answers.documents === "high" ||
      answers.documents === "very-high",
  },
  {
    id: "moderate-document-dependency",
    type: "documents",
    title: "Dependencia documental relevante",
    description:
      "Los documentos forman parte importante de la operación y podrían existir oportunidades de automatización.",
    strength: 65,
    sourceQuestions: ["documents"],
    matches: (answers) => answers.documents === "medium",
  },
  {
    id: "systems-disconnected",
    type: "integration",
    title: "Sistemas con baja integración",
    description:
      "La organización opera con sistemas desconectados o con pocas integraciones entre ellos.",
    strength: 95,
    sourceQuestions: ["systems"],
    matches: (answers) =>
      answers.systems === "disconnected" ||
      answers.systems === "few",
  },
  {
    id: "systems-partially-integrated",
    type: "integration",
    title: "Integración parcial entre sistemas",
    description:
      "Existen algunas integraciones, pero todavía hay movimiento manual de información entre sistemas.",
    strength: 70,
    sourceQuestions: ["systems"],
    matches: (answers) => answers.systems === "partial",
  },
  {
    id: "rules-defined",
    type: "rules",
    title: "Reglas de negocio conocidas",
    description:
      "Una parte importante de las decisiones repetitivas sigue reglas conocidas y estructurables.",
    strength: 90,
    sourceQuestions: ["rules"],
    matches: (answers) =>
      answers.rules === "most" ||
      answers.rules === "all",
  },
  {
    id: "rules-partially-defined",
    type: "rules",
    title: "Reglas parcialmente definidas",
    description:
      "Algunas decisiones repetitivas siguen reglas conocidas, aunque todavía existen excepciones.",
    strength: 60,
    sourceQuestions: ["rules"],
    matches: (answers) => answers.rules === "some",
  },
  {
    id: "high-rework",
    type: "errors",
    title: "Alta frecuencia de errores o retrabajo",
    description:
      "La operación presenta errores, correcciones o reprocesos con una frecuencia elevada.",
    strength: 90,
    sourceQuestions: ["errors"],
    matches: (answers) =>
      answers.errors === "frequent" ||
      answers.errors === "constant",
  },
  {
    id: "moderate-rework",
    type: "errors",
    title: "Retrabajo ocasional",
    description:
      "Existen errores o correcciones suficientemente frecuentes como para justificar análisis adicional.",
    strength: 60,
    sourceQuestions: ["errors"],
    matches: (answers) => answers.errors === "sometimes",
  },
];

export function generateEvidence(
  answers: AssessmentAnswers,
): AssessmentEvidence[] {
  return evidenceRules
    .filter((rule) => rule.matches(answers))
    .map((rule) => ({
      id: rule.id,
      type: rule.type,
      title: rule.title,
      description: rule.description,
      strength: rule.strength,
      sourceQuestions: rule.sourceQuestions,
    }));
}