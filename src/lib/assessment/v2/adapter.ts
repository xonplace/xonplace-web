import type {
  AssessmentAnswers,
  ProcessProfile,
} from "@/lib/assessment/intelligence";

export type AssessmentV2Answers = Record<
  string,
  string | string[]
>;

function getString(
  answers: AssessmentV2Answers,
  key: string,
): string {
  const value = answers[key];

  return typeof value === "string"
    ? value
    : "";
}

function getStringArray(
  answers: AssessmentV2Answers,
  key: string,
): string[] {
  const value = answers[key];

  return Array.isArray(value)
    ? value
    : [];
}

function getNumber(
  answers: AssessmentV2Answers,
  key: string,
): number | undefined {
  const value = getString(answers, key);

  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function mapFrequency(
  value: string,
): ProcessProfile["frequency"] {
  switch (value) {
    case "daily-many":
    case "daily":
      return "daily";

    case "weekly":
      return "weekly";

    case "monthly":
      return "monthly";

    case "occasional":
      return "occasional";

    default:
      return "unknown";
  }
}

function mapSystems(
  answers: AssessmentV2Answers,
): string[] {
  return getStringArray(
    answers,
    "systemsUsed",
  );
}

function mapInputs(
  answers: AssessmentV2Answers,
): string[] {
  const documentTypes = getStringArray(
    answers,
    "documentTypes",
  );

  return documentTypes;
}

function buildLegacyCompatibleAnswers(
  answers: AssessmentV2Answers,
): AssessmentAnswers {
  const manualPercentage = Number(
    getString(answers, "manualPercentage"),
  );

  const reworkLevel = getString(
    answers,
    "reworkLevel",
  );

  const rulesKnown = getString(
    answers,
    "rulesKnown",
  );

  const usesDocuments =
    getString(answers, "usesDocuments") ===
    "yes";

  const usesMultipleSystems =
    getString(
      answers,
      "usesMultipleSystems",
    ) === "yes";

  const doubleEntry = getString(
    answers,
    "doubleEntry",
  );

  let manualWork = "medium";

  if (manualPercentage >= 75) {
    manualWork = "very-high";
  } else if (manualPercentage >= 50) {
    manualWork = "high";
  } else if (manualPercentage >= 25) {
    manualWork = "medium";
  } else {
    manualWork = "low";
  }

  let systems = "complete";

  if (usesMultipleSystems) {
    if (doubleEntry === "frequent") {
      systems = "disconnected";
    } else if (doubleEntry === "sometimes") {
      systems = "few";
    } else {
      systems = "partial";
    }
  }

  let documents = "very-low";

  if (usesDocuments) {
    const extraction = getString(
      answers,
      "manualDataExtraction",
    );

    if (extraction === "yes") {
      documents = "very-high";
    } else if (extraction === "sometimes") {
      documents = "high";
    } else {
      documents = "medium";
    }
  }

  let rules = "none";

  if (rulesKnown === "all") {
    rules = "all";
  } else if (rulesKnown === "most") {
    rules = "most";
  } else if (rulesKnown === "some") {
    rules = "some";
  }

  let errors = "rarely";

  if (reworkLevel === "constant") {
    errors = "constant";
  } else if (reworkLevel === "frequent") {
    errors = "frequent";
  } else if (reworkLevel === "sometimes") {
    errors = "sometimes";
  }

  return {
    company: getString(
      answers,
      "company",
    ),

    industry: getString(
      answers,
      "industry",
    ),

    employees: getString(
      answers,
      "employees",
    ),

    manualWork,
    systems,
    documents,
    rules,
    errors,
  };
}

export function buildProcessProfile(
  answers: AssessmentV2Answers,
): ProcessProfile {
  const processName =
    getString(
      answers,
      "processName",
    ) || "Proceso evaluado";

  const processDescription =
    getString(
      answers,
      "processDescription",
    );

  const rulesKnown = getString(
    answers,
    "rulesKnown",
  );

  const requiresApproval =
    getString(
      answers,
      "requiresApproval",
    ) !== "no";

  const exceptionsLevel = getString(
    answers,
    "exceptionsLevel",
  );

  return {
    name: processName,

    description:
      processDescription || undefined,

    frequency: mapFrequency(
      getString(
        answers,
        "frequency",
      ),
    ),

    executionsPerMonth:
      getNumber(
        answers,
        "executionsPerMonth",
      ),

    peopleInvolved:
      getNumber(
        answers,
        "peopleInvolved",
      ),

    minutesPerExecution:
      getNumber(
        answers,
        "minutesPerExecution",
      ),

    manualPercentage:
      getNumber(
        answers,
        "manualPercentage",
      ),

    errorPercentage:
      undefined,

    systems:
      mapSystems(answers),

    inputs:
      mapInputs(answers),

    outputs: [],

    hasRules:
      rulesKnown === "all" ||
      rulesKnown === "most",

    requiresApproval,

    hasExceptions:
      exceptionsLevel === "medium" ||
      exceptionsLevel === "high",
  };
}

export function adaptAssessmentV2(
  answers: AssessmentV2Answers,
) {
  const process =
    buildProcessProfile(answers);

  const intelligenceAnswers =
    buildLegacyCompatibleAnswers(
      answers,
    );

  const hourlyCostCLP =
    getNumber(
      answers,
      "hourlyCostCLP",
    );

  return {
    intelligenceAnswers,

    processes: [process],

    hourlyCostCLP,
  };
}