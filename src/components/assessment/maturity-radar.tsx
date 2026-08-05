"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DimensionScores = {
  procesos: number;
  informacion: number;
  integracion: number;
  automatizacion: number;
  ia: number;
};

type MaturityRadarProps = {
  scores: DimensionScores;
};

export function MaturityRadar({ scores }: MaturityRadarProps) {
  const data = [
    {
      dimension: "Procesos",
      score: scores.procesos,
    },
    {
      dimension: "Información",
      score: scores.informacion,
    },
    {
      dimension: "Integración",
      score: scores.integracion,
    },
    {
      dimension: "Automatización",
      score: scores.automatizacion,
    },
    {
      dimension: "IA",
      score: scores.ia,
    },
  ];

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{
            top: 30,
            right: 45,
            bottom: 30,
            left: 45,
          }}
        >
          <PolarGrid stroke="#cbd5e1" />

          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: "#334155",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={6}
            tick={{
              fill: "#64748b",
              fontSize: 10,
            }}
          />

          <Tooltip
            formatter={(value) => [`${value}/100`, "Madurez"]}
          />

          <Radar
            name="Madurez"
            dataKey="score"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.22}
            strokeWidth={3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
