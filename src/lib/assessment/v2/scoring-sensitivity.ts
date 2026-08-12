import {
  calculateV2IntelligenceScores,
} from "./score-engine";

import type {
  AssessmentV2Answers,
} from "./adapter";

import type {
  IntelligenceScores,
} from "@/lib/assessment/intelligence";

type ScoreName =
  keyof IntelligenceScores;

type Direction =
  | "non-decreasing"
  | "non-increasing";

type SensitivityStep = {
  label: string;

  answers:
    AssessmentV2Answers;
};

type SensitivityExpectation = {
  score: ScoreName;

  direction: Direction;
};

type SensitivityCase = {
  id: string;

  name: string;

  description: string;

  steps:
    SensitivityStep[];

  expectations:
    SensitivityExpectation[];
};

type SensitivityStepResult = {
  label: string;

  scores:
    IntelligenceScores;
};

export type SensitivityValidationResult = {
  id: string;

  name: string;

  passed: boolean;

  steps:
    SensitivityStepResult[];

  failures: string[];
};

const baseAnswers:
  AssessmentV2Answers = {
    company:
      "Empresa de prueba",

    industry:
      "Servicios",

    employees:
      "51-200",

    mainPain:
      "Trabajo manual y tiempos operacionales",

    processName:
      "Proceso de prueba",

    processDescription:
      "Proceso operacional utilizado para validar la sensibilidad del motor de diagnóstico XONPLACE.",

    frequency:
      "daily",

    executionsPerMonth:
      "300",

    peopleInvolved:
      "3",

    minutesPerExecution:
      "15",

    manualPercentage:
      "50",

    usesDocuments:
      "no",

    documentTypes:
      [],

    manualDataExtraction:
      "no",

    usesMultipleSystems:
      "no",

    systemsUsed:
      [],

    doubleEntry:
      "no",

    systemsIntegrated:
      "most",

    apiAvailability:
      "most",

    rulesKnown:
      "most",

    requiresApproval:
      "no",

    exceptionsLevel:
      "low",

    reworkLevel:
      "rare",
  };

function buildAnswers(
  overrides: Partial<
    AssessmentV2Answers
  >,
): AssessmentV2Answers {
  const merged: Record<
    string,
    string | string[]
  > = {
    ...baseAnswers,
  };

  for (const [
    key,
    value,
  ] of Object.entries(
    overrides,
  )) {
    if (
      value !== undefined
    ) {
      merged[key] =
        value;
    }
  }

  return merged as AssessmentV2Answers;
}

/*
 * ==========================================================
 * SENSITIVITY CASES
 * ==========================================================
 *
 * Estas pruebas NO validan valores exactos.
 *
 * Validan propiedades fundamentales del modelo:
 *
 * - más manualidad no reduce Opportunity;
 * - mayor volumen no reduce Business Impact;
 * - mejor integración no reduce Readiness;
 * - más excepciones no mejoran Readiness;
 * - más retrabajo no mejora Readiness;
 * - más retrabajo no reduce Opportunity;
 * - mejores reglas no reducen Readiness;
 * - mejor información no reduce Readiness;
 * - más carga operacional no reduce Business Impact;
 * - eliminar información no aumenta Confidence.
 */

