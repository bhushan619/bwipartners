import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CheckCircle2, ChevronRight, ImageIcon, Pencil, Plus, Save, Settings2, Upload, X } from "lucide-react";
import { useState } from "react";
import { AdminShell, Button } from "@/components/BwiUi";
import { useBwi, type PartnerConfig } from "@/lib/bwi-store";

export const Route = createFileRoute("/bwi-admin")({
  head: () => ({ meta: [
    { title: "Partner Configurations — BWI Admin" },
    { name: "description", content: "Manage BWI partner exchange rates, withdrawal limits, and access." },
    { property: "og:title", content: "Partner Configurations — BWI Admin" },
    { property: "og:description", content: "Configure matrix app partners and their exchange settings in one workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: BwiAdmin,
});

interface ExchangeRow {
  id: number;
  appName: string;
  pair: string;
  marketRate: string;
  userRate: string;
  minimum: string;
  maximum: string;
  dailyLimit: string;
  displayOrder: string;
  enabled: boolean;
}

const initialRows: ExchangeRow[] = [
  { id: 3, appName: "Cardmax", pair: "USDT/NGN", marketRate: "1 USDT = 1,324.71984816", userRate: "1 USDT = 1,368.00000000", minimum: "3,000", maximum: "1,000,000", dailyLimit: "100", displayOrder: "1", enabled: true },
  { id: 2, appName: "Cardgoal", pair: "USDT/NGN", marketRate: "1 USDT = 1,324.71984816", userRate: "1 USDT = 1,368.00000000", minimum: "3,000", maximum: "1,000,000", dailyLimit: "100", displayOrder: "2", enabled: true },
  { id: 1, appName: "Tbay", pair: "USDT/Point", marketRate: "1 USDT = 0.83246073", userRate: "1 USDT = 0.70000000", minimum: "10", maximum: "1,000", dailyLimit: "100", displayOrder: "3", enabled: true },
];

const inputClass = "mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10";

const rateHistory = [
  { date: "2026-09-09", time: "15:01:44", changedBy: "Tommy", oldRate: "1370.0000", newRate: "1368.0000", marketPrice: "1321.9288", ipAddress: "115.204.133.217" },
  { date: "2026-09-09", time: "15:01:37", changedBy: "Tommy", oldRate: "1370.0000", newRate: "1368.0000", marketPrice: "1321.9288", ipAddress: "115.204.133.217" },
  { date: "2026-09-05", time: "13:05:41", changedBy: "Tommy", oldRate: "1374.0000", newRate: "1370.0000", marketPrice: "1321.9265", ipAddress: "222.252.48.115" },
  { date: "2026-09-05", time: "13:05:34", changedBy: "Tommy", oldRate: "1374.0000", newRate: "1370.0000", marketPrice: "1321.9265", ipAddress: "222.252.48.115" },
  { date: "2026-09-03", time: "13:36:52", changedBy: "Tommy", oldRate: "1377.0000", newRate: "1374.0000", marketPrice: "1327.9419", ipAddress: "222.252.48.115" },
];

function BwiAdmin() {
  const { partner, savePartner } = useBwi();
  const [form, setForm] = useState<PartnerConfig>(partner);
  const [rows, setRows] = useState(initialRows);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingRow, setEditingRow] = useState<ExchangeRow | null>(null);

  const openModal = () => {
    setForm({ name: "", code: "", currency: "NGN", brandingLabel: "", enabled: true, logo: "", loginUrl: "", displayOrder: String(rows.length + 1) });
    setModalOpen(true);
  };

  const submit = () => {
    const nextPartner = {
      ...form,
      name: form.name.trim() || "[Partner]",
      currency: form.currency.trim() || "Naira",
    };
    savePartner(nextPartner);
    setRows((current) => [
      {
        id: Math.max(0, ...current.map((row) => row.id)) + 1,
        appName: nextPartner.name,
        pair: `USDT/${nextPartner.currency}`,
        marketRate: "1 USDT = 1,324.71984816",
        userRate: "1 USDT = 1,368.00000000",
        minimum: "3,000",
        maximum: "1,000,000",
        dailyLimit: "100",
        displayOrder: nextPartner.displayOrder || String(current.length + 1),
        enabled: nextPartner.enabled,
      },
      ...current,
    ]);
    setSaved(true);
    setModalOpen(false);
  };

  const saveEditedRow = () => {
    if (!editingRow) return;
    setRows((current) => current.map((row) => row.id === editingRow.id ? editingRow : row));
    setEditingRow(null);
  };

  return (
    <AdminShell product="BWI Admin">
      <div className="mx-auto flex max-w-[1700px]">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 bg-navy p-4 text-navy-foreground lg:block">
          <Link to="/" className="mb-7 block px-3 text-xs font-semibold text-navy-foreground/60 hover:text-navy-foreground">← Prototype home</Link>
          <p className="px-3 text-[10px] font-bold uppercase text-navy-foreground/45">Accounts Management</p>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-bwi-blue px-3 py-3 text-sm font-semibold text-bwi-blue-foreground"><Settings2 className="size-4" />Partner Configurations</div>
        </aside>

        <section className="min-w-0 flex-1 bg-muted px-5 py-7 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Accounts Management</span><ChevronRight className="size-3" /><span>Asset Exchange</span><ChevronRight className="size-3" /><span className="font-semibold text-foreground">Partner Configurations</span></div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="font-display text-3xl font-extrabold text-navy">Partner Configurations</h1><p className="mt-2 text-sm text-muted-foreground">Manage exchange rates, withdrawal limits, and partner access.</p></div>
            <Button onClick={openModal}><Plus className="size-4" />Add Partner</Button>
          </div>
          {saved && <div className="mt-5 flex items-center gap-3 rounded-lg border border-primary/25 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="size-5 text-primary" />Partner created and added to configurations</div>}

          <div className="mt-7 overflow-x-auto border border-border bg-card shadow-card">
            <table className="w-full min-w-[1180px] text-left text-xs">
              <thead className="border-b border-border bg-muted/60"><tr>{["Serial Number", "App Name", "Exchange Pair", "Market Rate", "User Rate", "Min Withdrawal Amount", "Max Withdrawal Amount", "Max Daily Withdrawals", "Status", "Actions"].map((label) => <th key={label} className="whitespace-nowrap px-4 py-4 font-semibold text-foreground">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">{rows.map((row) => <tr key={row.id} className="hover:bg-muted/35"><td className="px-4 py-4">{row.id}</td><td className="px-4 py-4 font-semibold text-navy">{row.appName}</td><td className="px-4 py-4">{row.pair}</td><td className="whitespace-nowrap px-4 py-4">{row.marketRate}</td><td className="whitespace-nowrap px-4 py-4">{row.userRate}</td><td className="px-4 py-4">{row.minimum}</td><td className="px-4 py-4">{row.maximum}</td><td className="px-4 py-4">{row.dailyLimit}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${row.enabled ? "bg-accent text-accent-foreground" : "bg-warning text-warning-foreground"}`}>{row.enabled && <Check className="size-3" />}{row.enabled ? "Publish" : "Disabled"}</span></td><td className="px-4 py-4"><Button variant="ghost" onClick={() => setEditingRow({ ...row })} className="min-h-8 px-3"><Pencil className="size-3.5" />Edit</Button></td></tr>)}</tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><p>Per-partner configuration — no code deployment required.</p><p>1–{rows.length} of {rows.length} items</p></div>
        </section>
      </div>
      {modalOpen && <AddPartnerModal form={form} setForm={setForm} onSave={submit} onClose={() => setModalOpen(false)} />}
      {editingRow && <EditConfigurationModal row={editingRow} setRow={setEditingRow} onSave={saveEditedRow} onClose={() => setEditingRow(null)} />}
    </AdminShell>
  );
}

function EditConfigurationModal({ row, setRow, onSave, onClose }: { row: ExchangeRow; setRow: (row: ExchangeRow) => void; onSave: () => void; onClose: () => void }) {
  const update = (key: keyof ExchangeRow, value: string | boolean) => setRow({ ...row, [key]: value });
  const numericField = (key: "minimum" | "maximum" | "dailyLimit" | "userRate", label: string, value: string) => <label className="block"><span className="text-sm"><span className="mr-1 text-destructive">*</span>{label}</span><input aria-label={label} value={value.replace("1 USDT = ", "").replaceAll(",", "")} onChange={(event) => update(key, key === "userRate" ? `1 USDT = ${event.target.value}` : event.target.value)} className={inputClass} inputMode="decimal" /></label>;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="edit-configuration-title" className="flex max-h-[calc(100vh-2rem)] w-full max-w-[1280px] flex-col overflow-hidden rounded-md border border-border bg-card shadow-frame"><div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6"><h2 id="edit-configuration-title" className="font-display text-lg font-semibold">Edit {row.appName}</h2><Button variant="ghost" onClick={onClose} aria-label="Close edit configuration" className="size-9 min-h-0 p-0"><X className="size-5" /></Button></div><div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[420px_minmax(0,1fr)]"><div className="space-y-7 border-b border-border p-6 lg:border-b-0 lg:border-r"><div><p className="text-sm font-medium">Current Market Rate</p><p className="mt-3 text-sm">{row.marketRate} {row.pair.split("/")[1]}</p></div>{numericField("minimum", "Min Withdrawal Amount", row.minimum)}{numericField("maximum", "Max Withdrawal Amount", row.maximum)}{numericField("dailyLimit", "Max Daily Withdrawals", row.dailyLimit)}<div>{numericField("userRate", "User Exchange Rate", row.userRate)}<p className="mt-2 text-sm text-muted-foreground">Allowed Rate Range: ±20%</p></div><div><p className="text-sm">Status</p><button type="button" role="switch" aria-checked={row.enabled} aria-label="Configuration status" onClick={() => update("enabled", !row.enabled)} className={`mt-4 flex h-6 w-12 items-center rounded-full p-0.5 transition-colors ${row.enabled ? "bg-bwi-blue justify-end" : "bg-border justify-start"}`}><span className="size-5 rounded-full bg-card shadow-card" /></button></div></div><div className="min-w-0 p-6"><h3 className="font-display text-lg font-bold">Rate Change History</h3><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted"><tr>{["Date/Time", "Changed By", "Old Rate", "New Rate", "Market Price at Change", "IP Address"].map((heading) => <th key={heading} className="px-3 py-4 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{rateHistory.map((history, index) => <tr key={`${history.date}-${history.time}-${index}`}><td className="px-3 py-4"><span className="block">{history.date}</span><span className="mt-1 block">{history.time}</span></td><td className="px-3 py-4">{history.changedBy}</td><td className="px-3 py-4">{history.oldRate}</td><td className="px-3 py-4">{history.newRate}</td><td className="px-3 py-4">{history.marketPrice}</td><td className="px-3 py-4">{history.ipAddress}</td></tr>)}</tbody></table></div></div></div><div className="flex shrink-0 justify-end gap-3 border-t border-border px-6 py-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave}><Save className="size-4" />Save</Button></div></div></div>;
}

function AddPartnerModal({ form, setForm, onSave, onClose }: { form: PartnerConfig; setForm: (form: PartnerConfig) => void; onSave: () => void; onClose: () => void }) {
  const field = (key: keyof Pick<PartnerConfig, "name" | "code" | "brandingLabel" | "loginUrl">, label: string, placeholder: string) => <label className="block"><span className="text-sm font-semibold">{label}</span><input value={String(form[key])} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className={inputClass} placeholder={placeholder} /></label>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="add-partner-title" className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-frame"><div className="flex items-start justify-between border-b border-border px-6 py-5"><div><h2 id="add-partner-title" className="font-display text-xl font-extrabold text-navy">Add Partner</h2><p className="mt-1 text-sm text-muted-foreground">Create a new partner exchange configuration.</p></div><Button variant="ghost" onClick={onClose} aria-label="Close add partner" className="size-9 min-h-0 p-0"><X className="size-5" /></Button></div><div className="grid gap-5 p-6 sm:grid-cols-2"><div className="sm:col-span-2"><p className="text-sm font-semibold">Upload Partner Logo</p><div className="mt-2 flex items-center gap-4">{form.logo ? <img src={form.logo} alt="Partner logo preview" className="size-14 rounded-lg border border-border object-cover" /> : <div className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted"><ImageIcon className="size-5 text-muted-foreground" /></div>}<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"><Upload className="size-4" />Choose file<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setForm({ ...form, logo: URL.createObjectURL(file) }); }} /></label></div></div>{field("name", "Partner name", "New Partner App")}{field("code", "Partner code", "e.g. NP")}{field("loginUrl", "Partner Login URL", "https://partner.example.com/login")}{field("brandingLabel", "Branding label", "Name shown to users")}<div className="flex items-center justify-between border-t border-border pt-5 sm:col-span-2"><div><p className="text-sm font-semibold">Status</p><p className="text-xs text-muted-foreground">Publish this partner configuration</p></div><Button variant={form.enabled ? "primary" : "outline"} onClick={() => setForm({ ...form, enabled: !form.enabled })} aria-pressed={form.enabled} className="min-w-24">{form.enabled ? "Enabled" : "Disabled"}</Button></div></div><div className="flex justify-end gap-3 border-t border-border px-6 py-4"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave}><Save className="size-4" />Save Partner</Button></div></div></div>;
}