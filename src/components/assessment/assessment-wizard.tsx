"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
import { generateAssessmentInsights } from "@/lib/assessment/recommendations";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
  score?: number;
};

type Question = {
  id: string;
  title: string;
  description: string;
  type: "text" | "options";
  options?: Option[];
};

const questions: Question[] = [
  {
    id: "company",
    title: "¿Cómo se llama la empresa?",
    description:
      "Usaremos este nombre para personalizar el diagnóstico y el futuro Automation Blueprint.",
    type: "text",
  },
  {
    id: "industry",
    title: "¿En qué industria opera?",
    description:
      "Esto nos permitirá comparar sus procesos con organizaciones similares.",
    type: "options",
    options: [
      { label: "Servicios", value: "services", score: 6 },
      { label: "Tecnología", value: "technology", score: 8 },
      { label: "Comercio", value: "commerce", score: 6 },
      { label: "Manufactura", value: "manufacturing", score: 7 },
      { label: "Salud", value: "health", score: 6 },
      { label: "Educación", value: "education", score: 5 },
      { label: "Otra industria", value: "other", score: 5 },
    ],
  },
  {
    id: "employees",
    title: "¿Cuántas personas trabajan en la organización?",
    description:
      "El tamaño ayuda a estimar el volumen operacional y el impacto potencial.",
    type: "options",
    options: [
      { label: "1 a 20", value: "1-20", score: 3 },
      { label: "21 a 50", value: "21-50", score: 5 },
      { label: "51 a 200", value: "51-200", score: 7 },
      { label: "201 a 500", value: "201-500", score: 9 },
      { label: "Más de 500", value: "500+", score: 10 },
    ],
  },
  {
    id: "manualWork",
    title: "¿Cuánto trabajo manual y repetitivo existe?",
    description:
      "Considere transcripción, clasificación, seguimiento, reportes y movimiento de información.",
    type: "options",
    options: [
      { label: "Muy poco", value: "very-low", score: 2 },
      { label: "Poco", value: "low", score: 4 },
      { label: "Moderado", value: "medium", score: 6 },
      { label: "Alto", value: "high", score: 8 },
      { label: "Muy alto", value: "very-high", score: 10 },
    ],
  },
  {
    id: "systems",
    title: "¿Qué tan conectados están sus sistemas?",
    description:
      "Piense en ERP, CRM, correo, Excel, SharePoint, bases de datos y aplicaciones internas.",
    type: "options",
    options: [
      {
        label: "Totalmente desconectados",
        value: "disconnected",
        score: 10,
      },
      { label: "Pocas integraciones", value: "few", score: 8 },
      { label: "Parcialmente integrados", value: "partial", score: 6 },
      { label: "Mayormente integrados", value: "mostly", score: 4 },
      { label: "Completamente integrados", value: "complete", score: 2 },
    ],
  },
  {
    id: "documents",
    title: "¿Cuánto depende la operación de documentos y correos?",
    description:
      "Incluya PDF, Excel, contratos, órdenes, formularios, informes y mensajes.",
    type: "options",
    options: [
      { label: "Muy poco", value: "very-low", score: 2 },
      { label: "Poco", value: "low", score: 4 },
      { label: "Moderado", value: "medium", score: 6 },
      { label: "Alto", value: "high", score: 8 },
      { label: "Muy alto", value: "very-high", score: 10 },
    ],
  },
  {
    id: "rules",
    title: "¿Las decisiones repetitivas siguen reglas conocidas?",
    description:
      "Por ejemplo: aprobar, clasificar, asignar, escalar, validar o rechazar.",
    type: "options",
    options: [
      { label: "No existen reglas claras", value: "none", score: 2 },
      {
        label: "Algunas decisiones tienen reglas",
        value: "some",
        score: 5,
      },
      { label: "La mayoría sigue reglas", value: "most", score: 8 },
      { label: "Prácticamente todas", value: "all", score: 10 },
    ],
  },
  {
    id: "errors",
    title: "¿Con qué frecuencia aparecen errores o retrabajos?",
    description:
      "Considere información duplicada, omisiones, atrasos y correcciones manuales.",
    type: "options",
    options: [
      { label: "Casi nunca", value: "rarely", score: 2 },
      { label: "Ocasionalmente", value: "sometimes", score: 5 },
      { label: "Frecuentemente", value: "frequent", score: 8 },
      { label: "Constantemente", value: "constant", score: 10 },
    ],
  },
];

function getSelectedScore(question: Question, answer?: string): number {
  if (question.type === "text" || !answer) {
    return 0;
  }

  return (
    question.options?.find((option) => option.value === answer)?.score ?? 0
  );
}

