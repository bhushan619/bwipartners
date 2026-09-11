import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  ChevronRight,
  Coins,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav, PhoneShell } from "@/components/PhoneShell";
import {
  formatNaira,
  formatUsdt,
  formatDate,
  TBAY_POINTS_PER_USDT,
  useCobit,
} from "@/lib/cobit-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Cobit — Home" },
      {
        name: "description",
        content:
          "Your Cobit wallet: Cardgoal Naira balance, Tbay points and USDT, with instant swap to USDT.",
      },
      { property: "og:title", content: "Cobit — Home" },
      {
        property: "og:description",
        content:
          "Your Cobit wallet: Cardgoal Naira balance, Tbay points and USDT, with instant swap to USDT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { authed, userName, usdt, cardgoalNaira, tbayPoints, transactions, logout } =
    useCobit();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!authed) void navigate({ to: "/" });
  }, [authed, navigate]);

  const recent = transactions.slice(0, 3);

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Good day,</p>
            <h1 className="font-display text-xl font-bold">{userName}</h1>
          </div>
          <button
            onClick={() => {
              logout();
              void navigate({ to: "/" });
            }}
            className="btn-press flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        {/* USDT balance */}
        <div className="hero-balance rise-in mt-5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-80">Total USDT balance</p>
            <button
              onClick={() => setHidden((h) => !h)}
              aria-label="Toggle balance visibility"
              className="opacity-80"
            >
              {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight">
            {hidden ? "••••••" : formatUsdt(usdt)}
          </p>
          <p className="mt-1 text-xs opacity-70">
            ≈ {hidden ? "••••" : formatNaira(Math.round(usdt * 1580 * 100) / 100)}
          </p>
        </div>

        {/* Swap to USDT section */}
        <div className="mt-7">
          <h2 className="font-display text-base font-semibold">Swap to USDT</h2>
          <div className="mt-3 space-y-3">
            <div className="card-surface rise-in p-4" style={{ animationDelay: "60ms" }}>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-mint text-naira">
                  <span className="font-display text-lg font-bold">₦</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Cardgoal Naira</p>
                  <p className="truncate font-display text-lg font-bold">
                    {hidden ? "••••••" : formatNaira(cardgoalNaira)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Available to withdraw · synced from Cardgoal
                  </p>
                </div>
              </div>
              <Link
                to="/swap"
                search={{ source: "cardgoal" }}
                className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                <ArrowRightLeft className="size-4" />
                Swap to USDT
              </Link>
            </div>

            <div className="card-surface rise-in p-4" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-tbay">
                  <Coins className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Tbay points</p>
                  <p className="truncate font-display text-lg font-bold">
                    {hidden ? "••••••" : `${tbayPoints.toLocaleString()} pts`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {TBAY_POINTS_PER_USDT} pts = 1 USDT
                  </p>
                </div>
              </div>
              <Link
                to="/swap"
                search={{ source: "tbay" }}
                className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
              >
                <ArrowRightLeft className="size-4" />
                Swap to USDT
              </Link>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Recent activity</h2>
            <Link
              to="/history"
              className="flex items-center gap-0.5 text-xs font-medium text-primary"
            >
              View all <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="card-surface mt-3 divide-y divide-border">
            {recent.map((txn) => (
              <Link
                key={txn.id}
                to="/transaction/$id"
                params={{ id: txn.id }}
                className="flex items-center gap-3 p-4"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-mint text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{txn.summary}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
                </div>
                <p className="font-display text-sm font-bold text-primary">
                  +{formatUsdt(txn.usdtAmount)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
