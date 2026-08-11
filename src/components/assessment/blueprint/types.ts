export type DimensionScores = {
  procesos: number;
  informacion: number;
  integracion: number;
  automatizacion: number;
  ia: number;
};

export type Recommendation = {
  title: string;
  description: string;

  priority: "Alta" | "Media" | "Baja";
  category: "Proceso" | "Agente" | "Integración";

  impact: "Alto" | "Medio" | "Bajo";
  complexity: "Alta" | "Media" | "Baja";

  estimatedWeeks: number;

  technologies: string[];

  confidenceScore?: number;
  automationPotential?: number;

  currentProcess?: string;
  proposedProcess?: string;

  evidence?: string[];
  assumptions?: string[];
};

export type AgentRecommendation = {
  name: string;
  purpose: string;
  fitScore: number;
  priority: "Alta" | "Media";
};

export type EconomicEstimate = {
  hourlyCostCLP?: number;
  monthlySavingsCLP?: number;
  annualSavingsCLP?: number;
  estimatedImplementationCLP?: number;
  paybackMonths?: number;
  roiPercentage?: number;
  confidence?: number;
  assumptions?: string[];
};

export type ProcessAnalysis = {
  name: string;
  description?: string;

  executionsPerMonth?: number;
  peopleInvolved?: number;
  minutesPerExecution?: number;
  manualPercentage?: number;

  systems: string[];
  inputs: string[];

  requiresApproval: boolean;
  hasExceptions: boolean;

  scores: {
    readiness: number;
    opportunity: number;
    businessImpact: number;
    confidence: number;
  };

  currentHoursPerMonth?: number;
  recoverableHoursPerMonth?: number;
};

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

export type MaturityDimensionDetail = {
  score: number;
  level: string;
  rationale: string;
  factors: MaturityFactor[];
  actions: string[];
};

export type MaturityAnalysis = {
  procesos: MaturityDimensionDetail;
  informacion: MaturityDimensionDetail;
  integracion: MaturityDimensionDetail;
  automatizacion: MaturityDimensionDetail;
  ia: MaturityDimensionDetail;
};

export type BlueprintInsights = {
  strengths: string[];
  risks: string[];

  recommendations: Recommendation[];
  agents: AgentRecommendation[];

  estimatedHoursPerMonth?: number;

  economicEstimate: EconomicEstimate;

  roadmap: {
    phase: string;
    title: string;
    description: string;
  }[];
};

export type BlueprintReportData = {
  id: string;
  company: string;
  generatedAt: string;

  automationScore: number;

  level: string;
  diagnosis: string;

  dimensions: DimensionScores;
  maturityAnalysis?: MaturityAnalysis;

  /*
   * Solo está presente en Blueprints V2.
   * Se mantiene opcional para compatibilidad
   * con Blueprints antiguos almacenados.
   */
  processAnalysis?: ProcessAnalysis;

  insights: BlueprintInsights;
};