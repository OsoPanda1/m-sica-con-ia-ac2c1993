import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { COURSE, ALL_LESSONS, FREE_LESSON_ID, hasActiveAccess } from "@/lib/course";
import { accountQuery } from "@/lib/use-account";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/curso/")({
  head: () => ({ meta: [{ title: "Mi curso — Sonora IA" }, { name: "description", content: "Tus módulos y avance." }] }),
  component: Curso,
});

function Curso() {
  const { data } = useQuery(accountQuery);
  const completed = data?.completed ?? new Set<string>();
  const access = hasActiveAccess(data?.paidUntil);
  const pct = Math.round((completed.size / ALL_LESSONS.length) * 100);
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-bold">Hola{data?.profile?.username ? `, ${data.profile.username}` : ""}</h1>
      <div className="mt-6 rounded-2xl border border-border bg-panel p-5">
        <div className="flex justify-between text-sm"><span>Tu avance</span><span>{pct}%</span></div>
        <Progress value={pct} className="mt-2" />
      </div>
      {!access && (
        <div className="mt-6 rounded-2xl border border-terracotta/50 bg-card p-5">
          <h2 className="font-bold">Inscripción pendiente</h2>
          <p className="mt-1 text-sm text-muted-foreground">El acceso completo cuesta $500 MXN por trimestre. El pago en línea estará disponible muy pronto. Mientras tanto puedes ver la primera lección gratis.</p>
        </div>
      )}
      <div className="mt-8 space-y-6">
        {COURSE.map((m) => (
          <section key={m.id}>
            <h2 className="text-xl font-bold"><span className="font-mono text-sm text-electric">M{m.number} · </span>{m.title}</h2>
            <ul className="mt-3 space-y-2">
              {m.lessons.map((l) => {
                const open = access || l.id === FREE_LESSON_ID;
                const done = completed.has(l.id);
                const Icon = done ? CheckCircle2 : open ? PlayCircle : Lock;
                const inner = (<><Icon className={`h-5 w-5 ${done ? "text-lavender" : "text-muted-foreground"}`} /><span className="flex-1">{l.title}</span><span className="text-xs text-muted-foreground">{l.minutes} min</span></>);
                return (
                  <li key={l.id}>
                    {open ? (
                      <Link to="/curso/$lessonId" params={{ lessonId: l.id }} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-lavender">{inner}</Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 opacity-60">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
