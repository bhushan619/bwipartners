import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ChevronRight, LayoutGrid, Link2, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminShell, Button } from "@/components/BwiUi";
import { useBwi } from "@/lib/bwi-store";

export const Route = createFileRoute("/saas")({
  head: () => ({ meta: [
    { title: "Matrix Apps — SaaS Business Module" },
    { name: "description", content: "Manage BWI connections across matrix apps from the central SaaS Business Module." },
    { property: "og:title", content: "Matrix Apps — SaaS Business Module" },
    { property: "og:description", content: "Enable and monitor reusable BWI connections across the entire matrix app platform." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: SaasModule,
});

type View = "list" | "manage" | "overview";

function SaasModule() {
  const { partner, apps, updateApp } = useBwi();
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState("new-partner");
  const selected = useMemo(() => apps.find((app) => app.id === selectedId) ?? apps[0], [apps, selectedId]);
  const [connected, setConnected] = useState(false);
  const [code, setCode] = useState("");
  const [currency, setCurrency] = useState("[CCY]");
  const [placement, setPlacement] = useState("Wallet screen");
  const [saved, setSaved] = useState(false);

  const manage = (id: string) => {
    const app = apps.find((item) => item.id === id);
    if (!app) return;
    setSelectedId(id); setConnected(app.status === "Connected"); setCode(app.partnerCode || (id === 'new-partner' ? partner.code : '')); setCurrency(app.currency); setPlacement(app.placement); setSaved(false); setView("manage");
  };
  const save = () => {
    if (!selected) return;
    updateApp(selected.id, { status: connected ? "Connected" : "Not connected", partnerCode: code, currency, placement: placement as "Wallet screen"|"Withdraw menu"|"Home" });
    setSaved(true);
  };

  return <AdminShell product="SaaS Admin — Business Module">
    <div className="border-b border-border bg-card"><div className="mx-auto flex max-w-[1500px] items-center gap-2 px-5 py-3 lg:px-10"><Link to="/" className="mr-4 text-xs font-semibold text-muted-foreground hover:text-foreground">← Prototype home</Link><button onClick={()=>setView('list')} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${view==='list'?'bg-navy/5 text-navy':'text-muted-foreground'}`}><LayoutGrid className="size-4" />Matrix Apps</button><button onClick={()=>setView('overview')} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${view==='overview'?'bg-navy/5 text-navy':'text-muted-foreground'}`}><Link2 className="size-4" />Connection overview</button></div></div>
    <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-10">
      {view === 'list' && <><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold text-primary">BUSINESS MODULE</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy">Matrix Apps</h1><p className="mt-2 text-sm text-muted-foreground">Manage each app’s connection to the shared BWI wallet infrastructure.</p></div><Button variant="outline" onClick={()=>setView('overview')}><LayoutGrid className="size-4" />Connection overview</Button></div><AppsTable apps={apps} onManage={manage} /></>}
      {view === 'manage' && selected && <div className="max-w-3xl"><button onClick={()=>setView('list')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Matrix Apps</button><h1 className="font-display text-3xl font-extrabold text-navy">Connect to BWI — {selected.name}</h1><p className="mt-2 text-sm text-muted-foreground">Configure how this matrix app connects to the BWI service.</p>{saved && <div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/25 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="size-5 text-primary" />This app is now connected to BWI</div>}<div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card"><div className="flex items-center justify-between"><div><p className="font-display text-lg font-bold text-navy">Connect to BWI</p><p className="mt-1 text-xs text-muted-foreground">Enable the shared wallet and USDT withdrawal journey.</p></div><button onClick={()=>{setConnected(v=>!v);setSaved(false)}} aria-label="Toggle BWI connection" className={`relative h-8 w-14 rounded-full transition-colors ${connected?'bg-primary':'bg-border'}`}><span className={`absolute top-1 size-6 rounded-full bg-card shadow transition-transform ${connected?'left-7':'left-1'}`} /></button></div>{connected && <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2"><Field label="BWI partner code" note={partner.code ? `BWI Admin code: ${partner.code}` : 'Must match the BWI-side code'}><input value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. NP" className="h-11 w-full rounded-lg border border-input px-3 text-sm outline-none focus:border-navy" /></Field><Field label="Local currency"><input value={currency} onChange={e=>setCurrency(e.target.value)} className="h-11 w-full rounded-lg border border-input px-3 text-sm outline-none focus:border-navy" /></Field><Field label="Wallet entry-point placement"><select value={placement} onChange={e=>setPlacement(e.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-navy"><option>Wallet screen</option><option>Withdraw menu</option><option>Home</option></select></Field><div className="flex items-end"><Button onClick={save} disabled={!code.trim()} className="w-full">Save connection</Button></div></div>}</div><p className="mt-5 border-l-2 border-primary pl-3 text-xs text-muted-foreground">Enabling is a config action — the connection component is shared across all matrix apps, built once and reused.</p></div>}
      {view === 'overview' && <Overview apps={apps} onManage={manage} />}
    </section>
  </AdminShell>;
}

function AppsTable({ apps, onManage }: { apps: ReturnType<typeof useBwi>['apps']; onManage:(id:string)=>void }) { return <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr>{['App Name','Local Currency','BWI Connection Status','Actions'].map(x=><th key={x} className="px-5 py-3 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{apps.map(app=><tr key={app.id}><td className="px-5 py-4 font-bold text-navy">{app.name}</td><td className="px-5 py-4 text-muted-foreground">{app.currency}</td><td className="px-5 py-4"><Status status={app.status} /></td><td className="px-5 py-4"><Button variant="ghost" onClick={()=>onManage(app.id)}>Manage <ChevronRight className="size-4" /></Button></td></tr>)}</tbody></table></div>; }
function Overview({ apps, onManage }: { apps: ReturnType<typeof useBwi>['apps']; onManage:(id:string)=>void }) { const connected=apps.filter(a=>a.status==='Connected').length; return <div><p className="text-xs font-bold text-primary">PLATFORM VIEW</p><h1 className="mt-2 font-display text-3xl font-extrabold text-navy">Connection overview</h1><p className="mt-2 text-sm text-muted-foreground">BWI status across every matrix app in one place.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><Summary value={apps.length} label="Matrix apps" /><Summary value={connected} label="Connected" /><Summary value={apps.length-connected} label="Needs attention" /></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{apps.map(app=><article key={app.id} className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-lg bg-navy/5 text-navy"><Settings2 className="size-5" /></span><Status status={app.status} /></div><h2 className="mt-5 font-display text-lg font-bold text-navy">{app.name}</h2><p className="mt-1 text-xs text-muted-foreground">{app.currency} · Code {app.partnerCode || 'Not set'}</p><Button variant="outline" onClick={()=>onManage(app.id)} className="mt-5 w-full">Manage connection</Button></article>)}</div></div>; }
function Field({label,note,children}:{label:string;note?:string;children:React.ReactNode}) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{note&&<span className="mt-1.5 block text-xs text-muted-foreground">{note}</span>}</label>; }
function Summary({value,label}:{value:number;label:string}) { return <div className="rounded-lg border border-border bg-card p-5"><p className="font-display text-3xl font-extrabold text-navy">{value}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p></div>; }
function Status({ status }: { status: string }) { const classes=status==='Connected'?'bg-accent text-accent-foreground':status==='Disabled'?'bg-warning text-warning-foreground':'bg-muted text-muted-foreground'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>; }