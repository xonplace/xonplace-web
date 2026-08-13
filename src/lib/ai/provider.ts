import type {
  AIProvider,
} from "./types";

import {
  OpenAIProvider,
} from "./providers/openai-provider";

export function getAIProvider():
  AIProvider {
  const provider =
    process.env.AI_PROVIDER?.toLowerCase();

  switch (provider) {
    case "openai":
      return new OpenAIProvider();

    case "groq":
      throw new Error(
        "El provider Groq todavía no está implementado.",
      );

    case "gemini":
      throw new Error(
        "El provider Gemini todavía no está implementado.",
      );

    case "ollama":
      throw new Error(
        "El provider Ollama todavía no está implementado.",
      );

    default:
      throw new Error(
        `Proveedor de IA no soportado: ${
          provider ??
          "no configurado"
        }.`,
      );
  }
}