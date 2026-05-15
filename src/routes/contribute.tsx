import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { addCustomPlace, type Place, type PlaceCategory, CATEGORY_LABEL } from "@/lib/places";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ImagePlus, X } from "lucide-react";

export const Route = createFileRoute("/contribute")({
  head: () => ({
    meta: [
      { title: "Colaborar — CalmPath" },
      { name: "description", content: "Agrega un lugar a CalmPath y ayuda a la comunidad sensible." },
    ],
  }),
  component: Contribute,
});

const NOISE_LABEL = ["", "Muy silencioso", "Silencioso", "Moderado", "Activo", "Muy ruidoso"];

function Contribute() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [done, setDone] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "cafeteria" as PlaceCategory,
    noise: 2,
    light: "tenue" as Place["light"],
    scent: "",
    crowd: "muy-pocas" as Place["crowd"],
    priceLevel: 2 as 1 | 2 | 3,
    minAge: 0,
    description: "",
    emotional: "",
  });

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 5).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const place: Place = {
      id: `c-${Date.now()}`,
      name: form.name,
      type: form.type,
      description: form.description,
      noise: form.noise as 1 | 2 | 3 | 4 | 5,
      light: form.light,
      crowd: form.crowd,
      scent: form.scent || "neutro",
      vibe: form.noise <= 2 ? "calmante" : form.noise >= 4 ? "estimulante" : "neutral",
      distanceKm: Number((Math.random() * 3).toFixed(1)),
      quietHours: "—",
      tags: [],
      emotional: form.emotional || "Sin descripción",
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      priceLevel: form.priceLevel,
      minAge: form.minAge > 0 ? form.minAge : undefined,
      images,
    };
    addCustomPlace(place);
    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1100);
  };

  const upd = (k: keyof typeof form) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Panel de colaboradores</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Comparte un lugar</h1>
        <p className="text-muted-foreground mt-2">
          Ayuda a personas sensibles a encontrar espacios donde puedan estar bien.
        </p>

        {done ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-10 text-center rounded-3xl bg-secondary/50 border border-border/60 p-10"
          >
            <span className="grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground mx-auto">
              <Check className="w-7 h-7" />
            </span>
            <div className="font-display text-2xl mt-4">¡Gracias por contribuir!</div>
            <p className="text-muted-foreground text-sm mt-1">Tu lugar ya aparece en el mapa.</p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <Row label="Nombre del lugar">
              <Input value={form.name} onChange={upd("name")} required placeholder="Ej. Café Susurro" />
            </Row>

            <Row label="Categoría">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(Object.keys(CATEGORY_LABEL) as PlaceCategory[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-3 py-2.5 rounded-2xl text-xs border transition ${
                      form.type === t
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-card border-border hover:bg-mist"
                    }`}
                  >
                    {CATEGORY_LABEL[t]}
                  </button>
                ))}
              </div>
            </Row>

            {/* Image upload */}
            <Row label="Imágenes del lugar (máx. 5)">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-border/60">
                    <img src={src} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1.5 right-1.5 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                      aria-label="Eliminar imagen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-border/80 hover:border-primary hover:bg-mist transition flex flex-col items-center justify-center gap-1 text-muted-foreground"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[11px]">Subir</span>
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => onFiles(e.target.files)}
              />
            </Row>

            <Row label={`Nivel de ruido — ${NOISE_LABEL[form.noise]}`}>
              <input
                type="range"
                min={1}
                max={5}
                value={form.noise}
                onChange={(e) => setForm({ ...form, noise: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </Row>

            <Row label="Iluminación">
              <select value={form.light} onChange={upd("light")} className={inputCls}>
                {["tenue", "natural", "calida", "fria", "brillante"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Row>

            <Row label="Aroma característico (olor predominante)">
              <Input value={form.scent} onChange={upd("scent")} placeholder="café, lavanda, naturaleza, neutro…" />
            </Row>

            <Row label="Cantidad de personas">
              <select value={form.crowd} onChange={upd("crowd")} className={inputCls}>
                <option value="muy-pocas">Muy pocas</option>
                <option value="moderado">Moderado</option>
                <option value="social">Social</option>
                <option value="concurrido">Concurrido</option>
              </select>
            </Row>

            <Row label="Rango de precio">
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setForm({ ...form, priceLevel: n as 1 | 2 | 3 })}
                    className={`flex-1 py-3 rounded-2xl border transition ${
                      form.priceLevel === n
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-mist"
                    }`}
                  >
                    {"$".repeat(n)}
                  </button>
                ))}
              </div>
            </Row>

            <Row label="Edad mínima recomendada (0 si no aplica)">
              <Input
                type="number"
                min={0}
                max={21}
                value={form.minAge}
                onChange={(e) => setForm({ ...form, minAge: Number(e.target.value) || 0 })}
              />
            </Row>

            <Row label="Descripción">
              <textarea value={form.description} onChange={upd("description")} rows={3} className={inputCls} />
            </Row>

            <Row label="Ambiente emocional">
              <Input
                value={form.emotional}
                onChange={upd("emotional")}
                placeholder="Refugio acogedor para pensar despacio…"
              />
            </Row>

            <button
              type="submit"
              className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              Publicar lugar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition";
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      {children}
    </div>
  );
}
