import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown, ChevronRight, FileClock, Gauge, Pencil, Save, Settings2, ShieldAlert, WalletCards } from "lucide-react";
import { useState } from "react";
import { AdminShell, Button } from "@/components/BwiUi";
import { useBwi, type PartnerConfig } from "@/lib/bwi-store";

export const Route = createFileRoute("/bwi-admin")({
  head: () => ({ meta: [
    { title: "Partner Management — BWI Admin" },
    { name: "description", content: "Create partner connections, configure rates, and review partner transactions in BWI Admin." },
    { property: "og:title", content: "Partner Management — BWI Admin" },
    { property: "og:description", content: "Configure matrix app partners and their operational controls without a code deployment." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: BwiAdmin,
});

type View = "add" | "rates" | "transactions" | "withdrawals" | "risk";
const inputClass = "mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";

function BwiAdmin() {
  const { partner, savePartner } = useBwi();
  const [view, setView] = useState<View>("add");
  const [form, setForm] = useState<PartnerConfig>(partner);
  const [saved, setSaved] = useState(false);
  const [rates, setRates] = useState([
    ["Max exchanges per user / day", "100"], ["Min amount per exchange", "5"], ["Max amount per exchange (0 = unlimited)", "0"],
    ["Source currency (out)", partner.currency || "[CCY]"], ["Target currency (in)", "USDT"], ["Currency ↔ USDT discount ratio", "1.14"], ["Points ↔ currency ratio", "6.36"],
  ]);
  const [editing, setEditing] = useState<number | null>(null);
  const name = partner.name || "[Partner]";

  const submit = () => {
    savePartner({ ...form, name: form.name || "[Partner]", currency: form.currency || "[CCY]" });
    setRates((current) => current.map((row, index) => index === 3 ? [row[0] ?? "Source currency (out)", form.currency || "[CCY]"] : row));
    setSaved(true);
    setView("rates");
  };

  return <AdminShell product="BWI Admin">
    <div className="mx-auto flex max-w-[1500px]">
      <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-card p-4 lg:block">
        <Link to="/" className="mb-5 block px-3 text-xs font-semibold text-muted-foreground hover:text-foreground">← Prototype home</Link>
        <p className="px-3 text-[10px] font-bold uppercase text-muted-foreground">Accounts</p>
        <button onClick={() => setView("add")} className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold hover:bg-muted"><Settings2 className="size-4" /> Partner Management</button>
        <div className="mt-2 rounded-lg bg-navy/5 p-2">
          <p className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-navy"><ChevronDown className="size-3.5" /> {name} transactions</p>
          {([['transactions','Transaction History',FileClock],['rates','Rates Management',Gauge],['withdrawals','Withdrawal Management',WalletCards],['risk','Risk Management',ShieldAlert]] as const).map(([id,label,Icon]) => <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium ${view === id ? 'bg-card text-navy shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><Icon className="size-3.5" />{label}</button>)}
        </div>
      </aside>
      <section className="min-w-0 flex-1 px-5 py-7 lg:px-10 lg:py-9">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Accounts</span><ChevronRight className="size-3" /><span>{view === 'add' ? 'Partner Management / Add Partner' : `${name} transactions`}</span>{view !== 'add' && <><ChevronRight className="size-3" /><span className="font-semibold text-foreground">{viewLabel(view)}</span></>}</div>
        {saved && view === 'rates' && <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/25 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="size-5 text-primary" /> Partner created — Rates, admin views and report filter provisioned</div>}
        {view === 'add' && <AddPartner form={form} setForm={setForm} onSave={submit} />}
        {view === 'rates' && <Rates name={name} rates={rates} setRates={setRates} editing={editing} setEditing={setEditing} />}
        {view === 'transactions' && <Transactions name={name} currency={partner.currency || '[CCY]'} />}
        {view === 'withdrawals' && <PlaceholderView title="Withdrawal Management" icon={<WalletCards className="size-6" />} text={`Review and approve ${name} withdrawal requests from this provisioned view.`} />}
        {view === 'risk' && <PlaceholderView title="Risk Management" icon={<ShieldAlert className="size-6" />} text={`Set transaction thresholds and monitoring rules for ${name}.`} />}
      </section>
    </div>
  </AdminShell>;
}

function AddPartner({ form, setForm, onSave }: { form: PartnerConfig; setForm: (form: PartnerConfig) => void; onSave: () => void }) {
  const field = (key: keyof Pick<PartnerConfig, 'name'|'code'|'currency'|'brandingLabel'>, label: string, placeholder: string) => <label className="block"><span className="text-sm font-semibold">{label}</span><input value={String(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputClass} placeholder={placeholder} /></label>;
  return <div className="max-w-3xl"><h1 className="font-display text-3xl font-extrabold text-navy">Add Partner</h1><p className="mt-2 text-sm text-muted-foreground">Create a new matrix app connection — no code or database change</p><div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card"><div className="grid gap-6 sm:grid-cols-2">{field('name','Partner name','New Partner App')}{field('code','Partner code','e.g. NP')}{field('currency','Local currency','e.g. NGN / GHS')}{field('brandingLabel','Branding label','Name shown to users')}</div><div className="mt-7 flex items-center justify-between border-t border-border pt-6"><div><p className="text-sm font-semibold">Status</p><p className="text-xs text-muted-foreground">Allow this partner to use BWI</p></div><button onClick={() => setForm({ ...form, enabled: !form.enabled })} aria-label="Toggle partner status" className={`relative h-7 w-12 rounded-full transition-colors ${form.enabled ? 'bg-primary' : 'bg-border'}`}><span className={`absolute top-1 size-5 rounded-full bg-card shadow transition-transform ${form.enabled ? 'left-6' : 'left-1'}`} /></button></div></div><div className="mt-6 flex gap-3"><Button onClick={onSave}><Save className="size-4" />Save Partner</Button><Button variant="outline" onClick={() => setForm({ name:'[Partner]', code:'', currency:'[CCY]', brandingLabel:'[Partner]', enabled:true })}>Cancel</Button></div></div>;
}

function Rates({ name, rates, setRates, editing, setEditing }: { name:string; rates:string[][]; setRates:(rates:string[][])=>void; editing:number|null; setEditing:(index:number|null)=>void }) {
  return <div><h1 className="font-display text-3xl font-extrabold text-navy">Rates Management — {name}</h1><p className="mt-2 text-sm text-muted-foreground">Control exchange limits and conversion parameters for this partner.</p><div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr><th className="px-5 py-3 font-semibold">Parameter Name</th><th className="px-5 py-3 font-semibold">Value</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-border">{rates.map(([label = "Parameter",value = ""],index)=><tr key={label}><td className="px-5 py-4 text-muted-foreground">{label}</td><td className="px-5 py-4 font-semibold">{editing === index ? <input autoFocus value={value} onChange={(e)=>setRates(rates.map((row,rowIndex)=>rowIndex===index?[row[0] ?? "Parameter",e.target.value]:row))} className="h-9 w-44 rounded-md border border-input px-3 outline-none focus:border-navy" /> : value}</td><td className="px-5 py-4 text-right"><Button variant="ghost" onClick={()=>setEditing(editing===index?null:index)} className="min-h-8 px-3"><Pencil className="size-3.5" />{editing===index?'Save':'Edit'}</Button></td></tr>)}</tbody></table></div><p className="mt-5 border-l-2 border-primary pl-3 text-xs text-muted-foreground">Per-partner config — adding a partner is an admin action, no code deploy</p></div>;
}

function Transactions({ name, currency }: { name:string; currency:string }) {
  const rows = [['BW-84019','u_1048',`10,000 ${currency}`,'7.14 USDT','Completed','14 Sep, 05:24'],['BW-84018','u_2071',`24,500 ${currency}`,'17.50 USDT','Completed','14 Sep, 04:52'],['BW-84017','u_8820',`7,000 ${currency}`,'5.00 USDT','Processing','14 Sep, 04:20'],['BW-84016','u_4459',`35,000 ${currency}`,'25.00 USDT','Completed','13 Sep, 22:09']];
  return <div><h1 className="font-display text-3xl font-extrabold text-navy">{name} Transaction History</h1><p className="mt-2 text-sm text-muted-foreground">All wallet swaps initiated through this partner connection.</p><div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr>{['Order No.','User','Amount','USDT equivalent','Status','Time'].map(x=><th key={x} className="px-4 py-3 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={cell} className={`px-4 py-4 ${index===0?'font-semibold text-navy':'text-muted-foreground'}`}>{index===4?<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cell==='Completed'?'bg-accent text-accent-foreground':'bg-warning text-warning-foreground'}`}>{cell}</span>:cell}</td>)}</tr>)}</tbody></table></div></div>;
}

function PlaceholderView({ title, icon, text }: { title:string; icon:React.ReactNode; text:string }) { return <div><h1 className="font-display text-3xl font-extrabold text-navy">{title}</h1><div className="mt-8 flex max-w-2xl items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-card"><span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">{icon}</span><div><h2 className="font-display text-lg font-bold">Provisioned automatically</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></div></div>; }
function viewLabel(view: View) { return ({ add:'Add Partner', rates:'Rates Management', transactions:'Transaction History', withdrawals:'Withdrawal Management', risk:'Risk Management' } as const)[view]; }