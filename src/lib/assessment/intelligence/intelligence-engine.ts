import {
  calculateEconomicProjection,
} from "./economic-engine";

import {
  generateEvidence,
  type AssessmentAnswers,
} from "./evidence-engine";

import {
  generateOpportunities,
} from "./opportunity-engine";

import {
  calculateIntelligenceScores,
} from "./score-engine";

import {
  contextualizeOpportunities,
} from "./context-engine";

import {
  explainIntelligenceScores,
} from "./explainability-engine";

import type {
  AssessmentEvidence,
  IntelligenceResult,
  IntelligenceScores,
  ProcessProfile,
} from "./types";

const SCORING_VERSION =
  "2.1";

export type IntelligenceEngineInput = {
  answers:
    AssessmentAnswers;

  processes?:
    ProcessProfile[];

  additionalEvidence?:
    AssessmentEvidence[];

  hourlyCostCLP?:
    number;

  estimatedImplementationCLP?:
    number;

  /*
   * Assessment V2 puede entregar sus
   * propios scores calculados directamente
   * desde las respuestas estructuradas.
   *
   * V1 continúa usando el Score Engine
   * original.
   */
  scoresOverride?:
    IntelligenceScores;
};

function mergeEvidence(
  baseEvidence:
    AssessmentEvidence[],
  additionalEvidence:
    AssessmentEvidence[],
): AssessmentEvidence[] {
  const evidenceMap =
    new Map<
      string,
      AssessmentEvidence
    >();

  for (const evidence of [
    ...baseEvidence,
    ...additionalEvidence,
  ]) {
    evidenceMap.set(
      evidence.id,
      evidence,
    );
  }

  return Array.from(
    evidenceMap.values(),
  );
}

export function generateIntelligenceResult({
  answers,
  processes = [],
  additionalEvidence = [],
  hourlyCostCLP,
  estimatedImplementationCLP,
  scoresOverride,
}: IntelligenceEngineInput): IntelligenceResult {
  /*
   * Evidencia legacy.
   *
   * Se mantiene para compatibilidad con
   * Assessment V1 y para complementar el
   * diagnóstico V2.
   */
  const legacyEvidence =
    generateEvidence(
      answers,
    );

  /*
   * Fusionamos evidencia sin duplicar IDs.
   */
  const evidence =
    mergeEvidence(
      legacyEvidence,
      additionalEvidence,
    );

  /*
   * Scoring original.
   */
  const calculatedScores =
    calculateIntelligenceScores(
      evidence,
    );

  /*
   * V1:
   * calculatedScores
   *
   * V2:
   * scoresOverride calculados mediante
   * calculateV2IntelligenceScores().
   */
  const scores =
    scoresOverride ??
    calculatedScores;

  /*
   * NUEVO:
   *
   * Construimos una explicación determinística
   * utilizando exactamente los mismos scores
   * y evidencia del diagnóstico.
   *
   * No utilizamos LLM.
   * No inventamos factores.
   */
  const explanations =
    explainIntelligenceScores(
      scores,
      evidence,
    );

  /*
   * Detectamos oportunidades genéricas
   * desde la evidencia.
   */
  const genericOpportunities =
    generateOpportunities(
      evidence,
    );

  /*
   * Contextualizamos las oportunidades
   * según los procesos evaluados.
   */
  const opportunities =
    contextualizeOpportunities({
      opportunities:
        genericOpportunities,

      processes,
    });

  /*
   * Caso económico.
   *
   * Permanecerá parcial cuando falten
   * datos operacionales o financieros.
   */
  const economics =
    calculateEconomicProjection({
      processes,
      opportunities,
      hourlyCostCLP,
      estimatedImplementationCLP,
    });

  const warnings:
    string[] = [];

  /*
   * Evidencia insuficiente.
   */
  if (
    evidence.length < 3
  ) {
    warnings.push(
      "La evidencia disponible todavía es limitada. Se recomienda ampliar el Assessment antes de tomar decisiones de inversión.",
    );
  }

  /*
   * Confianza insuficiente.
   */
  if (
    scores.confidence <
    60
  ) {
    warnings.push(
      "El nivel de confianza del diagnóstico es bajo o medio debido a información insuficiente.",
    );
  }

  /*
   * Cobertura insuficiente.
   */
 if (
  explanations.confidence
    .signalCoverage <
  50
) {
  warnings.push(
    "La cobertura de señales observadas es parcial. Se recomienda validar información adicional durante Discovery antes de tomar decisiones de inversión.",
  );
}

  /*
   * Ninguna oportunidad detectada.
   */
  if (
    opportunities.length ===
    0
  ) {
    warnings.push(
      "No existen suficientes señales para generar oportunidades de automatización con confianza.",
    );
  }

  /*
   * Horas recuperables pendientes.
   */
  if (
    economics
      .recoverableHoursPerMonth ===
    undefined
  ) {
    warnings.push(
      "Las horas recuperables no pueden calcularse todavía porque faltan datos operacionales de volumen, tiempo o porcentaje manual.",
    );
  }

  /*
   * Ahorro económico pendiente.
   */
  if (
    economics
      .monthlySavingsCLP ===
    undefined
  ) {
    warnings.push(
      "El ahorro económico permanecerá pendiente hasta contar con un costo hora validado.",
    );
  }

  /*
   * ROI pendiente.
   */
  if (
    economics
      .roiPercentage ===
    undefined
  ) {
    warnings.push(
      "El ROI no se calcula hasta contar con una estimación de inversión y ahorro económico validado.",
    );
  }

  return {
    scoringVersion:
    SCORING_VERSION,
    
    scores,

    evidence,

    explanations,

    opportunities,

    economics,

    warnings,
  };
}