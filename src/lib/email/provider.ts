import type {
  EmailProvider,
} from "./types";

import {
  ResendEmailProvider,
} from "./providers/resend-provider";

export function getEmailProvider():
  EmailProvider {
  const provider =
    process.env.EMAIL_PROVIDER
      ?.trim()
      .toLowerCase();

  switch (provider) {
    case "resend":
      return new ResendEmailProvider();

    default:
      throw new Error(
        `Proveedor de correo no soportado: ${
          provider ??
          "no configurado"
        }.`,
      );
  }
}