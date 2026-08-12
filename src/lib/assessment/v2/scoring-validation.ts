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

type ScoreRange = {
  min?: number;
  max?: number;
};

type ExpectedScores =
  Partial<
    Record<
      ScoreName,
      ScoreRange
    >
  >;

type ValidationCase = {
  id: string;
  name: string;
  description: string;

  answers:
    AssessmentV2Answers;

  expected:
    ExpectedScores;
};

type ValidationResult = {
  id: string;
  name: string;

  scores:
    IntelligenceScores;

  expected:
    ExpectedScores;

  passed: boolean;

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
      "Proceso operacional utilizado para validar el comportamiento del motor de diagnóstico XONPLACE.",

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

export const scoringValidationCases:
  ValidationCase[] = [
    {
      id: "healthy-baseline",

      name:
        "Proceso base saludable",

      description:
        "Proceso relativamente estructurado, con reglas conocidas, poca excepción y sin brechas relevantes.",

      answers:
        buildAnswers({}),

      expected: {
        readiness: {
          min: 70,
        },

        opportunity: {
          max: 65,
        },

        confidence: {
          min: 85,
        },
      },
    },

    {
      id: "extreme-manual",

      name:
        "Proceso altamente manual",

      description:
        "Proceso con intervención humana prácticamente completa.",

      answers:
        buildAnswers({
          manualPercentage:
            "100",

          executionsPerMonth:
            "1000",

          peopleInvolved:
            "10",

          minutesPerExecution:
            "30",
        }),

      expected: {
        opportunity: {
          min: 45,
        },

        businessImpact: {
          min: 80,
        },

        confidence: {
          min: 85,
        },
      },
    },

    {
      id: "almost-automated",

      name:
        "Proceso casi automatizado",

      description:
        "Proceso con muy baja intervención manual y buenas condiciones operacionales.",

      answers:
        buildAnswers({
          manualPercentage:
            "10",

          rulesKnown:
            "all",

          exceptionsLevel:
            "low",

          reworkLevel:
            "rare",

          requiresApproval:
            "no",
        }),

      expected: {
        readiness: {
          min: 75,
        },

        opportunity: {
          max: 55,
        },
      },
    },

    {
      id: "disconnected-systems",

      name:
        "Sistemas desconectados",

      description:
        "Proceso distribuido entre múltiples sistemas sin integración.",

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

      expected: {
        readiness: {
          max: 75,
        },

        opportunity: {
          min: 50,
        },

        confidence: {
          min: 85,
        },
      },
    },

    {
      id: "mature-integration",

      name:
        "Integración tecnológica madura",

      description:
        "Múltiples sistemas con integración, APIs disponibles y sin doble digitación.",

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

      expected: {
        readiness: {
          min: 75,
        },

        confidence: {
          min: 90,
        },
      },
    },

    {
      id: "manual-documents",

      name:
        "Proceso documental manual",

      description:
        "Proceso dependiente de documentos con extracción manual de información.",

      answers:
        buildAnswers({
          usesDocuments:
            "yes",

          documentTypes: [
            "Facturas",
            "Órdenes de compra",
            "PDF",
          ],

          manualDataExtraction:
            "yes",

          manualPercentage:
            "80",
        }),

      expected: {
        opportunity: {
          min: 55,
        },
      },
    },

    {
      id: "structured-documents",

      name:
        "Proceso documental estructurado",

      description:
        "Proceso que utiliza documentos pero sin extracción manual significativa.",

      answers:
        buildAnswers({
          usesDocuments:
            "yes",

          documentTypes: [
            "Facturas",
            "Formularios",
          ],

          manualDataExtraction:
            "no",
        }),

      expected: {
        readiness: {
          min: 70,
        },
      },
    },

    {
      id: "high-volume",

      name:
        "Proceso de alto volumen",

      description:
        "Proceso con más de mil ejecuciones mensuales.",

      answers:
        buildAnswers({
          executionsPerMonth:
            "1500",

          peopleInvolved:
            "5",

          minutesPerExecution:
            "10",

          manualPercentage:
            "70",
        }),

      expected: {
        businessImpact: {
          min: 75,
        },
      },
    },

    {
      id: "low-volume",

      name:
        "Proceso de bajo volumen",

      description:
        "Proceso ocasional con pocas ejecuciones y bajo consumo de horas.",

      answers:
        buildAnswers({
          frequency:
            "occasional",

          executionsPerMonth:
            "5",

          peopleInvolved:
            "1",

          minutesPerExecution:
            "10",

          manualPercentage:
            "30",
        }),

      expected: {
        businessImpact: {
          max: 50,
        },

        opportunity: {
          max: 60,
        },
      },
    },

    {
      id: "constant-rework",

      name:
        "Retrabajo constante",

      description:
        "Proceso con errores y retrabajo permanente.",

      answers:
        buildAnswers({
          reworkLevel:
            "constant",

          manualPercentage:
            "80",

          executionsPerMonth:
            "500",
        }),

      expected: {
        readiness: {
          max: 80,
        },

        opportunity: {
          min: 45,
        },

        businessImpact: {
          min: 55,
        },
      },
    },

    {
      id: "high-exceptions",

      name:
        "Alta variabilidad y excepciones",

      description:
        "Proceso donde gran parte de las ejecuciones requieren tratamiento excepcional.",

      answers:
        buildAnswers({
          exceptionsLevel:
            "high",

          rulesKnown:
            "some",
        }),

      expected: {
        readiness: {
          max: 75,
        },
      },
    },

    {
      id: "clear-rules",

      name:
        "Reglas completamente conocidas",

      description:
        "Proceso determinista y altamente estructurado.",

      answers:
        buildAnswers({
          rulesKnown:
            "all",

          exceptionsLevel:
            "low",

          reworkLevel:
            "rare",
        }),

      expected: {
        readiness: {
          min: 75,
        },
      },
    },

    {
      id: "no-rules",

      name:
        "Proceso sin reglas claras",

      description:
        "Proceso poco estandarizado y dependiente del criterio humano.",

      answers:
        buildAnswers({
          rulesKnown:
            "none",

          exceptionsLevel:
            "high",
        }),

      /*
       * KNOWN CALIBRATION ISSUE
       *
       * Actualmente el motor entrega un
       * Readiness superior al esperado.
       *
       * Este caso debe mantenerse fallando
       * hasta revisar conscientemente la
       * fórmula de Readiness.
       */
      expected: {
        readiness: {
          max: 60,
        },
      },
    },

    {
      id: "approval-heavy",

      name:
        "Proceso dependiente de aprobaciones",

      description:
        "Proceso con intervención de aprobación humana.",

      answers:
        buildAnswers({
          requiresApproval:
            "yes",

          manualPercentage:
            "70",
        }),

      expected: {
        readiness: {
          max: 85,
        },
      },
    },

    {
      id: "massive-operational-load",

      name:
        "Carga operacional masiva",

      description:
        "Proceso de gran volumen, muchas personas y alta dedicación mensual.",

      answers:
        buildAnswers({
          executionsPerMonth:
            "3000",

          peopleInvolved:
            "15",

          minutesPerExecution:
            "30",

          manualPercentage:
            "90",

          reworkLevel:
            "frequent",
        }),

      expected: {
        businessImpact: {
          min: 85,
        },

        opportunity: {
          min: 50,
        },
      },
    },

    {
      id: "small-but-inefficient",

      name:
        "Proceso ineficiente de bajo impacto",

      description:
        "Proceso muy manual y deficiente, pero con poco volumen y pocas personas.",

      answers:
        buildAnswers({
          executionsPerMonth:
            "5",

          peopleInvolved:
            "1",

          minutesPerExecution:
            "15",

          manualPercentage:
            "100",

          reworkLevel:
            "constant",

          rulesKnown:
            "none",

          exceptionsLevel:
            "high",
        }),

      expected: {
        readiness: {
          max: 60,
        },

        businessImpact: {
          max: 60,
        },
      },
    },

    {
      id: "incomplete-information",

      name:
        "Assessment incompleto",

      description:
        "Caso diseñado para comprobar que Confidence disminuya cuando faltan datos.",

      answers: {
        company:
          "Empresa incompleta",

        processName:
          "Proceso desconocido",

        manualPercentage:
          "70",
      },

      expected: {
        confidence: {
          max: 45,
        },
      },
    },

    {
      id: "ideal-automation-candidate",

      name:
        "Candidato ideal de automatización",

      description:
        "Alto volumen, mucha manualidad, reglas claras, documentos, doble digitación y retrabajo.",

      answers:
        buildAnswers({
          executionsPerMonth:
            "1500",

          peopleInvolved:
            "8",

          minutesPerExecution:
            "20",

          manualPercentage:
            "90",

          usesDocuments:
            "yes",

          documentTypes: [
            "Facturas",
            "Órdenes",
            "Formularios",
          ],

          manualDataExtraction:
            "yes",

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
            "some",

          doubleEntry:
            "frequent",

          rulesKnown:
            "all",

          requiresApproval:
            "sometimes",

          exceptionsLevel:
            "medium",

          reworkLevel:
            "frequent",
        }),

      expected: {
        opportunity: {
          min: 75,
        },

        businessImpact: {
          min: 80,
        },

        confidence: {
          min: 90,
        },
      },
    },
  ];

function validateRange(
  scoreName:
    ScoreName,

  actual:
    number,

  expected:
    ScoreRange,
): string[] {
  const failures:
    string[] = [];

  if (
    expected.min !==
      undefined &&
    actual <
      expected.min
  ) {
    failures.push(
      `${scoreName}: ${actual} < mínimo esperado ${expected.min}`,
    );
  }

  if (
    expected.max !==
      undefined &&
    actual >
      expected.max
  ) {
    failures.push(
      `${scoreName}: ${actual} > máximo esperado ${expected.max}`,
    );
  }

  return failures;
}

export function runScoringValidation():
  ValidationResult[] {
  return scoringValidationCases.map(
    (validationCase) => {
      const scores =
        calculateV2IntelligenceScores(
          validationCase.answers,
        );

      const failures:
        string[] = [];

      for (const [
        scoreName,
        expected,
      ] of Object.entries(
        validationCase.expected,
      )) {
        if (!expected) {
          continue;
        }

        const typedScoreName =
          scoreName as ScoreName;

        failures.push(
          ...validateRange(
            typedScoreName,
            scores[
              typedScoreName
            ],
            expected,
          ),
        );
      }

      return {
        id:
          validationCase.id,

        name:
          validationCase.name,

        scores,

        expected:
          validationCase.expected,

        passed:
          failures.length ===
          0,

        failures,
      };
    },
  );
}

export function printScoringValidation():
  boolean {
  const results =
    runScoringValidation();

  console.log("");
  console.log(
    "==============================================",
  );
  console.log(
    " XONPLACE SCORING VALIDATION SUITE V1",
  );
  console.log(
    "==============================================",
  );
  console.log("");

  for (const result of results) {
    const status =
      result.passed
        ? "PASS"
        : "FAIL";

    console.log(
      `[${status}] ${result.name}`,
    );

    console.log(
      `       Readiness:       ${result.scores.readiness}`,
    );

    console.log(
      `       Opportunity:     ${result.scores.opportunity}`,
    );

    console.log(
      `       Business Impact: ${result.scores.businessImpact}`,
    );

    console.log(
      `       Confidence:      ${result.scores.confidence}`,
    );

    if (!result.passed) {
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
    "----------------------------------------------",
  );

  console.log(
    `Resultado: ${passed}/${results.length} casos aprobados`,
  );

  console.log(
    `Fallidos: ${failed}`,
  );

  console.log(
    "----------------------------------------------",
  );

  return failed === 0;
}