export function AssessmentWizard() {

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const question = questions[currentStep];
  const answer = answers[question.id] ?? "";
  const progress = ((currentStep + 1) / questions.length) * 100;

  const dimensionScores = useMemo(() => {
    const getScore = (id: string): number => {
      const selectedQuestion = questions.find((item) => item.id === id);

      if (!selectedQuestion) {
        return 0;
      }

      return getSelectedScore(selectedQuestion, answers[id]);
    };

    return {
      procesos: Math.round(
        ((getScore("manualWork") +
          getScore("rules") +
          getScore("errors")) /
          30) *
          100,
      ),
      informacion: Math.round((getScore("documents") / 10) * 100),
      integracion: Math.round((getScore("systems") / 10) * 100),
      automatizacion: Math.round(
        ((getScore("manualWork") + getScore("systems")) / 20) * 100,
      ),
      ia: Math.round(
        ((getScore("documents") + getScore("rules")) / 20) * 100,
      ),
    };
  }, [answers]);

  const automationScore = useMemo(() => {
    const values = Object.values(dimensionScores);

    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length,
    );
  }, [dimensionScores]);

  const insights = useMemo(
    () => generateAssessmentInsights(dimensionScores),
    [dimensionScores],
  );

  const result = useMemo(() => {
    if (automationScore >= 80) {
      return {
        level: "Potencial muy alto",
        description:
          "La organización presenta excelentes condiciones para comenzar con procesos automatizados y agentes supervisados.",
      };
    }

    if (automationScore >= 60) {
      return {
        level: "Potencial alto",
        description:
          "Existen varias oportunidades de alto impacto que pueden implementarse progresivamente.",
      };
    }

    if (automationScore >= 40) {
      return {
        level: "Potencial medio",
        description:
          "La automatización es viable, pero antes conviene ordenar datos, reglas o integraciones.",
      };
    }

    return {
      level: "Etapa inicial",
      description:
        "La organización debe comenzar documentando procesos y mejorando la calidad de su información.",
    };
  }, [automationScore]);

  const dimensionResults = [
    {
      label: "Procesos",
      value: dimensionScores.procesos,
    },
    {
      label: "Información",
      value: dimensionScores.informacion,
    },
    {
      label: "Integración",
      value: dimensionScores.integracion,
    },
    {
      label: "Automatización",
      value: dimensionScores.automatizacion,
    },
    {
      label: "Preparación para IA",
      value: dimensionScores.ia,
    },
  ];

  const canContinue = answer.trim().length > 0;

  function updateAnswer(value: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: value,
    }));
  }

  function goNext() {
    if (!canContinue) {
      return;
    }

    if (currentStep === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  }

  function restart() {
    setAnswers({});
    setCurrentStep(0);
    setCompleted(false);
  }

function generateBlueprint() {
    setSaveError(null);

    const blueprintData = {
      company: answers.company || "Organización evaluada",
      generatedAt: new Date().toISOString(),
      automationScore,
      level: result.level,
      diagnosis: result.description,
      dimensions: dimensionScores,
      insights,
    };

    startSaving(async () => {
      try {
        const request = await fetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client: {
              name: answers.company || "Organización evaluada",
              industry: answers.industry,
              employeeSize: answers.employees,
              country: "Chile",
            },
            assessment: {
              automationScore,
              level: result.level,
              answers,
              dimensions: dimensionScores,
              insights,
            },
            blueprint: {
              content: blueprintData,
            },
          }),
        });

        const response = (await request.json()) as
          | {
              success: true;
              clientId: string;
              assessmentId: string;
              blueprintId: string;
            }
          | {
              success: false;
              error: string;
            };

        if (!request.ok || !response.success) {
          setSaveError(
            response.success
              ? "No fue posible guardar el Assessment."
              : response.error,
          );
          return;
        }

        sessionStorage.setItem(
          "xonplace-assessment-blueprint",
          JSON.stringify(blueprintData),
        );

        router.push(`/portal/assessment/blueprint/${response.blueprintId}`);
      } catch (error) {
        console.error("Error guardando Assessment:", error);

        setSaveError(
          error instanceof Error
            ? error.message
            : "No fue posible guardar el Assessment.",
        );
      }
    });
  }

  if (completed) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="overflow-hidden">
          <div className="bg-slate-950 px-8 py-10 text-white">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600">
              <Sparkles className="size-6" />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Resultado preliminar
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {answers.company || "Su organización"}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Primera evaluación del potencial de automatización empresarial.
            </p>
          </div>

          <CardContent className="grid gap-8 p-8 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border bg-blue-50 p-6">
              <p className="text-sm font-semibold text-blue-700">
                Automation Score
              </p>

              <p className="mt-3 text-5xl font-bold tracking-tight text-blue-700">
                {automationScore}
                <span className="text-2xl text-blue-500">/100</span>
              </p>

              <p className="mt-4 font-semibold text-blue-950">
                {result.level}
              </p>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-emerald-600" />

                <div>
                  <h2 className="text-xl font-bold">Diagnóstico inicial</h2>

                  <p className="mt-2 leading-7 text-muted-foreground">
                    {result.description}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold">
                  Resultado por dimensiones
                </h3>

                <div className="mt-4 space-y-4">
                  {dimensionResults.map((dimension) => (
                    <div key={dimension.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{dimension.label}</span>

                        <span className="font-semibold">
                          {dimension.value}/100
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${dimension.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
    <h3 className="font-bold text-emerald-950">Fortalezas detectadas</h3>

    <div className="mt-4 space-y-3">
      {insights.strengths.length > 0 ? (
        insights.strengths.map((strength) => (
          <div key={strength} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />

            <p className="text-sm leading-6 text-emerald-900">
              {strength}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-emerald-900">
          El Assessment necesita mayor información para identificar fortalezas.
        </p>
      )}
    </div>
  </div>

  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
    <h3 className="font-bold text-amber-950">Riesgos y brechas</h3>

    <div className="mt-4 space-y-3">
      {insights.risks.length > 0 ? (
        insights.risks.map((risk) => (
          <div key={risk} className="flex items-start gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-amber-500" />

            <p className="text-sm leading-6 text-amber-900">{risk}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-amber-900">
          No se detectaron brechas críticas en esta evaluación preliminar.
        </p>
      )}
    </div>
  </div>
</div>

<div className="mt-8">
  <div className="flex items-end justify-between gap-4">
    <div>
      <h3 className="text-lg font-bold">Recomendaciones prioritarias</h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Acciones sugeridas según las respuestas del Assessment.
      </p>
    </div>

    <div className="rounded-xl bg-blue-50 px-4 py-3 text-right">
      <p className="text-xs font-semibold text-blue-700">
        Ahorro potencial inicial
      </p>

      <p className="mt-1 text-xl font-bold text-blue-800">
        {insights.estimatedHoursPerMonth} h/mes
      </p>
    </div>
  </div>

  <div className="mt-5 space-y-4">
    {insights.recommendations.map((recommendation, index) => (
      <div
        key={`${recommendation.title}-${index}`}
        className="rounded-xl border p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                {index + 1}
              </span>

              <h4 className="font-bold">{recommendation.title}</h4>
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {recommendation.description}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {recommendation.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                recommendation.priority === "Alta"
                  ? "bg-red-50 text-red-700"
                  : recommendation.priority === "Media"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              Prioridad {recommendation.priority}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="mt-8">
  <h3 className="text-lg font-bold">Roadmap inicial</h3>

  <div className="mt-5 grid gap-4 lg:grid-cols-3">
    {insights.roadmap.map((item) => (
      <div key={item.phase} className="rounded-xl border p-5">
        <p className="text-sm font-bold text-blue-600">{item.phase}</p>

        <h4 className="mt-3 font-bold">{item.title}</h4>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      </div>
    ))}
  </div>
</div>

              <div className="mt-8 rounded-xl border p-4">
                <p className="font-semibold">Siguiente etapa</p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  En la siguiente versión, XONPLACE transformará estas
                  respuestas en procesos prioritarios, agentes recomendados,
                  estimación de horas y un Automation Blueprint.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                 <Button
                  type="button"
                  onClick={generateBlueprint}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                    {isSaving ? "Guardando..." : "Generar Blueprint"}
                  </Button>

                <Button variant="outline" onClick={restart}>
                  Realizar nuevamente
                </Button>
                {saveError && (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {saveError}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-blue-600">
            XONPLACE Automation Assessment
          </span>

          <span className="text-muted-foreground">
            Pregunta {currentStep + 1} de {questions.length}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="border-b p-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Building2 className="size-6" />
          </div>

          <CardTitle className="text-2xl sm:text-3xl">
            {question.title}
          </CardTitle>

          <CardDescription className="max-w-2xl text-base leading-7">
            {question.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {question.type === "text" ? (
            <Input
              autoFocus
              value={answer}
              onChange={(event) => updateAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canContinue) {
                  goNext();
                }
              }}
              placeholder="Escriba aquí..."
              className="h-12 text-base"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options?.map((option) => {
                const selected = answer === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateAnswer(option.value)}
                    className={`rounded-xl border p-4 text-left text-sm font-medium transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/10"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {option.label}

                      {selected && (
                        <CheckCircle2 className="size-5 text-blue-600" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="size-4" />
              Anterior
            </Button>

            <Button
              onClick={goNext}
              disabled={!canContinue}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {currentStep === questions.length - 1
                ? "Ver resultado"
                : "Continuar"}

              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}