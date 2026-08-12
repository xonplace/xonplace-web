"use client";

import {
  useState,
} from "react";

import {
  BlueprintReport,
} from "@/components/assessment/blueprint-report";

import {
  OpportunityPriorityMatrix,
} from "@/components/assessment/v2/opportunity-priority-matrix";

import {
  ProcessTransformationCard,
} from "@/components/assessment/v2/process-transformation-card";

import {
  AssessmentV2Form,
} from "@/components/assessment/v2/assessment-v2-form";

import {
  generateIntelligenceResult,
} from "@/lib/assessment/intelligence";

import {
  adaptAssessmentV2,
  buildBlueprintV2,
  calculateV2IntelligenceScores,
  generateV2Evidence,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

const ASSESSMENT_VERSION =
  "2.0";

const SCORING_VERSION =
  "2.1";

const BLUEPRINT_VERSION =
  2;

type PersistedAssessment = {
  clientId: string;
  assessmentId: string;
  blueprintId: string;
};

export default function AssessmentV2Page() {
  const [result, setResult] =
    useState<ReturnType<
      typeof generateIntelligenceResult
    > | null>(null);

  const [answers, setAnswers] =
    useState<AssessmentV2Answers | null>(
      null,
    );

  const [
    showBlueprint,
    setShowBlueprint,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null,
  );

  const [
    persisted,
    setPersisted,
  ] = useState<PersistedAssessment | null>(
    null,
  );

  const handleComplete = (
    completedAnswers:
      AssessmentV2Answers,
  ) => {
    const adapted =
      adaptAssessmentV2(
        completedAnswers,
      );

    const v2Evidence =
      generateV2Evidence(
        completedAnswers,
      );

    const v2Scores =
      calculateV2IntelligenceScores(
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

        scoresOverride:
          v2Scores,
      });

    setAnswers(
      completedAnswers,
    );

    setResult(
      intelligence,
    );

    setShowBlueprint(
      false,
    );

    setSaveError(
      null,
    );

    setPersisted(
      null,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleGenerateBlueprint =
    async () => {
      if (
        !result ||
        !answers ||
        isSaving
      ) {
        return;
      }

      setSaveError(
        null,
      );

      /*
       * Si ya fue persistido durante
       * esta sesión no volvemos a crear
       * otro Assessment.
       */
      if (persisted) {
        setShowBlueprint(
          true,
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      setIsSaving(
        true,
      );

      try {
        const adapted =
          adaptAssessmentV2(
            answers,
          );

        const process =
          adapted.processes[0];

        if (!process) {
          throw new Error(
            "No fue posible identificar el proceso evaluado.",
          );
        }

        const blueprintData =
          buildBlueprintV2({
            answers,
            process,
            intelligence:
              result,
          });

        /*
         * Nombre del cliente.
         *
         * AssessmentV2Answers es un
         * diccionario flexible, por lo
         * que validamos el tipo antes
         * de utilizar el valor.
         */
        const rawCompany =
          answers.company;

        const clientName =
          typeof rawCompany ===
            "string" &&
          rawCompany.trim()
            ? rawCompany.trim()
            : "Cliente Assessment V2";

        const rawIndustry =
          answers.industry;

        const industry =
          typeof rawIndustry ===
          "string"
            ? rawIndustry
            : undefined;

        const rawEmployees =
          answers.employees;

        const employeeSize =
          typeof rawEmployees ===
          "string"
            ? rawEmployees
            : undefined;

        /*
         * Persistimos un snapshot
         * completo del diagnóstico.
         *
         * Nunca dependeremos de
         * recalcular un Assessment
         * histórico para visualizarlo.
         */
        const payload = {
          client: {
            name:
              clientName,

            industry,

            employeeSize,

            country:
              "Chile",
          },

          assessment: {
            /*
             * Se conserva este campo
             * por compatibilidad con
             * Assessment V1.
             *
             * En V2 usamos Opportunity
             * como Automation Score.
             */
            automationScore:
              result.scores
                .opportunity,

            level:
              getAssessmentLevel(
                result.scores
                  .opportunity,
              ),

            assessmentVersion:
              ASSESSMENT_VERSION,

            scoringVersion:
              SCORING_VERSION,

            readinessScore:
              result.scores
                .readiness,

            opportunityScore:
              result.scores
                .opportunity,

            businessImpactScore:
              result.scores
                .businessImpact,

            confidenceScore:
              result.scores
                .confidence,

            answers,

            /*
             * Guardamos las dimensiones
             * visibles del Blueprint
             * como snapshot separado.
             */
            dimensions:
            blueprintData
              .dimensions,

            /*
             * Insights completos que
             * alimentan el Blueprint.
             */
            insights:
              blueprintData
                .insights,

            /*
             * Snapshot completo del
             * Intelligence Engine.
             */
            intelligence:
              result,
          },

          blueprint: {
            content:
              blueprintData,

            version:
              BLUEPRINT_VERSION,

            scoringVersion:
              SCORING_VERSION,
          },
        };

        const response =
          await fetch(
            "/api/assessments",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  payload,
                ),
            },
          );

        const responseData =
          (await response.json()) as {
            success: boolean;

            clientId?: string;

            assessmentId?: string;

            blueprintId?: string;

            error?: string;
          };

        if (
          !response.ok ||
          !responseData.success
        ) {
          throw new Error(
            responseData.error ??
              "No fue posible guardar el Assessment.",
          );
        }

        if (
          !responseData.clientId ||
          !responseData.assessmentId ||
          !responseData.blueprintId
        ) {
          throw new Error(
            "El servidor no devolvió los identificadores del Assessment.",
          );
        }

        setPersisted({
          clientId:
            responseData.clientId,

          assessmentId:
            responseData.assessmentId,

          blueprintId:
            responseData.blueprintId,
        });

        setShowBlueprint(
          true,
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        console.error(
          "Error al generar Blueprint V2:",
          error,
        );

        setSaveError(
          error instanceof Error
            ? error.message
            : "No fue posible guardar el diagnóstico.",
        );
      } finally {
        setIsSaving(
          false,
        );
      }
    };

  /*
   * ========================================================
   * BLUEPRINT
   * ========================================================
   */

  if (
    showBlueprint &&
    result &&
    answers
  ) {
    const adapted =
      adaptAssessmentV2(
        answers,
      );

    const process =
      adapted.processes[0];

    const blueprintData =
      buildBlueprintV2({
        answers,
        process,
        intelligence:
          result,
      });

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {persisted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-800">
                    Assessment guardado
                    correctamente
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Blueprint ID:{" "}
                    {
                      persisted.blueprintId
                    }
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Scoring Engine v
                    {
                      SCORING_VERSION
                    }
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowBlueprint(
                  false,
                )
              }
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Volver al diagnóstico
            </button>
          </div>

          <BlueprintReport
            data={
              blueprintData
            }
          />
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * DIAGNÓSTICO
   * ========================================================
   */

  if (
    result &&
    answers
  ) {
    const adapted =
      adaptAssessmentV2(
        answers,
      );

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
                result.scores
                  .readiness
              }
            />

            <ScoreCard
              title="Opportunity"
              value={
                result.scores
                  .opportunity
              }
            />

            <ScoreCard
              title="Business Impact"
              value={
                result.scores
                  .businessImpact
              }
            />

            <ScoreCard
              title="Confidence"
              value={
                result.scores
                  .confidence
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
                {
                  process.description
                }
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ProcessMetric
                label="Ejecuciones / mes"
                value={
                  process
                    .executionsPerMonth
                }
              />

              <ProcessMetric
                label="Personas"
                value={
                  process
                    .peopleInvolved
                }
              />

              <ProcessMetric
                label="Minutos / ejecución"
                value={
                  process
                    .minutesPerExecution
                }
              />

              <ProcessMetric
                label="% manual"
                value={
                  process
                    .manualPercentage
                }
                suffix="%"
              />
            </div>
          </section>

          <ProcessTransformationCard
            process={
              process
            }
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
              (
                opportunity,
                index,
              ) => (
                <article
                  key={
                    opportunity.id
                  }
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
                          opportunity
                            .impactScore
                        }
                      />

                      <MiniMetric
                        label="Complejidad"
                        value={
                          opportunity
                            .complexityScore
                        }
                      />

                      <MiniMetric
                        label="Confianza"
                        value={
                          opportunity
                            .confidenceScore
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
                          opportunity
                            .currentProcess
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-5">
                      <p className="text-sm font-semibold text-emerald-800">
                        Proceso propuesto
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {
                          opportunity
                            .proposedProcess
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
                        (
                          technology,
                        ) => (
                          <span
                            key={
                              technology
                            }
                            className="rounded-full border bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {
                              technology
                            }
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

              {result.economics.assumptions
                .length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Supuestos
                  </p>

                  <ul className="mt-2 space-y-2">
                    {result.economics.assumptions.map(
                      (
                        assumption,
                      ) => (
                        <li
                          key={
                            assumption
                          }
                          className="text-sm leading-6 text-muted-foreground"
                        >
                          •{" "}
                          {
                            assumption
                          }
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {result.warnings.length >
            0 && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">
                Aspectos pendientes de
                validación
              </h2>

              <div className="mt-4 space-y-2">
                {result.warnings.map(
                  (
                    warning,
                  ) => (
                    <p
                      key={
                        warning
                      }
                      className="text-sm leading-6 text-amber-900"
                    >
                      • {warning}
                    </p>
                  ),
                )}
              </div>
            </section>
          )}

          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="font-semibold text-red-800">
                No fue posible guardar
                el Assessment
              </p>

              <p className="mt-1 text-sm text-red-700">
                {saveError}
              </p>
            </div>
          )}

          {persisted && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <p className="font-semibold text-emerald-800">
                Assessment persistido
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                Blueprint ID:{" "}
                {
                  persisted.blueprintId
                }
              </p>
            </div>
          )}

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() => {
                setResult(
                  null,
                );

                setAnswers(
                  null,
                );

                setShowBlueprint(
                  false,
                );

                setPersisted(
                  null,
                );

                setSaveError(
                  null,
                );
              }}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Realizar otro Assessment
            </button>

            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={
                handleGenerateBlueprint
              }
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSaving
                ? "Guardando Assessment..."
                : persisted
                  ? "Ver Blueprint V2"
                  : "Generar y guardar Blueprint V2"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * FORMULARIO
   * ========================================================
   */

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

function getAssessmentLevel(
  score: number,
): string {
  if (score >= 80) {
    return "MUY_ALTO";
  }

  if (score >= 60) {
    return "ALTO";
  }

  if (score >= 40) {
    return "MEDIO";
  }

  if (score >= 20) {
    return "BAJO";
  }

  return "MUY_BAJO";
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
            style:
              "currency",

            currency:
              "CLP",

            maximumFractionDigits:
              0,
          },
        ).format(value);
    } else {
      displayValue =
        new Intl.NumberFormat(
          "es-CL",
          {
            maximumFractionDigits:
              1,
          },
        ).format(value);

      if (suffix) {
        displayValue +=
          ` ${suffix}`;
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