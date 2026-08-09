import {
  Banknote,
  CalendarClock,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "@/components/cards";

import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export function BusinessImpactSection({ data }: Props) {
  const economic = data.insights.economicEstimate;

  const roi =
    economic.estimatedImplementationCLP > 0
      ? Math.round(
          ((economic.annualSavingsCLP -
            economic.estimatedImplementationCLP) /
            economic.estimatedImplementationCLP) *
            100,
        )
      : 0;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Business Impact
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Caso económico preliminar
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Proyección inicial del impacto económico asociado a las oportunidades
          de automatización detectadas durante el Assessment.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ahorro mensual"
          value={formatCLP(economic.monthlySavingsCLP)}
          icon={PiggyBank}
          tone="green"
        />

        <MetricCard
          title="Ahorro anual"
          value={formatCLP(economic.annualSavingsCLP)}
          icon={TrendingUp}
          tone="green"
        />

        <MetricCard
          title="Inversión estimada"
          value={formatCLP(economic.estimatedImplementationCLP)}
          icon={Banknote}
          tone="blue"
        />

        <MetricCard
          title="Payback"
          value={economic.paybackMonths}
          suffix="meses"
          icon={CalendarClock}
          tone="purple"
        />
      </div>

      <div className="rounded-3xl bg-slate-950 p-8 text-white">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
              ROI proyectado
            </p>

            <p className="mt-4 text-6xl font-bold tracking-tight">
              {roi}%
            </p>

            <p className="mt-3 text-sm text-slate-400">
              Retorno estimado durante el primer año.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="text-xl font-bold">
              Potencial de recuperación
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              La evaluación identifica aproximadamente{" "}
              <strong className="text-white">
                {data.insights.estimatedHoursPerMonth} horas mensuales
              </strong>{" "}
              con potencial de recuperación mediante automatización.
            </p>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Estas cifras son referenciales y deberán validarse durante el
              levantamiento detallado de procesos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}