import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Rocket,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

export function NextStepsSection({ data }: Props) {
  const firstRecommendation = data.insights.recommendations[0];

  const steps = [
    {
      title: "Workshop de validación",
      description:
        "Validar procesos, responsables, volúmenes, tiempos y restricciones técnicas.",
      icon: ClipboardList,
    },
    {
      title: "Definir piloto",
      description:
        firstRecommendation
          ? `Tomar como candidato inicial: ${firstRecommendation.title}.`
          : "Seleccionar una iniciativa de alto impacto y alcance controlado.",
      icon: Rocket,
    },
    {
      title: "Definir KPIs base",
      description:
        "Registrar tiempos actuales, costos, errores y carga operacional antes de automatizar.",
      icon: CheckCircle2,
    },
    {
      title: "Planificar implementación",
      description:
        "Definir responsables, arquitectura, integraciones, presupuesto y calendario de ejecución.",
      icon: CalendarDays,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Next Steps
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Próximos pasos recomendados
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          El Blueprint constituye una primera hipótesis de transformación.
          La siguiente etapa debe validar el caso de negocio y preparar un
          piloto controlado.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card key={step.title}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Paso {index + 1}
                    </p>

                    <CardTitle className="mt-1 text-lg">
                      {step.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-3xl bg-blue-600 p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">
              Acción sugerida
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              Convertir el diagnóstico en un piloto ejecutable
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
              El siguiente entregable debería transformar las oportunidades
              priorizadas en alcance, arquitectura, inversión, KPIs y plan de
              implementación.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-blue-700">
            Automation Pilot
            <ArrowRight className="size-4" />
          </div>
        </div>
      </div>
    </section>
  );
}