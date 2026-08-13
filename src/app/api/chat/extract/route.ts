import {
  NextResponse,
} from "next/server";

import type {
  AIChatMessage,
} from "@/lib/ai/types";

import {
  extractPreAssessmentContext,
} from "@/lib/chat/pre-assessment-extractor";

type ExtractRequest = {
  messages?:
    AIChatMessage[];
};

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as
        ExtractRequest;

    if (
      !Array.isArray(
        body.messages,
      ) ||
      body.messages.length ===
        0
    ) {
      throw new Error(
        "No existe conversación para analizar.",
      );
    }

    const context =
      await extractPreAssessmentContext(
        body.messages,
      );

    return NextResponse.json({
      success:
        true,

      context,
    });
  } catch (error) {
    console.error(
      "Error extrayendo PreAssessment:",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "No fue posible analizar la conversación.",
      },

      {
        status:
          400,
      },
    );
  }
}