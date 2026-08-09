"use client";

import { useState } from "react";

import { AssessmentV2Form } from "@/components/assessment/v2/assessment-v2-form";

import {
  adaptAssessmentV2,
  generateV2Evidence,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

import { generateIntelligenceResult } from "@/lib/assessment/intelligence";

export default function AssessmentV2Page() {
  const [result, setResult] =
    useState<ReturnType<
      typeof generateIntelligenceResult
    > | null>(null);

  const [answers, setAnswers] =
    useState<AssessmentV2Answers | null>(
      null,
    );

  const handleComplete = (
    completedAnswers: AssessmentV2Answers,
  ) => {
    const adapted =
      adaptAssessmentV2(completedAnswers);

    const v2Evidence =
      generateV2Evidence(
        completedAnswers,
      );

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (result && answers) {
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
              value={result.scores.readiness}
            />

            <ScoreCard
              title="Opportunity"
              value={result.scores.opportunity}
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
              {adaptAssessmentV2(
                answers,
              ).processes[0]?.name}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {
                adaptAssessmentV2(
                  answers,
                ).processes[0]
                  ?.description
              }
            </p>
          </section>

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
                        label="Confianza"
                        value={
                          opportunity.confidenceScore
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold">
                        Situación actual
                      </p>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {
                          opportunity.currentProcess
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Proceso propuesto
                      </p>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {
                          opportunity.proposedProcess
                        }
                      </p>
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Impacto económico
            </h2>

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
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setAnswers(null);
              }}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Realizar otro Assessment
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
          onComplete={handleComplete}
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

function EconomicMetric({
  label,
  value,
  currency = false,
}: {
  label: string;
  value?: number;
  currency?: boolean;
}) {
  let displayValue = "Pendiente";

  if (value !== undefined) {
    displayValue = currency
      ? new Intl.NumberFormat(
          "es-CL",
          {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
          },
        ).format(value)
      : new Intl.NumberFormat(
          "es-CL",
        ).format(value);
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