import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ENROLLMENT_PRICE_ID = "price_1UU5pJCmtLJ3nWUbjeMHyMX3"; // Inscripción trimestral $500 MXN

export const createEnrollmentCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const key = process.env["STRIPE_SECRET_KEY"];
    if (!key) throw new Error("El pago en línea aún no está configurado.");
    const origin = new URL(getRequest().url).origin;
    const params = new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": ENROLLMENT_PRICE_ID,
      "line_items[0][quantity]": "1",
      "metadata[user_id]": context.userId,
      client_reference_id: context.userId,
      success_url: `${origin}/curso?pago=exitoso`,
      cancel_url: `${origin}/curso?pago=cancelado`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const session = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !session.url) throw new Error(session.error?.message ?? "No se pudo crear el pago.");
    return { url: session.url };
  });
