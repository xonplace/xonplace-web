import {
  Bot,
  BrainCircuit,
  Clock3,
  Gauge,
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

function getPriorityStyle(priority: "Alta" | "Media") {
  return priority === "Alta"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";
}

function getAffinityTone(score: number) {
  if (score >= 80) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-700",
      label: "Muy alta",
    };
  }

  if (score >= 65) {
    return {
      bar: "bg-blue-600",
      text: "text-blue-700",
      label: "Alta",
    };
  }

  return {
    bar: "bg-amber-500",
    text: "text-amber-700",
    label: "Media",
  };
}

export function AIWorkforce({ data }: Props) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            AI Workforce
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Agentes IA recomendados
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Propuesta inicial de colaboradores digitales orientados a reducir
            carga operativa, supervisar procesos y asistir la toma de decisiones.
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Agentes sugeridos
          </p>

          <p className="mt-1 text-3xl font-bold">
            {data.insights.agents.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.insights.agents.map((agent, index) => {
          const affinity = getAffinityTone(agent.fitScore);

          return (
            <Card
              key={agent.name}
              className="overflow-hidden"
            >
              <CardHeader className="border-b bg-slate-50/70">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Bot className="size-6" />
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityStyle(
                      agent.priority,
                    )}`}
                  >
                    Prioridad {agent.priority}
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Agente {index + 1}
                </p>

                <CardTitle className="mt-1 text-xl">
                  {agent.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  {agent.purpose}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Gauge className="size-4 text-blue-600" />

                        <span className="text-sm font-medium">
                          Afinidad
                        </span>
                      </div>

                      <span className={`text-sm font-bold ${affinity.text}`}>
                        {agent.fitScore}% · {affinity.label}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${affinity.bar}`}
                        style={{ width: `${agent.fitScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="size-4 text-violet-600" />

                        <p className="text-xs text-muted-foreground">
                          Rol
                        </p>
                      </div>

                      <p className="mt-2 text-sm font-bold">
                        Asistencia IA
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <Clock3 className="size-4 text-emerald-600" />

                        <p className="text-xs text-muted-foreground">
                          Disponibilidad
                        </p>
                      </div>

                      <p className="mt-2 text-sm font-bold">
                        24x7
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}