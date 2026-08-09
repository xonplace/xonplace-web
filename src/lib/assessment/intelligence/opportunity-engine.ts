import type {
  AssessmentEvidence,
  AutomationOpportunity,
  OpportunityType,
} from "./types";

type OpportunityRule = {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;

  requiredEvidence: AssessmentEvidence["type"][];
  supportingEvidence?: AssessmentEvidence["type"][];

  automationPotential: number;
  baseImpactScore: number;
  baseComplexityScore: number;

  currentProcess: string;
  proposedProcess: string;

  recommendedTechnologies: string[];
  recommendedAgents: string[];

  assumptions: string[];
};

const opportunityRules: OpportunityRule[] = [
  {
    id: "workflow-automation",
    title: "Automatización de procesos repetitivos",
    description:
      "Existe potencial para transformar actividades manuales y repetitivas en flujos automatizados con reglas de negocio y gestión de excepciones.",

    type: "workflow",

    requiredEvidence: ["manual-work", "rules"],

    supportingEvidence: ["errors", "integration"],

    automationPotential: 80,
    baseImpactScore: 85,
    baseComplexityScore: 55,

    currentProcess:
      "Las actividades se ejecutan manualmente siguiendo reglas conocidas y requieren intervención humana recurrente.",

    proposedProcess:
      "Un workflow recibe la información, aplica reglas de negocio, ejecuta acciones automáticamente y deriva excepciones para revisión humana.",

    recommendedTechnologies: [
      "Workflow",
      "Reglas de negocio",
      "API",
      "Notificaciones",
    ],

    recommendedAgents: ["Workflow Supervisor Agent"],

    assumptions: [
      "Las reglas pueden documentarse y mantenerse.",
      "Las principales excepciones pueden identificarse.",
      "Los sistemas involucrados permiten algún mecanismo de integración.",
    ],
  },

  {
    id: "document-intelligence",
    title: "Automatización del procesamiento documental",
    description:
      "La dependencia de documentos y trabajo manual sugiere una oportunidad para clasificar, interpretar y registrar información automáticamente.",

    type: "document-intelligence",

    requiredEvidence: ["documents", "manual-work"],

    supportingEvidence: ["errors", "integration"],

    automationPotential: 85,
    baseImpactScore: 88,
    baseComplexityScore: 60,

    currentProcess:
      "Personas reciben documentos, revisan su contenido, extraen información y posteriormente realizan acciones o registros manuales.",

    proposedProcess:
      "Un agente documental recibe los archivos, clasifica su contenido, extrae los datos relevantes y envía información estructurada al workflow o sistema correspondiente.",

    recommendedTechnologies: [
      "Document AI",
      "OCR",
      "LLM",
      "Workflow",
      "API",
    ],

    recommendedAgents: ["Document Intelligence Agent"],

    assumptions: [
      "Los documentos presentan patrones identificables.",
      "La información requerida puede definirse previamente.",
      "Los casos de baja confianza pueden enviarse a revisión humana.",
    ],
  },

  {
    id: "system-integration",
    title: "Integración de sistemas y eliminación de doble digitación",
    description:
      "La baja integración entre sistemas puede estar generando transferencia manual de información, reprocesos y pérdida de trazabilidad.",

    type: "integration",

    requiredEvidence: ["integration"],

    supportingEvidence: ["manual-work", "errors"],

    automationPotential: 75,
    baseImpactScore: 82,
    baseComplexityScore: 75,

    currentProcess:
      "La información se mueve manualmente entre aplicaciones, planillas, correo u otros sistemas.",

    proposedProcess:
      "Una capa de integración sincroniza información entre sistemas y activa automáticamente los procesos relacionados.",

    recommendedTechnologies: [
      "API",
      "Webhooks",
      "ETL",
      "Integration Platform",
    ],

    recommendedAgents: ["Integration Orchestrator"],

    assumptions: [
      "Debe validarse la disponibilidad de APIs o mecanismos de integración.",
      "Los sistemas involucrados deben identificarse durante el discovery.",
    ],
  },

  {
    id: "quality-and-rework",
    title: "Reducción automática de errores y retrabajos",
    description:
      "La frecuencia de errores o correcciones indica una oportunidad para incorporar validaciones automáticas y controles preventivos.",

    type: "data-quality",

    requiredEvidence: ["errors"],

    supportingEvidence: ["manual-work", "documents", "rules"],

    automationPotential: 65,
    baseImpactScore: 78,
    baseComplexityScore: 45,

    currentProcess:
      "Los errores son detectados durante o después de la ejecución y requieren correcciones manuales.",

    proposedProcess:
      "Validaciones automáticas controlan calidad, consistencia y reglas antes de continuar con el proceso.",

    recommendedTechnologies: [
      "Validation Engine",
      "Reglas de negocio",
      "Data Quality",
      "Workflow",
    ],

    recommendedAgents: ["Data Quality Agent"],

    assumptions: [
      "Los errores más frecuentes pueden categorizarse.",
      "Existen reglas que permiten validar los datos.",
    ],
  },
];

