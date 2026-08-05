"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Download,
  FileChartColumn,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { MaturityRadar } from "@/components/assessment/maturity-radar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DimensionScores = {
  procesos: number;
  informacion: number;
  integracion: number;
  automatizacion: number;
  ia: number;
};

type Recommendation = {
  title: string;
  description: string;
  priority: "Alta" | "Media" | "Baja";
  category: "Proceso" | "Agente" | "Integración";
  impact: "Alto" | "Medio" | "Bajo";
  complexity: "Alta" | "Media" | "Baja";
  estimatedWeeks: number;
  technologies: string[];
};

type AgentRecommendation = {
  name: string;
  purpose: string;
  fitScore: number;
  priority: "Alta" | "Media";
};

type EconomicEstimate = {
  hourlyCostCLP: number;
  monthlySavingsCLP: number;
  annualSavingsCLP: number;
  estimatedImplementationCLP: number;
  paybackMonths: number;
};

type BlueprintData = {
  company: string;
  generatedAt: string;
  automationScore: number;
  level: string;
  diagnosis: string;
  dimensions: DimensionScores;
  insights: {
    strengths: string[];
    risks: string[];
    recommendations: Recommendation[];
    agents: AgentRecommendation[];
    estimatedHoursPerMonth: number;
    economicEstimate: EconomicEstimate;
    roadmap: {
      phase: string;
      title: string;
      description: string;
    }[];
  };
};

const dimensionLabels: Record<keyof DimensionScores, string> = {
  procesos: "Procesos",
  informacion: "Información",
  integracion: "Integración",
  automatizacion: "Automatización",
  ia: "Preparación para IA",
};

