import { NextResponse } from "next/server";

import {
  saveAssessment,
  type SaveAssessmentInput,
} from "@/services/assessment.service";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as SaveAssessmentInput;
    const result = await saveAssessment(input);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error API Assessment:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible guardar el Assessment.",
      },
      { status: 400 },
    );
  }
}