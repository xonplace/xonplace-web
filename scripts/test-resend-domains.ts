// scripts/test-resend-domains.ts

import "dotenv/config";
import { Resend } from "resend";

async function main() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada.");
  }

  const resend = new Resend(apiKey);

  const { data, error } =
    await resend.domains.list();

  console.dir(
    {
      data,
      error,
    },
    {
      depth: null,
    },
  );
}

main().catch(console.error);