import type {
  AutomationOpportunity,
  ProcessProfile,
} from "./types";

type ContextEngineInput = {
  opportunities: AutomationOpportunity[];
  processes: ProcessProfile[];
  mainPain?: string;
};

function humanizeSystem(value: string): string {
  const labels: Record<string, string> = {
    erp: "ERP",
    crm: "CRM",
    email: "correo electrónico",
    excel: "Excel",
    sharepoint: "SharePoint",
    database: "base de datos",
    "internal-app": "aplicación interna",
    other: "otro sistema",
  };

  return labels[value] ?? value;
}

function humanizeInput(value: string): string {
  const labels: Record<string, string> = {
    pdf: "archivos PDF",
    excel: "planillas Excel",
    email: "correos electrónicos",
    forms: "formularios",
    contracts: "contratos",
    orders: "órdenes",
    invoices: "facturas",
    other: "otros documentos",
  };

  return labels[value] ?? value;
}

function humanizeFrequency(
  frequency: ProcessProfile["frequency"],
): string {
  const labels: Record<
    ProcessProfile["frequency"],
    string
  > = {
    daily: "diariamente",
    weekly: "semanalmente",
    monthly: "mensualmente",
    occasional: "de forma ocasional",
    unknown: "con una frecuencia no determinada",
  };

  return labels[frequency];
}

