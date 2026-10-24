import { createFileRoute } from "@tanstack/react-router";

async function verifyStripeSignature(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${payload}`));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook no configurado", { status: 500 });
        const payload = await request.text();
        const sig = request.headers.get("stripe-signature") ?? "";
        if (!(await verifyStripeSignature(payload, sig, secret))) return new Response("Firma inválida", { status: 400 });

        const event = JSON.parse(payload) as {
          type?: string;
          data?: { object?: { metadata?: { user_id?: string }; client_reference_id?: string; payment_status?: string } };
        };
        if (event.type === "checkout.session.completed" && event.data?.object?.payment_status === "paid") {
          const userId = event.data.object.metadata?.user_id ?? event.data.object.client_reference_id;
          if (userId) {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data: existing } = await supabaseAdmin.from("enrollments").select("paid_until").eq("user_id", userId).maybeSingle();
            const now = new Date();
            const base = existing?.paid_until && new Date(existing.paid_until) > now ? new Date(existing.paid_until) : now;
            const until = new Date(base);
            until.setMonth(until.getMonth() + 3);
            const { error } = await supabaseAdmin.from("enrollments").upsert({ user_id: userId, paid_until: until.toISOString() }, { onConflict: "user_id" });
            if (error) return new Response("No se pudo registrar la inscripción", { status: 500 });
          }
        }
        return Response.json({ received: true });
      },
    },
  },
});
