import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Music4, Trash2, Wand2 } from "lucide-react";
import { GENRES, buildPrompt, composerSchema } from "@/lib/prompt-library";
import { deleteProject, generateProject, listProjects, saveProject } from "@/lib/lab.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/laboratorio")({
  validateSearch: (s: Record<string, unknown>) => ({ genre: typeof s["genre"] === "string" ? s["genre"].slice(0, 40) : "" }),
  head: () => ({
    meta: [
      { title: "Laboratorio musical — Sonora IA" },
      { name: "description", content: "Compón tus primeras canciones con IA: elige género, escribe tu prompt y genera un fragmento." },
      { property: "og:title", content: "Laboratorio musical — Sonora IA" },
      { property: "og:description", content: "Entrena componiendo con plantillas de 22 géneros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lab,
});

function Lab() {
  const { genre } = Route.useSearch();
  const qc = useQueryClient();
  const projects = useQuery({ queryKey: ["lab-projects"], queryFn: () => listProjects() });
  const [form, setForm] = useState({
    title: "", genre: GENRES.some((g) => g.id === genre) ? genre : "cumbia", bpm: 96,
    mood: "", voice: "", theme: "", lyrics: "", notes: "",
  });
  const selected = GENRES.find((g) => g.id === form.genre) ?? GENRES[0]!;
  const prompt = (() => {
    try {
      return buildPrompt(composerSchema.parse({ ...form, mood: form.mood || "alegría", theme: form.theme || "una historia personal", title: form.title || "Borrador" }));
    } catch { return ""; }
  })();

  const save = useMutation({
    mutationFn: async () => {
      const parsed = composerSchema.parse(form);
      return saveProject({ data: { title: parsed.title, genre: parsed.genre, bpm: parsed.bpm, prompt, lyrics: parsed.lyrics, notes: parsed.notes } });
    },
    onSuccess: () => { toast.success("Proyecto guardado"); qc.invalidateQueries({ queryKey: ["lab-projects"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar"),
  });
  const generate = useMutation({
    mutationFn: (id: string) => generateProject({ data: id }),
    onSuccess: () => { toast.success("Fragmento generado"); qc.invalidateQueries({ queryKey: ["lab-projects"] }); },
    onError: (e) => { toast.error(e instanceof Error ? e.message : "No se pudo generar"); qc.invalidateQueries({ queryKey: ["lab-projects"] }); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteProject({ data: id }),
    onSuccess: () => { toast.success("Proyecto eliminado"); qc.invalidateQueries({ queryKey: ["lab-projects"] }); },
    onError: () => toast.error("No se pudo eliminar"),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "bpm" ? Number(e.target.value) : e.target.value }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-mono text-xs text-electric">ISABELLA MUSIC LAB Ω</p>
      <h1 className="mt-3 text-4xl font-bold">Laboratorio de práctica</h1>
      <p className="mt-2 text-muted-foreground">Compón tu prompt, guárdalo como proyecto y genera un fragmento de 30 segundos para entrenar tu oído.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-panel p-6">
          <h2 className="text-xl font-bold">Nuevo proyecto</h2>
          <div className="mt-5 grid gap-4">
            <div className="space-y-1.5"><Label htmlFor="title">Título</Label><Input id="title" value={form.title} onChange={set("title")} placeholder="Mi primera cumbia" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="genre">Género</Label>
                <select id="genre" value={form.genre} onChange={set("genre")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {GENRES.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="bpm">BPM</Label><Input id="bpm" type="number" min={40} max={220} value={form.bpm} onChange={set("bpm")} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label htmlFor="mood">Emoción</Label><Input id="mood" value={form.mood} onChange={set("mood")} placeholder="nostalgia, fiesta…" /></div>
              <div className="space-y-1.5"><Label htmlFor="voice">Voz</Label><Input id="voice" value={form.voice} onChange={set("voice")} placeholder="femenina cálida…" /></div>
            </div>
            <div className="space-y-1.5"><Label htmlFor="theme">Tema</Label><Input id="theme" value={form.theme} onChange={set("theme")} placeholder="¿De qué trata tu canción?" /></div>
            <div className="space-y-1.5"><Label htmlFor="lyrics">Letra (opcional)</Label><textarea id="lyrics" rows={4} value={form.lyrics} onChange={set("lyrics")} placeholder="[Verse]… [Chorus]…" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
            <div className="rounded-xl border border-border bg-navy/60 p-4">
              <p className="text-xs text-muted-foreground">Vista previa del prompt</p>
              <p className="mt-1 font-mono text-xs leading-relaxed">{prompt || "Completa los campos para ver tu prompt."}</p>
            </div>
            <Button variant="hero" disabled={save.isPending || !form.title.trim() || !form.theme.trim()} onClick={() => save.mutate()}>
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music4 className="h-4 w-4" />} Guardar proyecto
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">Tus proyectos</h2>
          <div className="mt-5 space-y-4">
            {(projects.data ?? []).map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{p.genre} · {p.bpm} BPM · {p.status === "ready" ? "listo" : p.status === "composing" ? "componiendo…" : p.status === "draft" ? "borrador" : p.status === "blocked" ? "servicio en pausa" : "falló"}</p>
                  </div>
                  <div className="flex gap-2">
                    {p.status === "draft" && (
                      <Button size="sm" variant="hero" disabled={generate.isPending} onClick={() => generate.mutate(p.id)}>
                        {generate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Generar
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => remove.mutate(p.id)} aria-label="Eliminar"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                {p.error_message && <p className="mt-2 text-xs text-destructive">{p.error_message}</p>}
                {p.audioUrl && <audio controls preload="metadata" src={p.audioUrl} className="mt-3 w-full" />}
                <p className="mt-3 line-clamp-3 font-mono text-xs text-muted-foreground">{p.prompt}</p>
              </article>
            ))}
            {!projects.isLoading && !(projects.data ?? []).length && (
              <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Aún no tienes proyectos. Guarda tu primer prompt a la izquierda.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
