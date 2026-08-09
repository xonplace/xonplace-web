import { generateIntelligenceResult } from "./intelligence-engine";

const answers = {
  company: "Empresa Demo",
  industry: "technology",
  employees: "51-200",

  manualWork: "very-high",
  systems: "few",
  documents: "very-high",
  rules: "most",
  errors: "frequent",
};

const result = generateIntelligenceResult({
  answers,
});

console.dir(result, {
  depth: null,
});