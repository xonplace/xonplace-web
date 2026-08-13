type Suggestion = {
  label: string;
  value?: string;
  href?: string;
};

type Props = {
  onSelect: (
    value: string,
  ) => void;
};

const suggestions:
  Suggestion[] = [
    {
      label:
        "¿Qué hace XONPLACE?",
      value:
        "Quiero saber qué hace XONPLACE.",
    },

    {
      label:
        "Quiero automatizar un proceso",
      value:
        "Quiero identificar si un proceso de mi empresa se puede automatizar.",
    },

    {
      label:
        "Realizar Assessment",
      href:
        "/portal/assessment/v2",
    },
  ];

export function ChatSuggestions({
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map(
        (suggestion) => {
          if (
            suggestion.href
          ) {
            return (
              <a
                key={
                  suggestion.label
                }
                href={
                  suggestion.href
                }
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
              >
                {
                  suggestion.label
                }
              </a>
            );
          }

          return (
            <button
              key={
                suggestion.label
              }
              type="button"
              onClick={() =>
                onSelect(
                  suggestion.value ??
                    suggestion.label,
                )
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {
                suggestion.label
              }
            </button>
          );
        },
      )}
    </div>
  );
}