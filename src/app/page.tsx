const capabilities = [
  {
    title: "Automation Assessment",
    description:
      "Identificamos los procesos con mayor potencial de automatización, impacto y retorno.",
  },
  {
    title: "Knowledge Models",
    description:
      "Convertimos el conocimiento de la organización en modelos estructurados y reutilizables.",
  },
  {
    title: "AI Agents",
    description:
      "Creamos trabajadores digitales especializados, supervisados y conectados a sus sistemas.",
  },
  {
    title: "Automation Platform",
    description:
      "Integramos datos, documentos, reglas y workflows en una plataforma común.",
  },
];

const steps = [
  ["01", "Descubrir", "Entendemos cómo trabaja actualmente su organización."],
  ["02", "Analizar", "Medimos tiempos, sistemas, decisiones y oportunidades."],
  ["03", "Priorizar", "Seleccionamos las iniciativas con mayor valor y viabilidad."],
  ["04", "Transformar", "Implementamos automatización y medimos sus resultados."],
];

function XonplaceMark() {
  return (
    <div
      aria-hidden="true"
      className="relative h-9 w-9 shrink-0 rounded-xl bg-slate-950 shadow-lg shadow-blue-950/20"
    >
      <span className="absolute left-[9px] top-[7px] h-5 w-2 -rotate-45 rounded-sm bg-white" />
      <span className="absolute right-[9px] top-[7px] h-5 w-2 rotate-45 rounded-sm bg-blue-600" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <XonplaceMark />
            <div>
              <p className="text-lg font-bold tracking-[0.18em]">XONPLACE</p>
              <p className="hidden text-[10px] tracking-[0.22em] text-slate-500 sm:block">
                AI AUTOMATION AS A SERVICE
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#soluciones" className="transition hover:text-blue-600">
              Soluciones
            </a>
            <a href="#metodologia" className="transition hover:text-blue-600">
              Metodología
            </a>
            <a href="#assessment" className="transition hover:text-blue-600">
              Assessment
            </a>
            <a href="#contacto" className="transition hover:text-blue-600">
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
              <span className="text-blue-600">inteligencia operativa.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Automatizamos procesos, conectamos sistemas y construimos
              trabajadores digitales de Inteligencia Artificial que generan
              resultados medibles.
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
                    <p className="text-sm text-slate-400">{label}</p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-2xl font-bold text-white">{value}</p>
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
                    <p className="mt-1 text-2xl font-bold text-white">+28%</p>
                  </div>
                  <p className="text-sm text-slate-500">Últimos 6 meses</p>
                </div>

                <div className="mt-7 flex h-32 items-end gap-2">
                  {[20, 28, 24, 38, 45, 41, 57, 63, 70, 78, 86, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700 to-sky-400"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="soluciones" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Qué hacemos
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              No automatizamos tareas aisladas.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Transformamos procesos completos combinando conocimiento,
              integración, automatización e Inteligencia Artificial.
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
                <h3 className="mt-6 text-xl font-bold">{capability.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodologia" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Nuestro enfoque
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Primero entendemos. Después automatizamos.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                La IA no transforma una organización por sí sola. El cambio
                comienza al comprender sus procesos, información, reglas y
                decisiones.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {steps.map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  <p className="text-sm font-bold text-blue-600">{number}</p>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="assessment" className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">
              XONPLACE Automation Assessment
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Descubra cuánto puede automatizar su empresa.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Evaluamos procesos, volumen, sistemas, documentos, datos y
              decisiones para crear una hoja de ruta priorizada.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Automation Score",
              "Mapa de impacto y complejidad",
              "Procesos prioritarios",
              "Horas potencialmente automatizables",
              "Agentes recomendados",
              "Automation Blueprint",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              >
                <span className="mr-3 text-blue-400">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Comencemos
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            ¿Cuánto tiempo pierde hoy su empresa en trabajo repetitivo?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            El primer paso no es comprar una plataforma. Es identificar dónde
            están las mejores oportunidades de automatización.
          </p>

          <a
            href="mailto:contacto@xonplace.com"
            className="mt-10 inline-flex rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Hablar con XONPLACE
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <XonplaceMark />
            <div>
              <p className="font-bold tracking-[0.18em]">XONPLACE</p>
              <p className="text-sm text-slate-500">
                AI Automation as a Service
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} XONPLACE. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}