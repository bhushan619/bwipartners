import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Home, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background shadow-xl">
        {children}
      </div>
    </div>
  );
}

export function AppBar({
  title,
  backTo,
  right,
}: {
  title: string;
  backTo?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur">
      {backTo ? (
        <Link
          to={backTo}
          className="btn-press -ml-1 flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" />
        </Link>
      ) : null}
      <h1 className="font-display text-lg font-semibold">{title}</h1>
      <div className="ml-auto">{right}</div>
    </header>
  );
}

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/history", label: "History", icon: Clock3 },
  { to: "/cardgoal", label: "Cardgoal", icon: Wallet },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-10 mt-auto border-t border-border bg-background/95 px-6 pb-4 pt-2 backdrop-blur">
      <div className="flex items-center justify-between">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`btn-press flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