function getEvidenceByType(
  evidence: AssessmentEvidence[],
  type: AssessmentEvidence["type"],
) {
  return evidence.filter((item) => item.type === type);
}

function hasEvidence(
  evidence: AssessmentEvidence[],
  type: AssessmentEvidence["type"],
) {
  return getEvidenceByType(evidence, type).length > 0;
}

function calculateConfidence(
  rule: OpportunityRule,
  evidence: AssessmentEvidence[],
): number {
  const required = rule.requiredEvidence.flatMap((type) =>
    getEvidenceByType(evidence, type),
  );

  const supporting = (rule.supportingEvidence ?? []).flatMap((type) =>
    getEvidenceByType(evidence, type),
  );

  const requiredAverage =
    required.length > 0
      ? required.reduce(
          (total, item) => total + item.strength,
          0,
        ) / required.length
      : 0;

  const supportingAverage =
    supporting.length > 0
      ? supporting.reduce(
          (total, item) => total + item.strength,
          0,
        ) / supporting.length
      : 0;

  const supportingCoverageBonus = Math.min(
    10,
    supporting.length * 3,
  );

  const confidence =
    requiredAverage * 0.75 +
    supportingAverage * 0.15 +
    supportingCoverageBonus;

  return Math.min(
    95,
    Math.round(confidence),
  );
}

function calculateImpact(
  rule: OpportunityRule,
  evidence: AssessmentEvidence[],
): number {
  const supportingMatches = (
    rule.supportingEvidence ?? []
  ).filter((type) => hasEvidence(evidence, type)).length;

  return Math.min(
    100,
    rule.baseImpactScore + supportingMatches * 4,
  );
}

export function generateOpportunities(
  evidence: AssessmentEvidence[],
): AutomationOpportunity[] {
  return opportunityRules
    .filter((rule) =>
      rule.requiredEvidence.every((type) =>
        hasEvidence(evidence, type),
      ),
    )
    .map((rule) => {
      const matchedEvidence = evidence.filter(
        (item) =>
          rule.requiredEvidence.includes(item.type) ||
          rule.supportingEvidence?.includes(item.type),
      );

      return {
        id: rule.id,

        title: rule.title,

        description: rule.description,

        type: rule.type,

        evidence: matchedEvidence.map(
          (item) => item.id,
        ),

        currentProcess: rule.currentProcess,

        proposedProcess: rule.proposedProcess,

        automationPotential:
          rule.automationPotential,

        impactScore: calculateImpact(
          rule,
          evidence,
        ),

        complexityScore:
          rule.baseComplexityScore,

        confidenceScore:
          calculateConfidence(rule, evidence),

        recommendedTechnologies:
          rule.recommendedTechnologies,

        recommendedAgents:
          rule.recommendedAgents,

        assumptions: rule.assumptions,
      };
    })
    .sort(
      (a, b) =>
        b.impactScore * b.confidenceScore -
        a.impactScore * a.confidenceScore,
    );
}