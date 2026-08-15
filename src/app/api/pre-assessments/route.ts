import {
  NextResponse,
} from "next/server";

import type {
  AIChatMessage,
} from "@/lib/ai/types";

import {
  extractPreAssessmentContext,
} from "@/lib/chat/pre-assessment-extractor";

import {
  createPreAssessment,
  getPreAssessmentByToken,
} from "@/services/pre-assessment.service";

import {
  sendAssessmentAccessEmail,
} from "@/services/email.service";

type CreateRequest = {
  email?: string;
  contactName?: string;
  messages?: AIChatMessage[];
};

function validateMessages(
  messages: unknown,
): AIChatMessage[] {
  if (
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    throw new Error(
      "No existe una conversación válida para preparar el Assessment.",
    );
  }

  if (messages.length > 30) {
    throw new Error(
      "La conversación supera el límite permitido.",
    );
  }

  return messages.map(
    (
      message,
      index,
    ) => {
      if (
        !message ||
        typeof message !== "object"
      ) {
        throw new Error(
          `El mensaje ${index + 1} no es válido.`,
        );
      }

      const candidate =
        message as {
          role?: unknown;
          content?: unknown;
        };

      if (
        candidate.role !== "user" &&
        candidate.role !== "assistant"
      ) {
        throw new Error(
          `El rol del mensaje ${index + 1} no es válido.`,
        );
      }

      if (
        typeof candidate.content !== "string" ||
        !candidate.content.trim()
      ) {
        throw new Error(
          `El contenido del mensaje ${index + 1} no es válido.`,
        );
      }

      return {
        role:
          candidate.role,

        content:
          candidate.content
            .trim()
            .slice(
              0,
              3000,
            ),
      };
    },
  );
}

/*
 * =========================================================
 * URL PÚBLICA DE LA APLICACIÓN
 * =========================================================
 *
 * Producción:
 *   https://xonplace.com
 *
 * GitHub Codespaces:
 *   https://xxxx-3000.app.github.dev
 *
 * Desarrollo local tradicional:
 *   http://localhost:3000
 */
function getPublicBaseUrl(
  request: Request,
): string {
  const configuredProductionUrl =
    process.env
      .NEXT_PUBLIC_APP_URL
      ?.trim()
      .replace(
        /\/$/,
        "",
      );

  /*
   * En Vercel/producción utilizamos
   * siempre la URL oficial configurada.
   */
  if (
    process.env.NODE_ENV === "production" &&
    configuredProductionUrl
  ) {
    return configuredProductionUrl;
  }

  /*
   * GitHub Codespaces y otros proxies
   * informan el dominio público mediante
   * x-forwarded-host.
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
   * Fallback para desarrollo local.
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
        CreateRequest;

    const email =
      body.email
        ?.trim()
        .toLowerCase();

    if (!email) {
      throw new Error(
        "Debes indicar un correo electrónico.",
      );
    }

    const messages =
      validateMessages(
        body.messages,
      );

    /*
     * =====================================================
     * 1. EXTRAER CONTEXTO
     * =====================================================
     */

    const context =
      await extractPreAssessmentContext(
        messages,
      );

    const companyName =
      typeof context.company === "string"
        ? context.company.trim()
        : undefined;

    /*
     * =====================================================
     * 2. CREAR PRE-ASSESSMENT
     * =====================================================
     */

    const result =
      await createPreAssessment({
        email,

        contactName:
          body.contactName,

        companyName:
          companyName ||
          undefined,

        context,
      });

    /*
     * =====================================================
     * 3. GENERAR LINK PÚBLICO
     * =====================================================
     */

    const relativeUrl =
      `/portal/assessment/v2?token=${encodeURIComponent(
        result.token,
      )}`;

    const baseUrl =
      getPublicBaseUrl(
        request,
      );

    const assessmentUrl =
      `${baseUrl}${relativeUrl}`;

    /*
     * Muy útil mientras estamos
     * validando Codespaces/Vercel.
     *
     * No contiene el hash almacenado
     * en DB ni otra credencial.
     */
    console.log(
      "[PreAssessment] URL:",
      assessmentUrl,
    );

    /*
     * =====================================================
     * 4. ENVIAR EMAIL
     * =====================================================
     */

    const processName =
      typeof result.context.processName === "string"
        ? result.context.processName.trim()
        : undefined;

    let emailSent =
      false;

    let emailId:
      string | undefined;

    let emailProvider:
      string | undefined;

    let emailErrorMessage:
      string | undefined;

    try {
      const emailResult =
        await sendAssessmentAccessEmail({
          to:
            email,

          assessmentUrl,

          processName:
            processName ||
            undefined,

          expiresAt:
            result.expiresAt,
        });

      emailSent =
        true;

      emailId =
        emailResult.id;

      emailProvider =
        emailResult.provider;
    } catch (emailError) {
      console.error(
        "[PreAssessment] No fue posible enviar el correo:",
        emailError,
      );

      emailErrorMessage =
        emailError instanceof Error
          ? emailError.message
          : "No fue posible enviar el correo.";
    }

    /*
     * =====================================================
     * 5. RESPUESTA
     * =====================================================
     */

    return NextResponse.json({
      success:
        true,

      preAssessmentId:
        result.id,

      /*
       * El Advisor utiliza esta URL
       * para el botón Continuar Assessment.
       */
      url:
        assessmentUrl,

      relativeUrl,

      expiresAt:
        result.expiresAt.toISOString(),

      context:
        result.context,

      email: {
        sent:
          emailSent,

        id:
          emailId,

        provider:
          emailProvider,

        error:
          emailErrorMessage,
      },
    });
  } catch (error) {
    console.error(
      "[PreAssessment] Error:",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "No fue posible preparar el Assessment.",
      },
      {
        status:
          400,
      },
    );
  }
}

export async function GET(
  request: Request,
) {
  try {
    const url =
      new URL(
        request.url,
      );

    const token =
      url.searchParams.get(
        "token",
      );

    if (!token) {
      throw new Error(
        "El token es obligatorio.",
      );
    }

    /*
     * =====================================================
     * RECUPERAR PRE-ASSESSMENT
     * =====================================================
     */

    const preAssessment =
      await getPreAssessmentByToken(
        token,
      );

    if (!preAssessment) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "El enlace no existe, ya fue utilizado o ha vencido.",
        },
        {
          status:
            404,
        },
      );
    }

    return NextResponse.json({
      success:
        true,

      preAssessment: {
        id:
          preAssessment.id,

        email:
          preAssessment.email,

        contactName:
          preAssessment.contactName,

        companyName:
          preAssessment.companyName,

        context:
          preAssessment.context,

        status:
          preAssessment.status,

        expiresAt:
          preAssessment.expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "[PreAssessment] Error recuperando Assessment:",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "No fue posible recuperar el Assessment.",
      },
      {
        status:
          400,
      },
    );
  }
}