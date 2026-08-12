import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  BlueprintReportData,
  BlueprintScoreExplanation,
  BlueprintScoreFactor,
} from "./types";

type Props = {
  data: BlueprintReportData;
};

type ScoreKey =
  | "readiness"
  | "opportunity"
  | "businessImpact"
  | "confidence";

const scoreLabels:
  Record<
    ScoreKey,
    {
      title: string;
      eyebrow: string;
    }
  > = {
    readiness: {
      title:
        "Readiness",

      eyebrow:
        "Preparación actual",
    },

    opportunity: {
      title:
        "Opportunity",

      eyebrow:
        "Potencial de automatización",
    },

    businessImpact: {
      title:
        "Business Impact",

      eyebrow:
        "Impacto potencial",
    },

    confidence: {
      title:
        "Confidence",

      eyebrow:
        "Confianza del diagnóstico",
    },
  };

function getScoreTone(
  score: number,
): string {
  if (score >= 80) {
    return "text-emerald-600";
  }

  if (score >= 60) {
    return "text-blue-600";
  }

  if (score >= 40) {
    return "text-amber-600";
  }

  return "text-red-600";
}

function getBarColor(
  score: number,
): string {
  if (score >= 80) {
    return "bg-emerald-500";
  }

  if (score >= 60) {
    return "bg-blue-600";
  }

  if (score >= 40) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}

function EvidenceCard({
  factor,
  mode,
}: {
  factor:
    BlueprintScoreFactor;

  mode:
    | "positive"
    | "negative"
    | "neutral";
}) {
  const Icon =
    mode === "positive"
      ? ArrowUpRight
      : mode === "negative"
        ? ArrowDownRight
        : CheckCircle2;

  const iconClass =
    mode === "positive"
      ? "text-blue-600"
      : mode === "negative"
        ? "text-amber-600"
        : "text-slate-500";

  const label =
    mode === "positive"
      ? "Impulsa el resultado"
      : mode === "negative"
        ? "Reduce la preparación"
        : "Evidencia considerada";

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 size-5 shrink-0 ${iconClass}`}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">
              {factor.title}
            </p>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {factor.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  scoreKey,
  detail,
}: {
  scoreKey:
    ScoreKey;

  detail:
    BlueprintScoreExplanation;
}) {
  const labels =
    scoreLabels[scoreKey];

  /*
   * No mostramos strength al cliente.
   *
   * Ordenamos internamente por importancia
   * pero presentamos evidencia en lenguaje
   * empresarial.
   */
  const positiveFactors =
    detail.positiveFactors.slice(
      0,
      5,
    );

  const negativeFactors =
    detail.negativeFactors.slice(
      0,
      5,
    );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-slate-50/70">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {labels.eyebrow}
            </p>

            <CardTitle className="mt-2 text-2xl">
              {labels.title}
            </CardTitle>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {detail.summary}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border bg-white px-5 py-4 text-right">
            <p
              className={`text-4xl font-bold ${getScoreTone(
                detail.score,
              )}`}
            >
              {detail.score}
              <span className="text-base font-medium text-muted-foreground">
                /100
              </span>
            </p>

            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {detail.level}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${getBarColor(
              detail.score,
            )}`}
            style={{
              width: `${detail.score}%`,
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-7 p-6">
        {positiveFactors.length >
          0 && (
          <div>
            <p className="text-sm font-semibold">
              {scoreKey ===
              "confidence"
                ? "Evidencia utilizada"
                : "Factores que impulsan este resultado"}
            </p>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {positiveFactors.map(
                (factor) => (
                  <EvidenceCard
                    key={`${scoreKey}-${factor.id}`}
                    factor={
                      factor
                    }
                    mode={
                      scoreKey ===
                      "confidence"
                        ? "neutral"
                        : "positive"
                    }
                  />
                ),
              )}
            </div>
          </div>
        )}

        {negativeFactors.length >
          0 && (
          <div>
            <p className="text-sm font-semibold">
              Factores que limitan la preparación
            </p>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {negativeFactors.map(
                (factor) => (
                  <EvidenceCard
                    key={`${scoreKey}-negative-${factor.id}`}
                    factor={
                      factor
                    }
                    mode="negative"
                  />
                ),
              )}
            </div>
          </div>
        )}

        {positiveFactors.length ===
          0 &&
          negativeFactors.length ===
            0 && (
            <div className="flex items-start gap-3 rounded-xl border border-dashed p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-slate-400" />

              <p className="text-sm leading-6 text-muted-foreground">
                No se detectaron
                señales específicas
                adicionales para
                explicar esta
                dimensión con la
                información
                disponible.
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

export function ScoreExplainabilitySection({
  data,
}: Props) {
  const explanations =
    data.scoreExplanations;

  /*
   * Los Blueprints antiguos no tienen
   * explicaciones. En ese caso la sección
   * simplemente no se muestra.
   */
  if (!explanations) {
    return null;
  }

  const scoreOrder:
    ScoreKey[] = [
      "opportunity",
      "readiness",
      "businessImpact",
      "confidence",
    ];

  return (
    <section className="space-y-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Diagnostic Transparency
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          ¿Por qué obtuviste estos resultados?
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
          Los indicadores se
          construyen a partir de la
          información y evidencia
          identificada durante el
          Assessment. A continuación
          se muestran las principales
          señales que influyeron en
          cada resultado.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-950">
              Diagnóstico explicable
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-900/70">
              XONPLACE utiliza reglas
              y evidencia estructurada
              para construir estos
              indicadores. Las
              conclusiones deben
              validarse durante
              Discovery antes de tomar
              decisiones de inversión
              o implementación.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {scoreOrder.map(
          (scoreKey) => (
            <ScoreCard
              key={scoreKey}
              scoreKey={
                scoreKey
              }
              detail={
                explanations[
                  scoreKey
                ]
              }
            />
          ),
        )}
      </div>
    </section>
  );
}