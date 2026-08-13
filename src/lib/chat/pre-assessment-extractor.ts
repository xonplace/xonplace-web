import type {
  AIChatMessage,
} from "@/lib/ai/types";

import {
  getAIProvider,
} from "@/lib/ai/provider";

import type {
  AssessmentV2Answers,
} from "@/lib/assessment/v2";

export type ExtractedPreAssessment =
  AssessmentV2Answers;

const PRE_ASSESSMENT_EXTRACTION_PROMPT = `
Eres un extractor de información para XONPLACE.

Tu única tarea es convertir una conversación entre un potencial cliente y XONPLACE Advisor en información estructurada compatible con Automation Assessment V2.

REGLAS CRÍTICAS

1. Extrae únicamente información explícita o razonablemente inequívoca de la conversación.

2. NO inventes información.

3. Si un dato no está claro, simplemente no lo completes.

4. Nunca calcules scores.

5. Nunca infieras ROI, ahorro, costos o tiempos que el usuario no haya indicado.

6. Utiliza exclusivamente los valores permitidos por el esquema.

MAPEO DE CAMPOS

company:
Nombre de la empresa únicamente si el usuario lo indicó.

industry:
Valores permitidos:
services
technology
commerce
manufacturing
health
education
other

employees:
Valores permitidos:
1-20
21-50
51-200
201-500
500+

mainPain:
Selecciona solo si existe una señal clara:
manual-work
errors
slow-process
double-entry
traceability
documents
integration
other

processName:
Nombre corto del proceso.
Ejemplos:
Compras
Facturación
Pago a proveedores
Atención de clientes

processDescription:
Resumen fiel de cómo funciona actualmente el proceso según lo conversado.

frequency:
Valores:
daily-many
daily
weekly
monthly
occasional

executionsPerMonth:
Cantidad mensual, como texto numérico.

peopleInvolved:
Cantidad de personas, como texto numérico.

minutesPerExecution:
Minutos por ejecución, como texto numérico.

manualPercentage:
Solo completar si el usuario indicó explícitamente una proporción suficientemente clara.
Valores:
25
50
75
90

usesDocuments:
yes o no.

documentTypes:
Valores posibles:
pdf
excel
email
forms
contracts
orders
invoices
other

manualDataExtraction:
yes
sometimes
no

usesMultipleSystems:
yes o no.

systemsUsed:
Valores:
erp
crm
email
excel
sharepoint
database
internal-app
other

doubleEntry:
frequent
sometimes
no

systemsIntegrated:
most
some
none
unknown

apiAvailability:
most
some
none
unknown

rulesKnown:
all
most
some
none

requiresApproval:
yes
sometimes
no

exceptionsLevel:
low
medium
high

reworkLevel:
rare
sometimes
frequent
constant

hourlyCostCLP:
Costo hora, solo si el usuario lo entregó.

EJEMPLO

Conversación:
"Hacemos unas 400 órdenes de compra al mes en Excel. Luego las enviamos por correo y un ejecutivo crea una nota de compra en nuestro ERP propio."

Salida esperada:
{
  "processName": "Compras",
  "executionsPerMonth": "400",
  "mainPain": "double-entry",
  "usesDocuments": "yes",
  "documentTypes": [
    "excel",
    "email",
    "orders"
  ],
  "usesMultipleSystems": "yes",
  "systemsUsed": [
    "erp",
    "email",
    "excel",
    "internal-app"
  ],
  "doubleEntry": "frequent"
}

No agregues campos sobre los cuales no exista información suficiente.
`;

