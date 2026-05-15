import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { PLACES, getCustomPlaces, PRICE_LABEL, CATEGORY_LABEL } from "@/lib/places";
import { addReview, averageRating, getReviews, type Review } from "@/lib/reviews-store";
import { Stars } from "@/components/Stars";
import {
  ArrowLeft, Clock, Lightbulb, Users, Volume2, Wind, Navigation, Wallet, ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/place/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Lugar — CalmPath` },
      { name: "description", content: `Información sensorial y emocional del lugar ${params.id}.` },
    ],
  }),
  component: PlacePage,
});

function PlacePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const place = [...PLACES, ...getCustomPlaces()].find((p) => p.id === id);
  const [reviews, setReviews] = useState<Review[]>(() => (place ? getReviews(place.id) : []));
  const [activeImg, setActiveImg] = useState(0);

  const avg = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    return { avg: reviews.reduce((s, r) => s + r.overall, 0) / reviews.length, count: reviews.length };
  }, [reviews]);

  if (!place) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="font-display text-3xl">Lugar no encontrado</h1>
          <Link to="/dashboard" className="text-primary underline mt-4 inline-block">
            Volver al mapa
          </Link>
        </div>
      </div>
    );
  }

  const noiseLabel = ["", "Muy silencioso", "Silencioso", "Moderado", "Activo", "Muy ruidoso"][place.noise];
  const images = place.images ?? [];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-8">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-sky/60 via-mist to-sage/60">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.05_85_/_0.6),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.9_0.06_165_/_0.7),transparent_60%)]" />
            )}
            <div className="absolute bottom-4 left-4 glass rounded-2xl px-4 py-2 text-sm">
              {CATEGORY_LABEL[place.type]} · {place.distanceKm.toFixed(1)} km
            </div>
            {place.minAge && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-destructive/90 text-destructive-foreground px-3 py-1 text-xs">
                <ShieldAlert className="w-3.5 h-3.5" /> +{place.minAge}
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border transition ${
                    i === activeImg ? "border-primary ring-2 ring-primary/30" : "border-border/60"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mt-6">
            <div>
              <h1 className="font-display text-4xl">{place.name}</h1>
              <p className="text-muted-foreground mt-2">{place.description}</p>
            </div>
            <div className="text-right shrink-0">
              <Stars value={avg.avg} />
              <div className="text-xs text-muted-foreground mt-1">
                {avg.count > 0 ? `${avg.avg.toFixed(1)} · ${avg.count} reseñas` : "Sin reseñas"}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <Info icon={Volume2} label="Nivel de ruido" value={noiseLabel} />
            <Info icon={Lightbulb} label="Iluminación" value={place.light} />
            <Info icon={Wind} label="Aroma" value={place.scent} />
            <Info icon={Users} label="Cantidad de personas" value={place.crowd.replace("-", " ")} />
            <Info icon={Clock} label="Horarios tranquilos" value={place.quietHours} />
            <Info icon={Wallet} label="Precio" value={PRICE_LABEL[place.priceLevel]} />
          </div>

          <div className="mt-6 rounded-3xl bg-secondary/50 border border-border/60 p-5">
            <div className="text-xs uppercase tracking-widest text-secondary-foreground/70">
              Ambiente emocional
            </div>
            <p className="font-display text-xl mt-1">{place.emotional}</p>
          </div>

          <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20">
            <Navigation className="w-4 h-4" /> Navegar
          </button>

          {/* Reviews */}
          <section className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl">Reseñas de la comunidad</h2>
              <span className="text-xs text-muted-foreground">{reviews.length} en total</span>
            </div>

            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <article key={r.id} className="rounded-2xl bg-card border border-border/60 p-5">
                  <header className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.author}</div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                    <Stars value={r.overall} size={16} />
                  </header>
                  <p className="text-sm mt-3 text-foreground/90">{r.comment}</p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <SubRating label="Ruido" v={r.noise} />
                    <SubRating label="Comodidad" v={r.comfort} />
                    <SubRating label="Ambiente" v={r.ambiance} />
                    <SubRating label="Seguridad" v={r.safety} />
                  </div>
                  {r.critique && (
                    <div className="mt-3 text-xs text-muted-foreground border-l-2 border-accent pl-3 italic">
                      Sugerencia: {r.critique}
                    </div>
                  )}
                </article>
              ))}
              {reviews.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Aún no hay reseñas. Sé la primera persona en compartir tu experiencia.
                </div>
              )}
            </div>

            <ReviewForm
              placeId={place.id}
              onAdd={(r) => {
                addReview(r);
                setReviews([r, ...reviews]);
              }}
            />
          </section>
        </motion.div>
      </div>
    </div>
  );
}

function SubRating({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-lg bg-mist px-2 py-1.5 flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{v}/5</span>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-4 flex items-start gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-mist text-primary">
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium capitalize mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function ReviewForm({ placeId, onAdd }: { placeId: string; onAdd: (r: Review) => void }) {
  const [author, setAuthor] = useState("");
  const [overall, setOverall] = useState(5);
  const [noise, setNoise] = useState(4);
  const [comfort, setComfort] = useState(4);
  const [ambiance, setAmbiance] = useState(4);
  const [safety, setSafety] = useState(5);
  const [comment, setComment] = useState("");
  const [critique, setCritique] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `r-${Date.now()}`,
      placeId,
      author: author.trim() || "Anónimo",
      date: new Date().toISOString().slice(0, 10),
      overall, noise, comfort, ambiance, safety,
      comment: comment.trim(),
      critique: critique.trim() || undefined,
    });
    setAuthor(""); setComment(""); setCritique("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2200);
  };

  return (
    <form onSubmit={submit} className="mt-8 rounded-3xl bg-card border border-border/60 p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl">Comparte tu experiencia</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Tus impresiones ayudan a otras personas sensibles a decidir.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className="flex-1 bg-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <Stars value={overall} onChange={setOverall} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SubInput label="Ruido" v={noise} setV={setNoise} />
        <SubInput label="Comodidad" v={comfort} setV={setComfort} />
        <SubInput label="Ambiente" v={ambiance} setV={setAmbiance} />
        <SubInput label="Seguridad" v={safety} setV={setSafety} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        required
        placeholder="¿Cómo te sentiste en este lugar?"
        className="w-full bg-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <textarea
        value={critique}
        onChange={(e) => setCritique(e.target.value)}
        rows={2}
        placeholder="Críticas o sugerencias (opcional)"
        className="w-full bg-mist rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {submitted && "¡Gracias! Tu reseña ya está visible."}
        </span>
        <button
          type="submit"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          Publicar reseña
        </button>
      </div>
    </form>
  );
}

function SubInput({ label, v, setV }: { label: string; v: number; setV: (n: number) => void }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <Stars value={v} onChange={setV} size={14} />
    </div>
  );
}
