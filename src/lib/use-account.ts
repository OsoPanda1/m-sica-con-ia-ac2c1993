import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const accountQuery = queryOptions({
  queryKey: ["account"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const user = u.user;
    if (!user) return null;
    const [p, prog, enr] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id),
      supabase.from("enrollments").select("paid_until").eq("user_id", user.id).maybeSingle(),
    ]);
    let avatarSigned: string | null = null;
    if (p.data?.avatar_url) {
      const s = await supabase.storage.from("avatars").createSignedUrl(p.data.avatar_url, 3600);
      avatarSigned = s.data?.signedUrl ?? null;
    }
    return {
      user,
      profile: p.data,
      avatarSigned,
      completed: new Set((prog.data ?? []).map((r) => r.lesson_id)),
      paidUntil: enr.data?.paid_until ?? null,
    };
  },
});
