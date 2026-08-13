import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/prisma";

export type CreatePreAssessmentRecordInput = {
  tokenHash: string;

  email?: string;

  contactName?: string;

  companyName?: string;

  context:
    Prisma.InputJsonValue;

  expiresAt:
    Date;
};

export async function createPreAssessmentRecord(
  input: CreatePreAssessmentRecordInput,
) {
  return prisma.preAssessment.create({
    data: {
      tokenHash:
        input.tokenHash,

      email:
        input.email,

      contactName:
        input.contactName,

      companyName:
        input.companyName,

      context:
        input.context,

      status:
        "PENDING",

      expiresAt:
        input.expiresAt,
    },
  });
}

export async function findPreAssessmentByTokenHash(
  tokenHash: string,
) {
  return prisma.preAssessment.findUnique({
    where: {
      tokenHash,
    },
  });
}

export async function markPreAssessmentOpened(
  id: string,
) {
  return prisma.preAssessment.update({
    where: {
      id,
    },

    data: {
      status:
        "OPENED",
    },
  });
}

export async function markPreAssessmentConsumed(
  id: string,
) {
  return prisma.preAssessment.update({
    where: {
      id,
    },

    data: {
      status:
        "CONSUMED",
    },
  });
}

export async function markPreAssessmentExpired(
  id: string,
) {
  return prisma.preAssessment.update({
    where: {
      id,
    },

    data: {
      status:
        "EXPIRED",
    },
  });
}