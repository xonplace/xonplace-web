import { notFound } from "next/navigation";

import {
  BlueprintReport,
  type BlueprintReportData,
} from "@/components/assessment/blueprint-report";
import { getBlueprintById } from "@/services/assessment.service";

type StoredBlueprintPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StoredBlueprintContent = Partial<
  Omit<BlueprintReportData, "id">
>;

export default async function StoredBlueprintPage({
  params,
}: StoredBlueprintPageProps) {
  const { id } = await params;
  const blueprint = await getBlueprintById(id);

  if (!blueprint) {
    notFound();
  }

  const content =
    blueprint.content as StoredBlueprintContent;

  const storedDimensions =
    content.dimensions ??
    (blueprint.assessment.dimensions as BlueprintReportData["dimensions"]);

  const storedInsights =
    content.insights ??
    (blueprint.assessment.insights as BlueprintReportData["insights"]);

  const reportData: BlueprintReportData = {
    id: blueprint.id,

    company:
      content.company ??
      blueprint.assessment.client.name,

    generatedAt:
      content.generatedAt ??
      blueprint.createdAt.toISOString(),

    automationScore:
      content.automationScore ??
      blueprint.assessment.automationScore,

    level:
      content.level ??
      blueprint.assessment.level,

    diagnosis:
      content.diagnosis ??
      "El diagnóstico fue recuperado correctamente desde PostgreSQL.",

    dimensions: storedDimensions,

    insights: storedInsights,
  };

  return <BlueprintReport data={reportData} />;
}