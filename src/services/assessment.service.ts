import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  createAssessmentRecord,
  findBlueprintById,
  type CreateAssessmentRecordInput,
} from "@/repositories/assessment.repository";

export type SaveAssessmentInput = {
  client: {
    name: string;
    industry?: string;
    employeeSize?: string;
    country?: string;
  };

  assessment: {
    automationScore: number;
    level: string;

    assessmentVersion?: string;
    scoringVersion?: string;

    readinessScore?: number;
    opportunityScore?: number;
    businessImpactScore?: number;
    confidenceScore?: number;

    answers:
      Prisma.InputJsonValue;

    dimensions:
      Prisma.InputJsonValue;

    insights:
      Prisma.InputJsonValue;

    intelligence?:
      Prisma.InputJsonValue;
  };

  blueprint: {
    content:
      Prisma.InputJsonValue;

    version?: number;

    scoringVersion?: string;
  };
};

export type SaveAssessmentResult = {
  clientId: string;
  assessmentId: string;
  blueprintId: string;
};

function cleanOptionalText(
  value?: string,
): string | undefined {
  const cleanedValue =
    value?.trim();

  return cleanedValue
    ? cleanedValue
    : undefined;
}

function validateScore(
  value: number | undefined,
  name: string,
): void {
  if (
    value === undefined
  ) {
    return;
  }

  if (
    !Number.isInteger(value) ||
    value < 0 ||
    value > 100
  ) {
    throw new Error(
      `${name} debe ser un número entero entre 0 y 100.`,
    );
  }
}

function validateAssessmentInput(
  input: SaveAssessmentInput,
): void {
  const clientName =
    input.client.name.trim();

  if (!clientName) {
    throw new Error(
      "El nombre del cliente es obligatorio.",
    );
  }

  validateScore(
    input.assessment
      .automationScore,
    "Automation Score",
  );

  validateScore(
    input.assessment
      .readinessScore,
    "Readiness Score",
  );

  validateScore(
    input.assessment
      .opportunityScore,
    "Opportunity Score",
  );

  validateScore(
    input.assessment
      .businessImpactScore,
    "Business Impact Score",
  );

  validateScore(
    input.assessment
      .confidenceScore,
    "Confidence Score",
  );

  if (
    !input.assessment.level.trim()
  ) {
    throw new Error(
      "El nivel del Assessment es obligatorio.",
    );
  }

  if (
    !input.assessment.answers
  ) {
    throw new Error(
      "Las respuestas del Assessment son obligatorias.",
    );
  }

  if (
    !input.assessment.dimensions
  ) {
    throw new Error(
      "Las dimensiones del Assessment son obligatorias.",
    );
  }

  if (
    !input.assessment.insights
  ) {
    throw new Error(
      "Los resultados del Assessment son obligatorios.",
    );
  }

  if (
    !input.blueprint.content
  ) {
    throw new Error(
      "El contenido del Blueprint es obligatorio.",
    );
  }

  if (
    input.blueprint.version !==
      undefined &&
    (
      !Number.isInteger(
        input.blueprint.version,
      ) ||
      input.blueprint.version <
        1
    )
  ) {
    throw new Error(
      "La versión del Blueprint debe ser un entero mayor o igual a 1.",
    );
  }
}

export async function saveAssessment(
  input: SaveAssessmentInput,
): Promise<SaveAssessmentResult> {
  validateAssessmentInput(
    input,
  );

  const repositoryInput:
    CreateAssessmentRecordInput = {
      client: {
        name:
          input.client.name.trim(),

        industry:
          cleanOptionalText(
            input.client.industry,
          ),

        employeeSize:
          cleanOptionalText(
            input.client.employeeSize,
          ),

        country:
          cleanOptionalText(
            input.client.country,
          ) ?? "Chile",
      },

      assessment: {
        automationScore:
          input.assessment
            .automationScore,

        level:
          input.assessment.level.trim(),

        assessmentVersion:
          cleanOptionalText(
            input.assessment
              .assessmentVersion,
          ),

        scoringVersion:
          cleanOptionalText(
            input.assessment
              .scoringVersion,
          ),

        readinessScore:
          input.assessment
            .readinessScore,

        opportunityScore:
          input.assessment
            .opportunityScore,

        businessImpactScore:
          input.assessment
            .businessImpactScore,

        confidenceScore:
          input.assessment
            .confidenceScore,

        answers:
          input.assessment.answers,

        dimensions:
          input.assessment.dimensions,

        insights:
          input.assessment.insights,

        intelligence:
          input.assessment
            .intelligence,
      },

      blueprint: {
        content:
          input.blueprint.content,

        version:
          input.blueprint.version,

        scoringVersion:
          cleanOptionalText(
            input.blueprint
              .scoringVersion,
          ),
      },
    };

  const client =
    await createAssessmentRecord(
      repositoryInput,
    );

  const assessment =
    client.assessments[0];

  const blueprint =
    assessment?.blueprint;

  if (!assessment) {
    throw new Error(
      "No fue posible crear el Assessment.",
    );
  }

  if (!blueprint) {
    throw new Error(
      "No fue posible crear el Blueprint.",
    );
  }

  return {
    clientId:
      client.id,

    assessmentId:
      assessment.id,

    blueprintId:
      blueprint.id,
  };
}

export async function getBlueprintById(
  id: string,
) {
  const blueprintId =
    id.trim();

  if (!blueprintId) {
    throw new Error(
      "El ID del Blueprint es obligatorio.",
    );
  }

  const blueprint =
    await findBlueprintById(
      blueprintId,
    );

  if (!blueprint) {
    return null;
  }

  return blueprint;
}