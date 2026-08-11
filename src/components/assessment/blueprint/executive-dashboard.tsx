import {
  Activity,
  Briefcase,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "@/components/cards";

import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

function formatCurrency(
  value?: number,
): string {
  if (value === undefined) {
    return "Pendiente";
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRecoverableHours(
  value?: number,
): string | number {
  if (value === undefined) {
    return "Pendiente";
  }

  return value;
}

export function ExecutiveDashboard({
  data,
}: Props) {
  const economic =
    data.insights.economicEstimate;

  const recoverableHours =
    data.insights
      .estimatedHoursPerMonth;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          Executive Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Indicadores principales
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Opportunity Score"
          value={data.automationScore}
          suffix="/100"
          icon={Activity}
          tone="blue"
          description="Potencial detectado de automatización del proceso."
        />

        <MetricCard
          title="Horas recuperables"
          value={formatRecoverableHours(
            recoverableHours,
          )}
          suffix={
            recoverableHours !==
            undefined
              ? "/mes"
              : undefined
          }
          icon={Clock3}
          tone="purple"
          description={
            recoverableHours ===
            undefined
              ? "Pendiente de validación operacional."
              : undefined
          }
        />

        <MetricCard
          title="Ahorro anual"
          value={formatCurrency(
            economic.annualSavingsCLP,
          )}
          icon={TrendingUp}
          tone="green"
          description={
            economic.annualSavingsCLP ===
            undefined
              ? "Pendiente de validación económica."
              : undefined
          }
        />

        <MetricCard
          title="Automatizaciones"
          value={
            data.insights
              .recommendations.length
          }
          icon={Briefcase}
          tone="amber"
        />
      </div>
    </section>
  );
}