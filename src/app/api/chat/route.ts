import {
  NextResponse,
} from "next/server";

import {
  getAIProvider,
} from "@/lib/ai/provider";

import type {
  AIChatMessage,
} from "@/lib/ai/types";

import type {
  AssessmentV2Answers,
} from "@/lib/assessment/v2";

import {
  XONPLACE_ADVISOR_PROMPT,
} from "@/lib/chat/advisor-prompt";

import {
  extractPreAssessmentContext,
} from "@/lib/chat/pre-assessment-extractor";

type ChatRequestBody = {
  messages?: AIChatMessage[];
};

type ChatAction =
  | {
      type:
        "collect_assessment_email";
    }
  | null;

const MAX_MESSAGES =
  20;

const MAX_MESSAGE_LENGTH =
  2000;

/*
 * No ejecutamos el extractor desde
 * el primer mensaje para evitar
 * llamadas innecesarias y controlar
 * consumo.
 */
const MIN_USER_MESSAGES_FOR_CONTEXT_CHECK =
  2;

function validateMessages(
  messages: unknown,
): AIChatMessage[] {
  if (
    !Array.isArray(
      messages,
    )
  ) {
    throw new Error(
      "La conversación no tiene un formato válido.",
    );
  }

  if (
    messages.length ===
    0
  ) {
    throw new Error(
      "La conversación está vacía.",
    );
  }

  if (
    messages.length >
    MAX_MESSAGES
  ) {
    throw new Error(
      "La conversación superó el límite permitido.",
    );
  }

  return messages.map(
    (
      message,
      index,
    ) => {
      if (
        !message ||
        typeof message !==
          "object"
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
        candidate.role !==
          "user" &&
        candidate.role !==
          "assistant"
      ) {
        throw new Error(
          `El rol del mensaje ${index + 1} no es válido.`,
        );
      }

      if (
        typeof candidate.content !==
        "string"
      ) {
        throw new Error(
          `El contenido del mensaje ${index + 1} no es válido.`,
        );
      }

      const content =
        candidate.content.trim();

      if (!content) {
        throw new Error(
          `El mensaje ${index + 1} está vacío.`,
        );
      }

      if (
        content.length >
        MAX_MESSAGE_LENGTH
      ) {
        throw new Error(
          `El mensaje ${index + 1} supera el máximo permitido.`,
        );
      }

      return {
        role:
          candidate.role,

        content,
      };
    },
  );
}

/*
 * =========================================================
 * INTENCIÓN EXPLÍCITA
 * =========================================================
 *
 * Si el usuario dice directamente que quiere
 * iniciar el Assessment, no necesitamos que
 * el modelo siga conversando.
 */

function wantsToStartAssessment(
  messages:
    AIChatMessage[],
): boolean {
  const latestUserMessage =
    [...messages]
      .reverse()
      .find(
        (
          message,
        ) =>
          message.role ===
          "user",
      )
      ?.content
      .toLowerCase()
      .normalize(
        "NFD",
      )
      .replace(
        /[\u0300-\u036f]/g,
        "",
      ) ?? "";

  const explicitExpressions = [
    "quiero iniciar el assessment",
    "quiero iniciar assessment",
    "quiero comenzar el assessment",
    "quiero comenzar assessment",
    "quiero hacer el assessment",
    "quiero hacer assessment",
    "quiero realizar el assessment",
    "quiero realizar assessment",
    "quiero continuar con el assessment",
    "hagamos el assessment",
    "hagamos assessment",
    "iniciemos el assessment",
    "iniciemos assessment",
    "comencemos el assessment",
    "comencemos assessment",
    "quiero evaluarlo",
    "quiero avanzar con el assessment",
    "avancemos con el assessment",
  ];

  return explicitExpressions.some(
    (
      expression,
    ) =>
      latestUserMessage.includes(
        expression,
      ),
  );
}

/*
 * =========================================================
 * CONTEXTO SUFICIENTE
 * =========================================================
 *
 * No usamos un score del Assessment.
 *
 * Esto solamente responde:
 *
 * "¿Ya sabemos lo suficiente para dejar
 * de hacer discovery y pasar al Assessment?"
 */

