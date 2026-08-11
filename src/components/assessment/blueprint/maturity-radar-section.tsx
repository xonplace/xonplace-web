import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  MinusCircle,
} from "lucide-react";

import { MaturityRadar } from "@/components/assessment/maturity-radar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  BlueprintReportData,
  DimensionScores,
  MaturityDimensionDetail,
  MaturityFactorStatus,
} from "./types";

type Props = {
  data: BlueprintReportData;
};

const dimensionLabels: Record<
  keyof DimensionScores,
  string
> = {
  procesos: "Procesos",
  informacion: "Información",
  integracion: "Integración",
  automatizacion: "Automatización",
  ia: "Preparación para IA",
};

function getInterpretation(
  value: number,
): string {
  if (value >= 80) {
    return "Madurez avanzada";
  }

  if (value >= 60) {
    return "Madurez intermedia";
  }

  if (value >= 40) {
    return "Madurez básica";
  }

  return "Etapa inicial";
}

function getBarColor(
  value: number,
): string {
  if (value >= 80) {
    return "bg-emerald-500";
  }

  if (value >= 60) {
    return "bg-blue-600";
  }

  if (value >= 40) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}

function getStatusConfig(
  status: MaturityFactorStatus,
) {
  if (status === "fortaleza") {
    return {
      label: "Fortaleza",
      icon: CheckCircle2,
      iconClass:
        "text-emerald-600",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (status === "parcial") {
    return {
      label: "Parcial",
      icon: MinusCircle,
      iconClass:
        "text-amber-600",
      badgeClass:
        "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (status === "brecha") {
    return {
      label: "Brecha",
      icon: AlertTriangle,
      iconClass:
        "text-red-600",
      badgeClass:
        "bg-red-50 text-red-700 border-red-200",
    };
  }

  return {
    label: "No validado",
    icon: CircleHelp,
    iconClass:
      "text-slate-500",
    badgeClass:
      "bg-slate-50 text-slate-600 border-slate-200",
  };
}

function DimensionScoreCard({
  dimensionKey,
  value,
  detail,
}: {
  dimensionKey:
    keyof DimensionScores;
  value: number;
  detail?: MaturityDimensionDetail;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">
              {
                dimensionLabels[
                  dimensionKey
                ]
              }
            </p>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {detail?.level ??
                getInterpretation(
                  value,
                )}
            </p>
          </div>

          <p className="text-2xl font-bold">
            {value}
            <span className="text-sm font-medium text-muted-foreground">
              /100
            </span>
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${getBarColor(
              value,
            )}`}
            style={{
              width: `${value}%`,
            }}
          />
        </div>

        {detail?.rationale && (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {detail.rationale}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DimensionExplanation({
  dimensionKey,
  detail,
}: {
  dimensionKey:
    keyof DimensionScores;
  detail: MaturityDimensionDetail;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-slate-50/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              ¿Por qué este puntaje?
            </p>

            <CardTitle className="mt-2 text-xl">
              {
                dimensionLabels[
                  dimensionKey
                ]
              }
            </CardTitle>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {detail.rationale}
            </p>
          </div>

          <div className="shrink-0 rounded-xl border bg-white px-4 py-3 text-right">
            <p className="text-3xl font-bold">
              {detail.score}
            </p>

            <p className="text-xs font-medium text-muted-foreground">
              {detail.level}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-7 p-6">
        <div>
          <p className="text-sm font-semibold">
            Factores evaluados
          </p>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {detail.factors.map(
              (factor) => {
                const config =
                  getStatusConfig(
                    factor.status,
                  );

                const Icon =
                  config.icon;

                return (
                  <div
                    key={`${dimensionKey}-${factor.label}`}
                    className="rounded-xl border bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`mt-0.5 size-5 shrink-0 ${config.iconClass}`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {
                              factor.label
                            }
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${config.badgeClass}`}
                          >
                            {
                              config.label
                            }
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {
                            factor.detail
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {detail.actions.length >
          0 && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
            <p className="text-sm font-semibold text-blue-900">
              Cómo mejorar esta
              dimensión
            </p>

            <div className="mt-3 space-y-2">
              {detail.actions.map(
                (
                  action,
                  index,
                ) => (
                  <div
                    key={`${dimensionKey}-${action}`}
                    className="flex items-start gap-3"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                      {index + 1}
                    </div>

                    <p className="pt-0.5 text-sm leading-6 text-slate-700">
                      {action}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MaturityRadarSection({
  data,
}: Props) {
  const maturityAnalysis =
    data.maturityAnalysis;

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          AI Readiness
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Mapa de madurez
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Evaluación de cinco
          dimensiones que representan
          la madurez actual del proceso
          para avanzar hacia
          automatización e Inteligencia
          Artificial.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">
              Perfil de madurez digital
            </CardTitle>
          </CardHeader>

          <CardContent>
            <MaturityRadar
              scores={
                data.dimensions
              }
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            Object.entries(
              data.dimensions,
            ) as [
              keyof DimensionScores,
              number,
            ][]
          ).map(
            ([key, value]) => (
              <DimensionScoreCard
                key={key}
                dimensionKey={key}
                value={value}
                detail={
                  maturityAnalysis?.[
                    key
                  ]
                }
              />
            ),
          )}
        </div>
      </div>

      {maturityAnalysis && (
        <div className="space-y-5">
          <div className="border-t pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Trazabilidad del
              diagnóstico
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              ¿Qué explica cada
              dimensión?
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Los puntajes siguientes
              se construyen a partir de
              respuestas explícitas del
              Assessment y muestran los
              principales factores que
              fortalecen o limitan la
              madurez actual del
              proceso.
            </p>
          </div>

          {(
            Object.keys(
              data.dimensions,
            ) as (
              keyof DimensionScores
            )[]
          ).map((key) => (
            <DimensionExplanation
              key={key}
              dimensionKey={key}
              detail={
                maturityAnalysis[
                  key
                ]
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}