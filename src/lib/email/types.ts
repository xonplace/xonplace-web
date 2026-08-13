export type SendEmailInput = {
  to: string;

  subject: string;

  html: string;

  text?: string;
};

export type SendEmailResult = {
  id?: string;

  provider: string;
};

export interface EmailProvider {
  send(
    input: SendEmailInput,
  ): Promise<SendEmailResult>;
}