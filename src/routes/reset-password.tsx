import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña — Sonora IA" },
      { name: "description", content: "Define una nueva contraseña para tu cuenta." },
      { property: "og:title", content: "Nueva contraseña — Sonora IA" },
      { property: "og:description", content: "Restablece tu contraseña." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Mínimo 8 caracteres"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Contraseña actualizada");
    navigate({ to: "/curso" });
  }
  return (
    <main className="px-5 py-20">
      <form onSubmit={save} className="mx-auto max-w-sm space-y-4 rounded-3xl border border-border bg-panel p-8">
        <h1 className="text-2xl font-bold">Nueva contraseña</h1>
        <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Nueva contraseña" />
        <Button type="submit" variant="hero" className="w-full">Guardar</Button>
      </form>
    </main>
  );
}
