import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type CreateAssessmentRecordInput = {
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

export async function createAssessmentRecord(
  input: CreateAssessmentRecordInput,
) {
  return prisma.client.create({
    data: {
      name: input.client.name,
      industry: input.client.industry,
      employeeSize: input.client.employeeSize,
      country: input.client.country ?? "Chile",

      assessments: {
        create: {
          status: "COMPLETED",
          automationScore: input.assessment.automationScore,
          level: input.assessment.level,
          answers: input.assessment.answers,
          dimensions: input.assessment.dimensions,
          insights: input.assessment.insights,

          blueprint: {
            create: {
              content: input.blueprint.content,
              version: 1,
            },
          },
        },
      },
    },

    include: {
      assessments: {
        include: {
          blueprint: true,
        },
      },
    },
  });
}

export async function findBlueprintById(id: string) {
  return prisma.blueprint.findUnique({
    where: {
      id,
    },
    include: {
      assessment: {
        include: {
          client: true,
        },
      },
    },
  });
}