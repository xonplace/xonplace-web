"use client";

import { useState } from "react";

import { BlueprintReport } from "@/components/assessment/blueprint-report";
import { OpportunityPriorityMatrix } from "@/components/assessment/v2/opportunity-priority-matrix";
import { ProcessTransformationCard } from "@/components/assessment/v2/process-transformation-card";
import { AssessmentV2Form } from "@/components/assessment/v2/assessment-v2-form";

import { generateIntelligenceResult } from "@/lib/assessment/intelligence";

import {
  adaptAssessmentV2,
  buildBlueprintV2,
  generateV2Evidence,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

export default function AssessmentV2Page() {
  const [result, setResult] =
    useState<ReturnType<
      typeof generateIntelligenceResult
    > | null>(null);

  const [answers, setAnswers] =
    useState<AssessmentV2Answers | null>(null);

  const [showBlueprint, setShowBlueprint] =
    useState(false);

  const handleComplete = (
    completedAnswers: AssessmentV2Answers,
  ) => {
    const adapted =
      adaptAssessmentV2(completedAnswers);

    const v2Evidence =
      generateV2Evidence(completedAnswers);

    const intelligence =
      generateIntelligenceResult({
        answers:
          adapted.intelligenceAnswers,

        processes:
          adapted.processes,

        additionalEvidence:
          v2Evidence,

        hourlyCostCLP:
          adapted.hourlyCostCLP,
      });

    setAnswers(completedAnswers);
    setResult(intelligence);
    setShowBlueprint(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (showBlueprint && result && answers) {
    const adapted =
      adaptAssessmentV2(answers);

    const process =
      adapted.processes[0];

    const blueprintData =
      buildBlueprintV2({
        answers,
        process,
        intelligence: result,
      });

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setShowBlueprint(false)
              }
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Volver al diagnóstico
            </button>
          </div>

          <BlueprintReport
            data={blueprintData}
          />
        </div>
      </main>
    );
  }

  if (result && answers) {
    const adapted =
      adaptAssessmentV2(answers);

    const process =
      adapted.processes[0];

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              XONPLACE Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Diagnóstico preliminar
            </h1>

            <p className="mt-2 text-muted-foreground">
              Resultado generado por el
              Assessment V2.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <ScoreCard
              title="Readiness"
              value={
                result.scores.readiness
              }
            />

            <ScoreCard
              title="Opportunity"
              value={
                result.scores.opportunity
              }
            />

            <ScoreCard
              title="Business Impact"
              value={
                result.scores.businessImpact
              }
            />

            <ScoreCard
              title="Confidence"
              value={
                result.scores.confidence
              }
            />
          </div>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Proceso evaluado
            </h2>

            <p className="mt-2 text-lg font-medium">
              {process.name}
            </p>

            {process.description && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {process.description}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ProcessMetric
                label="Ejecuciones / mes"
                value={
                  process.executionsPerMonth
                }
              />

              <ProcessMetric
                label="Personas"
                value={
                  process.peopleInvolved
                }
              />

              <ProcessMetric
                label="Minutos / ejecución"
                value={
                  process.minutesPerExecution
                }
              />

              <ProcessMetric
                label="% manual"
                value={
                  process.manualPercentage
                }
                suffix="%"
              />
            </div>
          </section>

          <ProcessTransformationCard
            process={process}
          />

          <OpportunityPriorityMatrix
            opportunities={
              result.opportunities
            }
          />

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                Oportunidades detectadas
              </h2>

              <p className="mt-1 text-muted-foreground">
                Priorizadas según impacto,
                confianza y potencial de
                automatización.
              </p>
            </div>

            {result.opportunities.map(
              (opportunity, index) => (
                <article
                  key={opportunity.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">
                        Oportunidad{" "}
                        {index + 1}
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {
                          opportunity.title
                        }
                      </h3>

                      <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
                        {
                          opportunity.description
                        }
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <MiniMetric
                        label="Impacto"
                        value={
                          opportunity.impactScore
                        }
                      />

                      <MiniMetric
                        label="Complejidad"
                        value={
                          opportunity.complexityScore
                        }
                      />

                      <MiniMetric
                        label="Confianza"
                        value={
                          opportunity.confidenceScore
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-amber-50 p-5">
                      <p className="text-sm font-semibold text-amber-800">
                        Situación actual
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {
                          opportunity.currentProcess
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-5">
                      <p className="text-sm font-semibold text-emerald-800">
                        Proceso propuesto
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {
                          opportunity.proposedProcess
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold">
                      Tecnologías sugeridas
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.recommendedTechnologies.map(
                        (technology) => (
                          <span
                            key={
                              technology
                            }
                            className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {technology}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold">
                Impacto económico
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Calculado únicamente con
                información disponible y
                validable.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <EconomicMetric
                label="Horas actuales / mes"
                value={
                  result.economics
                    .currentHoursPerMonth
                }
              />

              <EconomicMetric
                label="Horas recuperables / mes"
                value={
                  result.economics
                    .recoverableHoursPerMonth
                }
              />

              <EconomicMetric
                label="Ahorro mensual"
                value={
                  result.economics
                    .monthlySavingsCLP
                }
                currency
              />

              <EconomicMetric
                label="Ahorro anual"
                value={
                  result.economics
                    .annualSavingsCLP
                }
                currency
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <EconomicMetric
                label="Inversión estimada"
                value={
                  result.economics
                    .estimatedImplementationCLP
                }
                currency
              />

              <EconomicMetric
                label="Payback"
                value={
                  result.economics
                    .paybackMonths
                }
                suffix="meses"
              />

              <EconomicMetric
                label="ROI"
                value={
                  result.economics
                    .roiPercentage
                }
                suffix="%"
              />
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-semibold">
                Confianza económica
              </p>

              <p className="mt-1 text-2xl font-bold">
                {
                  result.economics
                    .confidence
                }
                /100
              </p>

              {result.economics
                .assumptions.length >
                0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Supuestos
                  </p>

                  <ul className="mt-2 space-y-2">
                    {result.economics.assumptions.map(
                      (assumption) => (
                        <li
                          key={
                            assumption
                          }
                          className="text-sm leading-6 text-muted-foreground"
                        >
                          • {assumption}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {result.warnings.length > 0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">
                Aspectos pendientes de
                validación
              </h2>

              <div className="mt-4 space-y-2">
                {result.warnings.map(
                  (warning) => (
                    <p
                      key={warning}
                      className="text-sm leading-6 text-amber-900"
                    >
                      • {warning}
                    </p>
                  ),
                )}
              </div>
            </section>
          )}

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAnswers(null);
                setShowBlueprint(false);
              }}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Realizar otro Assessment
            </button>

            <button
              type="button"
              onClick={() =>
                setShowBlueprint(true)
              }
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Generar Blueprint V2
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="px-6 py-10">
        <AssessmentV2Form
          onComplete={
            handleComplete
          }
        />
      </div>
    </main>
  );
}

function ScoreCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-2 text-4xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        sobre 100
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-20 rounded-xl bg-slate-50 p-3 text-center">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}

function ProcessMetric({
  label,
  value,
  suffix,
}: {
  label: string;
  value?: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value !== undefined
          ? `${new Intl.NumberFormat(
              "es-CL",
            ).format(value)}${
              suffix ?? ""
            }`
          : "Pendiente"}
      </p>
    </div>
  );
}

function EconomicMetric({
  label,
  value,
  currency = false,
  suffix,
}: {
  label: string;
  value?: number;
  currency?: boolean;
  suffix?: string;
}) {
  let displayValue =
    "Pendiente de validación";

  if (value !== undefined) {
    if (currency) {
      displayValue =
        new Intl.NumberFormat(
          "es-CL",
          {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
          },
        ).format(value);
    } else {
      displayValue =
        new Intl.NumberFormat(
          "es-CL",
          {
            maximumFractionDigits: 1,
          },
        ).format(value);

      if (suffix) {
        displayValue += ` ${suffix}`;
      }
    }
  }

  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        {displayValue}
      </p>
    </div>
  );
}