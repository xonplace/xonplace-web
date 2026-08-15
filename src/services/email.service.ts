import {
  getEmailProvider,
} from "@/lib/email/provider";

export type SendAssessmentAccessEmailInput = {
  to: string;

  assessmentUrl: string;

  processName?: string;

  expiresAt: Date;
};

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}

function formatExpiration(
  value: Date,
): string {
  return new Intl.DateTimeFormat(
    "es-CL",
    {
      dateStyle:
        "long",

      timeStyle:
        "short",

      timeZone:
        "America/Santiago",
    },
  ).format(
    value,
  );
}

export async function sendAssessmentAccessEmail(
  input:
    SendAssessmentAccessEmailInput,
) {
  const provider =
    getEmailProvider();

  const safeUrl =
    escapeHtml(
      input.assessmentUrl,
    );

  const safeProcess =
    input.processName
      ? escapeHtml(
          input.processName,
        )
      : undefined;

  const expiration =
    formatExpiration(
      input.expiresAt,
    );

  const subject =
    safeProcess
      ? `Tu Automation Assessment de ${input.processName} está listo`
      : "Tu Automation Assessment de XONPLACE está listo";

  const html = `
<!doctype html>
<html lang="es">
  <body style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  ">
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        width:100%;
        background:#f8fafc;
        padding:32px 16px;
      "
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              width:100%;
              max-width:600px;
              background:#ffffff;
              border:1px solid #e2e8f0;
              border-radius:20px;
              overflow:hidden;
            "
          >
            <tr>
              <td
                style="
                  background:#020617;
                  padding:28px 32px;
                "
              >
                <div
                  style="
                    font-size:20px;
                    font-weight:700;
                    color:#ffffff;
                    letter-spacing:.02em;
                  "
                >
                  XONPLACE
                </div>

                <div
                  style="
                    margin-top:4px;
                    font-size:12px;
                    color:#94a3b8;
                  "
                >
                  Automation Intelligence
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:36px 32px;
                "
              >
                <div
                  style="
                    font-size:13px;
                    font-weight:700;
                    color:#2563eb;
                    text-transform:uppercase;
                    letter-spacing:.12em;
                  "
                >
                  Automation Assessment
                </div>

                <h1
                  style="
                    margin:10px 0 0;
                    font-size:28px;
                    line-height:1.2;
                    color:#0f172a;
                  "
                >
                  Tu Assessment está preparado
                </h1>

                <p
                  style="
                    margin:18px 0 0;
                    font-size:15px;
                    line-height:1.7;
                    color:#475569;
                  "
                >
                  XONPLACE Advisor recopiló información preliminar
                  durante la conversación y preparó parte de tu
                  Automation Assessment.
                </p>

                ${
                  safeProcess
                    ? `
                <div
                  style="
                    margin-top:24px;
                    padding:16px;
                    background:#eff6ff;
                    border:1px solid #bfdbfe;
                    border-radius:12px;
                  "
                >
                  <div
                    style="
                      font-size:12px;
                      font-weight:700;
                      color:#1d4ed8;
                    "
                  >
                    PROCESO
                  </div>

                  <div
                    style="
                      margin-top:5px;
                      font-size:16px;
                      font-weight:700;
                      color:#1e3a8a;
                    "
                  >
                    ${safeProcess}
                  </div>
                </div>
                `
                    : ""
                }

                <p
                  style="
                    margin:24px 0 0;
                    font-size:15px;
                    line-height:1.7;
                    color:#475569;
                  "
                >
                  Revisa los datos precargados, completa la
                  información pendiente y genera tu diagnóstico.
                </p>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    margin-top:28px;
                  "
                >
                  <tr>
                    <td
                      style="
                        border-radius:12px;
                        background:#2563eb;
                      "
                    >
                      <a
                        href="${safeUrl}"
                        style="
                          display:inline-block;
                          padding:14px 22px;
                          font-size:14px;
                          font-weight:700;
                          color:#ffffff;
                          text-decoration:none;
                        "
                      >
                        Continuar Automation Assessment
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin:28px 0 0;
                    font-size:12px;
                    line-height:1.6;
                    color:#64748b;
                  "
                >
                  Este acceso es personal y estará disponible
                  hasta ${escapeHtml(
                    expiration,
                  )}.
                </p>

                <p
                  style="
                    margin:12px 0 0;
                    font-size:12px;
                    line-height:1.6;
                    color:#64748b;
                  "
                >
                  Si no solicitaste este Assessment, puedes ignorar
                  este mensaje.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  border-top:1px solid #e2e8f0;
                  padding:20px 32px;
                  background:#f8fafc;
                "
              >
                <div
                  style="
                    font-size:11px;
                    color:#94a3b8;
                  "
                >
                  XONPLACE · AI Automation as a Service
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const text = [
    "XONPLACE Automation Assessment",
    "",
    "Tu Automation Assessment está preparado.",
    "",
    safeProcess
      ? `Proceso: ${input.processName}`
      : "",
    "",
    "Continúa aquí:",
    input.assessmentUrl,
    "",
    `El acceso estará disponible hasta ${expiration}.`,
  ]
    .filter(
      Boolean,
    )
    .join(
      "\n",
    );

  return provider.send({
    to:
      input.to,

    subject,

    html,

    text,
  });
}

export type SendInternalAssessmentRequestEmailInput = {
  name: string;
  company: string;
  email: string;
  employees: string;
  processName?: string;
  assessmentUrl: string;
};

export async function sendInternalAssessmentRequestEmail(
  input:
    SendInternalAssessmentRequestEmailInput,
) {
  const provider =
    getEmailProvider();

  const safeName =
    escapeHtml(
      input.name,
    );

  const safeCompany =
    escapeHtml(
      input.company,
    );

  const safeEmail =
    escapeHtml(
      input.email,
    );

  const safeEmployees =
    escapeHtml(
      input.employees,
    );

  const safeProcess =
    input.processName
      ? escapeHtml(
          input.processName,
        )
      : "No informado";

  const safeAssessmentUrl =
    escapeHtml(
      input.assessmentUrl,
    );

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:640px;margin:auto;">
      <div style="background:#020617;color:#fff;padding:24px;border-radius:16px 16px 0 0;">
        <div style="font-size:20px;font-weight:700;">XONPLACE</div>
        <div style="margin-top:4px;color:#94a3b8;font-size:12px;">
          Nuevo Automation Assessment
        </div>
      </div>

      <div style="border:1px solid #e2e8f0;border-top:0;padding:28px;border-radius:0 0 16px 16px;">
        <h2 style="margin-top:0;">Nueva solicitud desde xonplace.com</h2>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;font-weight:700;">Nombre</td>
            <td>${safeName}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;font-weight:700;">Empresa</td>
            <td>${safeCompany}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;font-weight:700;">Correo</td>
            <td>${safeEmail}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;font-weight:700;">Tamaño</td>
            <td>${safeEmployees}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;font-weight:700;">Proceso</td>
            <td>${safeProcess}</td>
          </tr>
        </table>

        <div style="margin-top:24px;">
          <a
            href="${safeAssessmentUrl}"
            style="display:inline-block;background:#2563eb;color:white;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;"
          >
            Abrir Assessment
          </a>
        </div>
      </div>
    </div>
  `;

  const text = `
Nuevo Automation Assessment XONPLACE

Nombre: ${input.name}
Empresa: ${input.company}
Correo: ${input.email}
Tamaño: ${input.employees}
Proceso: ${input.processName ?? "No informado"}

Assessment:
${input.assessmentUrl}
  `.trim();

  return provider.send({
    to:
      "xonplace@gmail.com",

    subject:
      `Nuevo Assessment · ${input.company}`,

    html,

    text,
  });
}