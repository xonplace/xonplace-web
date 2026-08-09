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
    email: "correo",
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
    pdf: "PDF",
    excel: "Excel",
    email: "correo",
    forms: "formularios",
    contracts: "contratos",
    orders: "órdenes",
    invoices: "facturas",
    other: "otros documentos",
  };

  return labels[value] ?? value;
}

function buildSystemFlow(process: ProcessProfile): string {
  if (process.systems.length === 0) {
    return "los sistemas involucrados";
  }

  return process.systems
    .map(humanizeSystem)
    .join(", ");
}

function buildInputFlow(process: ProcessProfile): string {
  if (process.inputs.length === 0) {
    return "la información de entrada";
  }

  return process.inputs
    .map(humanizeInput)
    .join(", ");
}

function contextualizeOpportunity(
  opportunity: AutomationOpportunity,
  process: ProcessProfile,
  mainPain?: string,
): AutomationOpportunity {
  const processName = process.name;
  const systems = buildSystemFlow(process);
  const inputs = buildInputFlow(process);

  if (opportunity.type === "document-intelligence") {
    return {
      ...opportunity,

      title: `Automatización documental de ${processName}`,

      description:
        `El proceso "${processName}" utiliza ${inputs} y presenta una carga manual relevante. ` +
        "Existe potencial para automatizar la recepción, clasificación, extracción y validación de información.",

      currentProcess:
        process.description ??
        `Las personas reciben ${inputs}, revisan su contenido y realizan registros manuales dentro del proceso ${processName}.`,

      proposedProcess:
        `Los documentos ingresan automáticamente a un motor de Document Intelligence, ` +
        `se clasifican, se extraen los datos requeridos y la información validada se envía a ${systems}. ` +
        "Los casos de baja confianza se derivan a revisión humana.",

      assumptions: [
        ...opportunity.assumptions,
        `La recomendación fue contextualizada para el proceso "${processName}".`,
      ],
    };
  }

  if (opportunity.type === "integration") {
    return {
      ...opportunity,

      title: `Integración de sistemas para ${processName}`,

      description:
        `El proceso "${processName}" utiliza ${systems}. ` +
        "La existencia de múltiples aplicaciones y transferencia manual de información genera una oportunidad directa de integración.",

      currentProcess:
        process.description ??
        `La información se transfiere manualmente entre ${systems}.`,

      proposedProcess:
        `Una capa de integración sincroniza los datos entre ${systems}, ` +
        "elimina registros duplicados y activa automáticamente las etapas siguientes del proceso.",

      assumptions: [
        ...opportunity.assumptions,
        "Debe confirmarse la disponibilidad de API, conectores o mecanismos de integración de cada sistema.",
      ],
    };
  }

  if (opportunity.type === "workflow") {
    return {
      ...opportunity,

      title: `Workflow automatizado para ${processName}`,

      description:
        `El proceso "${processName}" presenta actividades manuales recurrentes y reglas suficientemente conocidas para automatizar parte de su ejecución.`,

      currentProcess:
        process.description ??
        `El proceso ${processName} requiere intervención humana recurrente para ejecutar actividades basadas en reglas.`,

      proposedProcess:
        `Un workflow coordina las etapas de ${processName}, aplica reglas, ` +
        "ejecuta acciones automáticas y escala únicamente las excepciones que requieren criterio humano.",

      assumptions: [
        ...opportunity.assumptions,
        `Las reglas del proceso "${processName}" deberán formalizarse durante el discovery.`,
      ],
    };
  }

  if (opportunity.type === "data-quality") {
    return {
      ...opportunity,

      title: `Control automático de calidad en ${processName}`,

      description:
        `El nivel de errores o retrabajos detectado en "${processName}" justifica incorporar validaciones automáticas antes de completar el proceso.`,

      currentProcess:
        process.description ??
        `Los errores dentro de ${processName} se detectan y corrigen principalmente de forma manual.`,

      proposedProcess:
        `El proceso incorpora controles preventivos y reglas automáticas que validan datos, ` +
        "consistencia y condiciones de negocio antes de avanzar a la siguiente etapa.",

      assumptions: [
        ...opportunity.assumptions,
        "Los tipos de error más frecuentes deberán identificarse y clasificarse.",
      ],
    };
  }

  return {
    ...opportunity,

    description:
      mainPain
        ? `${opportunity.description} El principal dolor declarado es "${mainPain}".`
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

  return opportunities.map((opportunity) =>
    contextualizeOpportunity(
      opportunity,
      primaryProcess,
      mainPain,
    ),
  );
}