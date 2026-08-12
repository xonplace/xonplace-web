import type {
  IntelligenceExplanations,
} from "./explainability-engine";

export type ScoreLevel =
  | "Bajo"
  | "Medio"
  | "Alto"
  | "Muy alto";

export type IntelligenceScores = {
  readiness: number;
  opportunity: number;
  businessImpact: number;
  confidence: number;
};

export type EvidenceType =
  | "manual-work"
  | "documents"
  | "email"
  | "data-entry"
  | "integration"
  | "rules"
  | "errors"
  | "volume"
  | "time"
  | "people"
  | "approvals"
  | "exceptions";

export type AssessmentEvidence = {
  id: string;

  type: EvidenceType;

  title: string;

  description: string;

  strength: number;

  sourceQuestions: string[];
};

export type ProcessProfile = {
  name: string;

  description?: string;

  frequency:
    | "daily"
    | "weekly"
    | "monthly"
    | "occasional"
    | "unknown";

  executionsPerMonth?: number;

  peopleInvolved?: number;

  minutesPerExecution?: number;

  manualPercentage?: number;

  errorPercentage?: number;

  systems: string[];

  inputs: string[];

  outputs: string[];

  hasRules: boolean;

  requiresApproval: boolean;

  hasExceptions: boolean;
};

export type OpportunityType =
  | "workflow"
  | "document-intelligence"
  | "integration"
  | "rpa"
  | "ai-agent"
  | "data-quality"
  | "process-discovery";

export type AutomationOpportunity = {
  id: string;

  title: string;

  description: string;

  type: OpportunityType;

  evidence: string[];

  currentProcess: string;

  proposedProcess: string;

  automationPotential: number;

  impactScore: number;

  complexityScore: number;

  confidenceScore: number;

  estimatedHoursCurrentMonth?: number;

  estimatedHoursRecoverableMonth?: number;

  recommendedTechnologies: string[];

  recommendedAgents: string[];

  assumptions: string[];
};

export type EconomicProjection = {
  hourlyCostCLP?: number;

  currentHoursPerMonth?: number;

  recoverableHoursPerMonth?: number;

  monthlySavingsCLP?: number;

  annualSavingsCLP?: number;

  estimatedImplementationCLP?: number;

  paybackMonths?: number;

  roiPercentage?: number;

  confidence: number;

  assumptions: string[];
};

export type IntelligenceResult = {
  scoringVersion: string;
  scores: IntelligenceScores;

  /*
   * Evidencia utilizada por el diagnóstico.
   */
  evidence: AssessmentEvidence[];

  /*
   * Explicación determinística de los scores.
   *
   * Responde:
   * - qué factores favorecen el resultado;
   * - qué factores lo reducen;
   * - qué evidencia falta;
   * - cuánto cubre la evidencia disponible.
   */
  explanations:
    IntelligenceExplanations;

  opportunities:
    AutomationOpportunity[];

  economics:
    EconomicProjection;

  warnings: string[];
};