export const scoringSensitivityCases:
  SensitivityCase[] = [
    /*
     * 01
     * MANUALIDAD
     */
    {
      id: "manuality-opportunity",

      name:
        "Manualidad → Opportunity",

      description:
        "Aumentar el porcentaje manual no debería reducir la oportunidad de automatización.",

      steps: [
        {
          label:
            "10% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "10",
            }),
        },
        {
          label:
            "30% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "30",
            }),
        },
        {
          label:
            "50% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "50",
            }),
        },
        {
          label:
            "70% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "70",
            }),
        },
        {
          label:
            "90% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "90",
            }),
        },
        {
          label:
            "100% manual",

          answers:
            buildAnswers({
              manualPercentage:
                "100",
            }),
        },
      ],

      expectations: [
        {
          score:
            "opportunity",

          direction:
            "non-decreasing",
        },

        {
          score:
            "businessImpact",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 02
     * VOLUMEN
     */
    {
      id: "volume-impact",

      name:
        "Volumen → Business Impact",

      description:
        "Aumentar el número de ejecuciones no debería reducir el impacto operacional.",

      steps: [
        {
          label:
            "5 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "5",
            }),
        },
        {
          label:
            "30 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "30",
            }),
        },
        {
          label:
            "100 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "100",
            }),
        },
        {
          label:
            "300 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "300",
            }),
        },
        {
          label:
            "500 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "500",
            }),
        },
        {
          label:
            "1000 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "1000",
            }),
        },
        {
          label:
            "3000 ejecuciones",

          answers:
            buildAnswers({
              executionsPerMonth:
                "3000",
            }),
        },
      ],

      expectations: [
        {
          score:
            "businessImpact",

          direction:
            "non-decreasing",
        },

        {
          score:
            "opportunity",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 03
     * PERSONAS
     */
    {
      id: "people-impact",

      name:
        "Personas involucradas → Business Impact",

      description:
        "Aumentar las personas involucradas no debería reducir Business Impact.",

      steps: [
        {
          label:
            "1 persona",

          answers:
            buildAnswers({
              peopleInvolved:
                "1",
            }),
        },
        {
          label:
            "2 personas",

          answers:
            buildAnswers({
              peopleInvolved:
                "2",
            }),
        },
        {
          label:
            "3 personas",

          answers:
            buildAnswers({
              peopleInvolved:
                "3",
            }),
        },
        {
          label:
            "5 personas",

          answers:
            buildAnswers({
              peopleInvolved:
                "5",
            }),
        },
        {
          label:
            "10 personas",

          answers:
            buildAnswers({
              peopleInvolved:
                "10",
            }),
        },
        {
          label:
            "15 personas",

          answers:
            buildAnswers({
              peopleInvolved:
                "15",
            }),
        },
      ],

      expectations: [
        {
          score:
            "businessImpact",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 04
     * TIEMPO POR EJECUCIÓN
     */
    {
      id: "time-impact",

      name:
        "Tiempo por ejecución → Business Impact",

      description:
        "Aumentar la duración de cada ejecución no debería reducir Business Impact.",

      steps: [
        {
          label:
            "2 minutos",

          answers:
            buildAnswers({
              minutesPerExecution:
                "2",
            }),
        },
        {
          label:
            "5 minutos",

          answers:
            buildAnswers({
              minutesPerExecution:
                "5",
            }),
        },
        {
          label:
            "15 minutos",

          answers:
            buildAnswers({
              minutesPerExecution:
                "15",
            }),
        },
        {
          label:
            "30 minutos",

          answers:
            buildAnswers({
              minutesPerExecution:
                "30",
            }),
        },
        {
          label:
            "60 minutos",

          answers:
            buildAnswers({
              minutesPerExecution:
                "60",
            }),
        },
      ],

      expectations: [
        {
          score:
            "businessImpact",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 05
     * INTEGRACIÓN
     */
    {
      id: "integration-readiness",

      name:
        "Mejor integración → Readiness",

      description:
        "Mejorar integración, APIs y doble digitación no debería reducir Readiness.",

      steps: [
        {
          label:
            "Sin integración",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
                "Excel",
              ],

              systemsIntegrated:
                "none",

              apiAvailability:
                "none",

              doubleEntry:
                "frequent",
            }),
        },
        {
          label:
            "Integración parcial",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
                "Excel",
              ],

              systemsIntegrated:
                "some",

              apiAvailability:
                "some",

              doubleEntry:
                "sometimes",
            }),
        },
        {
          label:
            "Integración madura",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
              ],

              systemsIntegrated:
                "most",

              apiAvailability:
                "most",

              doubleEntry:
                "no",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-decreasing",
        },

        {
          score:
            "opportunity",

          direction:
            "non-increasing",
        },
      ],
    },

    /*
     * 06
     * EXCEPCIONES
     */
    {
      id: "exceptions-readiness",

      name:
        "Excepciones → Readiness",

      description:
        "Aumentar las excepciones no debería mejorar la preparación.",

      steps: [
        {
          label:
            "Excepciones bajas",

          answers:
            buildAnswers({
              exceptionsLevel:
                "low",
            }),
        },
        {
          label:
            "Excepciones medias",

          answers:
            buildAnswers({
              exceptionsLevel:
                "medium",
            }),
        },
        {
          label:
            "Excepciones altas",

          answers:
            buildAnswers({
              exceptionsLevel:
                "high",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-increasing",
        },
      ],
    },

    /*
     * 07
     * RETRABAJO
     */
    {
      id: "rework-behaviour",

      name:
        "Retrabajo → Readiness y Opportunity",

      description:
        "Más retrabajo debería reducir preparación y aumentar o mantener oportunidad e impacto.",

      steps: [
        {
          label:
            "Retrabajo raro",

          answers:
            buildAnswers({
              reworkLevel:
                "rare",
            }),
        },
        {
          label:
            "Retrabajo ocasional",

          answers:
            buildAnswers({
              reworkLevel:
                "sometimes",
            }),
        },
        {
          label:
            "Retrabajo frecuente",

          answers:
            buildAnswers({
              reworkLevel:
                "frequent",
            }),
        },
        {
          label:
            "Retrabajo constante",

          answers:
            buildAnswers({
              reworkLevel:
                "constant",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-increasing",
        },

        {
          score:
            "opportunity",

          direction:
            "non-decreasing",
        },

        {
          score:
            "businessImpact",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 08
     * REGLAS
     */
    {
      id: "rules-readiness",

      name:
        "Reglas conocidas → Readiness",

      description:
        "Mejorar la definición de reglas no debería reducir Readiness.",

      steps: [
        {
          label:
            "Sin reglas",

          answers:
            buildAnswers({
              rulesKnown:
                "none",

              exceptionsLevel:
                "medium",
            }),
        },
        {
          label:
            "Algunas reglas",

          answers:
            buildAnswers({
              rulesKnown:
                "some",

              exceptionsLevel:
                "medium",
            }),
        },
        {
          label:
            "Mayoría de reglas",

          answers:
            buildAnswers({
              rulesKnown:
                "most",

              exceptionsLevel:
                "medium",
            }),
        },
        {
          label:
            "Todas las reglas",

          answers:
            buildAnswers({
              rulesKnown:
                "all",

              exceptionsLevel:
                "medium",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-decreasing",
        },
      ],
    },

    /*
     * 09
     * DOCUMENTOS / EXTRACCIÓN
     */
    {
      id: "document-information-readiness",

      name:
        "Extracción documental → Readiness",

      description:
        "Reducir extracción manual de documentos no debería reducir Readiness.",

      steps: [
        {
          label:
            "Extracción manual",

          answers:
            buildAnswers({
              usesDocuments:
                "yes",

              documentTypes: [
                "PDF",
                "Facturas",
              ],

              manualDataExtraction:
                "yes",
            }),
        },
        {
          label:
            "Extracción parcialmente manual",

          answers:
            buildAnswers({
              usesDocuments:
                "yes",

              documentTypes: [
                "PDF",
                "Facturas",
              ],

              manualDataExtraction:
                "sometimes",
            }),
        },
        {
          label:
            "Extracción automatizada",

          answers:
            buildAnswers({
              usesDocuments:
                "yes",

              documentTypes: [
                "PDF",
                "Facturas",
              ],

              manualDataExtraction:
                "no",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-decreasing",
        },

        {
          score:
            "opportunity",

          direction:
            "non-increasing",
        },
      ],
    },

    /*
     * 10
     * APROBACIONES
     */
    {
      id: "approval-readiness",

      name:
        "Aprobaciones humanas → Readiness",

      description:
        "Aumentar dependencia de aprobaciones no debería mejorar Readiness.",

      steps: [
        {
          label:
            "Sin aprobación",

          answers:
            buildAnswers({
              requiresApproval:
                "no",
            }),
        },
        {
          label:
            "Aprobación ocasional",

          answers:
            buildAnswers({
              requiresApproval:
                "sometimes",
            }),
        },
        {
          label:
            "Aprobación requerida",

          answers:
            buildAnswers({
              requiresApproval:
                "yes",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-increasing",
        },
      ],
    },

    /*
     * 11
     * API
     */
    {
      id: "api-readiness",

      name:
        "Disponibilidad API → Readiness",

      description:
        "Mejor disponibilidad de APIs no debería reducir Readiness.",

      steps: [
        {
          label:
            "Sin API",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
              ],

              systemsIntegrated:
                "some",

              apiAvailability:
                "none",

              doubleEntry:
                "sometimes",
            }),
        },
        {
          label:
            "Algunas APIs",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
              ],

              systemsIntegrated:
                "some",

              apiAvailability:
                "some",

              doubleEntry:
                "sometimes",
            }),
        },
        {
          label:
            "APIs disponibles",

          answers:
            buildAnswers({
              usesMultipleSystems:
                "yes",

              systemsUsed: [
                "ERP",
                "CRM",
              ],

              systemsIntegrated:
                "some",

              apiAvailability:
                "most",

              doubleEntry:
                "sometimes",
            }),
        },
      ],

      expectations: [
        {
          score:
            "readiness",

          direction:
            "non-decreasing",
        },

        {
          score:
            "opportunity",

          direction:
            "non-increasing",
        },
      ],
    },

    /*
     * 12
     * CONFIDENCE
     */
    {
      id: "information-confidence",

      name:
        "Completitud de información → Confidence",

      description:
        "Agregar información al Assessment no debería reducir Confidence.",

      steps: [
        {
          label:
            "Información mínima",

          answers: {
            company:
              "Empresa de prueba",

            processName:
              "Proceso de prueba",
          },
        },
        {
          label:
            "Información básica",

          answers: {
            company:
              "Empresa de prueba",

            industry:
              "Servicios",

            employees:
              "51-200",

            processName:
              "Proceso de prueba",

            manualPercentage:
              "50",

            rulesKnown:
              "most",
          },
        },
        {
          label:
            "Información operacional parcial",

          answers: {
            company:
              "Empresa de prueba",

            industry:
              "Servicios",

            employees:
              "51-200",

            mainPain:
              "Trabajo manual",

            processName:
              "Proceso de prueba",

            processDescription:
              "Proceso operacional con información parcial para validar el nivel de confianza.",

            frequency:
              "daily",

            manualPercentage:
              "50",

            usesDocuments:
              "no",

            usesMultipleSystems:
              "no",

            rulesKnown:
              "most",

            requiresApproval:
              "no",

            exceptionsLevel:
              "low",

            reworkLevel:
              "rare",

            executionsPerMonth:
              "300",
          },
        },
        {
          label:
            "Assessment completo",

          answers:
            buildAnswers({}),
        },
      ],

      expectations: [
        {
          score:
            "confidence",

          direction:
            "non-decreasing",
        },
      ],
    },
  ];

/*
 * ==========================================================
 * VALIDATION ENGINE
 * ==========================================================
 */

function validateDirection(
  score:
    ScoreName,

  direction:
    Direction,

  steps:
    SensitivityStepResult[],
): string[] {
  const failures:
    string[] = [];

  for (
    let index = 1;
    index < steps.length;
    index += 1
  ) {
    const previous =
      steps[index - 1];

    const current =
      steps[index];

    const previousValue =
      previous.scores[
        score
      ];

    const currentValue =
      current.scores[
        score
      ];

    if (
      direction ===
        "non-decreasing" &&
      currentValue <
        previousValue
    ) {
      failures.push(
        `${score}: "${current.label}" (${currentValue}) < "${previous.label}" (${previousValue})`,
      );
    }

    if (
      direction ===
        "non-increasing" &&
      currentValue >
        previousValue
    ) {
      failures.push(
        `${score}: "${current.label}" (${currentValue}) > "${previous.label}" (${previousValue})`,
      );
    }
  }

  return failures;
}

export function runScoringSensitivityValidation():
  SensitivityValidationResult[] {
  return scoringSensitivityCases.map(
    (sensitivityCase) => {
      const steps =
        sensitivityCase.steps.map(
          (step) => ({
            label:
              step.label,

            scores:
              calculateV2IntelligenceScores(
                step.answers,
              ),
          }),
        );

      const failures:
        string[] = [];

      for (
        const expectation
        of sensitivityCase.expectations
      ) {
        failures.push(
          ...validateDirection(
            expectation.score,
            expectation.direction,
            steps,
          ),
        );
      }

      return {
        id:
          sensitivityCase.id,

        name:
          sensitivityCase.name,

        passed:
          failures.length ===
          0,

        steps,

        failures,
      };
    },
  );
}

export function printScoringSensitivityValidation():
  boolean {
  const results =
    runScoringSensitivityValidation();

  console.log("");
  console.log(
    "====================================================",
  );

  console.log(
    " XONPLACE SCORING SENSITIVITY SUITE V1",
  );

  console.log(
    "====================================================",
  );

  console.log("");

  for (
    const result
    of results
  ) {
    const status =
      result.passed
        ? "PASS"
        : "FAIL";

    console.log(
      `[${status}] ${result.name}`,
    );

    for (
      const step
      of result.steps
    ) {
      console.log(
        `       ${step.label}`,
      );

      console.log(
        `         R:${step.scores.readiness} O:${step.scores.opportunity} B:${step.scores.businessImpact} C:${step.scores.confidence}`,
      );
    }

    if (
      !result.passed
    ) {
      for (
        const failure
        of result.failures
      ) {
        console.log(
          `       -> ${failure}`,
        );
      }
    }

    console.log("");
  }

  const passed =
    results.filter(
      (result) =>
        result.passed,
    ).length;

  const failed =
    results.length -
    passed;

  console.log(
    "----------------------------------------------------",
  );

  console.log(
    `Resultado: ${passed}/${results.length} pruebas de sensibilidad aprobadas`,
  );

  console.log(
    `Fallidas: ${failed}`,
  );

  console.log(
    "----------------------------------------------------",
  );

  return failed === 0;
}