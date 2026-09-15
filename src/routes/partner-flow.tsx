import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Eye, Home, ReceiptText, RefreshCw, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, MobileFrame } from "@/components/BwiUi";
import { FirstSwapModal } from "@/components/FirstSwapModal";
import { useBwi } from "@/lib/bwi-store";

export const Route = createFileRoute("/partner-flow")({
  head: () => ({
    meta: [
      { title: "Partner App Wallet Flow — BWI" },
      { name: "description", content: "Explore the partner wallet experience before a local-currency withdrawal continues in BWI." },
      { property: "og:title", content: "Partner App Wallet Flow — BWI" },
      { property: "og:description", content: "See the partner balance, withdrawal entry point, and linked transaction status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerFlow,
});

const records = [
  { label: "Wallet funding", date: "14 Sep, 11:25 AM", amount: "+ 5,453.24", positive: true },
  { label: "Wallet funding", date: "13 Sep, 04:12 PM", amount: "+ 2,800.00", positive: true },
  { label: "Naira swapped successfully", date: "12 Sep, 02:30 PM", amount: "− 10,000.00", positive: false },
];

function PartnerFlow() {
  const { partner } = useBwi();
  const [showStatus, setShowStatus] = useState(false);
  const [showFirstSwap, setShowFirstSwap] = useState(false);
  const partnerName = partner.brandingLabel || partner.name || "[Partner]";
  const currency = partner.currency || "[CCY]";

  useEffect(() => {
    const timer = setTimeout(() => setShowFirstSwap(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileFrame>
      <header className="flex h-16 items-center justify-between px-5">
        <Link to="/" aria-label="Back to prototype home" className="flex size-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="size-5" /></Link>
        <p className="font-display text-sm font-extrabold text-navy">{partnerName}</p>
        <button aria-label="Show balance" className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><Eye className="size-4" /></button>
      </header>

      <section className="relative flex flex-1 flex-col px-5 pb-4 pt-3">
        <h1 className="font-display text-2xl font-extrabold text-navy">Wallet</h1>
        <Link to="/user-flow" className="mt-5 flex items-center gap-3 rounded-xl bg-bwi-blue p-4 text-bwi-blue-foreground shadow-card">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bwi-blue-foreground/15"><RefreshCw className="size-5" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold">Swap Naira to USDT with BWI</span><span className="mt-1 block text-xs text-bwi-blue-foreground/75">Securely continue in your BWI wallet</span></span>
          <ArrowRight className="size-5 shrink-0" />
        </Link>
        <div className="relative mt-5 rounded-3xl bg-navy p-6 pb-5 text-navy-foreground shadow-frame after:absolute after:-bottom-2 after:left-3 after:right-3 after:-z-10 after:h-12 after:rounded-b-3xl after:bg-primary">
          <div className="flex items-center justify-between text-sm text-navy-foreground/70"><span>Available Balance</span><Eye className="size-4" /></div>
          <div className="mt-3 flex items-end gap-2"><span className="font-display text-4xl font-extrabold">86,762</span><span className="mb-1 text-sm font-semibold">{currency}</span></div>
          <div className="mt-7 flex justify-end">
            <Link to="/user-flow" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"><WalletCards className="size-4" />Withdraw</Link>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between"><h2 className="font-display text-base font-bold">Transaction Records</h2><button className="text-xs font-semibold text-muted-foreground">View all</button></div>
        <div className="mt-3 divide-y divide-border">
          {records.map((record) => (
            <button key={`${record.label}-${record.date}`} onClick={() => !record.positive && setShowStatus(true)} className="flex w-full items-center gap-3 py-4 text-left">
              <span className={`flex size-10 items-center justify-center rounded-full ${record.positive ? "bg-accent text-primary" : "bg-navy text-navy-foreground"}`}><WalletCards className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{record.label}</span><span className="mt-1 block text-xs text-muted-foreground">{record.date}</span></span>
              <span className={`text-sm font-bold ${record.positive ? "text-navy" : "text-destructive"}`}>{record.amount} {currency}</span>
              {!record.positive && <ChevronRight className="size-4 text-muted-foreground" />}
            </button>
          ))}
        </div>

        <nav className="mt-auto grid grid-cols-3 border-t border-border pt-3 text-[11px] font-semibold text-muted-foreground">
          <span className="flex flex-col items-center gap-1 text-navy"><Home className="size-5" />Home</span>
          <span className="flex flex-col items-center gap-1"><ReceiptText className="size-5" />Transactions</span>
          <span className="flex flex-col items-center gap-1"><WalletCards className="size-5" />Wallet</span>
        </nav>
      </section>

      {showStatus && (
        <div className="absolute inset-0 z-20 flex items-end bg-foreground/45">
          <div className="w-full rounded-t-3xl bg-background p-6 shadow-frame">
            <div className="flex items-start justify-between"><div><p className="text-sm font-semibold">Transaction Status</p><p className="mt-1 flex items-center gap-1 text-lg font-bold text-primary"><Check className="size-4" />Successful</p></div><Button variant="ghost" aria-label="Close transaction status" onClick={() => setShowStatus(false)} className="size-9 min-h-0 p-0"><X className="size-5" /></Button></div>
            <div className="mt-6 flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-navy text-xs font-black text-navy-foreground">BWI</span><div><p className="text-sm font-bold">Naira swapped successfully</p><p className="mt-1 text-xs text-muted-foreground">12 Sep, 02:30 PM</p></div></div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5"><div><p className="text-xs text-muted-foreground">Swapped amount</p><p className="mt-1 font-bold text-destructive">− 10,000 {currency}</p></div><Link to="/user-flow" className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold text-navy-foreground">Open BWI</Link></div>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}