import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { PhoneShell } from "@/components/PhoneShell";
import { useCobit } from "@/lib/cobit-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cobit — Sign in" },
      {
        name: "description",
        content:
          "Sign in to Cobit with your Cardgoal account and swap Naira to USDT instantly.",
      },
      { property: "og:title", content: "Cobit — Sign in" },
      {
        property: "og:description",
        content:
          "Sign in to Cobit with your Cardgoal account and swap Naira to USDT instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { authed, loginWithCardgoal } = useCobit();
  const navigate = useNavigate();

  useEffect(() => {
    if (authed) void navigate({ to: "/home" });
  }, [authed, navigate]);

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col px-6 pb-10 pt-16">
        <div className="rise-in">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary">
            <TrendingUp className="size-7 text-primary-foreground" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
            Welcome to Cobit
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Trade crypto with ease. Connect your Cardgoal account to turn your
            Naira balance into stable USDT.
          </p>
        </div>

        <div className="rise-in mt-10 space-y-3" style={{ animationDelay: "80ms" }}>
          <div className="card-surface flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-mint text-primary">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Cardgoal balance, ready</p>
              <p className="text-xs text-muted-foreground">
                Your withdrawable Naira shows up automatically
              </p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Secure swap to USDT</p>
              <p className="text-xs text-muted-foreground">
                Recorded on both Cobit and Cardgoal
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-10">
          <button
            onClick={() => {
              loginWithCardgoal();
              void navigate({ to: "/home" });
            }}
            className="btn-press flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-display text-base font-semibold text-primary-foreground shadow-lg"
          >
            <CreditCard className="size-5" />
            Login with Cardgoal
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Demo build — balances and rates are sample data.
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}
