import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, Bell, Bitcoin, Check, ChevronRight, CircleDollarSign, Eye, EyeOff, Gem, Home, LockKeyhole, Mail, ReceiptText, RefreshCw, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, MobileFrame } from "@/components/BwiUi";
import { FirstSwapModal } from "@/components/FirstSwapModal";
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
  const [showFirstSwap, setShowFirstSwap] = useState(false);
  const [firstSwapHandled, setFirstSwapHandled] = useState(false);
  const partnerName = partner.name || "[Partner]";
  const currency = partner.currency || "Naira";
  const received = amount ? (Number(amount) / 1400).toFixed(2) : "0.00";

  useEffect(() => {
    if (screen !== "home" || firstSwapHandled) return;
    const timer = setTimeout(() => setShowFirstSwap(true), 800);
    return () => clearTimeout(timer);
  }, [screen, firstSwapHandled]);

  const dismissFirstSwap = () => {
    setShowFirstSwap(false);
    setFirstSwapHandled(true);
  };

  const startFirstSwap = () => {
    dismissFirstSwap();
    setScreen("swap");
  };

  if (screen === "login") {
    return (
      <MobileFrame>
        <section className="relative flex flex-1 flex-col bg-login-surface px-5 pb-6 pt-5 sm:px-6">
          <Link to="/partner-flow" aria-label="Back to partner wallet" className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card"><ArrowLeft className="size-5" /></Link>
          <div className="mx-auto mt-10 flex items-center font-display text-[42px] font-extrabold leading-none text-login-navy" aria-label="BWI"><span>B</span><span className="relative mx-0.5 size-9 rounded-full border-[7px] border-login-cyan border-r-login-blue" /><span>WI</span></div>
          <h1 className="mt-4 text-center font-display text-[22px] font-extrabold text-login-navy">Welcome Back to Sign in</h1>
          <p className="mx-auto mt-1 max-w-[320px] text-center text-sm leading-5 text-muted-foreground">Your account is protected with encrypted login and advanced authentication.</p>

          <form className="mt-7" onSubmit={(event) => { event.preventDefault(); setScreen("home"); }}>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-login-navy">Email</span><span className="relative block"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-login-blue focus:ring-2 focus:ring-login-blue/15" placeholder="Enter your email" /></span></label>
            <label className="mt-5 block"><span className="mb-2 block text-xs font-semibold text-login-navy">Password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type={showPassword ? "text" : "password"} className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-12 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-login-blue focus:ring-2 focus:ring-login-blue/15" placeholder="Enter Password" /><Button type="button" variant="ghost" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 size-9 min-h-0 -translate-y-1/2 p-0" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></span></label>
            <div className="mt-2 flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="checkbox" className="size-4 rounded border-input accent-login-blue" />Remember me</label><Button type="button" variant="ghost" className="min-h-0 p-0 text-[11px] text-login-blue hover:bg-transparent hover:text-login-navy">Forgot Password?</Button></div>
            <Button type="submit" className="mt-5 w-full bg-login-blue py-3.5 text-login-blue-foreground shadow-login-button hover:bg-login-blue/90">Login</Button>
          </form>

          <div className="relative my-7 flex items-center"><span className="h-px flex-1 bg-border" /><span className="px-3 text-[11px] text-muted-foreground">Link your partner account</span><span className="h-px flex-1 bg-border" /></div>
          <div className="space-y-3"><Button variant="navy" onClick={() => setScreen("home")} className="w-full py-3.5"><span className="grid grid-cols-2 gap-0.5"><i className="size-2.5 rounded-sm bg-login-cyan" /><i className="size-2.5 rounded-sm bg-card" /><i className="size-2.5 rounded-sm bg-card" /><i className="size-2.5 rounded-sm bg-login-cyan" /></span>CardGoal</Button><Button onClick={() => setScreen("home")} className="w-full bg-login-partner py-3.5 text-login-blue-foreground hover:bg-login-partner/90"><span className="font-display text-xl font-black">M</span>CardMax</Button></div>
          <p className="mt-5 text-center text-xs text-login-navy">Don’t have an account? <Button type="button" variant="ghost" className="inline min-h-0 p-0 text-xs text-login-blue hover:bg-transparent">Sign up</Button></p>
          <p className="mt-auto pt-5 text-center text-[11px] text-muted-foreground"><Button type="button" variant="ghost" className="inline min-h-0 p-0 text-[11px] text-login-blue hover:bg-transparent">Terms &amp; Conditions</Button> and <Button type="button" variant="ghost" className="inline min-h-0 p-0 text-[11px] text-login-blue hover:bg-transparent">Privacy Policy</Button></p>
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
        <FirstSwapModal
          partnerName={partnerName}
          currency={currency}
          isOpen={showFirstSwap}
          onSwap={startFirstSwap}
          onDismiss={dismissFirstSwap}
        />
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