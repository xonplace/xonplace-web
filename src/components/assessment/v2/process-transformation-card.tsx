import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";

import type { ProcessProfile } from "@/lib/assessment/intelligence";

type ProcessTransformationCardProps = {
  process: ProcessProfile;
};

function humanizeSystem(value: string): string {
  const labels: Record<string, string> = {
    erp: "ERP",
    crm: "CRM",
    email: "Correo",
    excel: "Excel",
    sharepoint: "SharePoint",
    database: "Base de datos",
    "internal-app": "Aplicación interna",
    other: "Otro sistema",
  };

  return labels[value] ?? value;
}

function humanizeInput(value: string): string {
  const labels: Record<string, string> = {
    pdf: "PDF",
    excel: "Excel",
    email: "Correo",
    forms: "Formularios",
    contracts: "Contratos",
    orders: "Órdenes",
    invoices: "Facturas",
    other: "Otros documentos",
  };

  return labels[value] ?? value;
}

export function ProcessTransformationCard({
  process,
}: ProcessTransformationCardProps) {
  const currentSteps: string[] = [];

  if (process.inputs.length > 0) {
    currentSteps.push(
      `Recepción de ${process.inputs
        .map(humanizeInput)
        .join(", ")}`,
    );
  }

  if (
    process.manualPercentage !== undefined &&
    process.manualPercentage >= 50
  ) {
    currentSteps.push(
      `Intervención manual aproximada del ${process.manualPercentage}%`,
    );
  }

  if (process.systems.length > 1) {
    currentSteps.push(
      `Uso de múltiples sistemas: ${process.systems
        .map(humanizeSystem)
        .join(", ")}`,
    );
  }

  if (process.requiresApproval) {
    currentSteps.push("Aprobaciones humanas");
  }

  if (process.hasExceptions) {
    currentSteps.push("Gestión manual de excepciones");
  }

  const targetSteps = [
    "Recepción automática de información",
    "Validación y clasificación",
    "Aplicación automática de reglas",
    "Integración entre sistemas",
    "Escalamiento solo de excepciones",
    "Registro y trazabilidad automática",
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Transformación del proceso
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Proceso actual → Proceso objetivo
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Comparación preliminar entre la operación actual de{" "}
          <strong>{process.name}</strong> y un modelo de operación automatizada.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <CircleAlert className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Situación actual
              </p>

              <h3 className="font-bold">
                {process.name}
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {currentSteps.length > 0 ? (
              currentSteps.map((step) => (
                <div
                  key={step}
                  className="rounded-xl border border-amber-100 bg-white p-4 text-sm"
                >
                  {step}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                La información disponible aún no permite reconstruir
                completamente el proceso actual.
              </p>
            )}
          </div>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <ArrowRight className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Proceso objetivo
              </p>

              <h3 className="font-bold">
                Operación automatizada
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {targetSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {index + 1}
                </div>

                <p className="text-sm">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}