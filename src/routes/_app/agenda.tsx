import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Field, Input, Pill } from "@/components/ui";
import {
  BLOCK_KINDS,
  eventKindLabel,
  type EventKind,
} from "@/lib/types";
import { formatDay, todayIsoClient, usePos, weekDates } from "@/lib/store";

export const Route = createFileRoute("/_app/agenda")({ component: Agenda });

type Slot = "bloco" | "compromisso";

function formatDayLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const text = new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Agenda() {
  const events = usePos((s) => s.events);
  const addEvent = usePos((s) => s.addEvent);
  const removeEvent = usePos((s) => s.removeEvent);
  const today = todayIsoClient();
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i * 7);
    return weekDates(d);
  });

  const [slot, setSlot] = useState<Slot>("bloco");
  const [blockKind, setBlockKind] = useState<EventKind>("codigo");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (slot === "compromisso") {
      if (!title.trim()) return;
      addEvent({
        title: title.trim(),
        date,
        start,
        end,
        kind: "compromisso",
        notes,
      });
    } else {
      addEvent({
        title: eventKindLabel(blockKind),
        date,
        start,
        end,
        kind: blockKind,
        notes,
      });
    }
    setSlot("bloco");
    setBlockKind("codigo");
    setTitle("");
    setDate(today);
    setStart("09:00");
    setEnd("10:00");
    setNotes("");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Agenda da semana</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Agende seu compromisso ou programe uma sessão de Time Blocking
        </p>
      </header>

      <Card>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="O que agendar">
            <select
              className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
              value={slot}
              onChange={(e) => setSlot(e.target.value as Slot)}
            >
              <option value="bloco">Time blocking</option>
              <option value="compromisso">Compromisso</option>
            </select>
          </Field>
          {slot === "bloco" ? (
            <Field label="Tipo do bloco">
              <select
                className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
                value={blockKind}
                onChange={(e) => setBlockKind(e.target.value as EventKind)}
              >
                {BLOCK_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Compromisso">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Reunião, dentista, compromisso pessoal…"
              />
            </Field>
          )}
          <Field label="Dia">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Início">
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Fim">
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
          <Field label="Descrição">
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={slot === "bloco" ? "Intenção do bloco" : "Onde, com quem"}
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit">Agendar</Button>
          </div>
        </form>
      </Card>

      <p className="text-sm text-muted">Deslize para a esquerda para ver as próximas semanas.</p>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:-mx-8 sm:px-8">
        <div className="flex gap-6">
          {weeks.map((week) => (
            <section
              key={week[0]}
              className="min-w-[min(100%,52rem)] shrink-0 snap-start"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                {formatDayLong(week[0])} – {formatDayLong(week[6])}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
                {week.map((d) => {
                  const list = events
                    .filter((e) => e.date === d)
                    .sort((a, b) => a.start.localeCompare(b.start));
                  const isToday = d === today;
                  return (
                    <Card
                      key={d}
                      className={`p-4 ${isToday ? "border-forest bg-leaf/40" : ""}`}
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        {formatDay(d)}
                      </p>
                      <ul className="mt-3 grid gap-2">
                        {list.length === 0 ? (
                          <li className="text-xs text-subtle">Livre</li>
                        ) : (
                          list.map((e) => (
                            <li key={e.id} className="rounded-md border border-line bg-surface p-2">
                              <p className="text-xs font-medium leading-snug">{e.title}</p>
                              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-1">
                                  <Pill>{e.start}</Pill>
                                  <Pill tone={e.kind === "compromisso" ? "sand" : "forest"}>
                                    {e.kind === "compromisso" ? "Compromisso" : "Bloco"}
                                  </Pill>
                                </div>
                                <button
                                  type="button"
                                  className="text-[11px] text-clay"
                                  onClick={() => removeEvent(e.id)}
                                >
                                  Tirar
                                </button>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
