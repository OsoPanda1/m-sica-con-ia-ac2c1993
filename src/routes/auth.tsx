import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ mode: s["mode"] === "signup" ? ("signup" as const) : undefined }),
  head: () => ({
    meta: [
      { title: "Entrar o inscribirme — Sonora IA" },
      { name: "description", content: "Crea tu cuenta o inicia sesión para acceder al curso de música con IA." },
      { property: "og:title", content: "Entrar — Sonora IA" },
      { property: "og:description", content: "Accede a tu curso de creación musical con IA." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  username: z.string().trim().min(3, "Mínimo 3 caracteres").max(30).regex(/^[a-zA-Z0-9_.]+$/, "Solo letras, números, _ y ."),
  age: z.coerce.number().int().min(13, "Debes tener al menos 13 años").max(120),
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const [signup, setSignup] = useState(mode === "signup");
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; const email = f["email"] ?? ""; const password = f["password"] ?? "";
    setLoading(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Te enviamos un correo para restablecer tu contraseña.");
      } else if (signup) {
        const parsed = signupSchema.safeParse(f);
        if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos"); return; }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/curso", data: { username: parsed.data.username, age: parsed.data.age } },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/curso" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { toast.error("No se pudo entrar con Google"); return; }
    if (r.redirected) return;
    navigate({ to: "/curso" });
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] bg-aurora px-5 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-panel p-8 shadow-glow">
        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Revisa tu correo</h1>
            <p className="mt-3 text-muted-foreground">Te enviamos un enlace para confirmar tu cuenta. Después podrás entrar y completar tu inscripción.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{forgot ? "Recuperar contraseña" : signup ? "Crea tu cuenta" : "Bienvenido de vuelta"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{signup ? "Regístrate para acceder al curso completo." : "Entra para continuar tu curso."}</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {signup && !forgot && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5"><Label htmlFor="username">Nombre de usuario</Label><Input id="username" name="username" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="age">Edad</Label><Input id="age" name="age" type="number" min={13} required /></div>
                </div>
              )}
              <div className="space-y-1.5"><Label htmlFor="email">Correo</Label><Input id="email" name="email" type="email" required /></div>
              {!forgot && <div className="space-y-1.5"><Label htmlFor="password">Contraseña</Label><Input id="password" name="password" type="password" required minLength={signup ? 8 : 1} /></div>}
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? "Un momento…" : forgot ? "Enviar enlace" : signup ? "Crear cuenta" : "Entrar"}
              </Button>
            </form>
            {!forgot && (
              <>
                <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />o<div className="h-px flex-1 bg-border" /></div>
                <Button variant="glass" className="w-full" onClick={google}>Continuar con Google</Button>
              </>
            )}
            <div className="mt-6 flex justify-between text-sm">
              <button className="text-lavender hover:underline" onClick={() => { setSignup(!signup); setForgot(false); }}>
                {signup ? "Ya tengo cuenta" : "Crear una cuenta"}
              </button>
              {!signup && <button className="text-muted-foreground hover:underline" onClick={() => setForgot(!forgot)}>{forgot ? "Volver" : "¿Olvidaste tu contraseña?"}</button>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
