import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const draftSchema = z.object({ title: z.string().trim().min(1).max(120), genre: z.string().min(1).max(80), bpm: z.number().int().min(40).max(220), prompt: z.string().min(1).max(6000), lyrics: z.string().max(6000), notes: z.string().max(3000) });
export const listProjects = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from("music_projects").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return Promise.all((data ?? []).map(async (p) => {
    const audio = p.audio_path ? await context.supabase.storage.from("music-projects").createSignedUrl(p.audio_path, 3600, { download: false }) : null;
    return { ...p, audioUrl: audio?.data?.signedUrl ?? null };
  }));
});
export const saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => draftSchema.parse(input)).handler(async ({ data, context }) => {
  const result = await context.supabase.from("music_projects").insert({ ...data, user_id: context.userId }).select("id").single();
  if (result.error) throw new Error(result.error.message);
  return result.data.id;
});
export const deleteProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.string().uuid().parse(input)).handler(async ({ data, context }) => {
  const result = await context.supabase.from("music_projects").delete().eq("id", data).eq("user_id", context.userId).select("id");
  if (result.error) throw new Error(result.error.message);
  if (!result.data.length) throw new Error("No se pudo eliminar el proyecto.");
});
export const generateProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.string().uuid().parse(input)).handler(async ({ data: id, context }) => {
  const { data: project } = await context.supabase.from("music_projects").select("*").eq("id", id).eq("user_id", context.userId).single();
  if (!project) throw new Error("Proyecto no encontrado");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const paused = await supabaseAdmin.from("ai_service_state").select("reason").eq("service", "music").maybeSingle();
  if (paused.error) throw new Error(paused.error.message);
  if (paused.data) throw new Error(paused.data.reason);
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) throw new Error("La generación musical no está configurada.");
  const claim = await supabaseAdmin.from("music_projects").update({ status: "composing" }).eq("id", id).eq("user_id", context.userId).eq("status", "draft").select("id");
  if (claim.error || !claim.data?.length) throw new Error("Este proyecto ya se está procesando o ya fue generado.");
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/music", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "google/lyria-3-clip-preview", input: [{ type: "user_input", content: [{ type: "text", text: `${project.prompt}\nCrea un fragmento de 30 segundos. ${project.lyrics ? `Lyrics:\n${project.lyrics}` : "Instrumental, sin voz."}` }] }] }) });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { message?: string; error?: { message?: string } };
      const reason = payload.message ?? payload.error?.message ?? `Generación no disponible (${response.status}).`;
      if (response.status === 402 || response.status === 403) await supabaseAdmin.from("ai_service_state").upsert({ service: "music", status: response.status, reason });
      await supabaseAdmin.from("music_projects").update({ status: response.status === 402 || response.status === 403 ? "blocked" : "failed", error_message: reason }).eq("id", id);
      throw new Error(reason);
    }
    const bytes = await response.arrayBuffer();
    if (!bytes.byteLength) throw new Error("La generación no devolvió audio.");
    const path = `${context.userId}/${id}.mp3`;
    const upload = await supabaseAdmin.storage.from("music-projects").upload(path, bytes, { contentType: "audio/mpeg", upsert: false });
    if (upload.error) throw new Error(upload.error.message);
    const saved = await supabaseAdmin.from("music_projects").update({ status: "ready", audio_path: path }).eq("id", id);
    if (saved.error) throw new Error(saved.error.message);
    return id;
  } catch (error) {
    await supabaseAdmin.from("music_projects").update({ status: "failed", error_message: error instanceof Error ? error.message : "No se pudo completar el audio." }).eq("id", id).eq("status", "composing");
    throw error;
  }
});