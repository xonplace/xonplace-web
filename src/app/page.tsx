import {
  AssessmentRequestForm,
} from "@/components/landing/assessment-request-form";

import {
  XonplaceAdvisor,
} from "@/components/chat/xonplace-advisor";

const capabilities = [
  {
    title: "Automation Assessment",
    description:
      "Evaluamos procesos, sistemas, información, carga operativa y reglas de negocio para identificar oportunidades reales de automatización.",
  },
  {
    title: "Automation Blueprint",
    description:
      "Convertimos el diagnóstico en una hoja de ruta priorizada según impacto, complejidad, preparación y potencial de automatización.",
  },
  {
    title: "Intelligent Automation",
    description:
      "Diseñamos automatizaciones que conectan sistemas, documentos, datos, reglas y workflows para transformar procesos de principio a fin.",
  },
  {
    title: "AI Agents",
    description:
      "Creamos agentes digitales especializados que analizan información, ejecutan tareas y escalan excepciones bajo supervisión humana.",
  },
];

const steps = [
  [
    "01",
    "Descubrir",
    "Entendemos cómo funciona realmente su operación: procesos, personas, sistemas, documentos, reglas, decisiones y excepciones.",
  ],
  [
    "02",
    "Diagnosticar",
    "Medimos madurez, oportunidad, impacto y preparación para identificar dónde la automatización puede generar mayor valor.",
  ],
  [
    "03",
    "Priorizar",
    "Convertimos el diagnóstico en un Automation Blueprint con iniciativas priorizadas por impacto, complejidad, factibilidad y evidencia.",
  ],
  [
    "04",
    "Transformar",
    "Diseñamos e implementamos automatizaciones, integraciones y agentes de IA, midiendo resultados antes de escalar.",
  ],
];

