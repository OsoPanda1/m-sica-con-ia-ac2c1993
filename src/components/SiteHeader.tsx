import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

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
        <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold">
          <span className="rounded-lg bg-logo-plate px-2 py-1"><img src={logo} alt="Real del Monte Tecnológico by TAMV Online" className="h-9 w-auto" /></span>
          <span className="hidden text-metal sm:inline">Sonora IA</span>
        </Link>
        <nav className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/curso">Mi curso</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link to="/tutor">Tutora IA</Link></Button>
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

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-sm text-muted-foreground md:flex-row md:justify-between">
        <span className="rounded-xl bg-logo-plate px-3 py-2"><img src={logo} alt="Real del Monte Tecnológico" className="h-12 w-auto" /></span>
        <p>© {new Date().getFullYear()} Real del Monte Tecnológico by TAMV Online · Sonora IA</p>
      </div>
    </footer>
  );
}
