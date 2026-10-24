import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { findLesson, FREE_LESSON_ID, hasActiveAccess, type Block } from "@/lib/course";
import { accountQuery } from "@/lib/use-account";
import { Button } from "@/components/ui/button";
import { LESSON_AUDIO } from "@/lib/audio";
import { TutorChat } from "@/components/TutorChat";
import { ALL_LESSONS } from "@/lib/course";
import { Headphones } from "lucide-react";

export const Route = createFileRoute("/_authenticated/curso/$lessonId")({
  head: () => ({ meta: [{ title: "Lección — Sonora IA" }, { name: "description", content: "Lección del curso de música con IA." }] }),
  component: LessonPage,
});

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "p": return <p className="leading-relaxed text-platinum">{b.text}</p>;
    case "h": return <h3 className="pt-2 text-xl font-bold">{b.text}</h3>;
    case "list": {
      const L = b.ordered ? "ol" : "ul";
      return <L className={`space-y-1.5 pl-5 ${b.ordered ? "list-decimal" : "list-disc"}`}>{b.items.map((i) => <li key={i}>{i}</li>)}</L>;
    }
    case "code": return (
      <div className="rounded-xl border border-border bg-navy/60">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted-foreground">
          <span>{b.label ?? "Copiar"}</span>
          <button className="text-lavender" onClick={() => { navigator.clipboard.writeText(b.text); toast.success("Copiado"); }}>Copiar</button>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-sm">{b.text}</pre>
      </div>
    );
    case "table": return (
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm"><thead className="bg-muted"><tr>{b.head.map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="px-3 py-2">{c}</td>)}</tr>)}</tbody></table>
      </div>
    );
    case "tip": return <div className="rounded-xl border-l-4 border-terracotta bg-card p-4">{b.text}</div>;
    case "practice": return (
      <div className="rounded-xl border border-lavender/40 bg-panel p-5">
        <p className="font-bold text-lavender">Práctica · {b.title}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    );
  }
}

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = findLesson(lessonId);
  const { data } = useQuery(accountQuery);
  const qc = useQueryClient();
  if (!lesson) return <main className="p-10">Lección no encontrada.</main>;
  const open = lesson.id === FREE_LESSON_ID || hasActiveAccess(data?.paidUntil);
  const done = data?.completed.has(lesson.id);

  async function toggle() {
    if (!data) return;
    const q = done
      ? supabase.from("lesson_progress").delete().eq("user_id", data.user.id).eq("lesson_id", lessonId)
      : supabase.from("lesson_progress").insert({ user_id: data.user.id, lesson_id: lessonId });
    const { error } = await q;
    if (error) { toast.error("No se pudo guardar"); return; }
    qc.invalidateQueries({ queryKey: ["account"] });
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/curso" className="text-sm text-lavender">← Volver al curso</Link>
      <p className="mt-6 font-mono text-xs text-electric">MÓDULO {lesson.moduleNumber} · {lesson.minutes} MIN</p>
      <h1 className="mt-2 text-4xl font-bold">{lesson.title}</h1>
      {open ? (
        <>
          {LESSON_AUDIO[lesson.id] && (
            <div className="mt-6 rounded-2xl border border-border bg-panel p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-lavender"><Headphones className="h-4 w-4" /> Escucha esta lección</p>
              <audio key={lesson.id} controls preload="metadata" src={LESSON_AUDIO[lesson.id]} className="w-full" />
            </div>
          )}
          <div className="mt-8 space-y-5">{lesson.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
          <Button variant={done ? "glass" : "hero"} className="mt-10" onClick={toggle}>{done ? "Marcar como pendiente" : "Marcar como completada"}</Button>
          <NextLink id={lesson.id} />
          <section className="mt-12">
            <h2 className="mb-3 text-2xl font-bold">¿Dudas? Pregúntale a tu tutora</h2>
            <TutorChat key={lesson.id} lessonId={lesson.id} compact />
          </section>
        </>
      ) : (
        <p className="mt-8 text-muted-foreground">Esta lección requiere tu inscripción de $500 MXN por trimestre.</p>
      )}
    </main>
  );
}

function NextLink({ id }: { id: string }) {
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  const next = ALL_LESSONS[i + 1];
  if (!next) return null;
  return <Link to="/curso/$lessonId" params={{ lessonId: next.id }} className="ml-4 text-sm text-lavender">Siguiente: {next.title} →</Link>;
}
