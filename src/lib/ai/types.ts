export type AIChatRole =
  | "user"
  | "assistant";

export type AIChatMessage = {
  role: AIChatRole;
  content: string;
};

export type AIGenerateInput = {
  messages: AIChatMessage[];
  systemPrompt?: string;
};

export type AIGenerateResult = {
  text: string;

  provider: string;

  model: string;
};

export type AIJsonSchema = {
  name: string;

  schema: Record<
    string,
    unknown
  >;
};

export type AIGenerateStructuredInput = {
  messages: AIChatMessage[];

  systemPrompt?: string;

  outputSchema:
    AIJsonSchema;
};

export type AIGenerateStructuredResult<
  T,
> = {
  data: T;

  provider: string;

  model: string;
};

export interface AIProvider {
  generate(
    input: AIGenerateInput,
  ): Promise<AIGenerateResult>;

  generateStructured<
    T,
  >(
    input:
      AIGenerateStructuredInput,
  ): Promise<
    AIGenerateStructuredResult<T>
  >;
}