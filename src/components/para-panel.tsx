import { ExternalLink } from "lucide-react";
import { DRIVE_HOME, PARA_WHERE } from "@/lib/para";
import { Card } from "./ui";

export function DriveHint() {
  return (
    <Card className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="grid gap-1">
        <p className="text-sm leading-relaxed text-muted">
          As pastas PARA estão no Drive pessoal, com suas respectivas subpastas. No app NorteOS a
          divisão é para notas em casos específicos.
        </p>
      </div>
      <a
        href={DRIVE_HOME}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-ink no-underline hover:bg-bg-warm"
      >
        Abrir meu Drive
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </Card>
  );
}

export function WhereGuide() {
  return (
    <ul className="grid gap-1 text-xs text-subtle">
      {PARA_WHERE.map((row) => (
        <li key={row.kind}>
          <span className="font-medium text-muted">{row.kind}:</span> {row.place}
        </li>
      ))}
    </ul>
  );
}
