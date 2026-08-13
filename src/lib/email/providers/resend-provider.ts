import {
  Resend,
} from "resend";

import type {
  EmailProvider,
  SendEmailInput,
  SendEmailResult,
} from "../types";

export class ResendEmailProvider
  implements EmailProvider
{
  private readonly client:
    Resend;

  private readonly from:
    string;

  constructor() {
    const apiKey =
      process.env
        .RESEND_API_KEY;

    const from =
      process.env
        .EMAIL_FROM;

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY no está configurado.",
      );
    }

    if (!from) {
      throw new Error(
        "EMAIL_FROM no está configurado.",
      );
    }

    this.client =
      new Resend(
        apiKey,
      );

    this.from =
      from;
  }

  async send(
    input: SendEmailInput,
  ): Promise<SendEmailResult> {
    const {
      data,
      error,
    } =
      await this.client.emails.send({
        from:
          this.from,

        to: [
          input.to,
        ],

        subject:
          input.subject,

        html:
          input.html,

        text:
          input.text,
      });

    if (error) {
      throw new Error(
        `Resend rechazó el envío: ${
          error.message
        }`,
      );
    }

    return {
      id:
        data?.id,

      provider:
        "resend",
    };
  }
}