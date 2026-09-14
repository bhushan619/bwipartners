import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, Check, Eye, Headphones, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
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
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState("10000");
  const partnerName = partner.name || "[Partner]";
  const currency = partner.currency || "[CCY]";
  const received = amount ? (Number(amount) / 1400).toFixed(2) : "0.00";

  return (
    <MobileFrame>
      <header className="bg-bwi-blue px-5 pb-7 pt-5 text-bwi-blue-foreground">
        <div className="flex items-center justify-between">
          {step === 1 ? <Link to="/partner-flow" aria-label="Back to partner wallet" className="flex size-9 items-center justify-center rounded-full hover:bg-bwi-blue-foreground/10"><ArrowLeft className="size-5" /></Link> : <Button variant="ghost" onClick={() => setStep((value) => Math.max(1, value - 1))} aria-label="Previous step" className="size-9 min-h-0 p-0 text-bwi-blue-foreground hover:bg-bwi-blue-foreground/10 hover:text-bwi-blue-foreground"><ArrowLeft className="size-5" /></Button>}
          <span className="text-sm font-bold">Swap</span><span className="w-9 text-right text-xs font-semibold text-bwi-blue-foreground/75">{step}/4</span>
        </div>
        <h1 className="mt-5 font-display text-2xl font-extrabold">{step === 2 ? `Swap ${currency} to USDT` : step === 3 ? "Secure sign in" : step === 4 ? "Transaction complete" : "Swap to USDT"}</h1>
        <p className="mt-1 text-xs text-bwi-blue-foreground/75">{partnerName} × BWI</p>
      </header>

      {step === 1 && (
        <section className="flex flex-1 flex-col bg-muted px-4 pb-6 pt-4">
          <div className="rounded-xl border-l-2 border-primary bg-card p-4 shadow-card"><div className="flex gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary"><ShieldCheck className="size-5" /></span><div><p className="text-xs font-bold text-primary">Your funds are protected</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your {currency} stays in your {partnerName} wallet until you confirm. BWI only receives converted USDT.</p></div></div></div>
          <h2 className="mt-6 font-display text-base font-bold">How it works</h2>
          <div className="mt-4 space-y-5">{[["1","Enter an amount","See the live rate and exact USDT before you commit."],["2","Confirm the swap",`${currency} is only debited after you confirm.`],["3","USDT lands in BWI","Usually within 2 minutes, with a record in both apps."]].map(([number,title,text]) => <div key={number} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-navy">{number}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}</div>
          <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-card p-4 shadow-card"><LockKeyhole className="size-5 text-bwi-blue" /><p className="mt-3 text-xs font-bold">Your protection</p><p className="mt-1 text-[11px] text-muted-foreground">Custody and reversals</p></div><div className="rounded-xl bg-card p-4 shadow-card"><Headphones className="size-5 text-bwi-blue" /><p className="mt-3 text-xs font-bold">Live support</p><p className="mt-1 text-[11px] text-muted-foreground">Help when needed</p></div></div>
          <Button onClick={() => setStep(2)} className="mt-auto w-full bg-bwi-blue py-3.5 text-bwi-blue-foreground hover:bg-bwi-blue/90">Swap securely</Button>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">By continuing you agree to the BWI swap terms</p>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-1 flex-col bg-muted px-4 pb-6 pt-5">
          <div className="rounded-2xl bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">You swap</span><span className="font-medium text-navy">Balance 86,762 {currency}</span></div><div className="mt-3 flex items-center gap-3"><input aria-label="Swap amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))} className="h-12 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 font-display text-xl font-bold outline-none focus:border-bwi-blue focus:ring-2 focus:ring-bwi-blue/10" /><span className="text-sm font-bold text-navy">{currency}</span></div><label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" className="size-4 rounded border-input accent-primary" />Use full balance</label></div>
          <div className="relative flex h-12 items-center justify-center"><span className="absolute flex size-12 items-center justify-center rounded-full border-4 border-muted bg-secondary text-bwi-blue"><RefreshCw className="size-5" /></span></div>
          <div className="rounded-2xl bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">You receive</span><span className="font-medium text-navy">1 USDT = 1,400 {currency}</span></div><div className="mt-3 flex items-center justify-between rounded-lg border border-input bg-background px-3 py-3"><span className="font-display text-xl font-bold text-muted-foreground">{received}</span><span className="text-sm font-bold text-navy">USDT</span></div></div>
          <p className="mt-4 rounded-xl bg-card px-4 py-3 text-xs text-muted-foreground">Fee 1.50 USDT · Final amount shown before confirmation</p>
          <div className="mt-6"><h2 className="font-display text-base font-bold">Recent swaps</h2><div className="mt-3 space-y-3">{["220", "850"].map((value) => <div key={value} className="flex items-center rounded-xl bg-card p-4 shadow-card"><div className="min-w-0 flex-1"><p className="text-sm font-bold">{value} {currency}</p><p className="mt-1 text-[11px] text-muted-foreground">12 Sep, 11:10 AM</p></div><ArrowDown className="size-4 -rotate-90 text-muted-foreground" /><p className="ml-4 text-sm font-bold">{(Number(value)/1400).toFixed(2)} <span className="font-normal text-muted-foreground">USDT</span></p></div>)}</div></div>
          <Button onClick={() => setStep(3)} disabled={!amount || Number(amount) <= 0} className="mt-auto w-full bg-bwi-blue py-3.5 text-bwi-blue-foreground hover:bg-bwi-blue/90">Continue</Button>
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-9"><span className="flex size-12 items-center justify-center rounded-xl bg-bwi-blue/10 text-bwi-blue"><LockKeyhole className="size-6" /></span><h2 className="mt-6 font-display text-2xl font-extrabold text-navy">Log in to continue</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use your {partnerName} account — no new signup.</p><div className="mt-8 space-y-4"><label className="block"><span className="mb-2 block text-xs font-bold">{partnerName} username / email</span><input className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-bwi-blue" placeholder="name@example.com" /></label><label className="block"><span className="mb-2 block text-xs font-bold">Password</span><span className="relative block"><input type={showPassword ? "text" : "password"} className="h-12 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none focus:border-bwi-blue" placeholder="Enter password" /><Button variant="ghost" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 size-9 min-h-0 -translate-y-1/2 p-0" aria-label="Toggle password visibility"><Eye className="size-4" /></Button></span></label></div><Button onClick={() => setStep(4)} className="mt-auto w-full bg-bwi-blue py-3.5 text-bwi-blue-foreground hover:bg-bwi-blue/90">Login with {partnerName}</Button></section>
      )}

      {step === 4 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-12"><div className="success-pop mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-10" strokeWidth={2.5} /></div><h2 className="mt-6 text-center font-display text-3xl font-extrabold text-navy">Complete</h2><p className="mt-2 text-center text-sm text-muted-foreground">Your USDT withdrawal was completed successfully.</p><div className="mt-9 divide-y divide-border rounded-xl border border-border bg-card px-5 shadow-card">{[["Network","USDT-TRC20"],["Amount",`${received} USDT`],["To address","TXxxx…xxxx"]].map(([label,value]) => <div key={label} className="flex items-center justify-between py-4"><span className="text-sm text-muted-foreground">{label}</span><span className="text-sm font-bold text-navy">{value}</span></div>)}</div><Link to="/partner-flow" className="mt-auto flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">Done</Link></section>
      )}
    </MobileFrame>
  );
}