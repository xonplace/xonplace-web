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
};

export type AgentRecommendation = {
  name: string;
  purpose: string;
  fitScore: number;
  priority: "Alta" | "Media";
};

export type EconomicEstimate = {
  hourlyCostCLP: number;
  monthlySavingsCLP: number;
  annualSavingsCLP: number;
  estimatedImplementationCLP: number;
  paybackMonths: number;
};

export type BlueprintReportData = {
  id: string;
  company: string;
  generatedAt: string;
  automationScore: number;
  level: string;
  diagnosis: string;
  dimensions: DimensionScores;
  insights: {
    strengths: string[];
    risks: string[];
    recommendations: Recommendation[];
    agents: AgentRecommendation[];
    estimatedHoursPerMonth: number;
    economicEstimate: EconomicEstimate;
    roadmap: {
      phase: string;
      title: string;
      description: string;
    }[];
  };
};