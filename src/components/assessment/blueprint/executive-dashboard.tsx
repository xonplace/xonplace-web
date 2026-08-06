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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export function ExecutiveDashboard({ data }: Props) {
  const economic = data.insights.economicEstimate;

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
          title="Automation Score"
          value={data.automationScore}
          suffix="/100"
          icon={Activity}
          tone="blue"
        />

        <MetricCard
          title="Horas recuperables"
          value={data.insights.estimatedHoursPerMonth}
          suffix="/mes"
          icon={Clock3}
          tone="purple"
        />

        <MetricCard
          title="Ahorro anual"
          value={formatCurrency(economic.annualSavingsCLP)}
          icon={TrendingUp}
          tone="green"
        />

        <MetricCard
          title="Automatizaciones"
          value={data.insights.recommendations.length}
          icon={Briefcase}
          tone="amber"
        />

      </div>
    </section>
  );
}