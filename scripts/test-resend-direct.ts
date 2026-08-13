import "dotenv/config";
import { Resend } from "resend";

async function main() {
  const apiKey =
    process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY no está configurada.",
    );
  }

  const resend =
    new Resend(apiKey);

  console.log({
    keyPrefix:
      apiKey.slice(0, 6),
    keyLength:
      apiKey.length,
    from:
      process.env.EMAIL_FROM,
  });

  const {
    data,
    error,
  } =
    await resend.emails.send({
      from:
         "XONPLACE Advisor <advisor@correo.xonplace.com>",

      to: [
        "xonplace@gmail.com",
      ],

      subject:
        "Prueba directa XONPLACE",

      html:
        "<p>Prueba directa de envío desde XONPLACE.</p>",
    });

  console.log({
    data,
    error,
  });
}

main().catch(
  console.error,
);