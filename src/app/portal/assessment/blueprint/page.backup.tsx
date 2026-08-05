"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Download,
  FileChartColumn,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

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
    estimatedHoursPerMonth: number;
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

  return (
    <div className="mx-auto w-full max-w-6xl">
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

        <div className="space-y-10 p-8 sm:p-12">
          <section className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardDescription className="font-semibold text-blue-700">
                  XONPLACE Automation Score
                </CardDescription>

                <CardTitle className="text-5xl text-blue-700">
                  {data.automationScore}
                  <span className="text-2xl text-blue-500">/100</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="font-bold text-blue-950">{data.level}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen ejecutivo</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  {data.diagnosis}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock3 className="size-4 text-blue-600" />
                      Ahorro potencial
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      {data.insights.estimatedHoursPerMonth} h/mes
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FileChartColumn className="size-4 text-blue-600" />
                      Proyección anual
                    </div>

                    <p className="mt-2 text-2xl font-bold">
                      {annualHours.toLocaleString("es-CL")} horas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Resultado por dimensiones</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Object.entries(data.dimensions).map(([key, value]) => (
                <div key={key} className="rounded-xl border p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {dimensionLabels[key as keyof DimensionScores]}
                    </p>

                    <p className="font-bold">{value}/100</p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
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
                  <div key={strength} className="flex items-start gap-3">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500" />

                    <p className="text-sm leading-6">{strength}</p>
                  </div>
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
                  <div key={risk} className="flex items-start gap-3">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-amber-500" />

                    <p className="text-sm leading-6">{risk}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <Bot className="size-6 text-blue-600" />
              <h2 className="text-2xl font-bold">
                Recomendaciones prioritarias
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {data.insights.recommendations.map((recommendation, index) => (
                <div
                  key={`${recommendation.title}-${index}`}
                  className="rounded-xl border p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-600">
                        Recomendación {index + 1}
                      </p>

                      <h3 className="mt-2 text-lg font-bold">
                        {recommendation.title}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {recommendation.description}
                      </p>
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
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Roadmap 30–60–90 días</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
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
              observación de procesos, revisión de datos y análisis técnico de
              integraciones.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
