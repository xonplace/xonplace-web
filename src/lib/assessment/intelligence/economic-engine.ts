import type {
  AutomationOpportunity,
  EconomicProjection,
  ProcessProfile,
} from "./types";

type EconomicEngineInput = {
  processes: ProcessProfile[];
  opportunities: AutomationOpportunity[];
  hourlyCostCLP?: number;
  estimatedImplementationCLP?: number;
};

function round(value: number): number {
  return Math.round(value);
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function calculateProcessMonthlyHours(
  process: ProcessProfile,
): number | undefined {
  if (
    !process.executionsPerMonth ||
    !process.minutesPerExecution ||
    !process.peopleInvolved
  ) {
    return undefined;
  }

  const monthlyMinutes =
    process.executionsPerMonth *
    process.minutesPerExecution *
    process.peopleInvolved;

  return monthlyMinutes / 60;
}

function calculateRecoverableHours(
  process: ProcessProfile,
): number | undefined {
  const currentHours =
    calculateProcessMonthlyHours(process);

  if (currentHours === undefined) {
    return undefined;
  }

  if (process.manualPercentage === undefined) {
    return undefined;
  }

  const manualShare =
    clampPercentage(process.manualPercentage) / 100;

  return currentHours * manualShare;
}

export function calculateEconomicProjection({
  processes,
  opportunities,
  hourlyCostCLP,
  estimatedImplementationCLP,
}: EconomicEngineInput): EconomicProjection {
  const assumptions: string[] = [];

  const currentHours = processes
    .map(calculateProcessMonthlyHours)
    .filter(
      (value): value is number =>
        value !== undefined,
    );

  const recoverableHours = processes
    .map(calculateRecoverableHours)
    .filter(
      (value): value is number =>
        value !== undefined,
    );

  const currentHoursPerMonth =
    currentHours.length > 0
      ? round(
          currentHours.reduce(
            (sum, value) => sum + value,
            0,
          ),
        )
      : undefined;

  const baseRecoverableHours =
    recoverableHours.length > 0
      ? recoverableHours.reduce(
          (sum, value) => sum + value,
          0,
        )
      : undefined;

  const averageAutomationPotential =
    opportunities.length > 0
      ? opportunities.reduce(
          (sum, opportunity) =>
            sum +
            opportunity.automationPotential,
          0,
        ) / opportunities.length
      : undefined;

  let recoverableHoursPerMonth:
    | number
    | undefined;

  if (
    baseRecoverableHours !== undefined &&
    averageAutomationPotential !== undefined
  ) {
    recoverableHoursPerMonth = round(
      baseRecoverableHours *
        (averageAutomationPotential / 100),
    );

    assumptions.push(
      `El porcentaje automatizable se estimó a partir del promedio de potencial de automatización de ${opportunities.length} oportunidades detectadas.`,
    );
  }

  let monthlySavingsCLP:
    | number
    | undefined;

  let annualSavingsCLP:
    | number
    | undefined;

  if (
    recoverableHoursPerMonth !== undefined &&
    hourlyCostCLP !== undefined
  ) {
    monthlySavingsCLP = round(
      recoverableHoursPerMonth *
        hourlyCostCLP,
    );

    annualSavingsCLP =
      monthlySavingsCLP * 12;

    assumptions.push(
      `El ahorro económico utiliza un costo hora declarado de ${hourlyCostCLP.toLocaleString(
        "es-CL",
      )} CLP.`,
    );
  }

  let paybackMonths:
    | number
    | undefined;

  let roiPercentage:
    | number
    | undefined;

  if (
    monthlySavingsCLP !== undefined &&
    monthlySavingsCLP > 0 &&
    estimatedImplementationCLP !== undefined
  ) {
    paybackMonths = Number(
      (
        estimatedImplementationCLP /
        monthlySavingsCLP
      ).toFixed(1),
    );
  }

  if (
    annualSavingsCLP !== undefined &&
    estimatedImplementationCLP !== undefined &&
    estimatedImplementationCLP > 0
  ) {
    roiPercentage = round(
      ((annualSavingsCLP -
        estimatedImplementationCLP) /
        estimatedImplementationCLP) *
        100,
    );
  }

  if (currentHoursPerMonth === undefined) {
    assumptions.push(
      "No existen suficientes datos de frecuencia, tiempo por ejecución y personas involucradas para calcular las horas actuales.",
    );
  }

  if (recoverableHoursPerMonth === undefined) {
    assumptions.push(
      "Las horas recuperables requieren información explícita sobre volumen, tiempo y porcentaje manual del proceso.",
    );
  }

  if (hourlyCostCLP === undefined) {
    assumptions.push(
      "El ahorro económico no se calcula hasta contar con un costo hora validado.",
    );
  }

  if (
    estimatedImplementationCLP === undefined
  ) {
    assumptions.push(
      "ROI y payback permanecerán pendientes hasta disponer de una estimación de inversión.",
    );
  }

  const availableEconomicInputs = [
    currentHoursPerMonth !== undefined,
    recoverableHoursPerMonth !== undefined,
    hourlyCostCLP !== undefined,
    estimatedImplementationCLP !== undefined,
  ].filter(Boolean).length;

  const confidence = round(
    (availableEconomicInputs / 4) * 100,
  );

  return {
    hourlyCostCLP,

    currentHoursPerMonth,

    recoverableHoursPerMonth,

    monthlySavingsCLP,

    annualSavingsCLP,

    estimatedImplementationCLP,

    paybackMonths,

    roiPercentage,

    confidence,

    assumptions,
  };
}