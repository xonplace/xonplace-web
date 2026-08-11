import type {
  AgentRecommendation,
  BlueprintReportData,
  DimensionScores,
  Recommendation,
} from "@/components/assessment/blueprint";

import type {
  AssessmentEvidence,
  AutomationOpportunity,
  IntelligenceResult,
  ProcessProfile,
} from "@/lib/assessment/intelligence";

import type {
  AssessmentV2Answers,
} from "./adapter";

import {
  calculateMaturityDimensions,
} from "./maturity-engine";

type BuildBlueprintV2Input = {
  id?: string;
  answers: AssessmentV2Answers;
  process: ProcessProfile;
  intelligence: IntelligenceResult;
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

function clamp(value: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function getEvidenceStrength(
  evidence: AssessmentEvidence[],
  type: AssessmentEvidence["type"],
): number {
  const matches = evidence.filter(
    (item) => item.type === type,
  );

  if (matches.length === 0) {
    return 0;
  }

  return Math.max(
    ...matches.map(
      (item) => item.strength,
    ),
  );
}

/*
 * IMPORTANTE:
 *
 * Esta función corresponde al modelo anterior
 * de dimensiones basado principalmente en
 * evidencias del Intelligence Engine.
 *
 * Por ahora la conservamos para compatibilidad
 * y comparación durante la transición al
 * Maturity Engine V2.
 *
 * buildBlueprintV2() ya NO utiliza esta función.
 */
function calculateDimensions(
  intelligence: IntelligenceResult,
): DimensionScores {
  const evidence =
    intelligence.evidence;

  const rules =
    getEvidenceStrength(
      evidence,
      "rules",
    );

  const errors =
    getEvidenceStrength(
      evidence,
      "errors",
    );

  const integrationGap =
    getEvidenceStrength(
      evidence,
      "integration",
    );

  const documents =
    getEvidenceStrength(
      evidence,
      "documents",
    );

  const dataEntry =
    getEvidenceStrength(
      evidence,
      "data-entry",
    );

  const exceptions =
    getEvidenceStrength(
      evidence,
      "exceptions",
    );

  const approvals =
    getEvidenceStrength(
      evidence,
      "approvals",
    );

  const procesos = clamp(
    rules * 0.45 +
      (100 - errors) * 0.25 +
      intelligence.scores.readiness *
        0.3,
  );

  const informacion = clamp(
    documents > 0
      ? documents * 0.45 +
          (100 - dataEntry) * 0.25 +
          intelligence.scores.confidence *
            0.3
      : intelligence.scores.confidence *
          0.7,
  );

  const integracion = clamp(
    100 - integrationGap,
  );

  const automatizacion = clamp(
    intelligence.scores.opportunity *
      0.55 +
      intelligence.scores.readiness *
        0.45,
  );

  const ia = clamp(
    intelligence.scores.readiness *
      0.45 +
      intelligence.scores.confidence *
        0.35 +
      (100 - exceptions) * 0.1 +
      (100 - approvals) * 0.1,
  );

  return {
    procesos,
    informacion,
    integracion,
    automatizacion,
    ia,
  };
}

function getImpactLabel(
  score: number,
): Recommendation["impact"] {
  if (score >= 80) {
    return "Alto";
  }

  if (score >= 60) {
    return "Medio";
  }

  return "Bajo";
}

function getComplexityLabel(
  score: number,
): Recommendation["complexity"] {
  if (score >= 70) {
    return "Alta";
  }

  if (score >= 45) {
    return "Media";
  }

  return "Baja";
}

function getPriority(
  opportunity: AutomationOpportunity,
): Recommendation["priority"] {
  if (
    opportunity.impactScore >= 80 &&
    opportunity.confidenceScore >= 75
  ) {
    return "Alta";
  }

  if (
    opportunity.impactScore >= 60 &&
    opportunity.confidenceScore >= 60
  ) {
    return "Media";
  }

  return "Baja";
}

function getCategory(
  opportunity: AutomationOpportunity,
): Recommendation["category"] {
  if (
    opportunity.type === "integration"
  ) {
    return "Integración";
  }

  if (
    opportunity.type ===
      "document-intelligence" ||
    opportunity.type === "ai-agent"
  ) {
    return "Agente";
  }

  return "Proceso";
}

function estimateWeeks(
  complexityScore: number,
): number {
  if (complexityScore >= 80) {
    return 12;
  }

  if (complexityScore >= 70) {
    return 10;
  }

  if (complexityScore >= 60) {
    return 8;
  }

  if (complexityScore >= 45) {
    return 6;
  }

  return 4;
}

function mapRecommendations(
  opportunities: AutomationOpportunity[],
): Recommendation[] {
  return opportunities.map(
    (opportunity) => ({
      title:
        opportunity.title,

      description:
        opportunity.description,

      priority:
        getPriority(opportunity),

      category:
        getCategory(opportunity),

      impact:
        getImpactLabel(
          opportunity.impactScore,
        ),

      complexity:
        getComplexityLabel(
          opportunity.complexityScore,
        ),

      estimatedWeeks:
        estimateWeeks(
          opportunity.complexityScore,
        ),

      technologies:
        opportunity.recommendedTechnologies,

      confidenceScore:
        opportunity.confidenceScore,

      automationPotential:
        opportunity.automationPotential,

      currentProcess:
        opportunity.currentProcess,

      proposedProcess:
        opportunity.proposedProcess,

      evidence:
        opportunity.evidence,

      assumptions:
        opportunity.assumptions,
    }),
  );
}

function getAgentPurpose(
  name: string,
  opportunity: AutomationOpportunity,
): string {
  if (
    name ===
    "Document Intelligence Agent"
  ) {
    return (
      `Procesar documentos e información asociados al proceso ` +
      `"${opportunity.title}", extrayendo y validando datos antes ` +
      "de continuar el workflow."
    );
  }

  if (
    name ===
    "Workflow Supervisor Agent"
  ) {
    return (
      "Supervisar la ejecución del workflow, detectar excepciones " +
      "y escalar únicamente los casos que requieren intervención humana."
    );
  }

  if (
    name ===
    "Integration Orchestrator"
  ) {
    return (
      "Coordinar el intercambio de información entre los sistemas " +
      "involucrados y reducir transferencias manuales o doble digitación."
    );
  }

  if (
    name === "Data Quality Agent"
  ) {
    return (
      "Validar consistencia, obligatoriedad y reglas de negocio " +
      "para prevenir errores y reducir retrabajos."
    );
  }

  return `Apoyar la automatización de ${opportunity.title}.`;
}

function mapAgents(
  opportunities: AutomationOpportunity[],
): AgentRecommendation[] {
  const agentMap =
    new Map<
      string,
      AgentRecommendation
    >();

  for (const opportunity of opportunities) {
    for (
      const agentName of
      opportunity.recommendedAgents
    ) {
      const existing =
        agentMap.get(agentName);

      const fitScore =
        opportunity.confidenceScore;

      const candidate: AgentRecommendation =
        {
          name: agentName,

          purpose:
            getAgentPurpose(
              agentName,
              opportunity,
            ),

          fitScore,

          priority:
            fitScore >= 80
              ? "Alta"
              : "Media",
        };

      if (
        !existing ||
        candidate.fitScore >
          existing.fitScore
      ) {
        agentMap.set(
          agentName,
          candidate,
        );
      }
    }
  }

  return Array.from(
    agentMap.values(),
  ).sort(
    (a, b) =>
      b.fitScore - a.fitScore,
  );
}

function buildStrengths(
  evidence: AssessmentEvidence[],
): string[] {
  const strengths: string[] = [];

  const rules =
    getEvidenceStrength(
      evidence,
      "rules",
    );

  const volume =
    getEvidenceStrength(
      evidence,
      "volume",
    );

  const documents =
    getEvidenceStrength(
      evidence,
      "documents",
    );

  if (rules >= 70) {
    strengths.push(
      "El proceso posee reglas de negocio suficientemente estructuradas para automatizar una parte relevante de su ejecución.",
    );
  }

  if (volume >= 70) {
    strengths.push(
      "Existe un volumen operacional suficiente para justificar el análisis de automatización y generar impacto medible.",
    );
  }

  if (documents >= 70) {
    strengths.push(
      "La operación presenta información y documentos con patrones que pueden ser procesados mediante automatización e Inteligencia Artificial.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "Existe información suficiente para continuar con una etapa estructurada de descubrimiento y validación del proceso.",
    );
  }

  return strengths;
}

function buildRisks(
  evidence: AssessmentEvidence[],
  warnings: string[],
): string[] {
  const risks: string[] = [];

  const integration =
    getEvidenceStrength(
      evidence,
      "integration",
    );

  const errors =
    getEvidenceStrength(
      evidence,
      "errors",
    );

  const exceptions =
    getEvidenceStrength(
      evidence,
      "exceptions",
    );

  const approvals =
    getEvidenceStrength(
      evidence,
      "approvals",
    );

  if (integration >= 70) {
    risks.push(
      "La baja integración entre sistemas puede aumentar la complejidad técnica de la implementación.",
    );
  }

  if (errors >= 70) {
    risks.push(
      "La frecuencia de errores y retrabajos requiere identificar sus causas antes de automatizar completamente el proceso.",
    );
  }

  if (exceptions >= 60) {
    risks.push(
      "Existen excepciones que deberán mantenerse bajo supervisión humana durante las primeras etapas de automatización.",
    );
  }

  if (approvals >= 60) {
    risks.push(
      "Las aprobaciones humanas deben incorporarse explícitamente al diseño del workflow objetivo.",
    );
  }

  if (warnings.length > 0) {
    risks.push(
      ...warnings.slice(0, 2),
    );
  }

  return risks;
}

function buildDiagnosis(
  process: ProcessProfile,
  intelligence: IntelligenceResult,
): string {
  const {
    readiness,
    opportunity,
    businessImpact,
    confidence,
  } = intelligence.scores;

  if (
    opportunity >= 80 &&
    readiness < 60
  ) {
    return (
      `El proceso "${process.name}" presenta una oportunidad de automatización muy alta (${opportunity}/100) ` +
      `y un impacto potencial relevante (${businessImpact}/100), pero su nivel de preparación actual (${readiness}/100) ` +
      "indica que antes de escalar será necesario fortalecer integraciones, reglas, datos o tratamiento de excepciones. " +
      `La confianza del diagnóstico es ${confidence}/100.`
    );
  }

  if (
    opportunity >= 80 &&
    readiness >= 60
  ) {
    return (
      `El proceso "${process.name}" presenta condiciones favorables para avanzar hacia automatización. ` +
      `La oportunidad detectada alcanza ${opportunity}/100, con readiness de ${readiness}/100 ` +
      `e impacto de negocio de ${businessImpact}/100. La confianza del diagnóstico es ${confidence}/100.`
    );
  }

  if (opportunity >= 60) {
    return (
      `El proceso "${process.name}" presenta oportunidades concretas de automatización, ` +
      "aunque se recomienda priorizar iniciativas selectivas y validar primero las variables operacionales críticas. " +
      `Opportunity Score: ${opportunity}/100. Confidence Score: ${confidence}/100.`
    );
  }

  return (
    `El proceso "${process.name}" todavía requiere mayor levantamiento y estandarización antes de justificar una automatización de mayor alcance. ` +
    `La oportunidad actual es ${opportunity}/100 y la confianza del diagnóstico es ${confidence}/100.`
  );
}

function buildLevel(
  intelligence: IntelligenceResult,
): string {
  const opportunity =
    intelligence.scores.opportunity;

  const readiness =
    intelligence.scores.readiness;

  if (
    opportunity >= 80 &&
    readiness >= 70
  ) {
    return "Alta preparación y alto potencial";
  }

  if (
    opportunity >= 80 &&
    readiness < 70
  ) {
    return "Alto potencial con brechas de preparación";
  }

  if (opportunity >= 60) {
    return "Potencial relevante";
  }

  return "Etapa de descubrimiento";
}

function buildRoadmap(
  intelligence: IntelligenceResult,
) {
  const firstOpportunity =
    intelligence.opportunities[0];

  return [
    {
      phase: "0–30 días",
      title:
        "Validación y discovery",
      description:
        "Validar flujo actual, responsables, volúmenes, reglas, excepciones, sistemas involucrados y métricas base.",
    },

    {
      phase: "30–60 días",
      title:
        "Diseño del piloto",
      description:
        firstOpportunity
          ? `Diseñar un piloto controlado para "${firstOpportunity.title}", incluyendo arquitectura, integraciones, KPIs y criterios de éxito.`
          : "Seleccionar y diseñar una primera iniciativa de automatización de alcance controlado.",
    },

    {
      phase: "60–90 días",
      title:
        "Implementación y medición",
      description:
        "Implementar el piloto, medir resultados contra la línea base y validar ahorro, calidad, tiempos y nivel de automatización.",
    },

    {
      phase: "90–180 días",
      title:
        "Escalamiento controlado",
      description:
        "Extender la automatización a nuevas etapas o procesos utilizando los resultados y aprendizajes del piloto.",
    },
  ];
}

export function buildBlueprintV2({
  id = "preview-v2",
  answers,
  process,
  intelligence,
}: BuildBlueprintV2Input): BlueprintReportData {
  const company =
    getString(
      answers,
      "company",
    ) || "Organización evaluada";

  const recommendations =
    mapRecommendations(
      intelligence.opportunities,
    );

  const agents =
    mapAgents(
      intelligence.opportunities,
    );

  const estimatedHoursPerMonth =
  intelligence.economics
    .recoverableHoursPerMonth;

  /*
   * NUEVO MOTOR DE MADUREZ V2
   *
   * A diferencia del modelo anterior,
   * estas cinco dimensiones se calculan
   * directamente desde las respuestas
   * estructuradas del Assessment V2.
   */
  const maturity =
    calculateMaturityDimensions(
      answers,
    );

  return {
    id,

    company,

    generatedAt:
      new Date().toISOString(),

    /*
     * Por compatibilidad con el Blueprint
     * existente mantenemos automationScore.
     *
     * Actualmente representa Opportunity Score.
     *
     * Más adelante podremos reemplazarlo por
     * un XONPLACE Automation Index propio.
     */
    automationScore:
      intelligence.scores.opportunity,

    level:
      buildLevel(intelligence),

    diagnosis:
      buildDiagnosis(
        process,
        intelligence,
      ),

    /*
     * Scores visibles en el radar.
     *
     * Desde ahora vienen del Maturity Engine V2.
     */
    dimensions: {
      procesos:
        maturity.procesos.score,

      informacion:
        maturity.informacion.score,

      integracion:
        maturity.integracion.score,

      automatizacion:
        maturity.automatizacion.score,

      ia:
        maturity.ia.score,
    },

    /*
     * Análisis completo y trazable.
     *
     * Incluye:
     * - score
     * - nivel
     * - rationale
     * - factores
     * - acciones recomendadas
     */
    maturityAnalysis:
      maturity,

    processAnalysis: {
      name:
        process.name,

      description:
        process.description,

      executionsPerMonth:
        process.executionsPerMonth,

      peopleInvolved:
        process.peopleInvolved,

      minutesPerExecution:
        process.minutesPerExecution,

      manualPercentage:
        process.manualPercentage,

      systems:
        process.systems,

      inputs:
        process.inputs,

      requiresApproval:
        process.requiresApproval,

      hasExceptions:
        process.hasExceptions,

      scores: {
        readiness:
          intelligence.scores
            .readiness,

        opportunity:
          intelligence.scores
            .opportunity,

        businessImpact:
          intelligence.scores
            .businessImpact,

        confidence:
          intelligence.scores
            .confidence,
      },

      currentHoursPerMonth:
        intelligence.economics
          .currentHoursPerMonth,

      recoverableHoursPerMonth:
        intelligence.economics
          .recoverableHoursPerMonth,
    },

    insights: {
      strengths:
        buildStrengths(
          intelligence.evidence,
        ),

      risks:
        buildRisks(
          intelligence.evidence,
          intelligence.warnings,
        ),

      recommendations,

      agents,

      estimatedHoursPerMonth,

      economicEstimate: {
        hourlyCostCLP:
          intelligence.economics
            .hourlyCostCLP,

        monthlySavingsCLP:
          intelligence.economics
            .monthlySavingsCLP,

        annualSavingsCLP:
          intelligence.economics
            .annualSavingsCLP,

        estimatedImplementationCLP:
          intelligence.economics
            .estimatedImplementationCLP,

        paybackMonths:
          intelligence.economics
            .paybackMonths,

        roiPercentage:
          intelligence.economics
            .roiPercentage,

        confidence:
          intelligence.economics
            .confidence,

        assumptions:
          intelligence.economics
            .assumptions,
      },

      roadmap:
        buildRoadmap(
          intelligence,
        ),
    },
  };
}

/*
 * Se mantiene exportable únicamente si
 * necesitamos comparar temporalmente el
 * cálculo antiguo con el nuevo.
 *
 * Puede eliminarse cuando terminemos la
 * validación del Maturity Engine V2.
 */
export {
  calculateDimensions,
};