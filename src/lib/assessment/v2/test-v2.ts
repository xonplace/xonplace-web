import { generateIntelligenceResult } from "@/lib/assessment/intelligence";

import {
  adaptAssessmentV2,
  generateV2Evidence,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

const answers: AssessmentV2Answers = {
  company: "Empresa Demo",
  industry: "services",
  employees: "51-200",

  mainPain: "double-entry",

  processName: "Ingreso de órdenes de compra",
  processDescription:
    "Las órdenes llegan por correo. Una persona revisa el documento, copia los datos a Excel y posteriormente registra la información en el ERP.",

  frequency: "daily-many",
  executionsPerMonth: "450",
  peopleInvolved: "2",
  minutesPerExecution: "12",
  manualPercentage: "90",

  usesDocuments: "yes",

  documentTypes: [
    "pdf",
    "email",
    "orders",
    "excel",
  ],

  manualDataExtraction: "yes",

  usesMultipleSystems: "yes",

  systemsUsed: [
    "email",
    "excel",
    "erp",
  ],

  doubleEntry: "frequent",

  rulesKnown: "most",

  requiresApproval: "sometimes",

  exceptionsLevel: "medium",

  reworkLevel: "frequent",

  hourlyCostCLP: "18000",
};

const adapted = adaptAssessmentV2(answers);

const v2Evidence =
  generateV2Evidence(answers);

const result = generateIntelligenceResult({
  answers: adapted.intelligenceAnswers,
  processes: adapted.processes,
  additionalEvidence: v2Evidence,
  hourlyCostCLP: adapted.hourlyCostCLP,
});

console.dir(
  {
    originalAnswers: answers,
    adapted,
    v2Evidence,
    intelligence: result,
  },
  {
    depth: null,
  },
);