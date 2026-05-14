import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PLACES, getCustomPlaces } from "@/lib/places";
import { ArrowLeft, Clock, Lightbulb, Users, Volume2, Wind, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/place/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Lugar — CalmPath` },
      { name: "description", content: `Información sensorial y emocional del lugar ${params.id}.` },
    ],
  }),
  component: PlacePage,
});

const TYPE_LABEL: Record<string,string> = {
  cafeteria: "Cafetería", biblioteca: "Biblioteca", parque: "Parque",
  museo: "Museo", coworking: "Coworking", restaurante: "Restaurante", creativo: "Espacio creativo",
};

function PlacePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const place = [...PLACES, ...getCustomPlaces()].find((p) => p.id === id);

  if (!place) {
    return (
      <div className="min-h-screen"><Header />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="font-display text-3xl">Lugar no encontrado</h1>
          <Link to="/dashboard" className="text-primary underline mt-4 inline-block">Volver al mapa</Link>
        </div>
      </div>
    );
  }

  const noiseLabel = ["", "Muy silencioso", "Silencioso", "Moderado", "Activo", "Muy ruidoso"][place.noise];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-8">
        <button onClick={() => navigate({ to: "/dashboard" })} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero photo (mock gradient) */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-sky/60 via-mist to-sage/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.05_85_/_0.6),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.9_0.06_165_/_0.7),transparent_60%)]" />
            <div className="absolute bottom-4 left-4 glass rounded-2xl px-4 py-2 text-sm">
              {TYPE_LABEL[place.type]} · {place.distanceKm.toFixed(1)} km
            </div>
          </div>

          <h1 className="font-display text-4xl mt-6">{place.name}</h1>
          <p className="text-muted-foreground mt-2">{place.description}</p>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <Info icon={Volume2} label="Nivel de ruido" value={noiseLabel} />
            <Info icon={Lightbulb} label="Iluminación" value={place.light} />
            <Info icon={Wind} label="Aroma" value={place.scent} />
            <Info icon={Users} label="Cantidad de personas" value={place.crowd.replace("-", " ")} />
            <Info icon={Clock} label="Horarios tranquilos" value={place.quietHours} />
          </div>

          <div className="mt-6 rounded-3xl bg-secondary/50 border border-border/60 p-5">
            <div className="text-xs uppercase tracking-widest text-secondary-foreground/70">Ambiente emocional</div>
            <p className="font-display text-xl mt-1">{place.emotional}</p>
          </div>

          <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20">
            <Navigation className="w-4 h-4" /> Navegar
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-4 flex items-start gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-mist text-primary"><Icon className="w-4 h-4" /></span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium capitalize mt-0.5">{value}</div>
      </div>
    </div>
  );
}
