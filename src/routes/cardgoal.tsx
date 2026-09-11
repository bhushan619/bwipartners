import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRightLeft, ChevronRight, ExternalLink, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { AppBar, BottomNav, PhoneShell } from "@/components/PhoneShell";
import { formatDate, formatNaira, useCobit } from "@/lib/cobit-store";

export const Route = createFileRoute("/cardgoal")({
  head: () => ({
    meta: [
      { title: "Cardgoal — Wallet & transactions" },
      {
        name: "description",
        content:
          "Your Cardgoal Naira wallet, swap history and the link to your Cobit USDT account.",
      },
      { property: "og:title", content: "Cardgoal — Wallet & transactions" },
      {
        property: "og:description",
        content:
          "Your Cardgoal Naira wallet, swap history and the link to your Cobit USDT account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CardgoalPage,
});

function CardgoalPage() {
  const { authed, cardgoalNaira, transactions } = useCobit();
  const navigate = useNavigate();
  const [h5Url, setH5Url] = useState("https://h5.cobit.example/wallet");

  useEffect(() => {
    if (!authed) void navigate({ to: "/" });
  }, [authed, navigate]);

  const cardgoalTxns = transactions.filter((t) => t.source === "Cardgoal");

  return (
    <PhoneShell>
      <AppBar title="Cardgoal wallet" backTo="/home" />
      <div className="flex-1 px-5 pb-6 pt-5">
        {/* Cardgoal-branded balance card */}
        <div className="rise-in rounded-3xl bg-foreground p-5 text-background">
          <p className="text-xs opacity-70">Cardgoal Naira balance</p>
          <p className="mt-1 font-display text-3xl font-bold">
            {formatNaira(cardgoalNaira)}
          </p>
          <p className="mt-1 text-xs opacity-60">
            Withdrawable · synced with Cobit on login
          </p>
          <Link
            to="/swap"
            search={{ source: "cardgoal" }}
            className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-pop py-3 text-sm font-bold text-foreground"
          >
            <ArrowRightLeft className="size-4" />
            Swap Naira to USDT
          </Link>
        </div>

        {/* Cobit H5 link */}
        <div className="card-surface mt-5 p-4">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            <p className="text-sm font-semibold">Cobit H5 page</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            The Cobit web page opens inside Cardgoal. The URL is configured from
            the backend.
          </p>
          <input
            value={h5Url}
            onChange={(e) => setH5Url(e.target.value)}
            className="mt-3 w-full rounded-xl border border-input bg-muted px-3 py-2 text-xs outline-none focus:border-ring"
            aria-label="Cobit H5 URL (backend configurable)"
          />
          <Link
            to="/home"
            className="btn-press mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
          >
            <ExternalLink className="size-3.5" />
            Open Cobit
          </Link>
        </div>

        {/* Cardgoal transaction history */}
        <h2 className="mt-6 font-display text-base font-semibold">
          Cardgoal transactions
        </h2>
        <div className="card-surface mt-3 divide-y divide-border">
          {cardgoalTxns.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No Cardgoal transactions yet.
            </p>
          ) : (
            cardgoalTxns.map((txn) => (
              <Link
                key={txn.id}
                to="/transaction/$id"
                params={{ id: txn.id }}
                className="flex items-center gap-3 p-4"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-mint text-naira">
                  <span className="font-display text-sm font-bold">₦</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    Naira swapped successfully
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(txn.date)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-display text-sm font-bold">
                    -{formatNaira(txn.nairaAmount ?? 0)}
                  </p>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
