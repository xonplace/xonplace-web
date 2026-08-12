import type {
  AssessmentEvidence,
  EvidenceType,
  IntelligenceScores,
} from "./types";

export type ScoreExplanationFactor = {
  id: string;
  evidenceType: EvidenceType;
  title: string;
  description: string;
  strength: number;
  effect: "positive" | "negative" | "neutral";
};

export type ScoreExplanation = {
  score: number;

  level:
    | "Bajo"
    | "Medio"
    | "Alto"
    | "Muy alto";

  summary: string;

  positiveFactors:
    ScoreExplanationFactor[];

  negativeFactors:
    ScoreExplanationFactor[];

  /*
   * Importante:
   *
   * Esto NO significa preguntas faltantes.
   * Representa únicamente los tipos de
   * evidencia que efectivamente fueron
   * observados/disparados por el motor.
   */
  observedEvidenceTypes:
    EvidenceType[];

  /*
   * Cobertura de señales observadas respecto
   * del universo de señales del modelo.
   *
   * NO debe interpretarse como porcentaje
   * de completitud del Assessment.
   */
  signalCoverage: number;
};

export type IntelligenceExplanations = {
  readiness: ScoreExplanation;
  opportunity: ScoreExplanation;
  businessImpact: ScoreExplanation;
  confidence: ScoreExplanation;
};

const expectedEvidenceTypes:
  EvidenceType[] = [
    "manual-work",
    "documents",
    "data-entry",
    "integration",
    "rules",
    "errors",
    "volume",
    "time",
    "people",
    "approvals",
    "exceptions",
  ];

function getLevel(
  score: number,
): ScoreExplanation["level"] {
  if (score >= 80) {
    return "Muy alto";
  }

  if (score >= 60) {
    return "Alto";
  }

  if (score >= 40) {
    return "Medio";
  }

  return "Bajo";
}

function getObservedEvidenceTypes(
  evidence: AssessmentEvidence[],
): EvidenceType[] {
  return Array.from(
    new Set(
      evidence.map(
        (item) => item.type,
      ),
    ),
  );
}

function getSignalCoverage(
  evidence: AssessmentEvidence[],
): number {
  const observed =
    getObservedEvidenceTypes(
      evidence,
    );

  return Math.round(
    (observed.length /
      expectedEvidenceTypes.length) *
      100,
  );
}

function toFactor(
  evidence: AssessmentEvidence,
  effect:
    ScoreExplanationFactor["effect"],
): ScoreExplanationFactor {
  return {
    id: evidence.id,

    evidenceType:
      evidence.type,

    title:
      evidence.title,

    description:
      evidence.description,

    strength:
      evidence.strength,

    effect,
  };
}

function sortFactors(
  factors:
    ScoreExplanationFactor[],
): ScoreExplanationFactor[] {
  return [...factors].sort(
    (a, b) =>
      b.strength - a.strength,
  );
}

function buildReadinessExplanation(
  score: number,
  evidence:
    AssessmentEvidence[],
): ScoreExplanation {
  const positiveTypes:
    EvidenceType[] = [
      "rules",
    ];

  const negativeTypes:
    EvidenceType[] = [
      "integration",
      "errors",
      "exceptions",
      "approvals",
    ];

  const positiveFactors =
    sortFactors(
      evidence
        .filter((item) =>
          positiveTypes.includes(
            item.type,
          ),
        )
        .map((item) =>
          toFactor(
            item,
            "positive",
          ),
        ),
    );

  const negativeFactors =
    sortFactors(
      evidence
        .filter((item) =>
          negativeTypes.includes(
            item.type,
          ),
        )
        .map((item) =>
          toFactor(
            item,
            "negative",
          ),
        ),
    );

  let summary: string;

  if (score >= 80) {
    summary =
      "El proceso presenta condiciones favorables para avanzar hacia automatización, con una base operacional relativamente preparada.";
  } else if (score >= 60) {
    summary =
      "El proceso presenta una preparación razonable para automatización, aunque todavía existen brechas que deben gestionarse antes de escalar.";
  } else if (score >= 40) {
    summary =
      "La preparación actual es intermedia. Existen condiciones aprovechables, pero será necesario resolver brechas operacionales o tecnológicas.";
  } else {
    summary =
      "El proceso requiere mayor estandarización, integración o control operacional antes de abordar una automatización de mayor alcance.";
  }

  return {
    score,
    level:
      getLevel(score),

    summary,

    positiveFactors,

    negativeFactors,

    observedEvidenceTypes:
      getObservedEvidenceTypes(
        evidence,
      ),

    signalCoverage:
      getSignalCoverage(
        evidence,
      ),
  };
}