function joinNatural(items: string[]): string {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} y ${
    items[items.length - 1]
  }`;
}

function buildSystemFlow(
  process: ProcessProfile,
): string {
  if (process.systems.length === 0) {
    return "los sistemas involucrados";
  }

  return joinNatural(
    process.systems.map(humanizeSystem),
  );
}

function buildInputFlow(
  process: ProcessProfile,
): string {
  if (process.inputs.length === 0) {
    return "información operacional";
  }

  return joinNatural(
    process.inputs.map(humanizeInput),
  );
}

function buildCurrentProcessNarrative(
  process: ProcessProfile,
): string {
  const sentences: string[] = [];

  sentences.push(
    `El proceso "${process.name}" se ejecuta ${humanizeFrequency(
      process.frequency,
    )}.`,
  );

  if (
    process.executionsPerMonth !== undefined
  ) {
    sentences.push(
      `Se realizan aproximadamente ${process.executionsPerMonth.toLocaleString(
        "es-CL",
      )} ejecuciones al mes.`,
    );
  }

  if (
    process.peopleInvolved !== undefined
  ) {
    sentences.push(
      `Participan aproximadamente ${process.peopleInvolved} ${
        process.peopleInvolved === 1
          ? "persona"
          : "personas"
      }.`,
    );
  }

  if (
    process.minutesPerExecution !== undefined
  ) {
    sentences.push(
      `Cada ejecución requiere cerca de ${process.minutesPerExecution} minutos.`,
    );
  }

  if (
    process.manualPercentage !== undefined
  ) {
    sentences.push(
      `Aproximadamente el ${process.manualPercentage}% del proceso depende actualmente de intervención manual.`,
    );
  }

  if (process.inputs.length > 0) {
    sentences.push(
      `La operación utiliza ${buildInputFlow(
        process,
      )} como información de entrada.`,
    );
  }

  if (process.systems.length > 0) {
    sentences.push(
      `Durante su ejecución intervienen ${buildSystemFlow(
        process,
      )}.`,
    );
  }

  if (process.hasRules) {
    sentences.push(
      "Una parte importante de las decisiones sigue reglas conocidas.",
    );
  }

  if (process.requiresApproval) {
    sentences.push(
      "El flujo incluye instancias de aprobación humana.",
    );
  }

  if (process.hasExceptions) {
    sentences.push(
      "También existen excepciones que requieren revisión o criterio humano.",
    );
  }

  return sentences.join(" ");
}

function buildProposedDocumentProcess(
  process: ProcessProfile,
): string {
  const systems = buildSystemFlow(process);

  return (
    `La información de entrada de "${process.name}" se recibe automáticamente, ` +
    "se clasifica y se extraen los datos relevantes mediante Document Intelligence. " +
    `La información validada se envía a ${systems} y el workflow continúa automáticamente. ` +
    "Los documentos o casos con baja confianza se derivan a revisión humana."
  );
}

function buildProposedIntegrationProcess(
  process: ProcessProfile,
): string {
  const systems = buildSystemFlow(process);

  return (
    `Una capa de integración conecta ${systems} para intercambiar información automáticamente. ` +
    "Esto reduce la doble digitación, mantiene consistencia entre sistemas y activa las siguientes etapas del proceso sin transferencias manuales innecesarias."
  );
}

function buildProposedWorkflowProcess(
  process: ProcessProfile,
): string {
  return (
    `Un workflow coordina las etapas de "${process.name}", aplica reglas de negocio, ` +
    "ejecuta automáticamente las actividades repetitivas y registra cada acción. " +
    "Solo las aprobaciones y excepciones que requieren criterio humano son derivadas a una persona."
  );
}

function buildProposedQualityProcess(
  process: ProcessProfile,
): string {
  return (
    `El proceso "${process.name}" incorpora validaciones automáticas antes de avanzar entre etapas. ` +
    "Los controles revisan consistencia, obligatoriedad y reglas de negocio, detectando errores tempranamente y reduciendo retrabajos."
  );
}

function contextualizeOpportunity(
  opportunity: AutomationOpportunity,
  process: ProcessProfile,
  mainPain?: string,
): AutomationOpportunity {
  const processName = process.name;
  const systems = buildSystemFlow(process);
  const inputs = buildInputFlow(process);

  const currentProcess =
    buildCurrentProcessNarrative(process);

  if (
    opportunity.type ===
    "document-intelligence"
  ) {
    return {
      ...opportunity,

      title: `Automatización documental de ${processName}`,

      description:
        `El proceso "${processName}" utiliza ${inputs} y presenta una carga manual relevante. ` +
        "Existe potencial para automatizar la recepción, clasificación, extracción, validación y registro de información.",

      currentProcess,

      proposedProcess:
        buildProposedDocumentProcess(process),

      assumptions: [
        ...opportunity.assumptions,
        `La recomendación fue contextualizada específicamente para el proceso "${processName}".`,
      ],
    };
  }

  if (
    opportunity.type === "integration"
  ) {
    return {
      ...opportunity,

      title: `Integración de sistemas para ${processName}`,

      description:
        `El proceso "${processName}" utiliza ${systems}. ` +
        "La participación de múltiples aplicaciones genera una oportunidad para reducir transferencias manuales y doble digitación.",

      currentProcess,

      proposedProcess:
        buildProposedIntegrationProcess(
          process,
        ),

      assumptions: [
        ...opportunity.assumptions,
        "Debe confirmarse la disponibilidad de APIs, conectores o mecanismos de integración de cada sistema.",
      ],
    };
  }

  if (opportunity.type === "workflow") {
    return {
      ...opportunity,

      title: `Workflow automatizado para ${processName}`,

      description:
        `El proceso "${processName}" presenta actividades manuales recurrentes y reglas suficientemente conocidas para automatizar parte importante de su ejecución.`,

      currentProcess,

      proposedProcess:
        buildProposedWorkflowProcess(process),

      assumptions: [
        ...opportunity.assumptions,
        `Las reglas del proceso "${processName}" deberán formalizarse durante el discovery.`,
      ],
    };
  }

  if (
    opportunity.type === "data-quality"
  ) {
    return {
      ...opportunity,

      title: `Control automático de calidad en ${processName}`,

      description:
        `El nivel de errores o retrabajos detectado en "${processName}" justifica incorporar validaciones automáticas y controles preventivos.`,

      currentProcess,

      proposedProcess:
        buildProposedQualityProcess(process),

      assumptions: [
        ...opportunity.assumptions,
        "Los tipos de error más frecuentes deberán identificarse y clasificarse durante el discovery.",
      ],
    };
  }

  return {
    ...opportunity,

    currentProcess,

    description: mainPain
      ? `${opportunity.description} El principal dolor declarado corresponde a "${mainPain}".`
      : opportunity.description,
  };
}

export function contextualizeOpportunities({
  opportunities,
  processes,
  mainPain,
}: ContextEngineInput): AutomationOpportunity[] {
  const primaryProcess = processes[0];

  if (!primaryProcess) {
    return opportunities;
  }

  return opportunities.map(
    (opportunity) =>
      contextualizeOpportunity(
        opportunity,
        primaryProcess,
        mainPain,
      ),
  );
}