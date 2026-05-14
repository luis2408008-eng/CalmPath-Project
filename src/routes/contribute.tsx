import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { addCustomPlace, type Place } from "@/lib/places";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const Route = createFileRoute("/contribute")({
  head: () => ({
    meta: [
      { title: "Colaborar — CalmPath" },
      { name: "description", content: "Agrega un lugar a CalmPath y ayuda a la comunidad sensible." },
    ],
  }),
  component: Contribute,
});

function Contribute() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "cafeteria" as Place["type"], noise: 2,
    light: "tenue" as Place["light"], scent: "", crowd: "muy-pocas" as Place["crowd"],
    description: "", emotional: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const place: Place = {
      id: `c-${Date.now()}`,
      name: form.name, type: form.type, description: form.description,
      noise: form.noise as any, light: form.light, crowd: form.crowd,
      scent: form.scent || "neutro",
      vibe: form.noise <= 2 ? "calmante" : form.noise >= 4 ? "estimulante" : "neutral",
      distanceKm: Number((Math.random() * 3).toFixed(1)),
      quietHours: "—",
      tags: [],
      emotional: form.emotional || "Sin descripción",
      x: 20 + Math.random() * 60, y: 20 + Math.random() * 60,
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
        <p className="text-muted-foreground mt-2">Ayuda a personas sensibles a encontrar espacios donde puedan estar bien.</p>

        {done ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="mt-10 text-center rounded-3xl bg-secondary/50 border border-border/60 p-10">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground mx-auto"><Check className="w-7 h-7" /></span>
            <div className="font-display text-2xl mt-4">¡Gracias por contribuir!</div>
            <p className="text-muted-foreground text-sm mt-1">Tu lugar ya aparece en el mapa.</p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <Row label="Nombre del lugar"><Input value={form.name} onChange={upd("name")} required /></Row>
            <Row label="Tipo">
              <select value={form.type} onChange={upd("type")} className={inputCls}>
                {["cafeteria","biblioteca","parque","museo","coworking","restaurante","creativo"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Row>
            <Row label={`Nivel de ruido (${form.noise}/5)`}>
              <input type="range" min={1} max={5} value={form.noise} onChange={(e)=>setForm({...form, noise:Number(e.target.value)})} className="w-full accent-primary" />
            </Row>
            <Row label="Iluminación">
              <select value={form.light} onChange={upd("light")} className={inputCls}>
                {["tenue","natural","calida","fria","brillante"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Row>
            <Row label="Aroma característico"><Input value={form.scent} onChange={upd("scent")} placeholder="café, lavanda, naturaleza…" /></Row>
            <Row label="Cantidad de personas">
              <select value={form.crowd} onChange={upd("crowd")} className={inputCls}>
                <option value="muy-pocas">Muy pocas</option>
                <option value="moderado">Moderado</option>
                <option value="social">Social</option>
                <option value="concurrido">Concurrido</option>
              </select>
            </Row>
            <Row label="Descripción"><textarea value={form.description} onChange={upd("description")} rows={3} className={inputCls} /></Row>
            <Row label="Descripción emocional"><Input value={form.emotional} onChange={upd("emotional")} placeholder="Refugio acogedor para pensar…" /></Row>

            <button type="submit" className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20">
              Publicar lugar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition";
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={inputCls} />; }
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="text-sm font-medium mb-2">{label}</div>{children}</div>;
}
