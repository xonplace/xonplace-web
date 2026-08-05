"use server";

import type { Prisma } from "@/generated/prisma/client";
import {
  saveAssessment,
  type SaveAssessmentInput,
} from "@/services/assessment.service";

export type SaveAssessmentActionInput = {
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

export type SaveAssessmentActionResult =
  | {
      success: true;
      clientId: string;
      assessmentId: string;
      blueprintId: string;
    }
  | {
      success: false;
      error: string;
    };

export async function saveAssessmentAction(
  input: SaveAssessmentActionInput,
): Promise<SaveAssessmentActionResult> {
  try {
    const serviceInput: SaveAssessmentInput = {
      client: input.client,
      assessment: input.assessment,
      blueprint: input.blueprint,
    };

    const result = await saveAssessment(serviceInput);

    return {
      success: true,
      clientId: result.clientId,
      assessmentId: result.assessmentId,
      blueprintId: result.blueprintId,
    };
  } catch (error) {
    console.error("Error al guardar el Assessment:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al guardar el Assessment.",
    };
  }
}