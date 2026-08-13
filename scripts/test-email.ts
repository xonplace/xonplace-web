import "dotenv/config";

import {
  sendAssessmentAccessEmail,
} from "../src/services/email.service";

async function main() {
  const result =
    await sendAssessmentAccessEmail({
      to:
        "gllabres@tecnodatasa.cl",

      assessmentUrl:
        "http://localhost:3000/portal/assessment/v2",

      processName:
        "Prueba XONPLACE",

      expiresAt:
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000,
        ),
    });

  console.log(
    "Correo enviado:",
    result,
  );
}

main().catch(
  (error) => {
    console.error(
      "Error enviando correo:",
      error,
    );

    process.exit(1);
  },
);