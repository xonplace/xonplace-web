export type AssessmentV2QuestionType =
  | "text"
  | "number"
  | "single"
  | "multiple";

export type AssessmentV2Option = {
  label: string;
  value: string;
};

export type AssessmentV2Question = {
  id: string;
  section: string;
  title: string;
  description?: string;
  type: AssessmentV2QuestionType;
  required?: boolean;
  options?: AssessmentV2Option[];
  showWhen?: {
    questionId: string;
    values: string[];
  };
};

export const assessmentV2Questions: AssessmentV2Question[] = [
  {
    id: "company",
    section: "Empresa",
    title: "¿Cómo se llama la empresa?",
    type: "text",
    required: true,
  },
  {
    id: "industry",
    section: "Empresa",
    title: "¿En qué industria opera?",
    type: "single",
    required: true,
    options: [
      { label: "Servicios", value: "services" },
      { label: "Tecnología", value: "technology" },
      { label: "Comercio", value: "commerce" },
      { label: "Manufactura", value: "manufacturing" },
      { label: "Salud", value: "health" },
      { label: "Educación", value: "education" },
      { label: "Otra", value: "other" },
    ],
  },
  {
    id: "employees",
    section: "Empresa",
    title: "¿Cuántas personas trabajan en la organización?",
    type: "single",
    required: true,
    options: [
      { label: "1 a 20", value: "1-20" },
      { label: "21 a 50", value: "21-50" },
      { label: "51 a 200", value: "51-200" },
      { label: "201 a 500", value: "201-500" },
      { label: "Más de 500", value: "500+" },
    ],
  },

  {
    id: "mainPain",
    section: "Dolor principal",
    title: "¿Cuál es hoy el principal problema operativo?",
    description:
      "Seleccione el problema que genera mayor impacto en la operación.",
    type: "single",
    required: true,
    options: [
      { label: "Demasiado trabajo manual", value: "manual-work" },
      { label: "Errores y retrabajos", value: "errors" },
      { label: "Procesos lentos", value: "slow-process" },
      { label: "Doble digitación", value: "double-entry" },
      { label: "Falta de trazabilidad", value: "traceability" },
      { label: "Documentos y correos", value: "documents" },
      { label: "Sistemas desconectados", value: "integration" },
      { label: "Otro", value: "other" },
    ],
  },

  {
    id: "processName",
    section: "Proceso candidato",
    title: "¿Qué proceso o actividad consume más tiempo?",
    description:
      "Ejemplo: ingreso de órdenes de compra, revisión de facturas, creación de reportes, atención de solicitudes.",
    type: "text",
    required: true,
  },
  {
    id: "processDescription",
    section: "Proceso candidato",
    title: "Describe brevemente cómo funciona hoy ese proceso",
    type: "text",
    required: true,
  },
  {
    id: "frequency",
    section: "Proceso candidato",
    title: "¿Con qué frecuencia se ejecuta?",
    type: "single",
    required: true,
    options: [
      { label: "Varias veces al día", value: "daily-many" },
      { label: "Diariamente", value: "daily" },
      { label: "Semanalmente", value: "weekly" },
      { label: "Mensualmente", value: "monthly" },
      { label: "Ocasionalmente", value: "occasional" },
    ],
  },
  {
    id: "executionsPerMonth",
    section: "Proceso candidato",
    title: "¿Cuántas veces aproximadamente se ejecuta al mes?",
    type: "number",
  },
  {
    id: "peopleInvolved",
    section: "Proceso candidato",
    title: "¿Cuántas personas participan normalmente?",
    type: "number",
  },
  {
    id: "minutesPerExecution",
    section: "Proceso candidato",
    title: "¿Cuántos minutos toma aproximadamente cada ejecución?",
    type: "number",
  },
  {
    id: "manualPercentage",
    section: "Proceso candidato",
    title: "¿Qué porcentaje del proceso es manual?",
    type: "single",
    required: true,
    options: [
      { label: "Menos de 25%", value: "25" },
      { label: "25% a 50%", value: "50" },
      { label: "50% a 75%", value: "75" },
      { label: "Más de 75%", value: "90" },
    ],
  },

  {
    id: "usesDocuments",
    section: "Información",
    title: "¿El proceso utiliza documentos, formularios o correos?",
    type: "single",
    required: true,
    options: [
      { label: "Sí", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "documentTypes",
    section: "Información",
    title: "¿Qué tipos de documentos utiliza?",
    type: "multiple",
    showWhen: {
      questionId: "usesDocuments",
      values: ["yes"],
    },
    options: [
      { label: "PDF", value: "pdf" },
      { label: "Excel", value: "excel" },
      { label: "Correos", value: "email" },
      { label: "Formularios", value: "forms" },
      { label: "Contratos", value: "contracts" },
      { label: "Órdenes", value: "orders" },
      { label: "Facturas", value: "invoices" },
      { label: "Otros", value: "other" },
    ],
  },
  {
    id: "manualDataExtraction",
    section: "Información",
    title: "¿Las personas extraen o copian información manualmente desde esos documentos?",
    type: "single",
    showWhen: {
      questionId: "usesDocuments",
      values: ["yes"],
    },
    options: [
      { label: "Sí", value: "yes" },
      { label: "A veces", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },

  {
    id: "usesMultipleSystems",
    section: "Sistemas",
    title: "¿El proceso utiliza más de un sistema o aplicación?",
    type: "single",
    required: true,
    options: [
      { label: "Sí", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "systemsUsed",
    section: "Sistemas",
    title: "¿Qué sistemas intervienen?",
    type: "multiple",
    showWhen: {
      questionId: "usesMultipleSystems",
      values: ["yes"],
    },
    options: [
      { label: "ERP", value: "erp" },
      { label: "CRM", value: "crm" },
      { label: "Correo", value: "email" },
      { label: "Excel", value: "excel" },
      { label: "SharePoint", value: "sharepoint" },
      { label: "Base de datos", value: "database" },
      { label: "Aplicación interna", value: "internal-app" },
      { label: "Otro", value: "other" },
    ],
  },
  {
    id: "doubleEntry",
    section: "Sistemas",
    title: "¿La misma información debe ingresarse en más de un sistema?",
    type: "single",
    showWhen: {
      questionId: "usesMultipleSystems",
      values: ["yes"],
    },
    options: [
      { label: "Frecuentemente", value: "frequent" },
      { label: "A veces", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },

  {
    id: "rulesKnown",
    section: "Decisiones",
    title: "¿Las principales decisiones del proceso siguen reglas conocidas?",
    type: "single",
    required: true,
    options: [
      { label: "Sí, prácticamente todas", value: "all" },
      { label: "La mayoría", value: "most" },
      { label: "Algunas", value: "some" },
      { label: "No", value: "none" },
    ],
  },
  {
    id: "requiresApproval",
    section: "Decisiones",
    title: "¿El proceso requiere aprobaciones humanas?",
    type: "single",
    required: true,
    options: [
      { label: "Sí", value: "yes" },
      { label: "A veces", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "exceptionsLevel",
    section: "Decisiones",
    title: "¿Con qué frecuencia aparecen excepciones que requieren criterio humano?",
    type: "single",
    required: true,
    options: [
      { label: "Muy pocas", value: "low" },
      { label: "Algunas", value: "medium" },
      { label: "Muchas", value: "high" },
    ],
  },

  {
    id: "reworkLevel",
    section: "Impacto",
    title: "¿Con qué frecuencia existen errores o retrabajos?",
    type: "single",
    required: true,
    options: [
      { label: "Casi nunca", value: "rare" },
      { label: "Ocasionalmente", value: "sometimes" },
      { label: "Frecuentemente", value: "frequent" },
      { label: "Constantemente", value: "constant" },
    ],
  },
  {
    id: "hourlyCostCLP",
    section: "Impacto",
    title: "¿Conoces el costo hora aproximado de las personas involucradas?",
    description:
      "Opcional. Si no se conoce, XONPLACE no calculará ahorro económico todavía.",
    type: "number",
  },
];