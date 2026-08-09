"use client";

import { Download } from "lucide-react";

import {
  AIWorkforce,
  AutomationPortfolio,
  BusinessImpactSection,
  ExecutiveCover,
  ExecutiveDashboard,
  ExecutiveSummary,
  FindingsSection,
  MaturityRadarSection,
  OpportunityMatrix,
  RoadmapSection,
  NextStepsSection,
  type BlueprintReportData,
} from "@/components/assessment/blueprint";
import { Button } from "@/components/ui/button";

type BlueprintReportProps = {
  data: BlueprintReportData;
};

export function BlueprintReport({ data }: BlueprintReportProps) {
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
          <ExecutiveDashboard data={data} />

          <ExecutiveSummary data={data} />

          <MaturityRadarSection data={data} />

          <FindingsSection data={data} />

          <BusinessImpactSection data={data} />

          <OpportunityMatrix data={data} />

          <AutomationPortfolio data={data} />

          <AIWorkforce data={data} />

          <RoadmapSection data={data} />

          <NextStepsSection data={data} />

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