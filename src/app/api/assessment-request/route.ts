import {
  NextResponse,
} from "next/server";

import type {
  AssessmentV2Answers,
} from "@/lib/assessment/v2";

import {
  createPreAssessment,
} from "@/services/pre-assessment.service";

import {
  sendAssessmentAccessEmail,
  sendInternalAssessmentRequestEmail,
} from "@/services/email.service";

type AssessmentRequestBody = {
  name?: string;
  company?: string;
  email?: string;
  employees?: string;
  processName?: string;
};

const validEmployeeSizes =
  new Set([
    "1-20",
    "21-50",
    "51-200",
    "201-500",
    "500+",
  ]);

function cleanRequired(
  value: unknown,
  fieldName: string,
): string {
  if (
    typeof value !==
      "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} es obligatorio.`,
    );
  }

  return value
    .trim()
    .slice(0, 250);
}

function validateEmail(
  value: string,
): string {
  const email =
    value
      .trim()
      .toLowerCase();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  ) {
    throw new Error(
      "El correo electrónico no es válido.",
    );
  }

  return email;
}

/*
 * Determina la URL pública desde
 * donde debe continuar el Assessment.
 *
 * PRODUCCIÓN:
 * NEXT_PUBLIC_APP_URL=https://xonplace.com
 *
 * CODESPACES:
 * utilizamos x-forwarded-host porque
 * internamente Next.js puede recibir
 * localhost:3000 aunque el navegador
 * esté accediendo mediante app.github.dev.
 */
function getPublicBaseUrl(
  request: Request,
): string {
  const configuredProductionUrl =
    process.env
      .NEXT_PUBLIC_APP_URL
      ?.trim()
      .replace(/\/$/, "");

  /*
   * En producción siempre preferimos
   * la URL explícitamente configurada.
   */
  if (
    process.env.NODE_ENV ===
      "production" &&
    configuredProductionUrl
  ) {
    return configuredProductionUrl;
  }

  /*
   * GitHub Codespaces, Vercel y otros
   * proxies suelen informar el host
   * público mediante estos headers.
   */
  const forwardedHost =
    request.headers.get(
      "x-forwarded-host",
    );

  const forwardedProto =
    request.headers.get(
      "x-forwarded-proto",
    ) ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(
      /\/$/,
      "",
    );
  }

  /*
   * Fallback para desarrollo local
   * tradicional.
   */
  const requestUrl =
    new URL(
      request.url,
    );

  return requestUrl.origin.replace(
    /\/$/,
    "",
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as
        AssessmentRequestBody;

    /*
     * Validación de datos.
     */

    const name =
      cleanRequired(
        body.name,
        "El nombre",
      );

    const company =
      cleanRequired(
        body.company,
        "La empresa",
      );

    const email =
      validateEmail(
        cleanRequired(
          body.email,
          "El correo",
        ),
      );

    const employees =
      cleanRequired(
        body.employees,
        "El tamaño de la empresa",
      );

    if (
      !validEmployeeSizes.has(
        employees,
      )
    ) {
      throw new Error(
        "El tamaño de empresa no es válido.",
      );
    }

    const processName =
      typeof body.processName ===
        "string"
        ? body.processName
            .trim()
            .slice(0, 500)
        : "";

    /*
     * Construimos el contexto inicial
     * que será precargado posteriormente
     * en Assessment V2.
     */

    const context:
      AssessmentV2Answers = {
        company,
        employees,
      };

    if (processName) {
      context.processName =
        processName;
    }

    /*
     * Creamos el PreAssessment.
     *
     * Aquí se genera el token que
     * permitirá continuar el Assessment
     * sin exponer IDs internos.
     */

    const preAssessment =
      await createPreAssessment({
        email,

        contactName:
          name,

        companyName:
          company,

        context,
      });

    /*
     * Construcción de URL segura.
     */

    const relativeUrl =
      `/portal/assessment/v2?token=${encodeURIComponent(
        preAssessment.token,
      )}`;

    const baseUrl =
      getPublicBaseUrl(
        request,
      );

    const assessmentUrl =
      `${baseUrl}${relativeUrl}`;

    /*
     * Log operacional.
     *
     * No contiene secretos.
     * Nos permitirá comprobar fácilmente
     * qué URL está generando Codespaces
     * o Vercel.
     */

    console.log(
      "[Assessment Request] URL:",
      assessmentUrl,
    );

    /*
     * Envío al cliente.
     *
     * Si Resend falla, NO destruimos
     * el PreAssessment. El usuario todavía
     * podrá continuar desde la web.
     */

    let clientEmailSent =
      false;

    try {
      await sendAssessmentAccessEmail({
        to:
          email,

        assessmentUrl,

        processName:
          processName ||
          undefined,

        expiresAt:
          preAssessment.expiresAt,
      });

      clientEmailSent =
        true;
    } catch (error) {
      console.error(
        "[Assessment Request] Error enviando correo al cliente:",
        error,
      );
    }

    /*
     * Notificación comercial interna.
     */

    let internalEmailSent =
      false;

    try {
      await sendInternalAssessmentRequestEmail({
        name,

        company,

        email,

        employees,

        processName:
          processName ||
          undefined,

        assessmentUrl,
      });

      internalEmailSent =
        true;
    } catch (error) {
      console.error(
        "[Assessment Request] Error notificando a XONPLACE:",
        error,
      );
    }

    /*
     * Respuesta al formulario.
     */

    return NextResponse.json({
      success:
        true,

      assessmentUrl,

      clientEmailSent,

      internalEmailSent,
    });
  } catch (error) {
    console.error(
      "[Assessment Request] Error:",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "No fue posible procesar la solicitud.",
      },
      {
        status:
          400,
      },
    );
  }
}