function hasEnoughAssessmentContext(
  context:
    AssessmentV2Answers,
): boolean {
  /*
   * 1. Sabemos qué proceso estamos
   * evaluando.
   */
  const hasProcess =
    typeof context.processName ===
      "string" &&
    context.processName.trim()
      .length > 0;

  /*
   * 2. Tenemos alguna medida de
   * recurrencia o volumen.
   */
  const hasVolume =
    (
      typeof context.executionsPerMonth ===
        "string" &&
      context.executionsPerMonth.trim()
        .length > 0
    ) ||
    (
      typeof context.frequency ===
        "string" &&
      context.frequency.trim()
        .length > 0
    );

  /*
   * 3. Existe una señal concreta
   * de manualidad/problema.
   */
  const hasManualPain =
    (
      typeof context.mainPain ===
        "string" &&
      context.mainPain.trim()
        .length > 0
    ) ||
    (
      typeof context.manualPercentage ===
        "string" &&
      context.manualPercentage.trim()
        .length > 0
    ) ||
    (
      typeof context.doubleEntry ===
        "string" &&
      context.doubleEntry !==
        "no"
    ) ||
    context.manualDataExtraction ===
      "yes" ||
    context.manualDataExtraction ===
      "sometimes";

  /*
   * 4. Conocemos que participan
   * sistemas o documentos.
   */
  const systemsUsed =
    Array.isArray(
      context.systemsUsed,
    )
      ? context.systemsUsed
      : [];

  const documentTypes =
    Array.isArray(
      context.documentTypes,
    )
      ? context.documentTypes
      : [];

  const hasOperationalEnvironment =
    context.usesMultipleSystems ===
      "yes" ||
    systemsUsed.length >
      0 ||
    context.usesDocuments ===
      "yes" ||
    documentTypes.length >
      0;

  /*
   * 5. Tenemos al menos una señal
   * adicional que aporta contexto
   * suficiente para no seguir
   * interrogando al prospecto.
   */
  const hasAdditionalEvidence =
    (
      typeof context.rulesKnown ===
        "string" &&
      context.rulesKnown.trim()
        .length > 0
    ) ||
    documentTypes.length >
      0 ||
    (
      typeof context.peopleInvolved ===
        "string" &&
      context.peopleInvolved.trim()
        .length > 0
    ) ||
    (
      typeof context.minutesPerExecution ===
        "string" &&
      context.minutesPerExecution.trim()
        .length > 0
    ) ||
    (
      typeof context.reworkLevel ===
        "string" &&
      context.reworkLevel.trim()
        .length > 0
    ) ||
    (
      typeof context.requiresApproval ===
        "string" &&
      context.requiresApproval.trim()
        .length > 0
    );

  return (
    hasProcess &&
    hasVolume &&
    hasManualPain &&
    hasOperationalEnvironment &&
    hasAdditionalEvidence
  );
}

function countUserMessages(
  messages:
    AIChatMessage[],
): number {
  return messages.filter(
    (
      message,
    ) =>
      message.role ===
      "user",
  ).length;
}

/*
 * La respuesta de conversión la genera
 * XONPLACE, no el modelo.
 *
 * De esta forma garantizamos que,
 * una vez tomada la decisión de cerrar
 * discovery, no aparezca otra pregunta
 * técnica.
 */

function createAssessmentHandoffResponse(
  reason:
    | "explicit_intent"
    | "sufficient_context",
) {
  const content =
    reason ===
    "explicit_intent"
      ? "Perfecto. Ya tengo información suficiente para preparar parte de tu Automation Assessment con lo que hemos conversado. ¿A qué correo quieres que te envíe el acceso?"
      : "Con lo que me cuentas ya tenemos información suficiente para avanzar al Automation Assessment. No necesitamos seguir profundizando técnicamente aquí; el Assessment nos permitirá validar los datos restantes y generar el diagnóstico. ¿A qué correo quieres que te envíe el acceso?";

  return NextResponse.json({
    success: true,

    message: {
      role:
        "assistant",

      content,
    },

    action: {
      type:
        "collect_assessment_email",
    } satisfies NonNullable<ChatAction>,

    /*
     * Útil en desarrollo.
     *
     * Después podemos enviarlo
     * solamente a logs.
     */
    meta: {
      provider:
        "xonplace",

      model:
        "workflow",

      transition:
        reason,
    },
  });
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as
        ChatRequestBody;

    const messages =
      validateMessages(
        body.messages,
      );

    /*
     * =====================================================
     * REGLA 1
     * INTENCIÓN EXPLÍCITA
     * =====================================================
     *
     * Si el prospecto ya dijo que quiere
     * avanzar, no gastamos otra llamada
     * de IA ni hacemos más discovery.
     */

    if (
      wantsToStartAssessment(
        messages,
      )
    ) {
      return createAssessmentHandoffResponse(
        "explicit_intent",
      );
    }

    /*
     * =====================================================
     * REGLA 2
     * CONTEXTO SUFICIENTE
     * =====================================================
     *
     * Desde la segunda intervención del
     * usuario podemos empezar a evaluar
     * si ya sabemos suficiente.
     */

    const userMessageCount =
      countUserMessages(
        messages,
      );

    if (
      userMessageCount >=
      MIN_USER_MESSAGES_FOR_CONTEXT_CHECK
    ) {
      try {
        const context =
          await extractPreAssessmentContext(
            messages,
          );

        if (
          hasEnoughAssessmentContext(
            context,
          )
        ) {
          return createAssessmentHandoffResponse(
            "sufficient_context",
          );
        }
      } catch (
        extractionError
      ) {
        /*
         * Si el extractor falla no rompemos
         * el chatbot.
         *
         * Seguimos con conversación normal.
         */
        console.error(
          "No fue posible evaluar suficiencia del contexto:",
          extractionError,
        );
      }
    }

    /*
     * =====================================================
     * REGLA 3
     * CONTINUAR DISCOVERY
     * =====================================================
     */

    const provider =
      getAIProvider();

    const result =
      await provider.generate({
        messages,

        systemPrompt:
          XONPLACE_ADVISOR_PROMPT,
      });

    return NextResponse.json({
      success:
        true,

      message: {
        role:
          "assistant",

        content:
          result.text,
      },

      action:
        null,

      meta: {
        provider:
          result.provider,

        model:
          result.model,

        transition:
          "conversation",
      },
    });
  } catch (error) {
    console.error(
      "Error XONPLACE Advisor:",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "No fue posible procesar la conversación.",
      },
      {
        status:
          400,
      },
    );
  }
}