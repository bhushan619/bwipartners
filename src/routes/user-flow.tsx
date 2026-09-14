import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, Check, Eye, LockKeyhole, WalletCards } from "lucide-react";
import { useState } from "react";
import { Button, MobileFrame } from "@/components/BwiUi";
import { useBwi } from "@/lib/bwi-store";

export const Route = createFileRoute("/user-flow")({
  head: () => ({
    meta: [
      { title: "Partner Wallet Flow — BWI" },
      { name: "description", content: "Walk through the BWI partner wallet, USDT swap, partner login, and completion flow." },
      { property: "og:title", content: "Partner Wallet Flow — BWI" },
      { property: "og:description", content: "Experience the mobile BWI wallet-to-USDT journey for partner app users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UserFlow,
});

function UserFlow() {
  const { partner } = useBwi();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const partnerName = partner.name || "[Partner]";
  const currency = partner.currency || "[CCY]";

  return (
    <MobileFrame>
      <header className="flex h-16 items-center justify-between border-b border-border px-5">
        {step === 1 ? (
          <Link to="/" aria-label="Back to prototype home" className="flex size-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="size-5" /></Link>
        ) : (
          <button onClick={() => setStep((value) => Math.max(1, value - 1))} aria-label="Previous step" className="flex size-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="size-5" /></button>
        )}
        <div className="text-center">
          <p className="font-display text-sm font-extrabold text-navy">{partner.brandingLabel || partnerName}</p>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Powered by BWI</p>
        </div>
        <span className="w-9 text-right text-xs font-bold text-muted-foreground">{step}/4</span>
      </header>

      {step === 1 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-8">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-navy">Wallet</h1>
          <div className="mt-8 rounded-2xl bg-navy p-6 text-navy-foreground shadow-frame">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-navy-foreground/65">Available Balance</p>
                <p className="mt-3 font-display text-4xl font-extrabold">86,762</p>
                <p className="mt-1 text-sm font-semibold text-navy-foreground/70">{currency}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-lg bg-navy-foreground/10"><WalletCards className="size-5" /></span>
            </div>
            <Button onClick={() => setStep(2)} className="mt-10 w-full">Withdraw</Button>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Pending</p><p className="mt-1 font-display text-lg font-bold">0 {currency}</p></div>
            <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Wallet status</p><p className="mt-1 text-sm font-bold text-primary">Active</p></div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-8">
          <p className="text-sm text-muted-foreground">Withdraw balance</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-navy">Swap {currency} to USDT</h1>
          <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground">You swap</span><span className="text-xs text-muted-foreground">Balance 86,762</span></div>
            <div className="mt-4 flex items-end justify-between"><span className="font-display text-3xl font-extrabold">10,000</span><span className="mb-1 text-sm font-bold text-navy">{currency}</span></div>
          </div>
          <div className="flex h-14 items-center justify-center"><span className="flex size-9 items-center justify-center rounded-full border border-border bg-background"><ArrowDown className="size-4 text-navy" /></span></div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-semibold text-muted-foreground">You receive</p>
            <div className="mt-4 flex items-end justify-between"><span className="font-display text-3xl font-extrabold text-navy">7.14</span><span className="mb-1 text-sm font-bold text-navy">USDT</span></div>
          </div>
          <p className="mt-5 rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">Rate: 1 USDT = 1,400 {currency} · fee 1.50 USDT</p>
          <Button onClick={() => setStep(3)} className="mt-auto w-full py-3.5">Continue</Button>
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-10">
          <span className="flex size-12 items-center justify-center rounded-lg bg-navy/5 text-navy"><LockKeyhole className="size-6" /></span>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-navy">Log in to continue</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use your {partnerName} account — no new signup</p>
          <div className="mt-9 space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-bold">{partnerName} username / email</span><input className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10" placeholder="name@example.com" /></label>
            <label className="block"><span className="mb-2 block text-xs font-bold">Password</span><span className="relative block"><input type={showPassword ? "text" : "password"} className="h-12 w-full rounded-lg border border-input bg-background px-4 pr-12 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10" placeholder="Enter password" /><button onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password visibility"><Eye className="size-4" /></button></span></label>
          </div>
          <Button variant="navy" onClick={() => setStep(4)} className="mt-auto w-full py-3.5">Login with {partnerName}</Button>
        </section>
      )}

      {step === 4 && (
        <section className="flex flex-1 flex-col px-5 pb-7 pt-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-10" strokeWidth={2.5} /></div>
          <h1 className="mt-6 text-center font-display text-3xl font-extrabold text-navy">Complete</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Your withdrawal has been submitted successfully.</p>
          <div className="mt-9 divide-y divide-border rounded-xl border border-border bg-card px-5 shadow-card">
            {[['Network', 'USDT-TRC20'], ['Amount', '7.14 USDT'], ['To address', 'TXxxx…xxxx']].map(([label, value]) => <div key={label} className="flex items-center justify-between py-4"><span className="text-sm text-muted-foreground">{label}</span><span className="text-sm font-bold text-navy">{value}</span></div>)}
          </div>
          <Link to="/" className="mt-auto flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">Done</Link>
        </section>
      )}
    </MobileFrame>
  );
}