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

function formatCLP(
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

function calculateROI(
  annualSavingsCLP?: number,
  estimatedImplementationCLP?: number,
  explicitROI?: number,
): number | undefined {
  if (explicitROI !== undefined) {
    return explicitROI;
  }

  if (
    annualSavingsCLP === undefined ||
    estimatedImplementationCLP ===
      undefined ||
    estimatedImplementationCLP <= 0
  ) {
    return undefined;
  }

  return Math.round(
    ((annualSavingsCLP -
      estimatedImplementationCLP) /
      estimatedImplementationCLP) *
      100,
  );
}

export function BusinessImpactSection({
  data,
}: Props) {
  const economic =
    data.insights.economicEstimate;

  const recoverableHours =
    data.insights
      .estimatedHoursPerMonth;

  const roi = calculateROI(
    economic.annualSavingsCLP,
    economic.estimatedImplementationCLP,
    economic.roiPercentage,
  );

  const paybackValue =
    economic.paybackMonths !== undefined
      ? economic.paybackMonths
      : "Pendiente";

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
          Proyección inicial del impacto
          económico asociado a las
          oportunidades de automatización
          detectadas durante el Assessment.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ahorro mensual"
          value={formatCLP(
            economic.monthlySavingsCLP,
          )}
          icon={PiggyBank}
          tone="green"
          description={
            economic.monthlySavingsCLP ===
            undefined
              ? "Pendiente de validación económica."
              : undefined
          }
        />

        <MetricCard
          title="Ahorro anual"
          value={formatCLP(
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
          title="Inversión estimada"
          value={formatCLP(
            economic.estimatedImplementationCLP,
          )}
          icon={Banknote}
          tone="blue"
          description={
            economic.estimatedImplementationCLP ===
            undefined
              ? "Pendiente de definición del alcance técnico."
              : undefined
          }
        />

        <MetricCard
          title="Payback"
          value={paybackValue}
          suffix={
            economic.paybackMonths !==
            undefined
              ? "meses"
              : undefined
          }
          icon={CalendarClock}
          tone="purple"
          description={
            economic.paybackMonths ===
            undefined
              ? "Pendiente hasta contar con ahorro e inversión validados."
              : undefined
          }
        />
      </div>

      <div className="rounded-3xl bg-slate-950 p-8 text-white">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
              ROI proyectado
            </p>

            {roi !== undefined ? (
              <>
                <p className="mt-4 text-6xl font-bold tracking-tight">
                  {roi}%
                </p>

                <p className="mt-3 text-sm text-slate-400">
                  Retorno estimado durante el
                  primer año.
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-3xl font-bold tracking-tight">
                  Pendiente de validación
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Se requiere una estimación
                  de inversión validada para
                  calcular ROI y payback.
                </p>
              </>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h3 className="text-xl font-bold">
              Potencial de recuperación
            </h3>

            {recoverableHours !== undefined ? (
              recoverableHours > 0 ? (
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  La evaluación identifica
                  aproximadamente{" "}
                  <strong className="text-white">
                    {recoverableHours} horas
                    mensuales
                  </strong>{" "}
                  con potencial de recuperación
                  mediante automatización.
                </p>
              ) : (
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Con la información disponible,
                  el cálculo actual no identifica
                  horas recuperables para este
                  proceso.
                </p>
              )
            ) : (
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Las horas recuperables
                permanecerán pendientes hasta
                contar con volumen, tiempos y
                nivel de manualidad validados.
              </p>
            )}

            {economic.confidence !== undefined && (
              <p className="mt-4 text-xs leading-5 text-slate-400">
                Confianza de la estimación
                económica:{" "}
                {economic.confidence}/100.
              </p>
            )}

            {economic.assumptions &&
              economic.assumptions.length >
                0 && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Supuestos
                  </p>

                  <ul className="mt-3 space-y-2">
                    {economic.assumptions.map(
                      (assumption) => (
                        <li
                          key={assumption}
                          className="text-xs leading-5 text-slate-400"
                        >
                          • {assumption}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}