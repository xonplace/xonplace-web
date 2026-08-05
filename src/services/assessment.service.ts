import type { Prisma } from "@/generated/prisma/client";
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
    answers: Prisma.InputJsonValue;
    dimensions: Prisma.InputJsonValue;
    insights: Prisma.InputJsonValue;
  };
  blueprint: {
    content: Prisma.InputJsonValue;
  };
};

export type SaveAssessmentResult = {
  clientId: string;
  assessmentId: string;
  blueprintId: string;
};

function cleanOptionalText(value?: string): string | undefined {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : undefined;
}

function validateAssessmentInput(input: SaveAssessmentInput): void {
  const clientName = input.client.name.trim();

  if (!clientName) {
    throw new Error("El nombre del cliente es obligatorio.");
  }

  if (
    !Number.isInteger(input.assessment.automationScore) ||
    input.assessment.automationScore < 0 ||
    input.assessment.automationScore > 100
  ) {
    throw new Error(
      "El Automation Score debe ser un número entero entre 0 y 100.",
    );
  }

  if (!input.assessment.level.trim()) {
    throw new Error("El nivel del Assessment es obligatorio.");
  }

  if (!input.assessment.answers) {
    throw new Error("Las respuestas del Assessment son obligatorias.");
  }

  if (!input.assessment.dimensions) {
    throw new Error("Las dimensiones del Assessment son obligatorias.");
  }

  if (!input.assessment.insights) {
    throw new Error("Los resultados del Assessment son obligatorios.");
  }

  if (!input.blueprint.content) {
    throw new Error("El contenido del Blueprint es obligatorio.");
  }
}

export async function saveAssessment(
  input: SaveAssessmentInput,
): Promise<SaveAssessmentResult> {
  validateAssessmentInput(input);

  const repositoryInput: CreateAssessmentRecordInput = {
    client: {
      name: input.client.name.trim(),
      industry: cleanOptionalText(input.client.industry),
      employeeSize: cleanOptionalText(input.client.employeeSize),
      country: cleanOptionalText(input.client.country) ?? "Chile",
    },
    assessment: {
      automationScore: input.assessment.automationScore,
      level: input.assessment.level.trim(),
      answers: input.assessment.answers,
      dimensions: input.assessment.dimensions,
      insights: input.assessment.insights,
    },
    blueprint: {
      content: input.blueprint.content,
    },
  };

  const client = await createAssessmentRecord(repositoryInput);
  const assessment = client.assessments[0];
  const blueprint = assessment?.blueprint;

  if (!assessment) {
    throw new Error("No fue posible crear el Assessment.");
  }

  if (!blueprint) {
    throw new Error("No fue posible crear el Blueprint.");
  }

  return {
    clientId: client.id,
    assessmentId: assessment.id,
    blueprintId: blueprint.id,
  };
}
export async function getBlueprintById(id: string) {
  const blueprintId = id.trim();

  if (!blueprintId) {
    throw new Error("El ID del Blueprint es obligatorio.");
  }

  const blueprint = await findBlueprintById(blueprintId);

  if (!blueprint) {
    return null;
  }

  return blueprint;
}