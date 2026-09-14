import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, CheckCircle2, ChevronRight, ExternalLink, LayoutGrid, Link2, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/BwiUi";
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

type View = "list" | "linking";

function SaasModule() {
  const { partner, apps, updateApp } = useBwi();
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => apps.find((app) => app.id === selectedId) ?? apps[0], [apps, selectedId]);
  const [connected, setConnected] = useState(false);
  const [code, setCode] = useState("");
  const [deeplinkUrl, setDeeplinkUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const manage = (id: string) => {
    const app = apps.find((item) => item.id === id);
    if (!app) return;
    setSelectedId(id);
    setConnected(app.status === "Connected");
    setCode(app.partnerCode || (id === "new-partner" ? partner.code : ""));
    setDeeplinkUrl(app.deeplinkUrl);
    setSaved(false);
  };
  const save = () => {
    if (!selected) return;
    updateApp(selected.id, {
      status: connected ? "Connected" : "Not connected",
      partnerCode: code,
      deeplinkUrl,
    });
    setSaved(true);
  };

  return <main className="min-h-screen bg-muted">
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div><p className="font-display text-lg font-bold text-navy">SaaS Admin</p><p className="text-xs text-muted-foreground">Business Module</p></div><div className="flex items-center gap-4"><span className="hidden text-xs text-muted-foreground sm:inline">English</span><span className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-navy-foreground">BA</span></div></header>
    <div className="mx-auto flex max-w-[1800px]">
      <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 bg-navy px-3 py-5 text-navy-foreground lg:block"><Link to="/" className="mb-6 block px-3 text-xs font-semibold text-navy-foreground/60 hover:text-navy-foreground">← Prototype home</Link><p className="px-3 text-[10px] font-bold uppercase text-navy-foreground/45">Business Management</p><nav className="mt-3 space-y-1"><Button variant="ghost" onClick={() => setView("list")} className={`w-full justify-start ${view === "list" ? "bg-bwi-blue text-bwi-blue-foreground" : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground"}`}><LayoutGrid className="size-4" />Matrix Apps</Button><Button variant="ghost" onClick={() => setView("linking")} className={`w-full justify-start ${view === "linking" ? "bg-bwi-blue text-bwi-blue-foreground" : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground"}`}><Link2 className="size-4" />Partner Linking</Button></nav></aside>
      <section className="min-w-0 flex-1 px-5 py-7 lg:px-8"><div className="mb-6 flex gap-2 lg:hidden"><Button variant={view === "list" ? "navy" : "outline"} onClick={() => setView("list")}><LayoutGrid className="size-4" />Matrix Apps</Button><Button variant={view === "linking" ? "navy" : "outline"} onClick={() => setView("linking")}><Link2 className="size-4" />Partner Linking</Button></div>{view === "list" ? <><p className="text-xs text-muted-foreground">Business Management <ChevronRight className="mx-1 inline size-3" /> Matrix Apps</p><div className="mt-4"><h1 className="font-display text-3xl font-extrabold text-navy">Matrix Apps</h1><p className="mt-2 text-sm text-muted-foreground">Manage each app’s connection to BWI.</p></div><AppsTable apps={apps} onManage={manage} /></> : <PartnerLinking apps={apps} onManage={manage} />}</section>
    </div>
    {selectedId && selected && <ConnectionModal app={selected} partnerCode={partner.code} connected={connected} setConnected={setConnected} code={code} setCode={setCode} deeplinkUrl={deeplinkUrl} setDeeplinkUrl={setDeeplinkUrl} saved={saved} onSave={save} onClose={() => setSelectedId(null)} />}
  </main>;
}

