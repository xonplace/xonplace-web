"use client";

import type {
  FormEvent,
} from "react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Mail,
  MessageCircle,
  Minus,
  X,
} from "lucide-react";

import {
  ChatMessage,
} from "./chat-message";

import {
  ChatSuggestions,
} from "./chat-suggestions";

type Message = {
  role:
    | "user"
    | "assistant";

  content: string;
};

type ChatAction =
  | {
      type:
        "collect_assessment_email";
    }
  | null;

type ChatResponse =
  | {
      success: true;

      message: {
        role:
          "assistant";

        content:
          string;
      };

      action?:
        ChatAction;
    }
  | {
      success: false;

      error:
        string;
    };

type PreAssessmentResponse =
  | {
      success: true;

      preAssessmentId:
        string;

      url:
        string;

      expiresAt:
        string;
    }
  | {
      success: false;

      error:
        string;
    };

type AssessmentHandoff = {
  url: string;
  email: string;
  expiresAt: string;
};

type AdvisorState =
  | "discovery"
  | "collecting_email"
  | "creating_preassessment"
  | "ready";

const initialMessages:
  Message[] = [
    {
      role:
        "assistant",

      content:
        "Hola, soy XONPLACE Advisor. Puedo ayudarte a entender cómo funciona XONPLACE o identificar procesos de tu empresa con potencial de automatización e Inteligencia Artificial.",
    },
  ];

function isValidEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim(),
  );
}

function maskEmail(
  email: string,
): string {
  const [
    local,
    domain,
  ] =
    email.split("@");

  if (
    !local ||
    !domain
  ) {
    return email;
  }

  const visible =
    local.slice(
      0,
      Math.min(
        1,
        local.length,
      ),
    );

  return `${visible}***@${domain}`;
}

