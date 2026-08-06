"use client";

import {
  Bot,
  CheckCircle2,
  Download,
  FileChartColumn,
  ShieldAlert,
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


import {
    ExecutiveCover,
    ExecutiveDashboard,
} from "@/components/assessment/blueprint";

export type DimensionScores = {
  procesos: number;
  informacion: number;
  integracion: number;
  automatizacion: number;
  ia: number;
};

export type Recommendation = {
  title: string;
  description: string;
  priority: "Alta" | "Media" | "Baja";
  category: "Proceso" | "Agente" | "Integración";
  impact: "Alto" | "Medio" | "Bajo";
  complexity: "Alta" | "Media" | "Baja";
  estimatedWeeks: number;
  technologies: string[];
};

export type AgentRecommendation = {
  name: string;
  purpose: string;
  fitScore: number;
  priority: "Alta" | "Media";
};

export type EconomicEstimate = {
  hourlyCostCLP: number;
  monthlySavingsCLP: number;
  annualSavingsCLP: number;
  estimatedImplementationCLP: number;
  paybackMonths: number;
};

export type BlueprintReportData = {
  id: string;
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

type BlueprintReportProps = {
  data: BlueprintReportData;
};

export function BlueprintReport({ data }: BlueprintReportProps) {
  const annualHours = data.insights.estimatedHoursPerMonth * 12;

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
      <div className="mb-6 flex justify-end print:hidden">
        <Button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="size-4" />
          Guardar como PDF
        </Button>
      </div>

      <article className="overflow-hidden rounded-2xl border bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
       
       <ExecutiveCover data={data} />

        <div className="space-y-14 p-8 sm:p-12">
          {/*<section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
            <Card>
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
                    <p className="text-sm text-muted-foreground">
                      Ahorro potencial mensual
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {data.insights.estimatedHoursPerMonth} horas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">
                      Proyección anual
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {annualHours.toLocaleString("es-CL")} horas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">
                      Iniciativas recomendadas
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {recommendationCount}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">
                      Prioridad alta
                    </p>
                    <p className="mt-2 text-3xl font-bold">
                      {highPriorityCount}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section> */}

          <ExecutiveDashboard data={data} />

          <section>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Diagnóstico de madurez
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Resultado por dimensiones
            </h2>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mapa de madurez</CardTitle>
                </CardHeader>

                <CardContent>
                  <MaturityRadar scores={data.dimensions} />
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(data.dimensions).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-semibold">
                          {dimensionLabels[key as keyof DimensionScores]}
                        </p>

                        <p className="text-2xl font-bold">{value}</p>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {data.insights.strengths.map((strength) => (
                  <p key={strength} className="text-sm leading-6">
                    {strength}
                  </p>
                ))}
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
                {data.insights.risks.map((risk) => (
                  <p key={risk} className="text-sm leading-6">
                    {risk}
                  </p>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="rounded-2xl bg-slate-950 p-8 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
              Caso económico preliminar
            </p>

            <h2 className="mt-3 text-3xl font-bold">Retorno estimado</h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Ahorro mensual",
                  value: formatCLP(
                    data.insights.economicEstimate.monthlySavingsCLP,
                  ),
                },
                {
                  label: "Ahorro anual",
                  value: formatCLP(
                    data.insights.economicEstimate.annualSavingsCLP,
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
                  label: "Payback",
                  value: `${data.insights.economicEstimate.paybackMonths} meses`,
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
          </section>

          <section>
            <div className="flex items-center gap-3">
              <Bot className="size-6 text-blue-600" />
              <h2 className="text-2xl font-bold">
                Recomendaciones prioritarias
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {data.insights.recommendations.map((recommendation, index) => (
                <Card key={`${recommendation.title}-${index}`}>
                  <CardHeader>
                    <CardDescription>
                      Recomendación {index + 1}
                    </CardDescription>
                    <CardTitle>{recommendation.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Fuerza laboral digital
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Agentes IA recomendados
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.insights.agents.map((agent) => (
                <Card key={agent.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {agent.purpose}
                    </p>
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

            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {data.insights.roadmap.map((item) => (
                <Card key={item.phase}>
                  <CardHeader>
                    <p className="text-sm font-bold text-blue-600">
                      {item.phase}
                    </p>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <footer className="border-t pt-8 text-center">
            <p className="font-semibold">
              Este diagnóstico es una evaluación preliminar.
            </p>

            <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Las estimaciones deberán validarse mediante entrevistas,
              observación de procesos, revisión de datos y análisis técnico.
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              Blueprint ID: {data.id}
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}