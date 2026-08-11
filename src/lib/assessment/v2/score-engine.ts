import type {
  IntelligenceScores,
} from "@/lib/assessment/intelligence";

import type {
  AssessmentV2Answers,
} from "./adapter";

function getString(
  answers: AssessmentV2Answers,
  key: string,
): string {
  const value = answers[key];

  return typeof value === "string"
    ? value
    : "";
}

function getNumber(
  answers: AssessmentV2Answers,
  key: string,
): number | undefined {
  const value = getString(
    answers,
    key,
  );

  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function getArray(
  answers: AssessmentV2Answers,
  key: string,
): string[] {
  const value = answers[key];

  return Array.isArray(value)
    ? value
    : [];
}

function clamp(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function mapRules(
  value: string,
): number {
  if (value === "all") {
    return 95;
  }

  if (value === "most") {
    return 85;
  }

  if (value === "some") {
    return 55;
  }

  if (value === "none") {
    return 25;
  }

  return 50;
}

function mapExceptions(
  value: string,
): number {
  if (value === "low") {
    return 90;
  }

  if (value === "medium") {
    return 60;
  }

  if (value === "high") {
    return 30;
  }

  return 50;
}

function mapReworkReadiness(
  value: string,
): number {
  if (value === "rare") {
    return 95;
  }

  if (value === "sometimes") {
    return 70;
  }

  if (value === "frequent") {
    return 40;
  }

  if (value === "constant") {
    return 15;
  }

  return 50;
}

function mapReworkOpportunity(
  value: string,
): number {
  if (value === "rare") {
    return 20;
  }

  if (value === "sometimes") {
    return 55;
  }

  if (value === "frequent") {
    return 85;
  }

  if (value === "constant") {
    return 100;
  }

  return 50;
}

function mapApproval(
  value: string,
): number {
  if (value === "no") {
    return 90;
  }

  if (value === "sometimes") {
    return 70;
  }

  if (value === "yes") {
    return 55;
  }

  return 50;
}

function mapManualExtractionReadiness(
  value: string,
): number {
  if (value === "no") {
    return 90;
  }

  if (value === "sometimes") {
    return 60;
  }

  if (value === "yes") {
    return 25;
  }

  return 50;
}

function mapManualExtractionOpportunity(
  value: string,
): number {
  if (value === "yes") {
    return 95;
  }

  if (value === "sometimes") {
    return 65;
  }

  if (value === "no") {
    return 20;
  }

  return 40;
}

function mapDoubleEntryReadiness(
  value: string,
): number {
  if (value === "no") {
    return 90;
  }

  if (value === "sometimes") {
    return 55;
  }

  if (value === "frequent") {
    return 20;
  }

  return 50;
}

function mapDoubleEntryOpportunity(
  value: string,
): number {
  if (value === "frequent") {
    return 95;
  }

  if (value === "sometimes") {
    return 60;
  }

  if (value === "no") {
    return 15;
  }

  return 40;
}

function mapSystemIntegration(
  value: string,
): number {
  if (value === "most") {
    return 90;
  }

  if (value === "some") {
    return 65;
  }

  if (value === "none") {
    return 25;
  }

  /*
   * Unknown NO significa 100.
   * Se utiliza un valor neutral.
   */
  return 50;
}

function mapApiAvailability(
  value: string,
): number {
  if (value === "most") {
    return 90;
  }

  if (value === "some") {
    return 65;
  }

  if (value === "none") {
    return 25;
  }

  return 50;
}

function calculateIntegrationReadiness(
  answers: AssessmentV2Answers,
): number {
  const usesMultipleSystems =
    getString(
      answers,
      "usesMultipleSystems",
    ) === "yes";

  /*
   * Un único sistema reduce la complejidad
   * de integración, pero no implica
   * automáticamente madurez perfecta.
   */
  if (!usesMultipleSystems) {
    return 80;
  }

  const integration =
    mapSystemIntegration(
      getString(
        answers,
        "systemsIntegrated",
      ),
    );

  const doubleEntry =
    mapDoubleEntryReadiness(
      getString(
        answers,
        "doubleEntry",
      ),
    );

  const api =
    mapApiAvailability(
      getString(
        answers,
        "apiAvailability",
      ),
    );

  return clamp(
    integration * 0.5 +
      doubleEntry * 0.3 +
      api * 0.2,
  );
}

function calculateInformationReadiness(
  answers: AssessmentV2Answers,
): number {
  const usesDocuments =
    getString(
      answers,
      "usesDocuments",
    ) === "yes";

  if (!usesDocuments) {
    return 80;
  }

  const extraction =
    mapManualExtractionReadiness(
      getString(
        answers,
        "manualDataExtraction",
      ),
    );

  const documentTypes =
    getArray(
      answers,
      "documentTypes",
    );

  const structureScore =
    documentTypes.length > 0
      ? 75
      : 50;

  return clamp(
    extraction * 0.65 +
      structureScore * 0.35,
  );
}

function calculateOperationalCompleteness(
  answers: AssessmentV2Answers,
): number {
  const values = [
    getNumber(
      answers,
      "executionsPerMonth",
    ),
    getNumber(
      answers,
      "peopleInvolved",
    ),
    getNumber(
      answers,
      "minutesPerExecution",
    ),
    getNumber(
      answers,
      "manualPercentage",
    ),
  ];

  const completed =
    values.filter(
      (value) =>
        value !== undefined,
    ).length;

  return clamp(
    (completed / values.length) *
      100,
  );
}

function calculateReadiness(
  answers: AssessmentV2Answers,
): number {
  const rules =
    mapRules(
      getString(
        answers,
        "rulesKnown",
      ),
    );

  const integration =
    calculateIntegrationReadiness(
      answers,
    );

  const information =
    calculateInformationReadiness(
      answers,
    );

  const exceptions =
    mapExceptions(
      getString(
        answers,
        "exceptionsLevel",
      ),
    );

  const rework =
    mapReworkReadiness(
      getString(
        answers,
        "reworkLevel",
      ),
    );

  const approvals =
    mapApproval(
      getString(
        answers,
        "requiresApproval",
      ),
    );

  const completeness =
    calculateOperationalCompleteness(
      answers,
    );

  return clamp(
    rules * 0.25 +
      integration * 0.25 +
      information * 0.15 +
      exceptions * 0.12 +
      rework * 0.1 +
      approvals * 0.05 +
      completeness * 0.08,
  );
}

function mapVolume(
  executions?: number,
): number {
  if (executions === undefined) {
    return 40;
  }

  if (executions >= 1000) {
    return 100;
  }

  if (executions >= 500) {
    return 90;
  }

  if (executions >= 300) {
    return 85;
  }

  if (executions >= 100) {
    return 70;
  }

  if (executions >= 30) {
    return 50;
  }

  return 30;
}

function calculateOpportunity(
  answers: AssessmentV2Answers,
): number {
  const manualPercentage =
    getNumber(
      answers,
      "manualPercentage",
    ) ?? 50;

  const extraction =
    mapManualExtractionOpportunity(
      getString(
        answers,
        "manualDataExtraction",
      ),
    );

  const doubleEntry =
    mapDoubleEntryOpportunity(
      getString(
        answers,
        "doubleEntry",
      ),
    );

  const integrationReadiness =
    calculateIntegrationReadiness(
      answers,
    );

  const integrationGap =
    100 -
    integrationReadiness;

  const usesDocuments =
    getString(
      answers,
      "usesDocuments",
    ) === "yes";

  const documents =
    usesDocuments
      ? 75
      : 20;

  const volume =
    mapVolume(
      getNumber(
        answers,
        "executionsPerMonth",
      ),
    );

  const rules =
    mapRules(
      getString(
        answers,
        "rulesKnown",
      ),
    );

  const rework =
    mapReworkOpportunity(
      getString(
        answers,
        "reworkLevel",
      ),
    );

  return clamp(
    manualPercentage * 0.22 +
      extraction * 0.16 +
      doubleEntry * 0.14 +
      integrationGap * 0.14 +
      documents * 0.1 +
      volume * 0.1 +
      rules * 0.08 +
      rework * 0.06,
  );
}

function mapPeopleImpact(
  people?: number,
): number {
  if (people === undefined) {
    return 40;
  }

  if (people >= 10) {
    return 100;
  }

  if (people >= 5) {
    return 85;
  }

  if (people >= 3) {
    return 70;
  }

  if (people >= 2) {
    return 55;
  }

  return 35;
}

function mapHoursImpact(
  hours?: number,
): number {
  if (hours === undefined) {
    return 40;
  }

  if (hours >= 300) {
    return 100;
  }

  if (hours >= 160) {
    return 90;
  }

  if (hours >= 80) {
    return 75;
  }

  if (hours >= 40) {
    return 60;
  }

  if (hours >= 20) {
    return 50;
  }

  return 30;
}

function calculateBusinessImpact(
  answers: AssessmentV2Answers,
): number {
  const executions =
    getNumber(
      answers,
      "executionsPerMonth",
    );

  const minutes =
    getNumber(
      answers,
      "minutesPerExecution",
    );

  const people =
    getNumber(
      answers,
      "peopleInvolved",
    );

  const manualPercentage =
    getNumber(
      answers,
      "manualPercentage",
    ) ?? 50;

  const currentHours =
    executions !== undefined &&
    minutes !== undefined &&
    people !== undefined
      ? (
          executions *
          minutes *
          people
        ) / 60
      : undefined;

  const hoursImpact =
    mapHoursImpact(
      currentHours,
    );

  const volumeImpact =
    mapVolume(
      executions,
    );

  const peopleImpact =
    mapPeopleImpact(
      people,
    );

  const reworkImpact =
    mapReworkOpportunity(
      getString(
        answers,
        "reworkLevel",
      ),
    );

  return clamp(
    hoursImpact * 0.4 +
      volumeImpact * 0.2 +
      manualPercentage * 0.2 +
      reworkImpact * 0.1 +
      peopleImpact * 0.1,
  );
}

function hasAnswer(
  answers: AssessmentV2Answers,
  key: string,
): boolean {
  const value = answers[key];

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function calculateDescriptionQuality(
  answers: AssessmentV2Answers,
): number {
  const description =
    getString(
      answers,
      "processDescription",
    ).trim();

  if (description.length >= 60) {
    return 100;
  }

  if (description.length >= 30) {
    return 85;
  }

  if (description.length >= 15) {
    return 65;
  }

  if (description.length > 0) {
    return 45;
  }

  return 0;
}

function calculateConfidence(
  answers: AssessmentV2Answers,
): number {
  /*
   * Confidence ahora representa
   * CALIDAD / COMPLETITUD de la información,
   * no severidad de los problemas.
   */

  const requiredKeys = [
    "company",
    "industry",
    "employees",
    "mainPain",
    "processName",
    "processDescription",
    "frequency",
    "manualPercentage",
    "usesDocuments",
    "usesMultipleSystems",
    "rulesKnown",
    "requiresApproval",
    "exceptionsLevel",
    "reworkLevel",
  ];

  const requiredCompleted =
    requiredKeys.filter(
      (key) =>
        hasAnswer(
          answers,
          key,
        ),
    ).length;

  const requiredScore =
    (
      requiredCompleted /
      requiredKeys.length
    ) * 100;

  const operationalKeys = [
    "executionsPerMonth",
    "peopleInvolved",
    "minutesPerExecution",
  ];

  const operationalCompleted =
    operationalKeys.filter(
      (key) =>
        hasAnswer(
          answers,
          key,
        ),
    ).length;

  const operationalScore =
    (
      operationalCompleted /
      operationalKeys.length
    ) * 100;

  const usesMultipleSystems =
    getString(
      answers,
      "usesMultipleSystems",
    ) === "yes";

  let integrationScore = 100;

  if (usesMultipleSystems) {
    const systemsUsed =
      getArray(
        answers,
        "systemsUsed",
      ).length > 0;

    const doubleEntry =
      hasAnswer(
        answers,
        "doubleEntry",
      );

    const integrated =
      getString(
        answers,
        "systemsIntegrated",
      );

    const api =
      getString(
        answers,
        "apiAvailability",
      );

    let points = 0;

    if (systemsUsed) {
      points += 25;
    }

    if (doubleEntry) {
      points += 25;
    }

    /*
     * "unknown" cuenta como respuesta,
     * pero con menor calidad diagnóstica.
     */
    if (integrated) {
      points +=
        integrated === "unknown"
          ? 12
          : 25;
    }

    if (api) {
      points +=
        api === "unknown"
          ? 12
          : 25;
    }

    integrationScore =
      points;
  }

  const descriptionScore =
    calculateDescriptionQuality(
      answers,
    );

  return clamp(
    requiredScore * 0.5 +
      operationalScore * 0.25 +
      integrationScore * 0.15 +
      descriptionScore * 0.1,
  );
}

export function calculateV2IntelligenceScores(
  answers: AssessmentV2Answers,
): IntelligenceScores {
  return {
    readiness:
      calculateReadiness(
        answers,
      ),

    opportunity:
      calculateOpportunity(
        answers,
      ),

    businessImpact:
      calculateBusinessImpact(
        answers,
      ),

    confidence:
      calculateConfidence(
        answers,
      ),
  };
}