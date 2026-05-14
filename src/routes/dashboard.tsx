import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { defaultProfile, useProfile } from "@/lib/profile-store";
import { recommendPlaces, getCustomPlaces, PLACES } from "@/lib/places";
import { useMemo, useState } from "react";
import { MockMap } from "@/components/MockMap";
import { PlaceCard } from "@/components/PlaceCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mapa y recomendaciones — CalmPath" },
      { name: "description", content: "Lugares recomendados según tu perfil sensorial y emocional." },
    ],
  }),
  component: Dashboard,
});

const MOOD_LABEL: Record<string, string> = {
  ansioso: "ansioso", estresado: "estresado", saturado: "saturado",
  cansado: "cansado", desmotivado: "desmotivado", tranquilo: "tranquilo",
  feliz: "feliz", concentracion: "buscando concentración",
};

function Dashboard() {
  const { profile, loaded } = useProfile();
  const [filter, setFilter] = useState<"todos" | "calmante" | "estimulante">("todos");
  const [selected, setSelected] = useState<string>();
  const navigate = useNavigate();

  const recommendations = useMemo(() => {
    const base = profile ?? defaultProfile;
    const all = recommendPlaces(base);
    // include custom user-added (without scoring deeply)
    const customs = getCustomPlaces();
    const withCustoms = customs.length
      ? [...all, ...customs.map((p) => ({ ...p, score: 70, matchReasons: ["Añadido por la comunidad"] }))]
      : all;
    return filter === "todos" ? withCustoms : withCustoms.filter((p) => p.vibe === filter);
  }, [profile, filter]);

  if (!loaded) return <div className="min-h-screen"><Header /></div>;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {profile ? `Hola${profile.name ? `, ${profile.name}` : ""}` : "Modo invitado"}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">
            {profile ? (
              <>Estás <span className="text-primary">{MOOD_LABEL[profile.mood]}</span> · quieres {profile.need}.</>
            ) : (
              <>Lugares recomendados cerca de ti</>
            )}
          </h1>
          {!profile && (
            <p className="mt-2 text-sm text-muted-foreground">
              <button onClick={() => navigate({ to: "/onboarding" })} className="text-primary underline underline-offset-4">Crea tu perfil</button> para personalizar las recomendaciones.
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
          <div className="space-y-4">
            <MockMap places={recommendations} selectedId={selected} onSelect={setSelected} />
            <div className="flex gap-2">
              {(["todos", "calmante", "estimulante"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm border transition capitalize ${
                    filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-mist"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
            {recommendations.map((p, i) => (
              <PlaceCard
                key={p.id}
                place={p as any}
                index={i}
                onClick={() => navigate({ to: "/place/$id", params: { id: p.id } })}
              />
            ))}
            {recommendations.length === 0 && (
              <div className="text-center text-muted-foreground py-12">No hay lugares con ese filtro.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Used by /place/$id
export { PLACES };
