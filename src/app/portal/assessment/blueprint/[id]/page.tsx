import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBlueprintById } from "@/services/assessment.service";

type BlueprintContent = {
  company?: string;
  automationScore?: number;
  level?: string;
  diagnosis?: string;
};

type StoredBlueprintPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StoredBlueprintPage({
  params,
}: StoredBlueprintPageProps) {
  const { id } = await params;
  const blueprint = await getBlueprintById(id);

  if (!blueprint) {
    notFound();
  }

  const content = blueprint.content as BlueprintContent;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden">
        <div className="bg-slate-950 px-8 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            Blueprint guardado en PostgreSQL
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {content.company ?? blueprint.assessment.client.name}
          </h1>

          <p className="mt-3 text-slate-300">
            Este informe fue recuperado directamente desde Neon mediante su ID
            permanente.
          </p>
        </div>

        <CardHeader>
          <CardDescription>ID del Blueprint</CardDescription>
          <CardTitle className="break-all text-base">
            {blueprint.id}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-700">
              Automation Score
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-800">
              {content.automationScore ??
                blueprint.assessment.automationScore}
              <span className="text-xl text-blue-500">/100</span>
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-muted-foreground">Nivel</p>

            <p className="mt-2 text-xl font-bold">
              {content.level ?? blueprint.assessment.level}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="font-semibold">Diagnóstico</p>

            <p className="mt-2 leading-7 text-muted-foreground">
              {content.diagnosis ??
                "El Blueprint fue recuperado correctamente desde la base de datos."}
            </p>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-3 border-t pt-5">
            <Button render={<Link href="/portal/assessment" />}>
              Nuevo Assessment
            </Button>

            <Button
              variant="outline"
              render={<Link href="/portal/dashboard" />}
            >
              Volver al centro de comando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}