function AppsTable({ apps, onManage }: { apps: ReturnType<typeof useBwi>['apps']; onManage:(id:string)=>void }) { return <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card shadow-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-muted"><tr>{['App Name','Local Currency','BWI Connection Status','Actions'].map(x=><th key={x} className="px-5 py-3 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{apps.map(app=><tr key={app.id}><td className="px-5 py-4 font-bold text-navy">{app.name}</td><td className="px-5 py-4 text-muted-foreground">{app.currency}</td><td className="px-5 py-4"><Status status={app.status} /></td><td className="px-5 py-4"><Button variant="ghost" onClick={()=>onManage(app.id)}>Manage <ChevronRight className="size-4" /></Button></td></tr>)}</tbody></table></div>; }
function PartnerLinking({ apps, onManage }: { apps: ReturnType<typeof useBwi>["apps"]; onManage:(id:string)=>void }) { const connected=apps.filter(a=>a.status==='Connected').length; return <div><p className="text-xs text-muted-foreground">Business Management <ChevronRight className="mx-1 inline size-3" /> Partner Linking</p><h1 className="mt-4 font-display text-3xl font-extrabold text-navy">Partner Linking</h1><p className="mt-2 text-sm text-muted-foreground">Review and manage BWI links across all matrix apps.</p><div className="mt-7 grid gap-4 sm:grid-cols-3"><Summary value={apps.length} label="Matrix apps" /><Summary value={connected} label="Connected" /><Summary value={apps.length-connected} label="Needs attention" /></div><div className="mt-6 grid gap-4 xl:grid-cols-3">{apps.map(app=><article key={app.id} className="rounded-md border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-md bg-navy/5 text-navy"><Settings2 className="size-5" /></span><Status status={app.status} /></div><h2 className="mt-5 font-display text-lg font-bold text-navy">{app.name}</h2><p className="mt-1 text-xs text-muted-foreground">Code {app.partnerCode || "Not set"}</p><p className="mt-2 flex min-h-5 items-center gap-1 truncate text-xs text-muted-foreground"><ExternalLink className="size-3" />{app.deeplinkUrl || "Deeplink not set"}</p><Button variant="outline" onClick={()=>onManage(app.id)} className="mt-5 w-full">Manage connection</Button></article>)}</div></div>; }
function ConnectionModal({ app, partnerCode, connected, setConnected, code, setCode, deeplinkUrl, setDeeplinkUrl, saved, onSave, onClose }: { app: ReturnType<typeof useBwi>["apps"][number]; partnerCode: string; connected: boolean; setConnected: (value: boolean) => void; code: string; setCode: (value: string) => void; deeplinkUrl: string; setDeeplinkUrl: (value: string) => void; saved: boolean; onSave: () => void; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onMouseDown={event => event.target === event.currentTarget && onClose()}><div role="dialog" aria-modal="true" aria-labelledby="connection-modal-title" className="w-full max-w-2xl rounded-md border border-border bg-card shadow-frame"><div className="flex items-start justify-between border-b border-border px-6 py-5"><div><h2 id="connection-modal-title" className="font-display text-xl font-bold text-navy">Manage connection — {app.name}</h2><p className="mt-1 text-sm text-muted-foreground">Configure this app’s link to BWI.</p></div><Button variant="ghost" onClick={onClose} aria-label="Close manage connection" className="size-9 min-h-0 p-0"><X className="size-5" /></Button></div><div className="space-y-6 p-6">{saved && <div className="flex items-center gap-3 rounded-md border border-primary/25 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="size-5 text-primary" />Connection details saved</div>}<div className="flex items-center justify-between"><div><p className="font-semibold">Connect to BWI</p><p className="mt-1 text-xs text-muted-foreground">Enable the shared wallet and swap journey.</p></div><Button variant={connected ? "primary" : "outline"} onClick={() => setConnected(!connected)} aria-pressed={connected} className="min-w-24">{connected ? "Enabled" : "Disabled"}</Button></div>{connected && <div className="grid gap-5 border-t border-border pt-6"><Field label="BWI partner code" note={partnerCode ? `BWI Admin code: ${partnerCode}` : "Must match the BWI-side code"}><input value={code} onChange={event=>setCode(event.target.value)} placeholder="e.g. NP" className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-navy" /></Field><Field label="Deeplink URL" note="The destination opened from the partner app."><input type="url" value={deeplinkUrl} onChange={event=>setDeeplinkUrl(event.target.value)} placeholder="https://partner.app/wallet/bwi" className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-navy" /></Field></div>}</div><div className="flex justify-end gap-3 border-t border-border px-6 py-4"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave} disabled={!connected || !code.trim() || !deeplinkUrl.trim()}>Save connection</Button></div></div></div>; }
function Field({label,note,children}:{label:string;note?:string;children:React.ReactNode}) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}{note&&<span className="mt-1.5 block text-xs text-muted-foreground">{note}</span>}</label>; }
function Summary({value,label}:{value:number;label:string}) { return <div className="rounded-lg border border-border bg-card p-5"><p className="font-display text-3xl font-extrabold text-navy">{value}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p></div>; }
function Status({ status }: { status: string }) { const classes=status==='Connected'?'bg-accent text-accent-foreground':status==='Disabled'?'bg-warning text-warning-foreground':'bg-muted text-muted-foreground'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>; }