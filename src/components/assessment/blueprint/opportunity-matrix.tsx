import { Sparkles, Target, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  BlueprintReportData,
  Recommendation,
} from "./types";

type Props = {
  data: BlueprintReportData;
};

function impactScore(impact: Recommendation["impact"]) {
  if (impact === "Alto") return 3;
  if (impact === "Medio") return 2;
  return 1;
}

function complexityScore(complexity: Recommendation["complexity"]) {
  if (complexity === "Alta") return 3;
  if (complexity === "Media") return 2;
  return 1;
}

function classifyOpportunity(recommendation: Recommendation) {
  const impact = impactScore(recommendation.impact);
  const complexity = complexityScore(recommendation.complexity);

  if (impact === 3 && complexity <= 2) {
    return "quick-win";
  }

  if (impact === 3 && complexity === 3) {
    return "strategic";
  }

  if (impact === 2 && complexity <= 2) {
    return "selective";
  }

  return "later";
}

const quadrantStyles = {
  "quick-win": {
    title: "Quick Wins",
    description: "Alto impacto con complejidad baja o media.",
    container: "border-emerald-200 bg-emerald-50/40",
    badge: "bg-emerald-100 text-emerald-700",
  },
  strategic: {
    title: "Iniciativas estratégicas",
    description: "Alto impacto, pero requieren mayor esfuerzo.",
    container: "border-blue-200 bg-blue-50/40",
    badge: "bg-blue-100 text-blue-700",
  },
  selective: {
    title: "Oportunidades selectivas",
    description: "Impacto medio y ejecución relativamente accesible.",
    container: "border-amber-200 bg-amber-50/40",
    badge: "bg-amber-100 text-amber-700",
  },
  later: {
    title: "Segunda prioridad",
    description: "Conviene abordarlas después de iniciativas de mayor retorno.",
    container: "border-slate-200 bg-slate-50",
    badge: "bg-slate-200 text-slate-700",
  },
};

export function OpportunityMatrix({ data }: Props) {
  const grouped = data.insights.recommendations.reduce(
    (acc, recommendation) => {
      const classification = classifyOpportunity(recommendation);

      acc[classification].push(recommendation);

      return acc;
    },
    {
      "quick-win": [] as Recommendation[],
      strategic: [] as Recommendation[],
      selective: [] as Recommendation[],
      later: [] as Recommendation[],
    },
  );

  const quickWins = grouped["quick-win"];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Opportunity Matrix
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Priorización impacto vs. complejidad
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Las iniciativas se clasifican según su impacto potencial y la
            complejidad estimada de implementación.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Quick Wins detectados
          </p>

          <p className="mt-1 text-3xl font-bold text-emerald-800">
            {quickWins.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Object.entries(grouped).map(([key, recommendations]) => {
          const config =
            quadrantStyles[key as keyof typeof quadrantStyles];

          return (
            <Card
              key={key}
              className={`overflow-hidden ${config.container}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      {config.title}
                    </CardTitle>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {config.description}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${config.badge}`}
                  >
                    {recommendations.length}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((recommendation) => (
                      <div
                        key={recommendation.title}
                        className="rounded-xl border bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold">
                              {recommendation.title}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {recommendation.category}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold">
                              Impacto {recommendation.impact}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold">
                              Complejidad {recommendation.complexity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    No existen iniciativas clasificadas en este cuadrante.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {quickWins.length > 0 && (
        <div className="rounded-3xl bg-slate-950 p-8 text-white">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <Sparkles className="size-6" />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Prioridad recomendada
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                Comenzar por Quick Wins
              </h3>
            </div>

            <div className="space-y-4">
              {quickWins.slice(0, 3).map((recommendation, index) => (
                <div
                  key={recommendation.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-bold">
                      {recommendation.title}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {recommendation.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="size-3.5" />
                        Impacto {recommendation.impact}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Target className="size-3.5" />
                        {recommendation.estimatedWeeks} semanas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}