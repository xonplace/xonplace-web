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

export type AssessmentInsights = {
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

export function generateAssessmentInsights(
  scores: DimensionScores,
): AssessmentInsights {
  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: Recommendation[] = [];
  const agents: AgentRecommendation[] = [];

  if (scores.procesos >= 70) {
    strengths.push(
      "Existe un volumen importante de procesos repetitivos y estructurados.",
    );

    recommendations.push({
      title: "Automatizar procesos repetitivos",
      description:
        "Priorizar tareas frecuentes con reglas conocidas, alto volumen y baja necesidad de intervención humana.",
      priority: "Alta",
      category: "Proceso",
      impact: "Alto",
      complexity: "Media",
      estimatedWeeks: 6,
      technologies: ["Workflow", "API", "RPA"],
    });
  } else {
    risks.push(
      "Los procesos requieren mayor documentación y estandarización antes de automatizarse.",
    );
  }

  if (scores.informacion >= 70) {
    strengths.push(
      "La operación posee un alto potencial para automatizar documentos, correos y datos no estructurados.",
    );

    recommendations.push({
      title: "Implementar Document Agent",
      description:
        "Clasificar documentos, extraer información y alimentar automáticamente los sistemas internos.",
      priority: "Alta",
      category: "Agente",
      impact: "Alto",
      complexity: "Media",
      estimatedWeeks: 8,
      technologies: ["IA generativa", "OCR", "API"],
    });

    agents.push({
      name: "Document Intelligence Agent",
      purpose:
        "Leer, clasificar y extraer información desde documentos, correos y formularios.",
      fitScore: Math.max(70, scores.informacion),
      priority: "Alta",
    });
  } else {
    risks.push(
      "La información disponible puede requerir limpieza, ordenamiento o digitalización.",
    );

    agents.push({
      name: "Data Quality Agent",
      purpose:
        "Detectar duplicados, campos incompletos e inconsistencias antes de automatizar.",
      fitScore: Math.max(55, 100 - scores.informacion),
      priority: "Media",
    });
  }

  if (scores.integracion >= 70) {
    risks.push(
      "Los sistemas presentan baja conexión y generan movimiento manual de información.",
    );

    recommendations.push({
      title: "Integrar sistemas prioritarios",
      description:
        "Conectar correo, ERP, CRM, planillas y bases de datos para eliminar la doble digitación.",
      priority: "Alta",
      category: "Integración",
      impact: "Alto",
      complexity: "Alta",
      estimatedWeeks: 10,
      technologies: ["API", "Webhooks", "ETL"],
    });

    agents.push({
      name: "Integration Orchestrator",
      purpose:
        "Coordinar el intercambio de información entre ERP, CRM, correo y aplicaciones internas.",
      fitScore: scores.integracion,
      priority: "Alta",
    });
  } else {
    strengths.push(
      "La organización cuenta con un nivel favorable de integración entre sus sistemas.",
    );
  }

  if (scores.automatizacion >= 70) {
    recommendations.push({
      title: "Crear Automation Workflow",
      description:
        "Diseñar un flujo que reciba información, aplique reglas, ejecute acciones y escale excepciones.",
      priority: "Alta",
      category: "Proceso",
      impact: "Alto",
      complexity: "Media",
      estimatedWeeks: 6,
      technologies: ["Workflow", "Reglas de negocio", "Notificaciones"],
    });

    agents.push({
      name: "Workflow Supervisor Agent",
      purpose:
        "Supervisar ejecuciones, identificar excepciones y escalar casos que requieran intervención humana.",
      fitScore: scores.automatizacion,
      priority: "Alta",
    });
  }

  if (scores.ia >= 70) {
    strengths.push(
      "La organización presenta buenas condiciones para implementar agentes de IA supervisados.",
    );

    recommendations.push({
      title: "Implementar AI Operations Agent",
      description:
        "Crear un agente que analice información, recomiende acciones y ejecute tareas bajo supervisión.",
      priority: "Media",
      category: "Agente",
      impact: "Alto",
      complexity: "Alta",
      estimatedWeeks: 12,
      technologies: ["LLM", "RAG", "Base de conocimiento"],
    });

    agents.push({
      name: "AI Operations Agent",
      purpose:
        "Analizar información operacional, recomendar acciones y ejecutar tareas controladas.",
      fitScore: scores.ia,
      priority: "Alta",
    });
  } else {
    risks.push(
      "Antes de incorporar agentes autónomos conviene fortalecer reglas, datos y fuentes de conocimiento.",
    );
  }

  if (recommendations.length < 3) {
    recommendations.push({
      title: "Documentar procesos críticos",
      description:
        "Crear una línea base con responsables, entradas, reglas, sistemas, tiempos y resultados esperados.",
      priority: "Media",
      category: "Proceso",
      impact: "Medio",
      complexity: "Baja",
      estimatedWeeks: 4,
      technologies: ["BPMN", "Documentación", "Métricas"],
    });
  }

  if (agents.length < 3) {
    agents.push({
      name: "Process Discovery Agent",
      purpose:
        "Analizar actividades, identificar patrones repetitivos y proponer oportunidades de automatización.",
      fitScore: Math.max(60, scores.procesos),
      priority: "Media",
    });
  }

  if (strengths.length === 0) {
    const strongestDimension = Object.entries(scores).sort(
      ([, firstScore], [, secondScore]) => secondScore - firstScore,
    )[0];

    const dimensionNames: Record<keyof DimensionScores, string> = {
      procesos: "procesos",
      informacion: "gestión de información",
      integracion: "integración de sistemas",
      automatizacion: "automatización",
      ia: "preparación para Inteligencia Artificial",
    };

    strengths.push(
      `La organización cuenta con una base inicial en ${
        dimensionNames[strongestDimension[0] as keyof DimensionScores]
      }, que puede utilizarse como punto de partida.`,
    );

    strengths.push(
      "Existe información suficiente para iniciar un proceso estructurado de descubrimiento y priorización.",
    );
  }

  const scoreValues = Object.values(scores);

  const averageScore =
    scoreValues.reduce((total, value) => total + value, 0) /
    scoreValues.length;

  const estimatedHoursPerMonth = Math.round(20 + averageScore * 2.3);

  const hourlyCostCLP = 18000;
  const monthlySavingsCLP = estimatedHoursPerMonth * hourlyCostCLP;
  const annualSavingsCLP = monthlySavingsCLP * 12;

  const highPriorityCount = recommendations.filter(
    (item) => item.priority === "Alta",
  ).length;

  const estimatedImplementationCLP =
    3500000 +
    recommendations.length * 900000 +
    highPriorityCount * 1200000;

  const paybackMonths = Number(
    (estimatedImplementationCLP / monthlySavingsCLP).toFixed(1),
  );

  return {
    strengths,
    risks,
    recommendations,
    agents,
    estimatedHoursPerMonth,
    economicEstimate: {
      hourlyCostCLP,
      monthlySavingsCLP,
      annualSavingsCLP,
      estimatedImplementationCLP,
      paybackMonths,
    },
    roadmap: [
      {
        phase: "30 días",
        title: "Descubrimiento y priorización",
        description:
          "Validar procesos, responsables, datos disponibles y métricas de referencia.",
      },
      {
        phase: "60 días",
        title: "Primer piloto",
        description:
          "Implementar una automatización de alto impacto y baja complejidad.",
      },
      {
        phase: "90 días",
        title: "Escalamiento controlado",
        description:
          "Medir resultados, corregir desviaciones y extender el modelo a nuevos procesos.",
      },
      {
        phase: "180 días",
        title: "Operación inteligente",
        description:
          "Consolidar agentes, automatizaciones, supervisión y mejora continua.",
      },
    ],
  };
}
