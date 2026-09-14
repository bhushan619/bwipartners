import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown, ChevronRight, FileClock, Gauge, Pencil, Plus, Save, Settings2, ShieldAlert, WalletCards, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AdminShell, Button } from "@/components/BwiUi";
import { useBwi, type PartnerConfig } from "@/lib/bwi-store";

export const Route = createFileRoute("/bwi-admin")({
  head: () => ({ meta: [
    { title: "Partner Configurations — BWI Admin" },
    { name: "description", content: "Add partners, configure exchange parameters, and review partner operations in BWI Admin." },
    { property: "og:title", content: "Partner Configurations — BWI Admin" },
    { property: "og:description", content: "Manage matrix app partners and operational controls without a code deployment." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: BwiAdmin,
});

type View = "configurations" | "transactions" | "withdrawals" | "risk";
const inputClass = "mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";

function BwiAdmin() {
  const { partner, savePartner } = useBwi();
  const [view, setView] = useState<View>("configurations");
  const [form, setForm] = useState<PartnerConfig>(partner);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rates, setRates] = useState<string[][]>([
    ["Max exchanges per user / day", "100"], ["Min amount per exchange", "5"], ["Max amount per exchange (0 = unlimited)", "0"],
    ["Source currency (out)", partner.currency || "[CCY]"], ["Target currency (in)", "USDT"], ["Currency ↔ USDT discount ratio", "1.14"], ["Points ↔ currency ratio", "6.36"],
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const name = partner.name || "[Partner]";

  const openModal = () => {
    setForm(partner);
    setModalOpen(true);
  };
  const submit = () => {
    const nextPartner = { ...form, name: form.name || "[Partner]", currency: form.currency || "[CCY]" };
    savePartner(nextPartner);
    setRates((current) => current.map((row, index) => index === 3 ? [row[0] ?? "Source currency (out)", nextPartner.currency] : row));
    setSaved(true);
    setModalOpen(false);
    setView("configurations");
  };

  return (
    <AdminShell product="BWI Admin">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 bg-navy p-4 text-navy-foreground lg:block">
          <Link to="/" className="mb-6 block px-3 text-xs font-semibold text-navy-foreground/60 hover:text-navy-foreground">← Prototype home</Link>
          <p className="px-3 text-[10px] font-bold uppercase text-navy-foreground/45">Accounts Management</p>
          <Button variant="ghost" onClick={() => setView("configurations")} className={`mt-2 w-full justify-start ${view === "configurations" ? "bg-bwi-blue text-bwi-blue-foreground hover:bg-bwi-blue" : "text-navy-foreground/75 hover:bg-navy-foreground/10 hover:text-navy-foreground"}`}><Settings2 className="size-4" />Partner Configurations</Button>
          <div className="mt-3 border-t border-navy-foreground/10 pt-3">
            <p className="flex items-center gap-2 px-3 py-2 text-xs font-bold"><ChevronDown className="size-3.5" />{name} transactions</p>
            {([["transactions", "Transaction History", FileClock], ["withdrawals", "Withdrawal Management", WalletCards], ["risk", "Risk Management", ShieldAlert]] as const).map(([id, label, Icon]) => <Button key={id} variant="ghost" onClick={() => setView(id)} className={`w-full justify-start px-3 text-xs ${view === id ? "bg-navy-foreground/10 text-navy-foreground" : "text-navy-foreground/60 hover:bg-navy-foreground/10 hover:text-navy-foreground"}`}><Icon className="size-3.5" />{label}</Button>)}
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-7 lg:px-10 lg:py-9">
          <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Accounts Management</span><ChevronRight className="size-3" /><span>Asset Exchange</span><ChevronRight className="size-3" /><span className="font-semibold text-foreground">{viewLabel(view)}</span></div>
          {saved && view === "configurations" && <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/25 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="size-5 text-primary" />Partner created — configuration and admin views provisioned</div>}
          {view === "configurations" && <PartnerConfigurations name={name} rates={rates} setRates={setRates} editing={editing} setEditing={setEditing} onAddPartner={openModal} />}
          {view === "transactions" && <Transactions name={name} currency={partner.currency || "[CCY]"} />}
          {view === "withdrawals" && <PlaceholderView title="Withdrawal Management" icon={<WalletCards className="size-6" />} text={`Review and approve ${name} withdrawal requests from this provisioned view.`} />}
          {view === "risk" && <PlaceholderView title="Risk Management" icon={<ShieldAlert className="size-6" />} text={`Set transaction thresholds and monitoring rules for ${name}.`} />}
        </section>
      </div>
      {modalOpen && <AddPartnerModal form={form} setForm={setForm} onSave={submit} onClose={() => setModalOpen(false)} />}
    </AdminShell>
  );
}

function AddPartnerModal({ form, setForm, onSave, onClose }: { form: PartnerConfig; setForm: (form: PartnerConfig) => void; onSave: () => void; onClose: () => void }) {
  const field = (key: keyof Pick<PartnerConfig, "name" | "code" | "currency" | "brandingLabel">, label: string, placeholder: string) => <label className="block"><span className="text-sm font-semibold">{label}</span><input value={String(form[key])} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className={inputClass} placeholder={placeholder} /></label>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="add-partner-title" className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-frame"><div className="flex items-start justify-between border-b border-border px-6 py-5"><div><h2 id="add-partner-title" className="font-display text-xl font-extrabold text-navy">Add Partner</h2><p className="mt-1 text-sm text-muted-foreground">Create a matrix app connection without a code or database change.</p></div><Button variant="ghost" onClick={onClose} aria-label="Close add partner" className="size-9 min-h-0 p-0"><X className="size-5" /></Button></div><div className="grid gap-5 p-6 sm:grid-cols-2">{field("name", "Partner name", "New Partner App")}{field("code", "Partner code", "e.g. NP")}{field("currency", "Local currency", "e.g. NGN / GHS")}{field("brandingLabel", "Branding label", "Name shown to users")}<div className="flex items-center justify-between border-t border-border pt-5 sm:col-span-2"><div><p className="text-sm font-semibold">Status</p><p className="text-xs text-muted-foreground">Allow this partner to use BWI</p></div><Button variant={form.enabled ? "primary" : "outline"} onClick={() => setForm({ ...form, enabled: !form.enabled })} aria-pressed={form.enabled} className="min-w-24">{form.enabled ? "Enabled" : "Disabled"}</Button></div></div><div className="flex justify-end gap-3 border-t border-border px-6 py-4"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave}><Save className="size-4" />Save Partner</Button></div></div></div>;
}

function PartnerConfigurations({ name, rates, setRates, editing, setEditing, onAddPartner }: { name: string; rates: string[][]; setRates: (rates: string[][]) => void; editing: number | null; setEditing: (index: number | null) => void; onAddPartner: () => void }) {
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-extrabold text-navy">Partner Configurations</h1><p className="mt-2 text-sm text-muted-foreground">Manage exchange rates, limits, and access for {name}.</p></div><Button onClick={onAddPartner}><Plus className="size-4" />Add Partner</Button></div><div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr><th className="px-5 py-3 font-semibold">Parameter Name</th><th className="px-5 py-3 font-semibold">Value</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-border">{rates.map(([label = "Parameter", value = ""], index) => <tr key={label}><td className="px-5 py-4 text-muted-foreground">{label}</td><td className="px-5 py-4 font-semibold">{editing === index ? <input autoFocus value={value} onChange={(event) => setRates(rates.map((row, rowIndex) => rowIndex === index ? [row[0] ?? "Parameter", event.target.value] : row))} className="h-9 w-44 rounded-md border border-input px-3 outline-none focus:border-navy" /> : value}</td><td className="px-5 py-4 text-right"><Button variant="ghost" onClick={() => setEditing(editing === index ? null : index)} className="min-h-8 px-3"><Pencil className="size-3.5" />{editing === index ? "Save" : "Edit"}</Button></td></tr>)}</tbody></table></div><p className="mt-5 border-l-2 border-primary pl-3 text-xs text-muted-foreground">Per-partner config — adding a partner is an admin action, no code deploy.</p></div>;
}

function Transactions({ name, currency }: { name: string; currency: string }) {
  const rows = [["BW-84019", "u_1048", `10,000 ${currency}`, "7.14 USDT", "Completed", "14 Sep, 05:24"], ["BW-84018", "u_2071", `24,500 ${currency}`, "17.50 USDT", "Completed", "14 Sep, 04:52"], ["BW-84017", "u_8820", `7,000 ${currency}`, "5.00 USDT", "Processing", "14 Sep, 04:20"], ["BW-84016", "u_4459", `35,000 ${currency}`, "25.00 USDT", "Completed", "13 Sep, 22:09"]];
  return <div><h1 className="font-display text-3xl font-extrabold text-navy">{name} Transaction History</h1><p className="mt-2 text-sm text-muted-foreground">All wallet swaps initiated through this partner connection.</p><div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr>{["Order No.", "User", "Amount", "USDT equivalent", "Status", "Time"].map((label) => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-4 py-4 ${index === 0 ? "font-semibold text-navy" : "text-muted-foreground"}`}>{index === 4 ? <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cell === "Completed" ? "bg-accent text-accent-foreground" : "bg-warning text-warning-foreground"}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></div>;
}

function PlaceholderView({ title, icon, text }: { title: string; icon: ReactNode; text: string }) { return <div><h1 className="font-display text-3xl font-extrabold text-navy">{title}</h1><div className="mt-8 flex max-w-2xl items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-card"><span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">{icon}</span><div><h2 className="font-display text-lg font-bold">Provisioned automatically</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></div></div>; }
function viewLabel(view: View) { return ({ configurations: "Partner Configurations", transactions: "Transaction History", withdrawals: "Withdrawal Management", risk: "Risk Management" } as const)[view]; }