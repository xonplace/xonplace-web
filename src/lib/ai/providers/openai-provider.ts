import OpenAI from "openai";

import type {
  AIGenerateInput,
  AIGenerateResult,
  AIGenerateStructuredInput,
  AIGenerateStructuredResult,
  AIProvider,
} from "../types";

export class OpenAIProvider
  implements AIProvider
{
  private readonly client:
    OpenAI;

  private readonly model:
    string;

  constructor() {
    const apiKey =
      process.env
        .OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY no está configurado.",
      );
    }

    this.model =
      process.env
        .AI_MODEL ??
      "gpt-5";

    this.client =
      new OpenAI({
        apiKey,
      });
  }

  async generate(
    input: AIGenerateInput,
  ): Promise<AIGenerateResult> {
    const conversation =
      input.messages.map(
        (
          message,
        ) => ({
          role:
            message.role,

          content:
            message.content,
        }),
      );

    const response =
      await this.client.responses.create({
        model:
          this.model,

        instructions:
          input.systemPrompt,

        input:
          conversation,

        store:
          false,
      });

    const text =
      response.output_text
        ?.trim();

    if (!text) {
      throw new Error(
        "OpenAI no devolvió una respuesta de texto.",
      );
    }

    return {
      text,

      provider:
        "openai",

      model:
        this.model,
    };
  }

  async generateStructured<
    T,
  >(
    input:
      AIGenerateStructuredInput,
  ): Promise<
    AIGenerateStructuredResult<T>
  > {
    const conversation =
      input.messages.map(
        (
          message,
        ) => ({
          role:
            message.role,

          content:
            message.content,
        }),
      );

    const response =
      await this.client.responses.create({
        model:
          this.model,

        instructions:
          input.systemPrompt,

        input:
          conversation,

        text: {
          format: {
            type:
              "json_schema",

            name:
              input.outputSchema
                .name,

            strict:
              true,

            schema:
              input.outputSchema
                .schema,
          },
        },

        store:
          false,
      });

    const raw =
      response.output_text
        ?.trim();

    if (!raw) {
      throw new Error(
        "OpenAI no devolvió una respuesta estructurada.",
      );
    }

    let parsed:
      unknown;

    try {
      parsed =
        JSON.parse(
          raw,
        );
    } catch {
      throw new Error(
        "La respuesta estructurada de OpenAI no contiene JSON válido.",
      );
    }

    return {
      data:
        parsed as T,

      provider:
        "openai",

      model:
        this.model,
    };
  }
}