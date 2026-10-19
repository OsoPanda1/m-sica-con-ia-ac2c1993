import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { accountQuery } from "@/lib/use-account";
import { computeBadges, ALL_LESSONS } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil — Sonora IA" }, { name: "description", content: "Tu perfil, insignias y avance." }] }),
  component: Perfil,
});

function Perfil() {
  const { data } = useQuery(accountQuery);
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  if (!data) return <main className="p-10">Cargando…</main>;
  const badges = computeBadges(data.completed);
  const pct = Math.round((data.completed.size / ALL_LESSONS.length) * 100);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    const f = new FormData(e.currentTarget);
    setSaving(true);
    let avatar_url = data.profile?.avatar_url ?? null;
    const file = f.get("avatar");
    if (file instanceof File && file.size > 0) {
      const path = `${data.user.id}/avatar-${Date.now()}`;
      const up = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (up.error) { setSaving(false); toast.error("No se pudo subir la foto"); return; }
      avatar_url = path;
    }
    const age = Number(f.get("age")) || null;
    const { error } = await supabase.from("profiles").upsert({
      id: data.user.id,
      username: String(f.get("username") ?? "").trim().slice(0, 30) || null,
      age,
      bio: String(f.get("bio") ?? "").slice(0, 300) || null,
      avatar_url,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Perfil guardado");
    qc.invalidateQueries({ queryKey: ["account"] });
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-[1fr_1.2fr]">
      <form onSubmit={save} className="space-y-4 rounded-3xl border border-border bg-panel p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-metal">
            {data.avatarSigned && <img src={data.avatarSigned} alt="Foto de perfil" className="h-full w-full object-cover" />}
          </div>
          <div><p className="font-bold">{data.profile?.username ?? "Sin nombre"}</p><p className="text-sm text-muted-foreground">{data.user.email}</p></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="avatar">Foto</Label><Input id="avatar" name="avatar" type="file" accept="image/*" /></div>
        <div className="space-y-1.5"><Label htmlFor="username">Nombre de usuario</Label><Input id="username" name="username" defaultValue={data.profile?.username ?? ""} /></div>
        <div className="space-y-1.5"><Label htmlFor="age">Edad</Label><Input id="age" name="age" type="number" defaultValue={data.profile?.age ?? ""} /></div>
        <div className="space-y-1.5"><Label htmlFor="bio">Biografía (opcional)</Label><Textarea id="bio" name="bio" maxLength={300} defaultValue={data.profile?.bio ?? ""} /></div>
        <Button type="submit" variant="hero" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
      </form>
      <section className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Avance</h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.completed.size} de {ALL_LESSONS.length} lecciones</p>
          <Progress value={pct} className="mt-3" />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Insignias</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div key={b.id} className={`rounded-2xl border p-4 ${b.earned ? "border-lavender bg-panel" : "border-border opacity-50"}`}>
                <Award className={`h-6 w-6 ${b.earned ? "text-terracotta" : "text-muted-foreground"}`} />
                <p className="mt-2 font-bold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
