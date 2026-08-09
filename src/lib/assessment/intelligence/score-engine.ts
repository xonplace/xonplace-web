import type {
  AssessmentEvidence,
  IntelligenceScores,
} from "./types";

type EvidenceIndex = {
  manualWork: number;
  documents: number;
  dataEntry: number;
  integration: number;
  rules: number;
  errors: number;
  volume: number;
  time: number;
  people: number;
  approvals: number;
  exceptions: number;
};

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

function clamp(value: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function buildEvidenceIndex(
  evidence: AssessmentEvidence[],
): EvidenceIndex {
  return {
    manualWork:
      getEvidenceStrength(
        evidence,
        "manual-work",
      ),

    documents:
      getEvidenceStrength(
        evidence,
        "documents",
      ),

    dataEntry:
      getEvidenceStrength(
        evidence,
        "data-entry",
      ),

    integration:
      getEvidenceStrength(
        evidence,
        "integration",
      ),

    rules:
      getEvidenceStrength(
        evidence,
        "rules",
      ),

    errors:
      getEvidenceStrength(
        evidence,
        "errors",
      ),

    volume:
      getEvidenceStrength(
        evidence,
        "volume",
      ),

    time:
      getEvidenceStrength(
        evidence,
        "time",
      ),

    people:
      getEvidenceStrength(
        evidence,
        "people",
      ),

    approvals:
      getEvidenceStrength(
        evidence,
        "approvals",
      ),

    exceptions:
      getEvidenceStrength(
        evidence,
        "exceptions",
      ),
  };
}

function calculateReadiness(
  index: EvidenceIndex,
): number {
  /*
   * Readiness mide capacidad de ejecutar automatización.
   *
   * Favorece:
   * - reglas conocidas;
   * - pocos errores;
   * - baja dependencia de intervención/excepciones;
   * - integración razonable.
   *
   * Importante:
   * integration representa una BRECHA:
   * 100 = integración muy deficiente.
   */
  const integrationReadiness =
    100 - index.integration;

  const errorReadiness =
    100 - index.errors;

  const exceptionReadiness =
    100 - index.exceptions;

  const approvalReadiness =
    100 - index.approvals;

  return clamp(
    index.rules * 0.35 +
      integrationReadiness * 0.2 +
      errorReadiness * 0.15 +
      exceptionReadiness * 0.15 +
      approvalReadiness * 0.1 +
      (index.documents > 0 ? 70 : 50) *
        0.05,
  );
}

function calculateOpportunity(
  index: EvidenceIndex,
): number {
  /*
   * Opportunity mide cuánto espacio existe
   * para automatizar.
   *
   * Señales principales:
   * - alta manualidad;
   * - doble digitación;
   * - dependencia documental;
   * - alto volumen;
   * - reglas conocidas;
   * - baja integración.
   */
  return clamp(
    index.manualWork * 0.22 +
      index.dataEntry * 0.18 +
      index.documents * 0.15 +
      index.integration * 0.15 +
      index.volume * 0.12 +
      index.rules * 0.1 +
      index.errors * 0.08,
  );
}

function calculateBusinessImpact(
  index: EvidenceIndex,
): number {
  /*
   * Business Impact debe reflejar carga real.
   *
   * Valora especialmente:
   * - volumen;
   * - tiempo;
   * - número de personas;
   * - errores;
   * - carga manual.
   */
  return clamp(
    index.volume * 0.22 +
      index.time * 0.22 +
      index.people * 0.16 +
      index.errors * 0.15 +
      index.manualWork * 0.15 +
      index.dataEntry * 0.1,
  );
}

function calculateConfidence(
  evidence: AssessmentEvidence[],
): number {
  if (evidence.length === 0) {
    return 0;
  }

  const averageStrength =
    evidence.reduce(
      (sum, item) =>
        sum + item.strength,
      0,
    ) / evidence.length;

  const coveredTypes = new Set(
    evidence.map(
      (item) => item.type,
    ),
  );

  /*
   * Esperamos evidencia en aproximadamente
   * 10 áreas relevantes.
   */
  const coverageScore = Math.min(
    100,
    (coveredTypes.size / 10) * 100,
  );

  /*
   * La confianza ya no sube únicamente
   * porque existan muchas reglas del mismo tipo.
   * Importa la diversidad de evidencia.
   */
  return Math.min(
    95,
    clamp(
      averageStrength * 0.6 +
        coverageScore * 0.4,
    ),
  );
}

export function calculateIntelligenceScores(
  evidence: AssessmentEvidence[],
): IntelligenceScores {
  const index =
    buildEvidenceIndex(evidence);

  return {
    readiness:
      calculateReadiness(index),

    opportunity:
      calculateOpportunity(index),

    businessImpact:
      calculateBusinessImpact(index),

    confidence:
      calculateConfidence(evidence),
  };
}