import type { BlueprintReportData } from "./types";

type Props = {
  data: BlueprintReportData;
};

export function ExecutiveCover({ data }: Props) {
  return (
    <section className="rounded-3xl bg-slate-950 p-10 text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
        XONPLACE AUTOMATION BLUEPRINT
      </p>

      <h1 className="mt-6 text-5xl font-bold">
        {data.company}
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-300">
        Evaluación ejecutiva de automatización e inteligencia artificial.
      </p>

      <div className="mt-10 flex flex-wrap gap-10">
        <div>
          <p className="text-sm text-slate-400">
            Automation Score
          </p>

          <p className="text-4xl font-bold">
            {data.automationScore}/100
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Nivel
          </p>

          <p className="text-2xl font-semibold">
            {data.level}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Fecha
          </p>

          <p className="text-lg">
            {new Date(data.generatedAt).toLocaleDateString("es-CL")}
          </p>
        </div>
      </div>
    </section>
  );
}