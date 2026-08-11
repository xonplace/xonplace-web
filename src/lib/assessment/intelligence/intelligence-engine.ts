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

import type {
  AssessmentEvidence,
  IntelligenceResult,
  IntelligenceScores,
  ProcessProfile,
} from "./types";

export type IntelligenceEngineInput = {
  answers: AssessmentAnswers;

  processes?: ProcessProfile[];

  additionalEvidence?: AssessmentEvidence[];

  hourlyCostCLP?: number;

  estimatedImplementationCLP?: number;

  /*
   * Permite que Assessment V2 utilice
   * un modelo de scoring propio sin
   * romper el motor legacy.
   */
  scoresOverride?: IntelligenceScores;
};

function mergeEvidence(
  baseEvidence: AssessmentEvidence[],
  additionalEvidence: AssessmentEvidence[],
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
  const legacyEvidence =
    generateEvidence(
      answers,
    );

  const evidence =
    mergeEvidence(
      legacyEvidence,
      additionalEvidence,
    );

  const calculatedScores =
    calculateIntelligenceScores(
      evidence,
    );

  /*
   * V1 seguirá usando calculatedScores.
   *
   * V2 podrá entregar sus propios scores,
   * calculados directamente desde las
   * respuestas estructuradas.
   */
  const scores =
    scoresOverride ??
    calculatedScores;

  const genericOpportunities =
    generateOpportunities(
      evidence,
    );

  const opportunities =
    contextualizeOpportunities({
      opportunities:
        genericOpportunities,
      processes,
    });

  const economics =
    calculateEconomicProjection({
      processes,
      opportunities,
      hourlyCostCLP,
      estimatedImplementationCLP,
    });

  const warnings: string[] = [];

  if (evidence.length < 3) {
    warnings.push(
      "La evidencia disponible todavía es limitada. Se recomienda ampliar el Assessment antes de tomar decisiones de inversión.",
    );
  }

  if (scores.confidence < 60) {
    warnings.push(
      "El nivel de confianza del diagnóstico es bajo o medio debido a información insuficiente.",
    );
  }

  if (
    opportunities.length === 0
  ) {
    warnings.push(
      "No existen suficientes señales para generar oportunidades de automatización con confianza.",
    );
  }

  if (
    economics
      .recoverableHoursPerMonth ===
    undefined
  ) {
    warnings.push(
      "Las horas recuperables no pueden calcularse todavía porque faltan datos operacionales de volumen, tiempo o porcentaje manual.",
    );
  }

  if (
    economics.monthlySavingsCLP ===
    undefined
  ) {
    warnings.push(
      "El ahorro económico permanecerá pendiente hasta contar con un costo hora validado.",
    );
  }

  if (
    economics.roiPercentage ===
    undefined
  ) {
    warnings.push(
      "El ROI no se calcula hasta contar con una estimación de inversión y ahorro económico validado.",
    );
  }

  return {
    scores,
    evidence,
    opportunities,
    economics,
    warnings,
  };
}