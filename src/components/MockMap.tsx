import type { Scored } from "@/lib/places";
import { motion } from "framer-motion";

export function MockMap({ places, selectedId, onSelect }: { places: Scored[]; selectedId?: string; onSelect?: (id: string) => void }) {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-sky/40 via-mist to-sage/40">
      {/* abstract terrain */}
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 70" preserveAspectRatio="none">
        <defs>
          <linearGradient id="river" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.07 225)" />
            <stop offset="100%" stopColor="oklch(0.78 0.09 220)" />
          </linearGradient>
        </defs>
        <path d="M-2 50 C 20 40, 35 60, 55 48 S 90 45, 105 55 L 105 75 L -2 75 Z" fill="oklch(0.92 0.05 165 / 0.6)" />
        <path d="M-5 30 C 25 25, 50 45, 75 30 S 105 28, 110 32" stroke="url(#river)" strokeWidth="3" fill="none" opacity="0.7" />
        <circle cx="20" cy="15" r="6" fill="oklch(0.9 0.04 165)" opacity="0.5" />
        <circle cx="80" cy="12" r="4" fill="oklch(0.9 0.04 165)" opacity="0.5" />
      </svg>

      {/* current user pulse */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
        <div className="relative">
          <span className="absolute inset-0 -m-3 rounded-full bg-primary/30 breathe" />
          <span className="block w-3 h-3 rounded-full bg-primary ring-4 ring-white/70" />
        </div>
      </div>

      {places.slice(0, 8).map((p, i) => (
        <motion.button
          key={p.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          onClick={() => onSelect?.(p.id)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={p.name}
        >
          <span className={`block rounded-full transition-all ring-2 ring-white shadow-md
            ${selectedId === p.id ? "w-5 h-5 bg-primary" : p.vibe === "calmante" ? "w-3.5 h-3.5 bg-secondary-foreground/70" : "w-3.5 h-3.5 bg-accent-foreground/70"}`} />
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-foreground opacity-0 group-hover:opacity-100 transition shadow">
            {p.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
