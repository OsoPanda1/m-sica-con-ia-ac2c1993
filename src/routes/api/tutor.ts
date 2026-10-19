import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { findLesson } from "@/lib/course";

const SYSTEM = `Eres "Maestra Sonora", tutora experta del curso "Música con IA" de Real del Monte Tecnológico by TAMV Online.
Respondes SIEMPRE en español claro, cálido y práctico, para principiantes.
Ayudas a: escribir letras con etiquetas de estructura ([Verse], [Chorus]...), crear prompts musicales (género, BPM, instrumentos, voz, emoción, producción),
corregir generaciones, mezclar, masterizar y publicar. Da ejemplos listos para copiar en bloques de código. Sé concisa y usa listas.
No inventes funciones de herramientas; si no estás segura, dilo. No reemplazas el criterio artístico del alumno: lo guías.`;

export const Route = createFileRoute("/api/tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("No autorizado", { status: 401 });
        const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
          auth: { persistSession: false },
        });
        const { data: u } = await sb.auth.getUser(token);
        if (!u.user) return new Response("No autorizado", { status: 401 });

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("IA no configurada", { status: 500 });

        const body = (await request.json()) as { messages: UIMessage[]; lessonId?: string };
        const lesson = body.lessonId ? findLesson(body.lessonId) : undefined;
        const ctx = lesson
          ? `\n\nEl alumno está estudiando la lección "${lesson.title}" (módulo ${lesson.moduleNumber}). Contenido: ${JSON.stringify(lesson.blocks).slice(0, 6000)}`
          : "";

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM + ctx,
          messages: await convertToModelMessages(body.messages.slice(-30)),
          abortSignal: request.signal,
          providerOptions: { openai: { store: false, reasoningEffort: "low" } },
        });
        return result.toUIMessageStreamResponse({
          onError: (e) => {
            const m = String((e as Error)?.message ?? e);
            if (m.includes("429")) return "Demasiadas solicitudes, intenta en un momento.";
            if (m.includes("402")) return "Se agotaron los créditos de IA del sitio.";
            return "La tutora no pudo responder. Intenta de nuevo.";
          },
        });
      },
    },
  },
});
