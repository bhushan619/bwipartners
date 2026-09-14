import { Link } from "@tanstack/react-router";
import { ArrowLeft, Boxes, LayoutDashboard, Settings2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "navy" | "outline" | "ghost";
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    navy: "bg-navy text-navy-foreground hover:bg-navy/92",
    outline: "border border-border bg-card text-foreground hover:bg-muted",
    ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  };
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function BackLink({ to = "/", label = "Back" }: { to?: "/"; label?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-muted px-4 py-6 sm:py-10">
      <div className="relative mx-auto flex min-h-[760px] w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-frame">
        {children}
      </div>
    </main>
  );
}

export function AdminHeader({ product }: { product: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-navy/15 bg-navy px-5 text-navy-foreground lg:px-8">
      <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
          BWI
        </span>
        {product}
      </Link>
      <div className="flex items-center gap-2 text-xs font-medium text-navy-foreground/70">
        <span className="size-2 rounded-full bg-primary" /> Prototype environment
      </div>
    </header>
  );
}

export function AdminShell({
  product,
  children,
}: {
  product: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted">
      <AdminHeader product={product} />
      {children}
    </main>
  );
}

export const adminNavIcons = { Boxes, LayoutDashboard, Settings2 };