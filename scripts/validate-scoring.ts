import {
  printScoringValidation,
} from "../src/lib/assessment/v2/scoring-validation";

const success =
  printScoringValidation();

if (!success) {
  process.exitCode = 1;
}