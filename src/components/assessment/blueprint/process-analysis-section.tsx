import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Network,
  Users,
  Workflow,
} from "lucide-react";

import type {
  BlueprintReportData,
  ProcessAnalysis,
} from "./types";

type Props = {
  data: BlueprintReportData;
};

const systemLabels: Record<string, string> = {
  erp: "ERP",
  crm: "CRM",
  email: "Correo",
  excel: "Excel",
  sharepoint: "SharePoint",
  database: "Base de datos",
  "internal-app": "Aplicación interna",
  other: "Otro",
};

const inputLabels: Record<string, string> = {
  pdf: "PDF",
  excel: "Excel",
  email: "Correo",
  forms: "Formularios",
  contracts: "Contratos",
  orders: "Órdenes",
  invoices: "Facturas",
  other: "Otros",
};

function formatNumber(value?: number) {
  if (value === undefined) {
    return "Pendiente";
  }

  return new Intl.NumberFormat("es-CL").format(value);
}

function OperationalMetric({
  label,
  value,
  suffix,
  icon: Icon,
}: {
  label: string;
  value?: number;
  suffix?: string;
  icon: typeof Clock3;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />

        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-bold">
        {formatNumber(value)}
        {value !== undefined && suffix
          ? ` ${suffix}`
          : ""}
      </p>
    </div>
  );
}

function ScoreMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1">
        <p className="text-2xl font-bold">
          {value}
        </p>

        <span className="pb-1 text-xs text-muted-foreground">
          /100
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, value),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function ProcessNarrative({
  process,
}: {
  process: ProcessAnalysis;
}) {
  const parts: string[] = [];

  if (
    process.executionsPerMonth !== undefined
  ) {
    parts.push(
      `${formatNumber(
        process.executionsPerMonth,
      )} ejecuciones mensuales`,
    );
  }

  if (
    process.peopleInvolved !== undefined
  ) {
    parts.push(
      `${process.peopleInvolved} ${
        process.peopleInvolved === 1
          ? "persona involucrada"
          : "personas involucradas"
      }`,
    );
  }

  if (
    process.minutesPerExecution !==
    undefined
  ) {
    parts.push(
      `${process.minutesPerExecution} minutos por ejecución`,
    );
  }

  if (
    process.manualPercentage !==
    undefined
  ) {
    parts.push(
      `${process.manualPercentage}% de intervención manual`,
    );
  }

  return (
    <p className="text-sm leading-7 text-slate-600">
      {parts.length > 0
        ? `El proceso presenta ${parts.join(
            ", ",
          )}.`
        : "La información operacional disponible todavía requiere validación."}
    </p>
  );
}

export function ProcessAnalysisSection({
  data,
}: Props) {
  const process =
    data.processAnalysis;

  if (!process) {
    return null;
  }

  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Proceso analizado
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          {process.name}
        </h2>

        {process.description && (
          <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
            {process.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OperationalMetric
          label="Ejecuciones / mes"
          value={
            process.executionsPerMonth
          }
          icon={Workflow}
        />

        <OperationalMetric
          label="Personas"
          value={
            process.peopleInvolved
          }
          icon={Users}
        />

        <OperationalMetric
          label="Minutos / ejecución"
          value={
            process.minutesPerExecution
          }
          icon={Clock3}
        />

        <OperationalMetric
          label="Intervención manual"
          value={
            process.manualPercentage
          }
          suffix="%"
          icon={Gauge}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="font-bold">
            Perfil operacional
          </h3>

          <div className="mt-4">
            <ProcessNarrative
              process={process}
            />
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Network className="size-4 text-blue-600" />

                <p className="text-sm font-semibold">
                  Sistemas involucrados
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {process.systems.length >
                0 ? (
                  process.systems.map(
                    (system) => (
                      <span
                        key={system}
                        className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium"
                      >
                        {systemLabels[
                          system
                        ] ?? system}
                      </span>
                    ),
                  )
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Pendiente de
                    levantamiento
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-blue-600" />

                <p className="text-sm font-semibold">
                  Información y documentos
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {process.inputs.length >
                0 ? (
                  process.inputs.map(
                    (input) => (
                      <span
                        key={input}
                        className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium"
                      >
                        {inputLabels[
                          input
                        ] ?? input}
                      </span>
                    ),
                  )
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Pendiente de
                    levantamiento
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  {process.requiresApproval ? (
                    <AlertCircle className="size-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  )}

                  <p className="text-sm font-semibold">
                    Aprobaciones
                  </p>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {process.requiresApproval
                    ? "Existen aprobaciones humanas dentro del flujo."
                    : "No se detectaron aprobaciones humanas obligatorias."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  {process.hasExceptions ? (
                    <AlertCircle className="size-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  )}

                  <p className="text-sm font-semibold">
                    Excepciones
                  </p>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {process.hasExceptions
                    ? "Existen casos que requieren criterio o tratamiento humano."
                    : "No se detectó una carga relevante de excepciones."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Diagnóstico XONPLACE
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Lectura ejecutiva del proceso
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {data.diagnosis}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ScoreMetric
              label="Readiness"
              value={
                process.scores.readiness
              }
            />

            <ScoreMetric
              label="Opportunity"
              value={
                process.scores.opportunity
              }
            />

            <ScoreMetric
              label="Business Impact"
              value={
                process.scores
                  .businessImpact
              }
            />

            <ScoreMetric
              label="Confidence"
              value={
                process.scores.confidence
              }
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-blue-50/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Carga actual calculada
          </p>

          <p className="mt-2 text-3xl font-bold">
            {process.currentHoursPerMonth !==
            undefined
              ? `${formatNumber(
                  process.currentHoursPerMonth,
                )} h/mes`
              : "Pendiente"}
          </p>
        </div>

        <div className="rounded-2xl border bg-emerald-50/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Potencial recuperable
          </p>

          <p className="mt-2 text-3xl font-bold">
            {process.recoverableHoursPerMonth !==
            undefined
              ? `${formatNumber(
                  process.recoverableHoursPerMonth,
                )} h/mes`
              : "Pendiente"}
          </p>
        </div>
      </div>
    </section>
  );
}