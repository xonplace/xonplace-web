"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type FormState = {
  name: string;
  company: string;
  email: string;
  employees: string;
  processName: string;
};

type ApiResponse =
  | {
      success: true;
      assessmentUrl: string;
      clientEmailSent: boolean;
      internalEmailSent: boolean;
    }
  | {
      success: false;
      error: string;
    };

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  employees: "",
  processName: "",
};

export function AssessmentRequestForm() {
  const [
    form,
    setForm,
  ] = useState<FormState>(
    initialState,
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    success,
    setSuccess,
  ] =
    useState<{
      url: string;
      clientEmailSent: boolean;
    } | null>(null);

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/assessment-request",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                form,
              ),
          },
        );

      const data =
        (await response.json()) as
          ApiResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.success
            ? "No fue posible preparar el Assessment."
            : data.error,
        );
      }

      setSuccess({
        url:
          data.assessmentUrl,

        clientEmailSent:
          data.clientEmailSent,
      });

      setForm(
        initialState,
      );
    } catch (
      requestError
    ) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible procesar la solicitud.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-left shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-6 text-emerald-600" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Tu Automation Assessment está listo
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {success.clientEmailSent
                ? "También enviamos el acceso a tu correo para que puedas retomarlo cuando quieras."
                : "El Assessment fue preparado correctamente. Puedes continuarlo ahora desde el botón inferior."}
            </p>

            <a
              href={
                success.url
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Continuar Assessment

              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={
            form.name
          }
          onChange={(
            event,
          ) =>
            updateField(
              "name",
              event.target
                .value,
            )
          }
          placeholder="Nombre"
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <input
          required
          value={
            form.company
          }
          onChange={(
            event,
          ) =>
            updateField(
              "company",
              event.target
                .value,
            )
          }
          placeholder="Empresa"
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <input
          required
          type="email"
          value={
            form.email
          }
          onChange={(
            event,
          ) =>
            updateField(
              "email",
              event.target
                .value,
            )
          }
          placeholder="Correo"
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <select
          required
          value={
            form.employees
          }
          onChange={(
            event,
          ) =>
            updateField(
              "employees",
              event.target
                .value,
            )
          }
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        >
          <option value="">
            Tamaño de la empresa
          </option>

          <option value="1-20">
            1–20 personas
          </option>

          <option value="21-50">
            21–50 personas
          </option>

          <option value="51-200">
            51–200 personas
          </option>

          <option value="201-500">
            201–500 personas
          </option>

          <option value="500+">
            Más de 500 personas
          </option>
        </select>
      </div>

      <input
        value={
          form.processName
        }
        onChange={(
          event,
        ) =>
          updateField(
            "processName",
            event.target
              .value,
          )
        }
        placeholder="¿Qué proceso le gustaría automatizar? (opcional)"
        className="mt-4 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting
        }
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Preparando Assessment...
          </>
        ) : (
          <>
            Solicitar Automation Assessment
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Recibirás un acceso seguro para continuar tu Automation Assessment.
      </p>
    </form>
  );
}