function XonplaceMark() {
  return (
    <img
      src="/brand/xonplace-symbol.svg"
      alt="XONPLACE"
      className="h-10 w-10 shrink-0"
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <a href="#inicio" className="flex items-center">
            <img
              src="/brand/xonplace-logo.svg"
              alt="XONPLACE — AI Automation as a Service"
              className="h-20 w-auto"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a
              href="#soluciones"
              className="transition hover:text-blue-600"
            >
              Soluciones
            </a>

            <a
              href="#metodologia"
              className="transition hover:text-blue-600"
            >
              Metodología
            </a>

            <a
              href="#assessment"
              className="transition hover:text-blue-600"
            >
              Assessment
            </a>

            <a
              href="#contacto"
              className="transition hover:text-blue-600"
            >
              Contacto
            </a>
          </nav>

          <a
            href="#contacto"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Solicitar Assessment
          </a>
        </div>
      </header>

      {/* HERO */}

      <section
        id="inicio"
        className="relative overflow-hidden border-b border-slate-200"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_35%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.10),transparent_24%)]" />

        <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Transformación empresarial con IA
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Transformamos conocimiento en{" "}
              <span className="text-blue-600">
                inteligencia operativa.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Automatizamos procesos, conectamos sistemas y
              construimos trabajadores digitales de Inteligencia
              Artificial que generan resultados medibles.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contacto"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Solicitar Automation Assessment
              </a>

              <a
                href="#metodologia"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Conocer nuestra metodología
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500">
              <span>✓ Integramos sus sistemas actuales</span>
              <span>✓ Supervisión humana</span>
              <span>✓ Resultados medibles</span>
            </div>
          </div>

          {/* DASHBOARD MOCKUP */}

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-2xl shadow-slate-950/20">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <XonplaceMark />

                  <div>
                    <p className="font-semibold tracking-wider text-white">
                      XONPLACE
                    </p>

                    <p className="text-xs text-slate-400">
                      Intelligence Dashboard
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Sistema activo
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["XAI Index", "84/100", "+12%"],
                  ["Procesos evaluados", "142", "+24"],
                  ["Agentes activos", "18", "24/7"],
                  ["Horas automatizadas", "12.450", "+32%"],
                ].map(([label, value, detail]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-sm text-slate-400">
                      {label}
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-2xl font-bold text-white">
                        {value}
                      </p>

                      <span className="text-sm font-semibold text-emerald-400">
                        {detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Progreso de automatización
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      +28%
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    Últimos 6 meses
                  </p>
                </div>

                <div className="mt-7 flex h-32 items-end gap-2">
                  {[
                    20, 28, 24, 38, 45, 41, 57, 63, 70, 78, 86,
                    96,
                  ].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700 to-sky-400"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ HACEMOS */}

      <section
        id="soluciones"
        className="bg-slate-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Qué hacemos
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              No automatizamos tareas aisladas.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Transformamos procesos completos combinando
              diagnóstico, integración, automatización e
              Inteligencia Artificial.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                  0{index + 1}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {capability.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}

<section
  id="metodologia"
  className="py-24"
>
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
        Nuestro enfoque
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Primero entendemos. Después automatizamos.
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600">
        La IA no transforma una organización por sí sola. El cambio
        comienza por comprender sus procesos, información, reglas,
        decisiones y sistemas antes de decidir qué automatizar.
      </p>
    </div>

    {/* Desktop timeline */}

    <div className="relative mt-16 hidden lg:block">
      <div className="absolute left-4 right-4 top-5 h-px bg-slate-200" />

      <div className="relative grid grid-cols-4 gap-8">
        {steps.map(
          (
            [
              number,
              title,
              description,
            ],
            index,
          ) => (
            <div
              key={
                number
              }
              className="relative"
            >
              <div
                className={`relative z-10 flex size-10 items-center justify-center rounded-full text-xs font-bold text-white ${
                  index ===
                  steps.length -
                    1
                    ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                    : "bg-slate-950"
                }`}
              >
                {number}
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight">
                {title}
              </h3>

              <p className="mt-3 max-w-xs leading-7 text-slate-600">
                {
                  description
                }
              </p>
            </div>
          ),
        )}
      </div>
    </div>

    {/* Mobile / tablet timeline */}

    <div className="relative mt-12 space-y-10 lg:hidden">
      <div className="absolute bottom-4 left-5 top-4 w-px bg-slate-200" />

      {steps.map(
        (
          [
            number,
            title,
            description,
          ],
          index,
        ) => (
          <div
            key={
              number
            }
            className="relative flex gap-6"
          >
            <div
              className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                index ===
                steps.length -
                  1
                  ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                  : "bg-slate-950"
              }`}
            >
              {number}
            </div>

            <div className="pb-2">
              <h3 className="text-xl font-bold tracking-tight">
                {title}
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                {
                  description
                }
              </p>
            </div>
          </div>
        ),
      )}
    </div>
  </div>
</section>

      

      {/* ASSESSMENT */}

            {/* ASSESSMENT */}

      <section
        id="assessment"
        className="relative overflow-hidden bg-slate-950 py-24 text-white"
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_78%_45%,rgba(37,99,235,0.16),transparent_30%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          {/* Columna izquierda */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">
              XONPLACE Automation Assessment
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Descubra cuánto puede automatizar su empresa.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Analizamos cómo funciona su operación, medimos su
              preparación para automatizar e identificamos las
              iniciativas con mayor impacto, factibilidad y
              potencial de retorno.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-blue-400">✓</span>
                <span>
                  Diagnóstico basado en procesos y evidencia.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-blue-400">✓</span>
                <span>
                  Priorización según impacto y complejidad.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-blue-400">✓</span>
                <span>
                  Hoja de ruta para avanzar desde diagnóstico a
                  implementación.
                </span>
              </div>
            </div>

            <a
              href="#contacto"
              className="mt-9 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Solicitar Automation Assessment
            </a>
          </div>

          {/* Preview del Assessment */}
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur">
              {/* Cabecera */}
              <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Assessment Result
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    Diagnóstico preliminar
                  </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Evaluación completada
                </span>
              </div>

              {/* Score principal */}
              <div className="grid gap-6 border-b border-white/10 p-6 md:grid-cols-[0.7fr_1.3fr]">
                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
                  <p className="text-sm text-slate-400">
                    Automation Score
                  </p>

                  <div className="mt-3 flex items-end gap-1">
                    <p className="text-5xl font-bold tracking-tight text-white">
                      82
                    </p>

                    <span className="mb-1 text-lg text-slate-400">
                      /100
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-blue-300">
                    Alto potencial
                  </p>
                </div>

                {/* Scores secundarios */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Readiness", "75"],
                    ["Opportunity", "82"],
                    ["Business Impact", "84"],
                    ["Confidence", "87"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                    >
                      <p className="text-xs text-slate-400">
                        {label}
                      </p>

                      <div className="mt-2 flex items-end gap-1">
                        <p className="text-2xl font-bold text-white">
                          {value}
                        </p>

                        <span className="mb-0.5 text-xs text-slate-500">
                          /100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entregables */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Qué obtiene
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Resultado ejecutivo del Assessment
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-blue-400">
                    Automation Blueprint
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      "AI Readiness",
                      "Madurez y preparación para automatizar.",
                    ],
                    [
                      "Oportunidades priorizadas",
                      "Impacto, complejidad y factibilidad.",
                    ],
                    [
                      "Análisis de procesos",
                      "Situación actual y proceso objetivo.",
                    ],
                    [
                      "Business Impact",
                      "Horas, ahorro y retorno cuando existe evidencia.",
                    ],
                    [
                      "Agentes IA",
                      "Roles digitales candidatos para la operación.",
                    ],
                    [
                      "Automation Blueprint",
                      "Iniciativas y roadmap de transformación.",
                    ],
                  ].map(([title, description]) => (
                    <div
                      key={title}
                      className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
                    >
                      <div className="flex gap-3">
                        <span className="mt-0.5 text-blue-400">
                          ✓
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nota de validación */}
                <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
                  <p className="text-xs leading-5 text-slate-400">
                    Las proyecciones económicas se presentan cuando
                    existe información suficiente sobre volumen,
                    tiempos, costos e inversión. De lo contrario,
                    quedan identificadas para validación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}

      {/* CONTACTO */}

<section
  id="contacto"
  className="border-t border-slate-100 bg-slate-50/70 py-24"
>
  <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
    <div className="lg:pt-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
        Comencemos
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        ¿Cuánto tiempo pierde hoy su empresa en trabajo repetitivo?
      </h2>

      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
        El primer paso no es comprar una plataforma. Es identificar
        dónde están las mejores oportunidades de automatización.
      </p>

      <div className="mt-8 space-y-3 text-sm text-slate-600">
        <p>
          ✓ Diagnóstico basado en información operacional.
        </p>

        <p>
          ✓ Acceso inmediato al Automation Assessment.
        </p>

        <p>
          ✓ Sin necesidad de compartir credenciales ni información sensible.
        </p>
      </div>
    </div>

    <AssessmentRequestForm />
  </div>
</section>

      {/* FOOTER */}

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center">
            <img
              src="/brand/xonplace-logo.svg"
              alt="XONPLACE — AI Automation as a Service"
              className="h-12 w-auto"
            />
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} XONPLACE. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    <XonplaceAdvisor />  
    </main>
  );
}