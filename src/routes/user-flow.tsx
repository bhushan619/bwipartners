import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, Bell, Bitcoin, Check, ChevronRight, CircleDollarSign, Eye, Gem, Home, LockKeyhole, ReceiptText, RefreshCw, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button, MobileFrame } from "@/components/BwiUi";
import { useBwi } from "@/lib/bwi-store";

export const Route = createFileRoute("/user-flow")({
  head: () => ({
    meta: [
      { title: "BWI Swap Flow — Wallet to USDT" },
      { name: "description", content: "Walk through BWI protection, local-currency swap, partner authentication, and USDT completion." },
      { property: "og:title", content: "BWI Swap Flow — Wallet to USDT" },
      { property: "og:description", content: "Experience the secure BWI local-currency to USDT journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BwiUserFlow,
});

function BwiUserFlow() {
  const { partner } = useBwi();
  const [screen, setScreen] = useState<"login" | "home" | "swap" | "complete">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState("10000");
  const partnerName = partner.name || "[Partner]";
  const currency = partner.currency || "[CCY]";
  const received = amount ? (Number(amount) / 1400).toFixed(2) : "0.00";

  if (screen === "login") {
    return (
      <MobileFrame>
        <section className="flex flex-1 flex-col px-6 pb-8 pt-6">
          <Link to="/partner-flow" aria-label="Back to partner wallet" className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"><ArrowLeft className="size-5" /></Link>
          <div className="mt-12 flex size-14 items-center justify-center rounded-xl bg-bwi-blue font-display text-sm font-black text-bwi-blue-foreground">BWI</div>
          <h1 className="mt-7 font-display text-3xl font-extrabold text-navy">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Log in to manage your wallet and swap to USDT.</p>
          <div className="mt-9 space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-bold">Email address</span><input className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-bwi-blue" placeholder="name@example.com" /></label>
            <label className="block"><span className="mb-2 block text-xs font-bold">Password</span><span className="relative block"><input type={showPassword ? "text" : "password"} className="h-12 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none focus:border-bwi-blue" placeholder="Enter password" /><Button variant="ghost" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 size-9 min-h-0 -translate-y-1/2 p-0" aria-label="Toggle password visibility"><Eye className="size-4" /></Button></span></label>
          </div>
          <button className="mt-4 self-end text-xs font-semibold text-bwi-blue">Forgot password?</button>
          <Button onClick={() => setScreen("home")} className="mt-auto w-full bg-bwi-blue py-3.5 text-bwi-blue-foreground hover:bg-bwi-blue/90">Log in to BWI</Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">Secure access for {partnerName} users</p>
        </section>
      </MobileFrame>
    );
  }

  if (screen === "home") {
    const assets = [
      { name: "Bitcoin", symbol: "BTC", available: "1,378,378.49", icon: Bitcoin, tone: "bg-warning text-warning-foreground" },
      { name: "Ethereum", symbol: "ETH", available: "4,567,473.57", icon: Gem, tone: "bg-bwi-blue/10 text-bwi-blue" },
      { name: "USDT", symbol: "USDT", available: "3,875,943.89", icon: CircleDollarSign, tone: "bg-accent text-primary" },
    ];
    return (
      <MobileFrame>
        <header className="flex items-center justify-between px-5 pb-4 pt-6">
          <div><p className="font-display text-xl font-extrabold text-navy">Hi, Jonathan</p><p className="mt-1 text-xs text-muted-foreground">Welcome to <span className="font-bold text-foreground">BWI</span></p></div>
          <Button variant="ghost" aria-label="Notifications" className="size-10 min-h-0 rounded-full bg-muted p-0"><Bell className="size-4" /></Button>
        </header>
        <section className="flex flex-1 flex-col bg-muted px-5 pb-4 pt-2">
          <div className="rounded-3xl bg-bwi-blue p-5 text-bwi-blue-foreground shadow-frame">
            <div className="flex items-center justify-between text-sm font-semibold"><span>My Wallet</span><span className="rounded-full bg-bwi-blue-foreground/15 px-3 py-1 text-[11px]">USD</span></div>
            <div className="mt-5 flex items-center justify-center gap-2"><span className="font-display text-3xl font-extrabold">8,489,489.32</span><Eye className="size-4 opacity-75" /></div>
            <p className="mt-1 text-center text-sm">≈16,389.03 {currency}</p>
            <div className="mt-5 grid grid-cols-2 gap-3"><Button onClick={() => setScreen("swap")} className="bg-bwi-blue-foreground/15 text-bwi-blue-foreground hover:bg-bwi-blue-foreground/25"><RefreshCw className="size-4" />Swap</Button><Button className="bg-bwi-blue-foreground/15 text-bwi-blue-foreground hover:bg-bwi-blue-foreground/25"><WalletCards className="size-4" />Withdraw</Button></div>
          </div>
          <button onClick={() => setScreen("swap")} className="mt-5 flex items-center rounded-xl bg-card p-4 text-left shadow-card">
            <span className="flex size-10 items-center justify-center rounded-lg bg-bwi-blue/10 text-bwi-blue"><CircleDollarSign className="size-5" /></span>
            <span className="ml-3 min-w-0 flex-1"><span className="block text-xs text-muted-foreground">Points</span><span className="block text-sm font-bold">2,345 available</span></span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-bwi-blue px-3 py-2 text-xs font-bold text-bwi-blue-foreground">Swap to USDT <ChevronRight className="size-3" /></span>
          </button>
          <div className="mt-5 rounded-xl bg-card p-4 shadow-card">
            <div className="flex items-center justify-between"><h2 className="font-display text-base font-bold">Balance</h2><ReceiptText className="size-4 text-muted-foreground" /></div>
            <div className="mt-2 divide-y divide-border">{assets.map(({ name, symbol, available, icon: Icon, tone }) => <div key={name} className="flex items-center gap-3 py-4"><span className={`flex size-9 items-center justify-center rounded-full ${tone}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{name}</p><p className="mt-1 text-[11px] text-muted-foreground">{symbol}</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">Available</p><p className="mt-1 text-xs font-bold text-navy">{available}</p></div></div>)}</div>
          </div>
          <nav className="mt-auto grid grid-cols-3 border-t border-border pt-3 text-[11px] font-semibold text-muted-foreground"><span className="flex flex-col items-center gap-1 text-bwi-blue"><Home className="size-5" />Home</span><span className="flex flex-col items-center gap-1"><ReceiptText className="size-5" />Orders</span><span className="flex flex-col items-center gap-1"><WalletCards className="size-5" />Wallet</span></nav>
        </section>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <header className="bg-bwi-blue px-5 pb-7 pt-5 text-bwi-blue-foreground">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setScreen(screen === "complete" ? "swap" : "home")} aria-label="Previous screen" className="size-9 min-h-0 p-0 text-bwi-blue-foreground hover:bg-bwi-blue-foreground/10 hover:text-bwi-blue-foreground"><ArrowLeft className="size-5" /></Button>
          <span className="text-sm font-bold">Swap</span><span className="w-9" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold">{screen === "complete" ? "Transaction complete" : `Swap ${currency} to USDT`}</h1>
        <p className="mt-1 text-xs text-bwi-blue-foreground/75">{partnerName} × BWI</p>
      </header>

      {screen === "swap" && (
        <section className="flex flex-1 flex-col bg-muted px-4 pb-6 pt-5">
          <div className="rounded-2xl bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">You swap</span><span className="font-medium text-navy">Balance 86,762 {currency}</span></div><div className="mt-3 flex items-center gap-3"><input aria-label="Swap amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))} className="h-12 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 font-display text-xl font-bold outline-none focus:border-bwi-blue focus:ring-2 focus:ring-bwi-blue/10" /><span className="text-sm font-bold text-navy">{currency}</span></div><label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" className="size-4 rounded border-input accent-primary" />Use full balance</label></div>
          <div className="relative flex h-12 items-center justify-center"><span className="absolute flex size-12 items-center justify-center rounded-full border-4 border-muted bg-secondary text-bwi-blue"><RefreshCw className="size-5" /></span></div>
          <div className="rounded-2xl bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">You receive</span><span className="font-medium text-navy">1 USDT = 1,400 {currency}</span></div><div className="mt-3 flex items-center justify-between rounded-lg border border-input bg-background px-3 py-3"><span className="font-display text-xl font-bold text-muted-foreground">{received}</span><span className="text-sm font-bold text-navy">USDT</span></div></div>
          <p className="mt-4 rounded-xl bg-card px-4 py-3 text-xs text-muted-foreground">Fee 1.50 USDT · Final amount shown before confirmation</p>
          <div className="mt-6"><h2 className="font-display text-base font-bold">Recent swaps</h2><div className="mt-3 space-y-3">{["220", "850"].map((value) => <div key={value} className="flex items-center rounded-xl bg-card p-4 shadow-card"><div className="min-w-0 flex-1"><p className="text-sm font-bold">{value} {currency}</p><p className="mt-1 text-[11px] text-muted-foreground">12 Sep, 11:10 AM</p></div><ArrowDown className="size-4 -rotate-90 text-muted-foreground" /><p className="ml-4 text-sm font-bold">{(Number(value)/1400).toFixed(2)} <span className="font-normal text-muted-foreground">USDT</span></p></div>)}</div></div>
          <Button onClick={() => setScreen("complete")} disabled={!amount || Number(amount) <= 0} className="mt-auto w-full bg-bwi-blue py-3.5 text-bwi-blue-foreground hover:bg-bwi-blue/90">Confirm swap</Button>
        </section>
      )}

      {screen === "complete" && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-12"><div className="success-pop mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-10" strokeWidth={2.5} /></div><h2 className="mt-6 text-center font-display text-3xl font-extrabold text-navy">Complete</h2><p className="mt-2 text-center text-sm text-muted-foreground">Your USDT swap was completed successfully.</p><div className="mt-9 divide-y divide-border rounded-xl border border-border bg-card px-5 shadow-card">{[["Network","USDT-TRC20"],["Amount",`${received} USDT`],["To address","TXxxx…xxxx"]].map(([label,value]) => <div key={label} className="flex items-center justify-between py-4"><span className="text-sm text-muted-foreground">{label}</span><span className="text-sm font-bold text-navy">{value}</span></div>)}</div><Button onClick={() => setScreen("home")} className="mt-auto w-full py-3.5">Done</Button></section>
      )}
    </MobileFrame>
  );
}