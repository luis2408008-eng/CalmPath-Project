import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = path === "/";

  const links = [
    { to: "/dashboard", label: "Mapa" },
    { to: "/onboarding", label: "Mi perfil" },
    { to: "/contribute", label: "Colaborar" },
    { to: "/feedback", label: "Opinión" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-2xl bg-primary/15 text-primary group-hover:scale-105 transition">
            <Leaf className="w-5 h-5" />
          </span>
          <span className="font-display text-xl tracking-tight">CalmPath</span>
        </Link>
        {!isLanding && (
          <nav className="flex items-center gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
                activeProps={{ className: "px-3 py-2 rounded-full bg-primary/10 text-primary font-medium" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
        {isLanding && (
          <Link
            to="/onboarding"
            className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Comenzar
          </Link>
        )}
      </div>
    </header>
  );
}
