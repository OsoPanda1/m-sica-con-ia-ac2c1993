import { createFileRoute, Link } from "@tanstack/react-router";
import { GENRES } from "@/lib/prompt-library";
import { Button } from "@/components/ui/button";
import { Copy, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/plantillas")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q.slice(0, 80) : "" }),
  head: () => ({ meta: [{ title: "Biblioteca de ritmos y prompts — Sonora IA" }, { name: "description", content: "Plantillas de salsa, cumbia, mariachi, reggaetón, rock, electrónica y más." }, { property: "og:title", content: "Biblioteca musical — Sonora IA" }, { property: "og:description", content: "Dirección musical y prompts para 22 géneros." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Templates,
});
function Templates() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const genres = GENRES.filter((g) => `${g.name} ${g.family}`.toLowerCase().includes(q.toLowerCase()));
  return <main className="mx-auto max-w-6xl px-5 py-12"><p className="font-mono text-xs text-electric">ISABELLA MUSIC LAB Ω / BIBLIOTECA</p><h1 className="mt-3 text-4xl font-bold">Un ritmo. Tu propia dirección.</h1>
    <input aria-label="Buscar género" placeholder="Buscar género…" value={q} onChange={(e) => navigate({ search: { q: e.target.value }, replace: true })} className="mt-8 w-full max-w-md rounded-lg border border-input bg-background px-4 py-3" />
    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{genres.map((g) => <article key={g.id} className="flex flex-col rounded-lg border border-border bg-card p-5"><div className="flex justify-between text-xs text-electric"><span>{g.family}</span><span>{g.bpm} BPM · orientativo</span></div><h2 className="mt-3 text-2xl font-bold">{g.name}</h2><p className="mt-3 text-sm text-platinum">{g.groove}</p><p className="mt-3 text-sm text-muted-foreground">{g.instruments}</p><p className="mt-3 flex-1 text-sm text-muted-foreground">{g.arrangement}</p><div className="mt-5 flex gap-2"><Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(`${g.name}, ${g.bpm} BPM. ${g.groove}. ${g.instruments}. ${g.arrangement}. Emoción: [tu emoción]. Voz: [tu voz]. Tema: [tu historia].`); toast.success("Plantilla copiada"); }}><Copy className="h-4 w-4" />Copiar</Button><Button asChild variant="hero" size="sm"><Link to="/laboratorio" search={{ genre: g.id }}><ArrowUpRight className="h-4 w-4" />Crear</Link></Button></div></article>)}</div>{!genres.length && <p className="mt-8">No hay géneros con ese nombre.</p>}
  </main>;
}