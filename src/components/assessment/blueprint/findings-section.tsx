import {
  CheckCircle2,
  ShieldAlert,
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

export function FindingsSection({ data }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Hallazgos
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Fortalezas y brechas
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Principales factores que favorecen o limitan actualmente la
          capacidad de automatización de la organización.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100">
                <CheckCircle2 className="size-5" />
              </div>

              Fortalezas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.insights.strengths.length > 0 ? (
              data.insights.strengths.map((strength) => (
                <div
                  key={strength}
                  className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4"
                >
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500" />

                  <p className="text-sm leading-6 text-slate-700">
                    {strength}
                  </p>
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

        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-800">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
                <ShieldAlert className="size-5" />
              </div>

              Riesgos y brechas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.insights.risks.length > 0 ? (
              data.insights.risks.map((risk) => (
                <div
                  key={risk}
                  className="flex items-start gap-3 rounded-xl border border-amber-100 bg-white p-4"
                >
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-amber-500" />

                  <p className="text-sm leading-6 text-slate-700">
                    {risk}
                  </p>
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
      </div>
    </section>
  );
}