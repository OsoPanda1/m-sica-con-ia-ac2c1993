import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Square, Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Ayúdame a escribir un coro sobre la nostalgia",
  "Convierte mi idea en un prompt musical completo",
  "¿Cómo separo la voz y la mejoro?",
];

export function TutorChat({ lessonId, compact }: { lessonId?: string; compact?: boolean }) {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({
    id: lessonId ?? "general",
    transport: new DefaultChatTransport({
      api: "/api/tutor",
      body: { lessonId },
      headers: async () => {
        const { data } = await supabase.auth.getSession();
        return { Authorization: `Bearer ${data.session?.access_token ?? ""}` };
      },
    }),
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [messages, status]);
  useEffect(() => { if (!busy) ref.current?.focus(); }, [busy]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className={`flex flex-col rounded-2xl border border-border bg-panel ${compact ? "h-[520px]" : "h-[70vh]"}`}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-metal text-primary-foreground"><Music2 className="h-4 w-4" /></span>
        <div><p className="font-bold leading-tight">Maestra Sonora</p><p className="text-xs text-muted-foreground">Tu tutora de música con IA</p></div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pregúntame lo que quieras sobre {lessonId ? "esta lección" : "el curso"}.</p>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-sm hover:border-lavender">{s}</button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground" : "max-w-full"}>
            {m.parts.map((p, i) => p.type === "text" ? (
              m.role === "user" ? <p key={i} className="whitespace-pre-wrap">{p.text}</p> :
              <div key={i} className="prose prose-sm prose-invert max-w-none prose-pre:bg-navy/60"><ReactMarkdown>{p.text}</ReactMarkdown></div>
            ) : null)}
          </div>
        ))}
        {status === "submitted" && <p className="animate-pulse text-sm text-muted-foreground">Pensando…</p>}
        {error && <p className="text-sm text-destructive">{error.message || "Ocurrió un error."}</p>}
        <div ref={end} />
      </div>
      <form className="flex items-end gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <textarea ref={ref} value={input} onChange={(e) => setInput(e.target.value)} rows={2} placeholder="Escribe tu pregunta…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
        {busy ? (
          <Button type="button" variant="glass" size="icon" onClick={() => stop()} aria-label="Detener"><Square className="h-4 w-4" /></Button>
        ) : (
          <Button type="submit" variant="hero" size="icon" aria-label="Enviar"><Send className="h-4 w-4" /></Button>
        )}
      </form>
    </div>
  );
}