export function XonplaceAdvisor() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(
    false,
  );

  const [
    messages,
    setMessages,
  ] =
    useState<Message[]>(
      initialMessages,
    );

  const [
    input,
    setInput,
  ] = useState("");

  const [
    advisorState,
    setAdvisorState,
  ] =
    useState<AdvisorState>(
      "discovery",
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    handoff,
    setHandoff,
  ] =
    useState<
      AssessmentHandoff | null
    >(null);

  const scrollRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const isLoading =
    advisorState ===
      "creating_preassessment";

  const isBusy =
    isLoading;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top:
        scrollRef.current
          .scrollHeight,

      behavior:
        "smooth",
    });
  }, [
    messages,
    advisorState,
    handoff,
  ]);

  /*
   * ========================================================
   * CREAR PRE-ASSESSMENT
   * ========================================================
   */

  async function createAssessmentHandoff(
    email: string,
  ) {
    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !isValidEmail(
        cleanEmail,
      )
    ) {
      setError(
        "Ingresa un correo electrónico válido.",
      );

      return;
    }

    setError(
      null,
    );

    setAdvisorState(
      "creating_preassessment",
    );

    try {
      /*
       * Importante:
       *
       * El correo NO se agrega
       * al historial enviado a la IA.
       *
       * Va directamente a nuestra
       * API de negocio.
       */
      const response =
        await fetch(
          "/api/pre-assessments",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  cleanEmail,

                messages,
              }),
          },
        );

      const data =
        (await response.json()) as
          PreAssessmentResponse;

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

      setInput("");

      setHandoff({
        url:
          data.url,

        email:
          cleanEmail,

        expiresAt:
          data.expiresAt,
      });

      setAdvisorState(
        "ready",
      );

      /*
       * Esta respuesta la genera
       * nuestra aplicación.
       *
       * No dependemos del modelo
       * para afirmar que el
       * PreAssessment fue creado.
       */
      setMessages(
        (
          current,
        ) => [
          ...current,

          {
            role:
              "assistant",

            content:
              "Perfecto. Ya preparé tu Automation Assessment con la información que recopilamos durante la conversación. Puedes continuarlo ahora y revisar los datos precargados antes de generar el diagnóstico.",
          },
        ],
      );
    } catch (
      requestError
    ) {
      console.error(
        "Error preparando Assessment:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible preparar el Assessment.",
      );

      /*
       * Si falla la creación,
       * volvemos a pedir el correo
       * para permitir reintentar.
       */
      setAdvisorState(
        "collecting_email",
      );
    }
  }

  /*
   * ========================================================
   * CONVERSACIÓN
   * ========================================================
   */

  async function sendChatMessage(
    content: string,
  ) {
    const cleanMessage =
      content.trim();

    if (
      !cleanMessage ||
      advisorState !==
        "discovery"
    ) {
      return;
    }

    setError(
      null,
    );

    const userMessage:
      Message = {
        role:
          "user",

        content:
          cleanMessage,
      };

    const conversation = [
      ...messages,
      userMessage,
    ];

    setMessages(
      conversation,
    );

    setInput("");

    try {
      const response =
        await fetch(
          "/api/chat",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                messages:
                  conversation,
              }),
          },
        );

      const data =
        (await response.json()) as
          ChatResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.success
            ? "No fue posible responder."
            : data.error,
        );
      }

      /*
       * Primero agregamos el
       * mensaje del Advisor.
       */
      setMessages(
        (
          currentMessages,
        ) => [
          ...currentMessages,

          data.message,
        ],
      );

      /*
       * Después hacemos la
       * transición de estado.
       *
       * Desde este momento
       * ningún nuevo texto irá
       * a /api/chat hasta que
       * se resuelva el email.
       */
      if (
        data.action?.type ===
        "collect_assessment_email"
      ) {
        setAdvisorState(
          "collecting_email",
        );
      }
    } catch (
      requestError
    ) {
      console.error(
        "Error XONPLACE Advisor:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible contactar al Advisor.",
      );
    }
  }

  /*
   * ========================================================
   * ROUTER DE MENSAJES
   * ========================================================
   */

  async function sendMessage(
    content: string,
  ) {
    const cleanMessage =
      content.trim();

    if (
      !cleanMessage ||
      isBusy
    ) {
      return;
    }

    /*
     * DISCOVERY
     *
     * Solo en este estado hablamos
     * con /api/chat.
     */
    if (
      advisorState ===
      "discovery"
    ) {
      await sendChatMessage(
        cleanMessage,
      );

      return;
    }

    /*
     * COLLECTING EMAIL
     *
     * El texto ya no se envía
     * al modelo.
     */
    if (
      advisorState ===
      "collecting_email"
    ) {
      await createAssessmentHandoff(
        cleanMessage,
      );

      return;
    }

    /*
     * READY
     *
     * Ya existe un Assessment.
     * No aceptamos nuevos mensajes
     * en esta V1 para evitar
     * reiniciar accidentalmente
     * el workflow.
     */
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void sendMessage(
      input,
    );
  }

  /*
   * ========================================================
   * PLACEHOLDER
   * ========================================================
   */

  function getInputPlaceholder():
    string {
    switch (
      advisorState
    ) {
      case "collecting_email":
        return "tu@empresa.cl";

      case "creating_preassessment":
        return "Preparando Assessment...";

      case "ready":
        return "Assessment preparado";

      default:
        return "Cuéntame qué quieres mejorar...";
    }
  }

  return (
    <>
      {isOpen && (
        <section className="fixed bottom-24 right-6 z-[100] flex h-[620px] max-h-[calc(100vh-8rem)] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-900/20">
          {/* HEADER */}

          <header className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <img
                src="/brand/xonplace-symbol-dark.svg"
                alt="XONPLACE"
                className="h-9 w-9"
              />

              <div>
                <p className="font-semibold">
                  XONPLACE Advisor
                </p>

                <p className="text-xs text-slate-400">
                  Automation Intelligence
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  false,
                )
              }
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar Advisor"
            >
              <X className="size-5" />
            </button>
          </header>

          {/* CONVERSACIÓN */}

          <div
            ref={
              scrollRef
            }
            className="flex-1 space-y-4 overflow-y-auto p-5"
          >
            {messages.map(
              (
                message,
                index,
              ) => (
                <ChatMessage
                  key={`${message.role}-${index}`}
                  role={
                    message.role
                  }
                  content={
                    message.content
                  }
                />
              ),
            )}

            {messages.length ===
              1 &&
              advisorState ===
                "discovery" && (
                <ChatSuggestions
                  onSelect={(
                    value,
                  ) => {
                    void sendMessage(
                      value,
                    );
                  }}
                />
              )}

            {/* SOLICITUD EMAIL */}

            {advisorState ===
              "collecting_email" && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-blue-600" />

                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Preparar Assessment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Ingresa tu correo
                      para asociar el
                      acceso al
                      Assessment que
                      prepararemos con la
                      información de esta
                      conversación.
                    </p>

                    <p className="mt-2 text-[10px] leading-4 text-blue-600">
                      En esta versión el
                      acceso se mostrará
                      inmediatamente en
                      pantalla. En la
                      siguiente fase
                      también lo
                      enviaremos por
                      correo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CREANDO */}

            {advisorState ===
              "creating_preassessment" && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="mb-2 text-xs font-medium text-slate-600">
                    Preparando tu
                    Assessment...
                  </p>

                  <div className="flex gap-1">
                    <span className="size-2 animate-pulse rounded-full bg-slate-400" />

                    <span className="size-2 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />

                    <span className="size-2 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* READY */}

            {advisorState ===
              "ready" &&
              handoff && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-emerald-900">
                        Assessment preparado
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        Acceso asociado a{" "}
                        {maskEmail(
                          handoff.email,
                        )}
                      </p>

                      <a
                        href={
                          handoff.url
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        Continuar Assessment

                        <ArrowRight className="size-4" />
                      </a>

                      <p className="mt-3 text-[10px] leading-4 text-emerald-700/80">
                        El enlace tiene
                        una vigencia
                        limitada.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* INPUT */}

          <form
            onSubmit={
              handleSubmit
            }
            className="border-t bg-white p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
              <textarea
                value={
                  input
                }
                onChange={(
                  event,
                ) =>
                  setInput(
                    event.target.value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    void sendMessage(
                      input,
                    );
                  }
                }}
                placeholder={
                  getInputPlaceholder()
                }
                rows={1}
                maxLength={
                  2000
                }
                disabled={
                  advisorState ===
                    "creating_preassessment" ||
                  advisorState ===
                    "ready"
                }
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  advisorState ===
                    "creating_preassessment" ||
                  advisorState ===
                    "ready" ||
                  !input.trim()
                }
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label={
                  advisorState ===
                    "collecting_email"
                    ? "Preparar Assessment"
                    : "Enviar mensaje"
                }
              >
                <ArrowUp className="size-5" />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
              XONPLACE Advisor puede
              cometer errores. Las
              evaluaciones deben
              validarse mediante el
              Automation Assessment.
            </p>
          </form>
        </section>
      )}

      {/* BOTÓN FLOTANTE */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (
              current,
            ) =>
              !current,
          )
        }
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-2xl shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-900"
        aria-label="Abrir XONPLACE Advisor"
      >
        <img
          src="/brand/xonplace-symbol-dark.svg"
          alt=""
          className="h-8 w-8"
        />

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold">
            XONPLACE Advisor
          </p>

          <p className="text-[10px] text-slate-400">
            {advisorState ===
            "ready"
              ? "Assessment preparado"
              : advisorState ===
                  "collecting_email"
                ? "Falta tu correo"
                : "¿Qué quieres automatizar?"}
          </p>
        </div>

        {isOpen ? (
          <Minus className="size-4 text-slate-400" />
        ) : (
          <MessageCircle className="size-4 text-blue-400" />
        )}
      </button>
    </>
  );
}