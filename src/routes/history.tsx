import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { AppBar, BottomNav, PhoneShell } from "@/components/PhoneShell";
import { formatDate, formatUsdt, useCobit } from "@/lib/cobit-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Cobit — USDT history" },
      {
        name: "description",
        content: "All your USDT swaps from Cardgoal Naira and Tbay points in Cobit.",
      },
      { property: "og:title", content: "Cobit — USDT history" },
      {
        property: "og:description",
        content: "All your USDT swaps from Cardgoal Naira and Tbay points in Cobit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { authed, transactions } = useCobit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authed) void navigate({ to: "/" });
  }, [authed, navigate]);

  return (
    <PhoneShell>
      <AppBar title="USDT history" backTo="/home" />
      <div className="flex-1 px-5 pb-6 pt-4">
        {transactions.length === 0 ? (
          <div className="card-surface mt-6 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No swaps yet — swap Naira or points to see them here.
            </p>
          </div>
        ) : (
          <div className="card-surface divide-y divide-border">
            {transactions.map((txn) => (
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
                  <p className="text-xs text-muted-foreground">
                    {formatDate(txn.date)} · {txn.source}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-display text-sm font-bold text-primary">
                    +{formatUsdt(txn.usdtAmount)}
                  </p>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