function buildOpportunityExplanation(
  score: number,
  evidence:
    AssessmentEvidence[],
): ScoreExplanation {
  /*
   * Estas señales incrementan Opportunity.
   *
   * Importante:
   * "positive" significa que aumentan la
   * oportunidad detectada; no significa
   * necesariamente que sean fortalezas.
   *
   * Ejemplo:
   * sistemas desconectados aumentan
   * Opportunity porque existe espacio
   * para mejorar.
   */
  const opportunityTypes:
    EvidenceType[] = [
      "manual-work",
      "data-entry",
      "documents",
      "integration",
      "volume",
      "rules",
      "errors",
    ];

  const positiveFactors =
    sortFactors(
      evidence
        .filter((item) =>
          opportunityTypes.includes(
            item.type,
          ),
        )
        .map((item) =>
          toFactor(
            item,
            "positive",
          ),
        ),
    );

  let summary: string;

  if (score >= 80) {
    summary =
      "Existe una oportunidad muy alta de automatización debido a la combinación de carga manual, volumen, reglas, documentos, errores o brechas de integración detectadas.";
  } else if (score >= 60) {
    summary =
      "El proceso presenta oportunidades claras de automatización y merece ser considerado dentro del portafolio prioritario.";
  } else if (score >= 40) {
    summary =
      "Existe potencial de automatización, aunque la evidencia disponible sugiere comenzar por iniciativas selectivas.";
  } else {
    summary =
      "Las señales actuales no muestran todavía una oportunidad suficientemente fuerte para justificar una automatización prioritaria.";
  }

  return {
    score,

    level:
      getLevel(score),

    summary,

    positiveFactors,

    negativeFactors: [],

    observedEvidenceTypes:
      getObservedEvidenceTypes(
        evidence,
      ),

    signalCoverage:
      getSignalCoverage(
        evidence,
      ),
  };
}

function buildBusinessImpactExplanation(
  score: number,
  evidence:
    AssessmentEvidence[],
): ScoreExplanation {
  const impactTypes:
    EvidenceType[] = [
      "volume",
      "time",
      "people",
      "errors",
      "manual-work",
      "data-entry",
    ];

  const positiveFactors =
    sortFactors(
      evidence
        .filter((item) =>
          impactTypes.includes(
            item.type,
          ),
        )
        .map((item) =>
          toFactor(
            item,
            "positive",
          ),
        ),
    );

  let summary: string;

  if (score >= 80) {
    summary =
      "La automatización podría generar un impacto operacional muy relevante por la carga, volumen, tiempo, personas o retrabajo involucrados.";
  } else if (score >= 60) {
    summary =
      "El proceso presenta un impacto potencial relevante y justifica una evaluación detallada de beneficios.";
  } else if (score >= 40) {
    summary =
      "El impacto potencial es moderado y debe contrastarse con esfuerzo, complejidad e inversión.";
  } else {
    summary =
      "Las señales actuales no demuestran todavía un impacto operacional suficientemente alto para priorizar la iniciativa por este criterio.";
  }

  return {
    score,

    level:
      getLevel(score),

    summary,

    positiveFactors,

    negativeFactors: [],

    observedEvidenceTypes:
      getObservedEvidenceTypes(
        evidence,
      ),

    signalCoverage:
      getSignalCoverage(
        evidence,
      ),
  };
}

function buildConfidenceExplanation(
  score: number,
  evidence:
    AssessmentEvidence[],
): ScoreExplanation {
  /*
   * Para Confidence las evidencias no se
   * interpretan como fortalezas del proceso.
   *
   * Son señales consideradas por el
   * diagnóstico.
   */
  const positiveFactors =
    sortFactors(
      evidence.map((item) =>
        toFactor(
          item,
          "neutral",
        ),
      ),
    );

  let summary: string;

  if (score >= 80) {
    summary =
      "El diagnóstico cuenta con información suficiente para sustentar sus principales conclusiones, aunque debe validarse durante Discovery antes de tomar decisiones de inversión.";
  } else if (score >= 60) {
    summary =
      "El diagnóstico permite orientar decisiones preliminares, pero algunas variables deberían validarse durante Discovery.";
  } else if (score >= 40) {
    summary =
      "La confianza del diagnóstico es intermedia. Se recomienda completar y validar información antes de tomar decisiones de inversión.";
  } else {
    summary =
      "La información disponible todavía es limitada y el resultado debe considerarse exploratorio hasta completar el levantamiento.";
  }

  return {
    score,

    level:
      getLevel(score),

    summary,

    positiveFactors,

    negativeFactors: [],

    observedEvidenceTypes:
      getObservedEvidenceTypes(
        evidence,
      ),

    signalCoverage:
      getSignalCoverage(
        evidence,
      ),
  };
}

export function explainIntelligenceScores(
  scores:
    IntelligenceScores,
  evidence:
    AssessmentEvidence[],
): IntelligenceExplanations {
  return {
    readiness:
      buildReadinessExplanation(
        scores.readiness,
        evidence,
      ),

    opportunity:
      buildOpportunityExplanation(
        scores.opportunity,
        evidence,
      ),

    businessImpact:
      buildBusinessImpactExplanation(
        scores.businessImpact,
        evidence,
      ),

    confidence:
      buildConfidenceExplanation(
        scores.confidence,
        evidence,
      ),
  };
}