export default function BlueprintPage() {
  const [data, setData] = useState<BlueprintData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedBlueprint = sessionStorage.getItem(
      "xonplace-assessment-blueprint",
    );

    if (storedBlueprint) {
      try {
        setData(JSON.parse(storedBlueprint) as BlueprintData);
      } catch {
        setData(null);
      }
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Preparando Blueprint...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <FileChartColumn className="mx-auto size-12 text-muted-foreground" />

        <h1 className="mt-5 text-2xl font-bold">
          No existe un Blueprint disponible
        </h1>

        <p className="mt-3 text-muted-foreground">
          Complete primero el XONPLACE Automation Assessment.
        </p>

        <Button
          className="mt-8"
          onClick={() => {
            window.location.href = "/portal/assessment";
          }}
        >
          Volver al Assessment
        </Button>
      </div>
    );
  }

  const annualHours = data.insights.estimatedHoursPerMonth * 12;

  const economicEstimate = data.insights.economicEstimate ?? {
  hourlyCostCLP: 18000,
  monthlySavingsCLP:
    data.insights.estimatedHoursPerMonth * 18000,
  annualSavingsCLP:
    data.insights.estimatedHoursPerMonth * 18000 * 12,
  estimatedImplementationCLP: 0,
  paybackMonths: 0,
};



  const recommendationCount = data.insights.recommendations.length;

  const highPriorityCount = data.insights.recommendations.filter(
    (recommendation) => recommendation.priority === "Alta",
  ).length;

  const scoreColor =
    data.automationScore >= 80
      ? "#059669"
      : data.automationScore >= 60
        ? "#2563eb"
        : data.automationScore >= 40
          ? "#d97706"
          : "#dc2626";

  const formatCLP = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = "/portal/assessment";
          }}
        >
          <ArrowLeft className="size-4" />
          Volver
        </Button>

        <Button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="size-4" />
          Guardar como PDF
        </Button>
      </div>

      <article className="overflow-hidden rounded-2xl border bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <header className="bg-slate-950 px-8 py-12 text-white sm:px-12">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600">
              <Sparkles className="size-6" />
            </div>

            <div>
              <p className="font-bold tracking-[0.18em]">XONPLACE</p>

              <p className="text-sm text-slate-400">
                AI Automation as a Service
              </p>
            </div>
          </div>

          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Automation Blueprint
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {data.company}
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Diagnóstico ejecutivo y hoja de ruta inicial para la transformación
            mediante automatización e Inteligencia Artificial.
          </p>

          <p className="mt-8 text-xs text-slate-500">
            Generado el{" "}
            {new Intl.DateTimeFormat("es-CL", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(data.generatedAt))}
          </p>
        </header>

        <div className="space-y-14 p-8 sm:p-12">
          <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
            <Card className="overflow-hidden border-slate-200">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                  Automation Score
                </p>

                <div className="relative mt-6 flex size-52 items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 size-full -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="18"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="82"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 82}`}
                      strokeDashoffset={`${
                        2 *
                        Math.PI *
                        82 *
                        (1 - data.automationScore / 100)
                      }`}
                    />
                  </svg>

                  <div className="relative">
                    <p className="text-6xl font-bold tracking-tight">
                      {data.automationScore}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      sobre 100
                    </p>
                  </div>
                </div>

                <div
                  className="mt-6 rounded-full px-4 py-2 text-sm font-bold"
                  style={{
                    backgroundColor: `${scoreColor}15`,
                    color: scoreColor,
                  }}
                >
                  {data.level}
                </div>

                <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
                  Resultado consolidado de las cinco dimensiones evaluadas por
                  XONPLACE.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardDescription>Resumen ejecutivo</CardDescription>

                  <CardTitle className="text-2xl">
                    Diagnóstico de automatización
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="leading-7 text-muted-foreground">
                    {data.diagnosis}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Ahorro potencial mensual
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {data.insights.estimatedHoursPerMonth}
                      <span className="ml-1 text-base font-semibold text-muted-foreground">
                        horas
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Proyección anual
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {annualHours.toLocaleString("es-CL")}
                      <span className="ml-1 text-base font-semibold text-muted-foreground">
                        horas
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Iniciativas recomendadas
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {recommendationCount}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Prioridad alta
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {highPriorityCount}
                      <span className="ml-1 text-base font-semibold text-muted-foreground">
                        iniciativas
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Diagnóstico de madurez
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Resultado por dimensiones
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                El gráfico muestra el nivel relativo de madurez y el potencial
                de transformación en las cinco dimensiones analizadas.
              </p>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Mapa de madurez</CardTitle>

                  <CardDescription>
                    Comparación visual entre las dimensiones evaluadas.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <MaturityRadar scores={data.dimensions} />
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(data.dimensions).map(([key, value]) => {
                  const interpretation =
                    value >= 80
                      ? "Madurez avanzada"
                      : value >= 60
                        ? "Madurez intermedia"
                        : value >= 40
                          ? "En desarrollo"
                          : "Etapa inicial";

                  const indicatorColor =
                    value >= 80
                      ? "bg-emerald-500"
                      : value >= 60
                        ? "bg-blue-600"
                        : value >= 40
                          ? "bg-amber-500"
                          : "bg-red-500";

                  return (
                    <Card key={key}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">
                              {
                                dimensionLabels[
                                  key as keyof DimensionScores
                                ]
                              }
                            </p>

                            <p className="mt-1 text-xs font-medium text-muted-foreground">
                              {interpretation}
                            </p>
                          </div>

                          <p className="text-2xl font-bold">{value}</p>
                        </div>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${indicatorColor}`}
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

          <section className="grid gap-6 md:grid-cols-2">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="size-5" />
                  Fortalezas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {data.insights.strengths.length > 0 ? (
                  data.insights.strengths.map((strength) => (
                    <div key={strength} className="flex items-start gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500" />

                      <p className="text-sm leading-6">{strength}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    No se detectaron fortalezas suficientes en esta evaluación
                    preliminar.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <ShieldAlert className="size-5" />
                  Riesgos y brechas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {data.insights.risks.length > 0 ? (
                  data.insights.risks.map((risk) => (
                    <div key={risk} className="flex items-start gap-3">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-amber-500" />

                      <p className="text-sm leading-6">{risk}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">
                    No se detectaron brechas críticas en esta evaluación
                    preliminar.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="rounded-2xl bg-slate-950 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
              Caso económico preliminar
            </p>

            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Retorno estimado</h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                  Proyección inicial calculada a partir de las horas
                  recuperables y un costo referencial de{" "}
                  {formatCLP(
                    economicEstimate.hourlyCostCLP,
                  )}{" "}
                  por hora.
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-5 py-4">
                <p className="text-sm text-slate-300">Payback estimado</p>

                <p className="mt-1 text-3xl font-bold">
                  {economicEstimate.paybackMonths} meses
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Ahorro mensual",
                  value: formatCLP(
                    economicEstimate.monthlySavingsCLP,
                  ),
                },
                {
                  label: "Ahorro anual",
                  value: formatCLP(
                    economicEstimate.annualSavingsCLP,
                  ),
                },
                {
                  label: "Inversión estimada",
                  value: formatCLP(
                    data.insights.economicEstimate
                      .estimatedImplementationCLP,
                  ),
                },
                {
                  label: "Horas recuperables",
                  value: `${annualHours.toLocaleString("es-CL")} h/año`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>

                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              Estimación referencial. Los valores deberán ajustarse con costos
              reales, volúmenes, tiempos observados y alcance técnico
              definitivo.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <Bot className="size-6 text-blue-600" />

              <h2 className="text-2xl font-bold">
                Recomendaciones prioritarias
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {data.insights.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={`${recommendation.title}-${index}`}
                    className="rounded-xl border p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-blue-600">
                          Recomendación {index + 1}
                        </p>

                        <h3 className="mt-2 text-lg font-bold">
                          {recommendation.title}
                        </h3>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                          {recommendation.description}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-muted-foreground">
                              Impacto
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {recommendation.impact}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-muted-foreground">
                              Complejidad
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {recommendation.complexity}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-muted-foreground">
                              Plazo estimado
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {recommendation.estimatedWeeks} semanas
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {recommendation.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                          {recommendation.category}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {recommendation.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          <section>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Fuerza laboral digital
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Agentes IA recomendados
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Agentes sugeridos según las brechas, oportunidades y nivel de
              madurez detectado.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.insights.agents.map((agent) => (
                <Card key={agent.name}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Bot className="size-5" />
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        Afinidad {agent.fitScore}%
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-lg">
                      {agent.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {agent.purpose}
                    </p>

                    <div className="mt-5 border-t pt-4">
                      <p className="text-xs text-muted-foreground">
                        Prioridad
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {agent.priority}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Plan de implementación
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Roadmap de transformación
            </h2>

            <div className="relative mt-8">
              <div className="absolute bottom-0 left-[19px] top-0 w-px bg-slate-200 md:left-0 md:right-0 md:top-[19px] md:h-px md:w-auto" />

              <div className="relative grid gap-6 md:grid-cols-4">
                {data.insights.roadmap.map((item, index) => (
                  <div
                    key={item.phase}
                    className="relative pl-14 md:pl-0 md:pt-14"
                  >
                    <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-sm font-bold text-white shadow-sm md:left-1/2 md:-translate-x-1/2">
                      {index + 1}
                    </div>

                    <Card className="h-full">
                      <CardHeader>
                        <p className="text-sm font-bold text-blue-600">
                          {item.phase}
                        </p>

                        <CardTitle className="text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="border-t pt-8 text-center">
            <p className="font-semibold">
              Este diagnóstico es una evaluación preliminar.
            </p>

            <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Las estimaciones deberán validarse mediante entrevistas,
              observación de procesos, revisión de datos y análisis técnico de
              integraciones.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}