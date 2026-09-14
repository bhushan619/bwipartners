import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2, PanelsTopLeft, Smartphone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BWI Prototype — Partner Wallet Infrastructure" },
      {
        name: "description",
        content:
          "Explore the BWI user wallet, partner administration, and SaaS connection journeys.",
      },
      { property: "og:title", content: "BWI Prototype — Partner Wallet Infrastructure" },
      {
        property: "og:description",
        content:
          "Explore the BWI user wallet, partner administration, and SaaS connection journeys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrototypeHome,
});

const sections = [
  {
    to: "/user-flow" as const,
    number: "01",
    title: "User Flow",
    description: "Walk through the partner wallet, USDT swap, login and completion experience.",
    icon: Smartphone,
    label: "Mobile journey",
  },
  {
    to: "/bwi-admin" as const,
    number: "02",
    title: "BWI Admin",
    description: "Create a partner, configure rates and review partner-level operations.",
    icon: Building2,
    label: "BWI configuration",
  },
  {
    to: "/saas" as const,
    number: "03",
    title: "SaaS Business Module",
    description: "Enable BWI for matrix apps and monitor connections across the platform.",
    icon: PanelsTopLeft,
    label: "Partner-side connection",
  },
];

function PrototypeHome() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-navy text-xs font-black text-navy-foreground">BWI</span>
            <span className="font-display text-sm font-bold">Partner Wallet Infrastructure</span>
          </div>
          <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Clickable prototype</span>
        </div>
      </div>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase text-primary">Configuration, not development</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-navy sm:text-6xl">
            Connect any partner wallet to USDT.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            See how BWI creates the partner connection, how the matrix app enables it, and what users experience once it is live.
          </p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {sections.map(({ to, number, title, description, icon: Icon, label }) => (
            <Link key={to} to={to} className="group flex min-h-72 flex-col rounded-lg border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-navy/25 hover:shadow-frame">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-muted-foreground">{number}</span>
                <span className="flex size-11 items-center justify-center rounded-lg bg-navy/5 text-navy"><Icon className="size-5" /></span>
              </div>
              <div className="mt-auto">
                <p className="text-xs font-semibold text-primary">{label}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy">Open section <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3 border-l-2 border-primary pl-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">One shared connection.</span> Partner code links the BWI and SaaS configuration.
        </div>
      </section>
    </main>
  );
}
