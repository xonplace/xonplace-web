import { CheckCircle2 } from "lucide-react";

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

export function RoadmapSection({ data }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Plan de implementación
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Roadmap de transformación
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Secuencia inicial de trabajo para avanzar desde el diagnóstico hacia
          pilotos, escalamiento y operación inteligente.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200 md:left-0 md:right-0 md:top-5 md:h-px md:w-auto" />

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

                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Hito recomendado
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}