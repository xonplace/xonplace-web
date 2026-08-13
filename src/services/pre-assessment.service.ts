import {
  createHash,
  randomBytes,
} from "node:crypto";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  assessmentV2Questions,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

import {
  createPreAssessmentRecord,
  findPreAssessmentByTokenHash,
  markPreAssessmentExpired,
  markPreAssessmentOpened,
} from "@/repositories/pre-assessment.repository";

const PRE_ASSESSMENT_EXPIRATION_DAYS =
  7;

export type CreatePreAssessmentInput = {
  email?: string;

  contactName?: string;

  companyName?: string;

  context:
    AssessmentV2Answers;
};

export type CreatePreAssessmentResult = {
  id: string;

  token: string;

  expiresAt: Date;

  context:
    AssessmentV2Answers;
};

export type GetPreAssessmentResult = {
  id: string;

  email?: string;

  contactName?: string;

  companyName?: string;

  context:
    AssessmentV2Answers;

  status: string;

  expiresAt: Date;
};

function cleanOptionalText(
  value?: string,
): string | undefined {
  const cleaned =
    value?.trim();

  return cleaned
    ? cleaned
    : undefined;
}

function normalizeEmail(
  value?: string,
): string | undefined {
  const email =
    cleanOptionalText(
      value,
    )?.toLowerCase();

  if (!email) {
    return undefined;
  }

  const basicEmailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !basicEmailPattern.test(
      email,
    )
  ) {
    throw new Error(
      "El correo electrónico no tiene un formato válido.",
    );
  }

  return email;
}

function createSecureToken():
  string {
  /*
   * 32 bytes aleatorios =
   * 256 bits de entropía.
   *
   * base64url produce un valor
   * seguro para utilizar dentro
   * de una URL.
   */
  return randomBytes(
    32,
  ).toString(
    "base64url",
  );
}

function hashToken(
  token: string,
): string {
  return createHash(
    "sha256",
  )
    .update(
      token,
    )
    .digest(
      "hex",
    );
}

function getExpirationDate():
  Date {
  const expiration =
    new Date();

  expiration.setDate(
    expiration.getDate() +
      PRE_ASSESSMENT_EXPIRATION_DAYS,
  );

  return expiration;
}

/*
 * =========================================================
 * VALIDACIÓN DEL CONTEXTO
 * =========================================================
 *
 * Nunca almacenamos directamente cualquier estructura
 * que entregue una IA.
 *
 * Solo aceptamos IDs existentes en Assessment V2.
 */

function sanitizeContext(
  input:
    AssessmentV2Answers,
): AssessmentV2Answers {
  const sanitized:
    AssessmentV2Answers = {};

  const questionMap =
    new Map(
      assessmentV2Questions.map(
        (question) => [
          question.id,
          question,
        ],
      ),
    );

  for (
    const [
      key,
      rawValue,
    ] of Object.entries(
      input,
    )
  ) {
    const question =
      questionMap.get(
        key,
      );

    /*
     * El modelo podría intentar
     * crear una propiedad que
     * nuestro Assessment no conoce.
     *
     * Simplemente la descartamos.
     */
    if (!question) {
      continue;
    }

    if (
      question.type ===
      "multiple"
    ) {
      if (
        !Array.isArray(
          rawValue,
        )
      ) {
        continue;
      }

      const validOptions =
        new Set(
          question.options?.map(
            (option) =>
              option.value,
          ) ?? [],
        );

      const values =
        rawValue.filter(
          (
            value,
          ): value is string =>
            typeof value ===
              "string" &&
            validOptions.has(
              value,
            ),
        );

      if (
        values.length >
        0
      ) {
        sanitized[key] =
          values;
      }

      continue;
    }

    if (
      typeof rawValue !==
      "string"
    ) {
      continue;
    }

    const value =
      rawValue.trim();

    if (!value) {
      continue;
    }

    /*
     * Para preguntas single,
     * únicamente aceptamos valores
     * existentes en sus opciones.
     */
    if (
      question.type ===
      "single"
    ) {
      const validOptions =
        new Set(
          question.options?.map(
            (option) =>
              option.value,
          ) ?? [],
        );

      if (
        validOptions.has(
          value,
        )
      ) {
        sanitized[key] =
          value;
      }

      continue;
    }

    /*
     * Para números mantenemos string
     * porque AssessmentV2Answers
     * trabaja actualmente con strings.
     */
    if (
      question.type ===
      "number"
    ) {
      const number =
        Number(
          value,
        );

      if (
        Number.isFinite(
          number,
        ) &&
        number >= 0
      ) {
        sanitized[key] =
          value;
      }

      continue;
    }

    /*
     * Texto libre.
     *
     * Limitamos longitud para evitar
     * almacenar contenido excesivo.
     */
    if (
      question.type ===
      "text"
    ) {
      sanitized[key] =
        value.slice(
          0,
          2000,
        );
    }
  }

  return sanitized;
}

export async function createPreAssessment(
  input: CreatePreAssessmentInput,
): Promise<CreatePreAssessmentResult> {
  const email =
    normalizeEmail(
      input.email,
    );

  const contactName =
    cleanOptionalText(
      input.contactName,
    );

  const companyName =
    cleanOptionalText(
      input.companyName,
    );

  const context =
    sanitizeContext(
      input.context,
    );

  if (
    Object.keys(
      context,
    ).length === 0
  ) {
    throw new Error(
      "No existe información válida para preparar el Assessment.",
    );
  }

  const token =
    createSecureToken();

  const tokenHash =
    hashToken(
      token,
    );

  const expiresAt =
    getExpirationDate();

  const record =
    await createPreAssessmentRecord({
      tokenHash,

      email,

      contactName,

      companyName,

      context:
        context as Prisma.InputJsonValue,

      expiresAt,
    });

  return {
    id:
      record.id,

    token,

    expiresAt,

    context,
  };
}

export async function getPreAssessmentByToken(
  token: string,
): Promise<GetPreAssessmentResult | null> {
  const cleanToken =
    token.trim();

  if (!cleanToken) {
    return null;
  }

  const tokenHash =
    hashToken(
      cleanToken,
    );

  const record =
    await findPreAssessmentByTokenHash(
      tokenHash,
    );

  if (!record) {
    return null;
  }

  /*
   * El link ya venció.
   */
  if (
    record.expiresAt.getTime() <
    Date.now()
  ) {
    if (
      record.status !==
      "EXPIRED"
    ) {
      await markPreAssessmentExpired(
        record.id,
      );
    }

    return null;
  }

  /*
   * Un Assessment ya consumido
   * no debería volver a iniciarse.
   */
  if (
    record.status ===
    "CONSUMED"
  ) {
    return null;
  }

  if (
    record.status ===
    "PENDING"
  ) {
    await markPreAssessmentOpened(
      record.id,
    );
  }

  return {
    id:
      record.id,

    email:
      record.email ??
      undefined,

    contactName:
      record.contactName ??
      undefined,

    companyName:
      record.companyName ??
      undefined,

    context:
      record.context as
        AssessmentV2Answers,

    status:
      record.status ===
      "PENDING"
        ? "OPENED"
        : record.status,

    expiresAt:
      record.expiresAt,
  };
}