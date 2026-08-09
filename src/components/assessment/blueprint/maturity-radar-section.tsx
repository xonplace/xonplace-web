import { MaturityRadar } from "@/components/assessment/maturity-radar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { BlueprintReportData, DimensionScores } from "./types";

type Props = {
  data: BlueprintReportData;
};

const dimensionLabels: Record<keyof DimensionScores, string> = {
  procesos: "Procesos",
  informacion: "Información",
  integracion: "Integración",
  automatizacion: "Automatización",
  ia: "Preparación para IA",
};

function getInterpretation(value: number) {
  if (value >= 80) return "Madurez avanzada";
  if (value >= 60) return "Madurez intermedia";
  if (value >= 40) return "En desarrollo";
  return "Etapa inicial";
}

function getBarColor(value: number) {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 60) return "bg-blue-600";
  if (value >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function MaturityRadarSection({ data }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          AI Readiness
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Mapa de madurez
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Comparación de las cinco dimensiones que determinan el potencial de
          automatización e Inteligencia Artificial de la organización.
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
            <MaturityRadar scores={data.dimensions} />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(data.dimensions).map(([key, value]) => {
            const typedKey = key as keyof DimensionScores;

            return (
              <Card key={key}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {dimensionLabels[typedKey]}
                      </p>

                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {getInterpretation(value)}
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
                      className={`h-full rounded-full ${getBarColor(value)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}