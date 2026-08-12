import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

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

export async function createAssessmentRecord(
  input: CreateAssessmentRecordInput,
) {
  return prisma.client.create({
    data: {
      name:
        input.client.name,

      industry:
        input.client.industry,

      employeeSize:
        input.client.employeeSize,

      country:
        input.client.country ??
        "Chile",

      assessments: {
        create: {
          status:
            "COMPLETED",

          automationScore:
            input.assessment
              .automationScore,

          level:
            input.assessment.level,

          assessmentVersion:
            input.assessment
              .assessmentVersion ??
            "1.0",

          scoringVersion:
            input.assessment
              .scoringVersion ??
            "1.0",

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

          blueprint: {
            create: {
              content:
                input.blueprint
                  .content,

              version:
                input.blueprint
                  .version ??
                1,

              scoringVersion:
                input.blueprint
                  .scoringVersion ??
                input.assessment
                  .scoringVersion ??
                "1.0",
            },
          },
        },
      },
    },

    include: {
      assessments: {
        include: {
          blueprint:
            true,
        },
      },
    },
  });
}

export async function findBlueprintById(
  id: string,
) {
  return prisma.blueprint.findUnique({
    where: {
      id,
    },

    include: {
      assessment: {
        include: {
          client:
            true,
        },
      },
    },
  });
}