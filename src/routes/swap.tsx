import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, BadgeCheck, Check, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppBar, PhoneShell } from "@/components/PhoneShell";
import {
  formatNaira,
  formatUsdt,
  NAIRA_PER_USDT,
  TBAY_POINTS_PER_USDT,
  useCobit,
  type Txn,
} from "@/lib/cobit-store";

type SwapSource = "cardgoal" | "tbay";

export const Route = createFileRoute("/swap")({
  validateSearch: (search: Record<string, unknown>): { source: SwapSource } => ({
    source: search["source"] === "tbay" ? "tbay" : "cardgoal",
  }),
  head: () => ({
    meta: [
      { title: "Cobit — Swap to USDT" },
      {
        name: "description",
        content: "Swap your Cardgoal Naira or Tbay points to USDT at today's rate.",
      },
      { property: "og:title", content: "Cobit — Swap to USDT" },
      {
        property: "og:description",
        content: "Swap your Cardgoal Naira or Tbay points to USDT at today's rate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SwapPage,
});

function SwapPage() {
  const { source } = Route.useSearch();
  const {
    authed,
    cardgoalNaira,
    tbayPoints,
    swapCardgoalNaira,
    swapTbayPoints,
  } = useCobit();
  const navigate = useNavigate();

  const [rawAmount, setRawAmount] = useState("");
  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const [result, setResult] = useState<Txn | null>(null);

  useEffect(() => {
    if (!authed) void navigate({ to: "/" });
  }, [authed, navigate]);

  const isCardgoal = source === "cardgoal";
  const available = isCardgoal ? cardgoalNaira : tbayPoints;
  const rate = isCardgoal ? NAIRA_PER_USDT : TBAY_POINTS_PER_USDT;
  const unit = isCardgoal ? "₦" : "pts";
  const sourceLabel = isCardgoal ? "Cardgoal Naira" : "Tbay points";

  const amount = Number(rawAmount) || 0;
  const usdtOut = useMemo(
    () => Math.round((amount / rate) * 100) / 100,
    [amount, rate],
  );
  const valid = amount > 0 && amount <= available;

  const confirm = () => {
    if (!valid) return;
    setPhase("processing");
    window.setTimeout(() => {
      const txn = isCardgoal ? swapCardgoalNaira(amount) : swapTbayPoints(amount);
      setResult(txn);
      setPhase("done");
    }, 1400);
  };

  if (phase === "done" && result) {
    return (
      <PhoneShell>
        <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-20 text-center">
          <div className="success-pop flex size-20 items-center justify-center rounded-full bg-primary">
            <Check className="size-10 text-primary-foreground" strokeWidth={3} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Swap successful</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isCardgoal
              ? "Cardgoal Naira swapped successfully"
              : "Tbay points swapped successfully"}
          </p>
          <p className="mt-6 font-display text-4xl font-bold text-primary">
            +{formatUsdt(result.usdtAmount)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isCardgoal
              ? `${formatNaira(result.nairaAmount ?? 0)} at ₦${result.rate}/USDT`
              : `${(result.pointsAmount ?? 0).toLocaleString()} pts at ${result.rate} pts/USDT`}
          </p>
          <p className="mt-4 flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-xs font-medium text-primary">
            <BadgeCheck className="size-3.5" />
            Recorded in Cobit and shared with {result.source}
          </p>
          <div className="mt-auto w-full space-y-3 pt-10">
            <Link
              to="/transaction/$id"
              params={{ id: result.id }}
              className="btn-press block w-full rounded-2xl bg-primary py-4 font-display text-base font-semibold text-primary-foreground"
            >
              View transaction
            </Link>
            <Link
              to="/home"
              className="btn-press block w-full rounded-2xl bg-secondary py-4 text-base font-semibold text-secondary-foreground"
            >
              Back to home
            </Link>
          </div>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <AppBar title={`Swap ${sourceLabel} to USDT`} backTo="/home" />
      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        {/* From */}
        <div className="card-surface p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>You swap</span>
            <span>
              Available:{" "}
              {isCardgoal ? formatNaira(available) : `${available.toLocaleString()} pts`}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-muted-foreground">
              {unit}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={rawAmount}
              onChange={(e) => setRawAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent font-display text-3xl font-bold outline-none placeholder:text-border"
            />
            <button
              onClick={() => setRawAmount(String(available))}
              className="btn-press rounded-full bg-mint px-3 py-1 text-xs font-bold text-primary"
            >
              MAX
            </button>
          </div>
          {amount > available ? (
            <p className="mt-2 text-xs font-medium text-destructive">
              Amount exceeds your available {sourceLabel} balance.
            </p>
          ) : null}
        </div>

        <div className="my-3 flex justify-center">
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
            <ArrowDown className="size-4 text-primary" />
          </div>
        </div>

        {/* To */}
        <div className="card-surface p-4">
          <p className="text-xs text-muted-foreground">You receive</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">
            {usdtOut.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDT
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>
            Rate: {isCardgoal ? `1 USDT = ₦${rate.toLocaleString()}` : `1 USDT = ${rate} pts`}
            . A successful swap is recorded in your Cobit history and shared with{" "}
            {isCardgoal ? "Cardgoal" : "Tbay"} so it appears in your transaction history there
            too.
          </p>
        </div>

        <div className="mt-auto pt-8">
          <button
            onClick={confirm}
            disabled={!valid || phase === "processing"}
            className="btn-press w-full rounded-2xl bg-primary py-4 font-display text-base font-semibold text-primary-foreground disabled:opacity-40"
          >
            {phase === "processing" ? "Processing swap…" : "Confirm swap"}
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}
