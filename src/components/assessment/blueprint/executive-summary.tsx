import { CheckCircle2, Sparkles } from "lucide-react";

import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

export function ExecutiveSummary({ data }: Props) {
  const topRecommendation = data.insights.recommendations[0];

  return (
    <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Executive Summary
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Diagnóstico ejecutivo
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          {data.diagnosis}
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-2xl bg-blue-50 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sparkles className="size-5" />
          </div>

          <div>
            <p className="font-bold text-blue-950">
              Principal oportunidad detectada
            </p>

            <p className="mt-2 text-sm leading-6 text-blue-900">
              {topRecommendation
                ? topRecommendation.title
                : "Priorizar el levantamiento y documentación de procesos críticos."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
          Conclusión
        </p>

        <p className="mt-4 text-2xl font-bold">
          {data.level}
        </p>

        <div className="mt-7 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />

            <p className="text-sm leading-6 text-slate-300">
              Score consolidado de {data.automationScore}/100.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />

            <p className="text-sm leading-6 text-slate-300">
              {data.insights.recommendations.length} iniciativas identificadas.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />

            <p className="text-sm leading-6 text-slate-300">
              {data.insights.estimatedHoursPerMonth} horas mensuales con
              potencial de recuperación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}