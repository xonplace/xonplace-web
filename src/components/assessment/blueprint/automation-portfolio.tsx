import { ArrowUpRight, Layers3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

function getPriorityStyle(priority: "Alta" | "Media" | "Baja") {
  if (priority === "Alta") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (priority === "Media") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getImpactStyle(impact: "Alto" | "Medio" | "Bajo") {
  if (impact === "Alto") {
    return "text-emerald-700";
  }

  if (impact === "Medio") {
    return "text-amber-700";
  }

  return "text-slate-600";
}

export function AutomationPortfolio({ data }: Props) {
  const recommendations = [...data.insights.recommendations].sort(
    (a, b) => {
      const priorityOrder = {
        Alta: 3,
        Media: 2,
        Baja: 1,
      };

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    },
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Automation Portfolio
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Iniciativas recomendadas
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Portafolio inicial de iniciativas priorizadas según su impacto,
            complejidad y nivel de oportunidad detectado en el Assessment.
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total iniciativas
          </p>

          <p className="mt-1 text-3xl font-bold">
            {recommendations.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {recommendations.map((recommendation, index) => (
          <Card
            key={`${recommendation.title}-${index}`}
            className="overflow-hidden"
          >
            <CardHeader className="border-b bg-slate-50/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers3 className="size-4" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Iniciativa {index + 1}
                    </p>
                  </div>

                  <CardTitle className="mt-4 text-xl">
                    {recommendation.title}
                  </CardTitle>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityStyle(
                    recommendation.priority,
                  )}`}
                >
                  {recommendation.priority}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm leading-6 text-muted-foreground">
                {recommendation.description}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-muted-foreground">
                    Impacto
                  </p>

                  <p
                    className={`mt-1 font-bold ${getImpactStyle(
                      recommendation.impact,
                    )}`}
                  >
                    {recommendation.impact}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-muted-foreground">
                    Complejidad
                  </p>

                  <p className="mt-1 font-bold">
                    {recommendation.complexity}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-muted-foreground">
                    Plazo
                  </p>

                  <p className="mt-1 font-bold">
                    {recommendation.estimatedWeeks} sem.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {recommendation.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {recommendation.category}
                </span>

                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Candidato para análisis
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}