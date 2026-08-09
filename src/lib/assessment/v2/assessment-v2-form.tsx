"use client";

import { useMemo, useState } from "react";

import {
  assessmentV2Questions,
  type AssessmentV2Answers,
} from "@/lib/assessment/v2";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AssessmentV2FormProps = {
  onComplete?: (
    answers: AssessmentV2Answers,
  ) => void;
};

function isVisible(
  question: (typeof assessmentV2Questions)[number],
  answers: AssessmentV2Answers,
): boolean {
  if (!question.showWhen) {
    return true;
  }

  const current =
    answers[question.showWhen.questionId];

  if (Array.isArray(current)) {
    return current.some((value) =>
      question.showWhen?.values.includes(value),
    );
  }

  return (
    typeof current === "string" &&
    question.showWhen.values.includes(current)
  );
}

export function AssessmentV2Form({
  onComplete,
}: AssessmentV2FormProps) {
  const [answers, setAnswers] =
    useState<AssessmentV2Answers>({});

  const [sectionIndex, setSectionIndex] =
    useState(0);

  const sections = useMemo(
    () =>
      Array.from(
        new Set(
          assessmentV2Questions.map(
            (question) => question.section,
          ),
        ),
      ),
    [],
  );

  const currentSection =
    sections[sectionIndex];

  const questions = assessmentV2Questions.filter(
    (question) =>
      question.section === currentSection &&
      isVisible(question, answers),
  );

  const progress =
    ((sectionIndex + 1) / sections.length) *
    100;

  const updateAnswer = (
    id: string,
    value: string | string[],
  ) => {
    setAnswers((current) => ({
      ...current,
      [id]: value,
    }));
  };

  const toggleMultiple = (
    id: string,
    value: string,
  ) => {
    const current = answers[id];

    const selected = Array.isArray(current)
      ? current
      : [];

    const next = selected.includes(value)
      ? selected.filter(
          (item) => item !== value,
        )
      : [...selected, value];

    updateAnswer(id, next);
  };

  const sectionIsValid =
    questions.every((question) => {
      if (!question.required) {
        return true;
      }

      const answer = answers[question.id];

      if (Array.isArray(answer)) {
        return answer.length > 0;
      }

      return Boolean(answer?.trim());
    });

  const next = () => {
    if (!sectionIsValid) {
      return;
    }

    if (
      sectionIndex <
      sections.length - 1
    ) {
      setSectionIndex(
        (current) => current + 1,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    onComplete?.(answers);
  };

  const previous = () => {
    if (sectionIndex === 0) {
      return;
    }

    setSectionIndex(
      (current) => current - 1,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Assessment XONPLACE
          </span>

          <span className="text-muted-foreground">
            {sectionIndex + 1} de{" "}
            {sections.length}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-blue-600">
          Etapa {sectionIndex + 1}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {currentSection}
        </h1>
      </div>

      <div className="space-y-6">
        {questions.map((question) => {
          const answer =
            answers[question.id];

          return (
            <Card key={question.id}>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h2 className="font-semibold">
                    {question.title}
                    {question.required && (
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    )}
                  </h2>

                  {question.description && (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {question.description}
                    </p>
                  )}
                </div>

                {question.type === "text" && (
                  <Input
                    value={
                      typeof answer ===
                      "string"
                        ? answer
                        : ""
                    }
                    onChange={(event) =>
                      updateAnswer(
                        question.id,
                        event.target.value,
                      )
                    }
                  />
                )}

                {question.type ===
                  "number" && (
                  <Input
                    type="number"
                    min="0"
                    value={
                      typeof answer ===
                      "string"
                        ? answer
                        : ""
                    }
                    onChange={(event) =>
                      updateAnswer(
                        question.id,
                        event.target.value,
                      )
                    }
                  />
                )}

                {question.type ===
                  "single" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options?.map(
                      (option) => {
                        const selected =
                          answer ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              updateAnswer(
                                question.id,
                                option.value,
                              )
                            }
                            className={[
                              "rounded-xl border p-4 text-left text-sm transition",
                              selected
                                ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
                                : "hover:border-blue-300 hover:bg-muted/40",
                            ].join(" ")}
                          >
                            {option.label}
                          </button>
                        );
                      },
                    )}
                  </div>
                )}

                {question.type ===
                  "multiple" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options?.map(
                      (option) => {
                        const selected =
                          Array.isArray(
                            answer,
                          ) &&
                          answer.includes(
                            option.value,
                          );

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              toggleMultiple(
                                question.id,
                                option.value,
                              )
                            }
                            className={[
                              "rounded-xl border p-4 text-left text-sm transition",
                              selected
                                ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
                                : "hover:border-blue-300 hover:bg-muted/40",
                            ].join(" ")}
                          >
                            {option.label}
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={previous}
          disabled={sectionIndex === 0}
        >
          Anterior
        </Button>

        <Button
          type="button"
          onClick={next}
          disabled={!sectionIsValid}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {sectionIndex ===
          sections.length - 1
            ? "Generar diagnóstico"
            : "Continuar"}
        </Button>
      </div>
    </div>
  );
}