import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  tone = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "ghost" | "quiet" | "danger";
}) {
  const tones = {
    primary: "bg-forest text-surface hover:bg-forest-deep disabled:opacity-50",
    ghost:
      "bg-transparent text-ink border border-line hover:border-line-strong hover:bg-bg-warm",
    quiet: "bg-leaf text-forest-deep hover:bg-bg-warm",
    danger: "bg-danger text-surface hover:opacity-90",
  };
  return (
    <button
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-150",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle outline-none focus:border-forest",
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "min-h-28 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-subtle outline-none focus:border-forest",
        props.className,
      )}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cx(
        "rounded-xl border border-line bg-surface p-5 shadow-[0_1px_0_rgba(28,25,23,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "forest" | "clay" | "sand";
}) {
  const map = {
    neutral: "bg-bg-warm text-muted",
    forest: "bg-leaf text-forest-deep",
    clay: "bg-amber-soft text-clay",
    sand: "bg-bg-warm text-ink",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[tone],
      )}
    >
      {children}
    </span>
  );
}
