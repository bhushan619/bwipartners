import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { AppBar, PhoneShell } from "@/components/PhoneShell";
import { formatDate, formatNaira, formatUsdt, useCobit } from "@/lib/cobit-store";

export const Route = createFileRoute("/transaction/$id")({
  head: () => ({
    meta: [
      { title: "Cobit — Transaction details" },
      {
        name: "description",
        content: "Full details of your Cardgoal or Tbay swap to USDT.",
      },
      { property: "og:title", content: "Cobit — Transaction details" },
      {
        property: "og:description",
        content: "Full details of your Cardgoal or Tbay swap to USDT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TransactionPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold">{value}</span>
    </div>
  );
}

function TransactionPage() {
  const { id } = Route.useParams();
  const { authed, getTxn } = useCobit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authed) void navigate({ to: "/" });
  }, [authed, navigate]);

  const txn = getTxn(id);

  if (!txn) {
    return (
      <PhoneShell>
        <AppBar title="Transaction" backTo="/history" />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-muted-foreground">
            This transaction could not be found.
          </p>
          <Link
            to="/history"
            className="btn-press mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Back to history
          </Link>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <AppBar title="Transaction details" backTo="/history" />
      <div className="flex-1 px-5 pb-8 pt-6">
        <div className="text-center">
          <p className="font-display text-4xl font-bold text-primary">
            +{formatUsdt(txn.usdtAmount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{txn.summary}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-primary">
            <BadgeCheck className="size-3.5" />
            {txn.status}
          </span>
        </div>

        <div className="card-surface mt-6 divide-y divide-border px-4">
          <Row label="Source" value={txn.source} />
          {txn.nairaAmount !== null ? (
            <Row label="Amount swapped" value={formatNaira(txn.nairaAmount)} />
          ) : null}
          {txn.pointsAmount !== null ? (
            <Row label="Points swapped" value={`${txn.pointsAmount.toLocaleString()} pts`} />
          ) : null}
          <Row
            label="Rate"
            value={
              txn.kind === "naira_swap"
                ? `1 USDT = ₦${txn.rate.toLocaleString()}`
                : `1 USDT = ${txn.rate} pts`
            }
          />
          <Row label="Received" value={formatUsdt(txn.usdtAmount)} />
          <Row label="Date" value={formatDate(txn.date)} />
          <Row label="Transaction ID" value={txn.id} />
        </div>

        {txn.source === "Cardgoal" ? (
          <Link
            to="/cardgoal"
            className="btn-press mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-sm font-semibold text-secondary-foreground"
          >
            <ExternalLink className="size-4" />
            View in Cardgoal wallet
          </Link>
        ) : null}
      </div>
    </PhoneShell>
  );
}
