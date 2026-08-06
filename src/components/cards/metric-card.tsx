import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string | number;
  suffix?: string;
  description?: string;
  icon?: LucideIcon;
  tone?: "blue" | "green" | "amber" | "purple" | "slate";
};

const toneStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    accent: "text-blue-700",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    accent: "text-emerald-700",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    accent: "text-amber-700",
  },
  purple: {
    icon: "bg-violet-50 text-violet-600",
    accent: "text-violet-700",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    accent: "text-slate-900",
  },
};

export function MetricCard({
  title,
  value,
  suffix,
  description,
  icon: Icon,
  tone = "blue",
}: MetricCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p
            className={`mt-3 text-3xl font-bold tracking-tight ${styles.accent}`}
          >
            {value}

            {suffix && (
              <span className="ml-1 text-base font-semibold text-muted-foreground">
                {suffix}
              </span>
            )}
          </p>
        </div>

        {Icon && (
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>

      {description && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
