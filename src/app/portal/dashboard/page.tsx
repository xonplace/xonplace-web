import {
  Bot,
  Building2,
  ChartNoAxesCombined,
  Clock3,
  FileChartColumn,
  Plus,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  {
    title: "Automation Score",
    value: "84/100",
    detail: "+12% este trimestre",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Procesos evaluados",
    value: "142",
    detail: "24 nuevos",
    icon: Workflow,
  },
  {
    title: "Agentes activos",
    value: "18",
    detail: "Operando 24/7",
    icon: Bot,
  },
  {
    title: "Horas automatizadas",
    value: "12.450",
    detail: "+32% este mes",
    icon: Clock3,
  },
];

const actions = [
  {
    title: "Realizar Assessment",
    description: "Evalúa el potencial de automatización de una empresa.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Crear agente IA",
    description: "Diseña un trabajador digital especializado.",
    icon: Bot,
  },
  {
    title: "Nueva automatización",
    description: "Conecta procesos, datos y decisiones.",
    icon: Workflow,
  },
  {
    title: "Generar Blueprint",
    description: "Crea una hoja de ruta ejecutiva.",
    icon: FileChartColumn,
  },
];

const activity = [
  {
    title: "Assessment completado",
    description: "Empresa Demo obtuvo un score de 84/100.",
    time: "Hace 12 minutos",
  },
  {
    title: "Nuevo agente desplegado",
    description: "Document Agent comenzó a procesar contratos.",
    time: "Hace 1 hora",
  },
  {
    title: "Blueprint generado",
    description: "Roadmap de automatización disponible.",
    time: "Hace 3 horas",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Centro de comando
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Buenas noches, Gonzalo.
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Supervisa el avance de automatización, crea agentes y transforma
            procesos desde un solo lugar.
          </p>
        </div>

        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4" />
          Nuevo proyecto
        </Button>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-5 text-blue-600" />
          <h2 className="text-lg font-semibold">¿Qué quieres construir hoy?</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Card
                key={action.title}
                className="cursor-pointer transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </div>

                  <CardTitle className="text-base">{action.title}</CardTitle>

                  <CardDescription className="leading-6">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Resumen ejecutivo</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>

                  <Icon className="size-4 text-blue-600" />
                </CardHeader>

                <CardContent>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    {metric.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas dentro de XONPLACE.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {activity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 border-b pb-5 last:border-0 last:pb-0"
              >
                <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Sparkles className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la organización</CardTitle>
            <CardDescription>
              Indicadores generales del workspace.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-blue-600" />
                <span className="text-sm font-medium">Empresas</span>
              </div>

              <span className="font-bold">18</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="size-5 text-blue-600" />
                <span className="text-sm font-medium">Agentes activos</span>
              </div>

              <span className="font-bold">18</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Workflow className="size-5 text-blue-600" />
                <span className="text-sm font-medium">
                  Automatizaciones
                </span>
              </div>

              <span className="font-bold">32</span>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Nivel de madurez
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-700">Avanzado</p>
              <p className="mt-2 text-xs leading-5 text-blue-700">
                La organización está preparada para implementar agentes
                supervisados.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}