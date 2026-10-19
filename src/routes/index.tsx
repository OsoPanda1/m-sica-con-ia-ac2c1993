import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { COURSE, ALL_LESSONS } from "@/lib/course";
import hero from "@/assets/hero.jpg";
import { Check, Sparkles, Mic2, SlidersHorizontal, PenLine } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sonora IA — Aprende a crear música con inteligencia artificial" },
      { name: "description", content: "Curso completo y práctico en español: de cero a crear y publicar canciones profesionales con IA." },
      { property: "og:title", content: "Sonora IA — Crea música con IA" },
      { property: "og:description", content: "9 módulos prácticos: letras, prompts, voces, mezcla, master y publicación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Estudio musical con onda de sonido luminosa" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-24 md:pt-36">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-lavender">
            <Sparkles className="h-3.5 w-3.5" /> Curso completo en español
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] md:text-7xl">
            Crea canciones reales <span className="text-metal">con inteligencia artificial</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            De principiante absoluto a creador profesional. Aprende a dirigir la IA como una banda de estudio: letra, estilo, voces, mezcla y publicación. Sin tocar ningún instrumento.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/auth" search={{ mode: "signup" }}>Inscribirme por $500 MXN</Link></Button>
            <Button asChild variant="glass" size="lg"><Link to="/curso/$lessonId" params={{ lessonId: "m1-l1" }}>Ver lección gratis</Link></Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Inscripción y acceso trimestral · {COURSE.length} módulos · {ALL_LESSONS.length} lecciones prácticas</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-20 md:grid-cols-4">
        {[
          { icon: PenLine, t: "Letras que la IA canta", d: "Estructura, hook, rima y etiquetas." },
          { icon: Sparkles, t: "Prompts profesionales", d: "Género, BPM, instrumentos y atmósfera." },
          { icon: Mic2, t: "Voces y coros", d: "Dirige timbre, actitud y efectos." },
          { icon: SlidersHorizontal, t: "Mezcla y master", d: "Stems, limpieza y entrega lista." },
        ].map(({ icon: I, t, d }) => (
          <div key={t} className="rounded-2xl border border-border bg-panel p-6">
            <I className="h-6 w-6 text-terracotta" />
            <h3 className="mt-4 text-lg font-bold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-3xl font-bold md:text-4xl">El programa</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {COURSE.map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
              <span className="font-mono text-xs text-electric">MÓDULO {String(m.number).padStart(2, "0")}</span>
              <h3 className="mt-2 font-bold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.goal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-28">
        <div className="rounded-3xl border border-border bg-panel p-10 text-center shadow-glow">
          <h2 className="text-3xl font-bold">Tu acceso</h2>
          <p className="mt-4 text-6xl font-extrabold text-metal">$500 <span className="text-2xl">MXN</span></p>
          <p className="mt-2 text-muted-foreground">Inscripción y acceso por trimestre</p>
          <ul className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm">
            {["Los 9 módulos completos", "Plantillas de letra y prompts listas para copiar", "Perfil con insignias y avance", "Proyecto final guiado"].map((x) => (
              <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-lavender" />{x}</li>
            ))}
          </ul>
          <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/auth" search={{ mode: "signup" }}>Crear mi cuenta</Link></Button>
        </div>
      </section>
    </main>
  );
}