const preAssessmentSchema = {
  name:
    "xonplace_pre_assessment",

  schema: {
    type:
      "object",

    additionalProperties:
      false,

    properties: {
      company: {
        type: [
          "string",
          "null",
        ],
      },

      industry: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "services",
          "technology",
          "commerce",
          "manufacturing",
          "health",
          "education",
          "other",
          null,
        ],
      },

      employees: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "1-20",
          "21-50",
          "51-200",
          "201-500",
          "500+",
          null,
        ],
      },

      mainPain: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "manual-work",
          "errors",
          "slow-process",
          "double-entry",
          "traceability",
          "documents",
          "integration",
          "other",
          null,
        ],
      },

      processName: {
        type: [
          "string",
          "null",
        ],
      },

      processDescription: {
        type: [
          "string",
          "null",
        ],
      },

      frequency: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "daily-many",
          "daily",
          "weekly",
          "monthly",
          "occasional",
          null,
        ],
      },

      executionsPerMonth: {
        type: [
          "string",
          "null",
        ],
      },

      peopleInvolved: {
        type: [
          "string",
          "null",
        ],
      },

      minutesPerExecution: {
        type: [
          "string",
          "null",
        ],
      },

      manualPercentage: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "25",
          "50",
          "75",
          "90",
          null,
        ],
      },

      usesDocuments: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "yes",
          "no",
          null,
        ],
      },

      documentTypes: {
        type: "array",

        items: {
          type:
            "string",

          enum: [
            "pdf",
            "excel",
            "email",
            "forms",
            "contracts",
            "orders",
            "invoices",
            "other",
          ],
        },
      },

      manualDataExtraction: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "yes",
          "sometimes",
          "no",
          null,
        ],
      },

      usesMultipleSystems: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "yes",
          "no",
          null,
        ],
      },

      systemsUsed: {
        type: "array",

        items: {
          type:
            "string",

          enum: [
            "erp",
            "crm",
            "email",
            "excel",
            "sharepoint",
            "database",
            "internal-app",
            "other",
          ],
        },
      },

      doubleEntry: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "frequent",
          "sometimes",
          "no",
          null,
        ],
      },

      systemsIntegrated: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "most",
          "some",
          "none",
          "unknown",
          null,
        ],
      },

      apiAvailability: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "most",
          "some",
          "none",
          "unknown",
          null,
        ],
      },

      rulesKnown: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "all",
          "most",
          "some",
          "none",
          null,
        ],
      },

      requiresApproval: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "yes",
          "sometimes",
          "no",
          null,
        ],
      },

      exceptionsLevel: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "low",
          "medium",
          "high",
          null,
        ],
      },

      reworkLevel: {
        type: [
          "string",
          "null",
        ],

        enum: [
          "rare",
          "sometimes",
          "frequent",
          "constant",
          null,
        ],
      },

      hourlyCostCLP: {
        type: [
          "string",
          "null",
        ],
      },
    },

    required: [
      "company",
      "industry",
      "employees",
      "mainPain",
      "processName",
      "processDescription",
      "frequency",
      "executionsPerMonth",
      "peopleInvolved",
      "minutesPerExecution",
      "manualPercentage",
      "usesDocuments",
      "documentTypes",
      "manualDataExtraction",
      "usesMultipleSystems",
      "systemsUsed",
      "doubleEntry",
      "systemsIntegrated",
      "apiAvailability",
      "rulesKnown",
      "requiresApproval",
      "exceptionsLevel",
      "reworkLevel",
      "hourlyCostCLP",
    ],
  },
};

type RawExtractedPreAssessment = {
  [key: string]:
    | string
    | string[]
    | null;
};

function removeNullValues(
  raw:
    RawExtractedPreAssessment,
): AssessmentV2Answers {
  const cleaned:
    AssessmentV2Answers = {};

  for (
    const [
      key,
      value,
    ] of Object.entries(
      raw,
    )
  ) {
    if (
      value === null
    ) {
      continue;
    }

    if (
      Array.isArray(
        value,
      ) &&
      value.length === 0
    ) {
      continue;
    }

    cleaned[key] =
      value;
  }

  return cleaned;
}

export async function extractPreAssessmentContext(
  messages:
    AIChatMessage[],
): Promise<AssessmentV2Answers> {
  const provider =
    getAIProvider();

  const result =
    await provider.generateStructured<
      RawExtractedPreAssessment
    >({
      messages,

      systemPrompt:
        PRE_ASSESSMENT_EXTRACTION_PROMPT,

      outputSchema:
        preAssessmentSchema,
    });

  return removeNullValues(
    result.data,
  );
}
