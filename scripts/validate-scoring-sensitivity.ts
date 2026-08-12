import {
  printScoringSensitivityValidation,
} from "../src/lib/assessment/v2/scoring-sensitivity";

const success =
  printScoringSensitivityValidation();

if (!success) {
  process.exitCode = 1;
}