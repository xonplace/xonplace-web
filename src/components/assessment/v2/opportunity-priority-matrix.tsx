import { ArrowUpRight, Target } from "lucide-react";

import type { AutomationOpportunity } from "@/lib/assessment/intelligence";

type OpportunityPriorityMatrixProps = {
  opportunities: AutomationOpportunity[];
};

type PriorityGroup =
  | "quick-win"
  | "strategic"
  | "selective"
  | "later";

function classifyOpportunity(
  opportunity: AutomationOpportunity,
): PriorityGroup {
  const impact = opportunity.impactScore;
  const complexity = opportunity.complexityScore;
  const confidence = opportunity.confidenceScore;

  if (
    impact >= 80 &&
    complexity <= 60 &&
    confidence >= 75
  ) {
    return "quick-win";
  }

  if (
    impact >= 80 &&
    complexity > 60 &&
    confidence >= 75
  ) {
    return "strategic";
  }

  if (
    impact >= 60 &&
    confidence >= 65
  ) {
    return "selective";
  }

  return "later";
}

const groups: Record<
  PriorityGroup,
  {
    title: string;
    description: string;
    container: string;
    badge: string;
  }
> = {
  "quick-win": {
    title: "Quick Wins",
    description:
      "Alto impacto, complejidad controlada y buena evidencia.",
    container:
      "border-emerald-200 bg-emerald-50/40",
    badge:
      "bg-emerald-100 text-emerald-700",
  },

  strategic: {
    title: "Iniciativas estratégicas",
    description:
      "Alto impacto, pero requieren mayor esfuerzo o integración.",
    container:
      "border-blue-200 bg-blue-50/40",
    badge:
      "bg-blue-100 text-blue-700",
  },

  selective: {
    title: "Oportunidades selectivas",
    description:
      "Conviene validarlas antes de incorporarlas al plan principal.",
    container:
      "border-amber-200 bg-amber-50/40",
    badge:
      "bg-amber-100 text-amber-700",
  },

  later: {
    title: "Segunda prioridad",
    description:
      "Menor prioridad relativa o evidencia todavía insuficiente.",
    container:
      "border-slate-200 bg-slate-50",
    badge:
      "bg-slate-200 text-slate-700",
  },
};

export function OpportunityPriorityMatrix({
  opportunities,
}: OpportunityPriorityMatrixProps) {
  const grouped = opportunities.reduce<
    Record<
      PriorityGroup,
      AutomationOpportunity[]
    >
  >(
    (accumulator, opportunity) => {
      const group =
        classifyOpportunity(opportunity);

      accumulator[group].push(
        opportunity,
      );

      return accumulator;
    },
    {
      "quick-win": [],
      strategic: [],
      selective: [],
      later: [],
    },
  );

  const quickWins =
    grouped["quick-win"];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Priorización
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Matriz de oportunidades
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Clasificación de las iniciativas
            según impacto, complejidad y
            nivel de confianza del
            diagnóstico.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Quick Wins
          </p>

          <p className="mt-1 text-3xl font-bold text-emerald-800">
            {quickWins.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {(
          Object.keys(groups) as PriorityGroup[]
        ).map((groupKey) => {
          const config =
            groups[groupKey];

          const items =
            grouped[groupKey];

          return (
            <div
              key={groupKey}
              className={`rounded-2xl border p-6 ${config.container}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {config.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {config.description}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${config.badge}`}
                >
                  {items.length}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {items.length > 0 ? (
                  items.map(
                    (opportunity) => (
                      <div
                        key={
                          opportunity.id
                        }
                        className="rounded-xl border bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">
                              {
                                opportunity.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Potencial de
                              automatización{" "}
                              {
                                opportunity.automationPotential
                              }
                              %
                            </p>
                          </div>

                          <Target className="size-4 shrink-0 text-blue-600" />
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <Metric
                            label="Impacto"
                            value={
                              opportunity.impactScore
                            }
                          />

                          <Metric
                            label="Complejidad"
                            value={
                              opportunity.complexityScore
                            }
                          />

                          <Metric
                            label="Confianza"
                            value={
                              opportunity.confidenceScore
                            }
                          />
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No existen
                    iniciativas en este
                    grupo.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {quickWins.length > 0 && (
        <div className="rounded-2xl bg-slate-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Acción recomendada
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            Comenzar por las iniciativas de mayor retorno
          </h3>

          <div className="mt-5 space-y-3">
            {quickWins
              .slice(0, 3)
              .map(
                (
                  opportunity,
                  index,
                ) => (
                  <div
                    key={
                      opportunity.id
                    }
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {
                            opportunity.title
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Impacto{" "}
                          {
                            opportunity.impactScore
                          }{" "}
                          · Complejidad{" "}
                          {
                            opportunity.complexityScore
                          }{" "}
                          · Confianza{" "}
                          {
                            opportunity.confidenceScore
                          }
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="size-4 shrink-0 text-emerald-400" />
                  </div>
                ),
              )}
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}