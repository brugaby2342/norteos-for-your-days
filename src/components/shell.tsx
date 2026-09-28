import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquareText,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { usePos } from "@/lib/store";
import { Button, cx } from "./ui";

const NAV = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/foco", label: "Foco", icon: Timer },
  { to: "/frentes", label: "Segundo cérebro", icon: Brain },
  { to: "/ia", label: "Copiloto", icon: Sparkles },
  { to: "/comunicacao", label: "Mensagens", icon: MessageSquareText },
] as const;

export function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      setArmed(false);
      return;
    }
    const arm = window.setTimeout(() => setArmed(true), 280);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function toggleMenu(e: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  }

  const menu = open
    ? createPortal(
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Fechar menu"
            className={cx(
              "absolute inset-0 z-0 bg-ink/40",
              armed ? "pointer-events-auto" : "pointer-events-none",
            )}
            onPointerDown={(e) => {
              if (!armed) return;
              e.preventDefault();
              setOpen(false);
            }}
          />
          <aside
            id="app-menu"
            className="relative z-[90] flex h-full w-[min(18rem,86vw)] flex-col bg-bg-warm px-4 py-6 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <Brand />
              <button
                type="button"
                aria-label="Fechar menu"
                className="grid size-11 place-items-center rounded-md border border-line bg-surface"
                onPointerDown={toggleMenu}
              >
                <X className="pointer-events-none size-5" />
              </button>
            </div>
            <Nav pathname={pathname} />
            <MenuFoot />
          </aside>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="relative isolate min-h-dvh bg-bg text-ink">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 z-[40] hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-bg-warm/60 px-4 py-6 md:flex">
          <Brand />
          <Nav pathname={pathname} />
          <MenuFoot />
        </aside>

        <div className="relative min-w-0 flex-1">
          <header className="sticky top-0 z-[40] flex items-center justify-between border-b border-line bg-bg/95 px-4 py-3 md:hidden">
            <Brand compact />
            <button
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="app-menu"
              className="relative z-[90] grid size-11 shrink-0 place-items-center rounded-md border border-line bg-surface"
              onPointerDown={toggleMenu}
            >
              {open ? (
                <X className="pointer-events-none size-5" />
              ) : (
                <Menu className="pointer-events-none size-5" />
              )}
            </button>
          </header>

          {menu}

          <main className="relative z-0 px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={cx(
        "flex items-baseline gap-2 px-2 no-underline",
        compact ? "mb-0" : "mb-6",
      )}
    >
      <span className="pointer-events-none font-display text-xl tracking-tight text-forest">
        Norte
      </span>
      <span className="pointer-events-none text-xs uppercase tracking-[0.18em] text-subtle">
        OS
      </span>
      {compact ? null : (
        <span className="sr-only">Sistema operacional pessoal para transição de carreira</span>
      )}
    </Link>
  );
}

function Nav({ pathname }: { pathname: string }) {
  return (
    <nav className="relative z-10 grid gap-1">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cx(
              "relative z-10 flex min-h-11 items-center gap-3 rounded-md px-3 text-sm no-underline transition-colors duration-150",
              active
                ? "bg-forest text-surface"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            <Icon className="pointer-events-none size-4 shrink-0" strokeWidth={1.75} />
            <span className="pointer-events-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MenuFoot() {
  const profile = usePos((s) => s.profile);
  const demoOn = usePos((s) => s.demoOn);
  const clearData = usePos((s) => s.clearData);
  const loadDemo = usePos((s) => s.loadDemo);
  return (
    <div className="mt-auto grid gap-3 px-2 pt-6">
      <p className="text-xs leading-relaxed text-subtle">
        {profile.name}
        <span className="block">Estudante em transição de carreira</span>
      </p>
      <Button
        type="button"
        tone="ghost"
        className="w-full text-xs"
        onClick={demoOn ? clearData : loadDemo}
      >
        {demoOn ? "Limpar dados" : "Gerar dados de teste"}
      </Button>
    </div>
  );
}
