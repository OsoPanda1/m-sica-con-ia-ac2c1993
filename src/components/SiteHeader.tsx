import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AudioWaveform } from "lucide-react";

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  useQuery({ queryKey: ["noop"], queryFn: () => null, enabled: false });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <AudioWaveform className="h-5 w-5 text-electric" />
          <span className="text-metal">Sonora IA</span>
        </Link>
        <nav className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/curso">Mi curso</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link to="/perfil">Perfil</Link></Button>
              <Button variant="glass" size="sm" onClick={signOut}>Salir</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/auth">Entrar</Link></Button>
              <Button asChild variant="hero" size="sm"><Link to="/auth" search={{ mode: "signup" }}>Inscribirme</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
