import type { Scored } from "@/lib/places";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { averageRating } from "@/lib/reviews-store";

const TAG_LABEL: Record<string, string> = {
  silencioso: "Silencioso",
  "luz-tenue": "Luz tenue",
  "aroma-suave": "Aroma suave",
  "poca-gente": "Poca gente",
  energetico: "Energético",
  social: "Social",
  "luz-natural": "Luz natural",
  "musica-suave": "Música suave",
  naturaleza: "Naturaleza",
  creativo: "Creativo",
};

export function PlaceCard({ place, onClick, index = 0 }: { place: Scored; onClick?: () => void; index?: number }) {
  const rating = typeof window !== "undefined" ? averageRating(place.id) : { avg: 0, count: 0 };
  const calmShare = place.vibe === "calmante" ? place.score : 100 - place.score;
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="text-left w-full bg-card rounded-3xl p-5 border border-border/70 shadow-[0_2px_20px_-12px_oklch(0.6_0.08_220/0.4)] hover:shadow-[0_10px_30px_-12px_oklch(0.6_0.08_220/0.5)] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{place.type}</div>
          <h3 className="font-display text-xl mt-0.5">{place.name}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${place.vibe === "calmante" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
          {place.vibe === "calmante" ? "Calmante" : place.vibe === "estimulante" ? "Estimulante" : "Neutral"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{place.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {place.tags.slice(0, 4).map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-mist text-foreground/70 border border-border/60">
            {TAG_LABEL[t] ?? t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{place.distanceKm.toFixed(1)} km</span>
          <span className="text-foreground/70">{"$".repeat(place.priceLevel)}</span>
          {rating.count > 0 && (
            <span className="inline-flex items-center gap-0.5 text-foreground/70">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />{rating.avg.toFixed(1)}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${place.score}%` }}
            />
          </div>
          <span className="tabular-nums text-foreground/70">{Math.round(calmShare)}%</span>
        </div>
      </div>
    </motion.button>
  );
}
