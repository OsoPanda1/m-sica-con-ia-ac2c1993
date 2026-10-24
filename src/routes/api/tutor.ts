import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { findLesson } from "@/lib/course";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "@/lib/ai/run-id.server";

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
        const sb = createClient(process.env['SUPABASE_URL']!, process.env['SUPABASE_PUBLISHABLE_KEY']!, {
          auth: { persistSession: false },
        });
        const { data: u } = await sb.auth.getUser(token);
        if (!u.user) return new Response("No autorizado", { status: 401 });

        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) return new Response("IA no configurada", { status: 500 });

        let body: { messages: UIMessage[]; lessonId?: string | undefined };
        try {
          const parsed = z.object({ lessonId: z.string().max(40).optional(), messages: z.array(z.object({ id: z.string().max(200), role: z.enum(["user", "assistant"]), parts: z.array(z.object({ type: z.literal("text"), text: z.string().max(12000) })).max(30) })).min(1).max(30) }).parse(await request.json());
          body = parsed;
        } catch { return new Response("La conversación es demasiado larga o inválida.", { status: 400 }); }
        const lesson = body.lessonId ? findLesson(body.lessonId) : undefined;
        const ctx = lesson
          ? `\n\nEl alumno está estudiando la lección "${lesson.title}" (módulo ${lesson.moduleNumber}). Contenido: ${JSON.stringify(lesson.blocks).slice(0, 6000)}`
          : "";

        const gateway = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: gateway.fetch,
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          instructions: SYSTEM + ctx,
          messages: await convertToModelMessages(body.messages.slice(-30)),
          abortSignal: request.signal,
          providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
          maxRetries: 0,
        });
        return withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse({
          sendReasoning: true,
          onError: (e) => {
            const m = String((e as Error)?.message ?? e);
            return m;
          },
        }), gateway);
      },
    },
  },
});
