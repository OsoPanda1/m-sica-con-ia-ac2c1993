import { createFileRoute } from "@tanstack/react-router";
import { TutorChat } from "@/components/TutorChat";

export const Route = createFileRoute("/_authenticated/tutor")({
  head: () => ({ meta: [{ title: "Tutora IA — Real del Monte Tecnológico" }, { name: "description", content: "Resuelve tus dudas de composición, prompts, mezcla y publicación con tu tutora de IA." }] }),
  component: () => (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-2 text-4xl font-bold">Tutora IA</h1>
      <p className="mb-6 text-muted-foreground">Pide ayuda con letras, prompts, voces, mezcla o publicación.</p>
      <TutorChat />
    </main>
  ),
});
