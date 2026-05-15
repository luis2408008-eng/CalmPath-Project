import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { addFeedback, type FeedbackType } from "@/lib/feedback-store";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bug, Lightbulb, Sparkles, Check } from "lucide-react";
import { Stars } from "@/components/Stars";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Tu opinión — CalmPath" },
      { name: "description", content: "Reporta errores, comparte sugerencias o cuéntanos tu experiencia con CalmPath." },
    ],
  }),
  component: FeedbackPage,
});

const TYPES: { v: FeedbackType; label: string; icon: any; desc: string }[] = [
  { v: "bug", label: "Reportar un error", icon: Bug, desc: "Algo no funciona como esperabas." },
  { v: "sugerencia", label: "Sugerencia", icon: Lightbulb, desc: "Una idea para mejorar la app." },
  { v: "experiencia", label: "Tu experiencia", icon: Sparkles, desc: "Cuéntanos cómo te sientes usándola." },
];

function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>("sugerencia");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      id: `f-${Date.now()}`,
      type,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      message: message.trim(),
      rating: type === "experiencia" ? rating : undefined,
      date: new Date().toISOString().slice(0, 10),
    });
    setDone(true);
    setMessage("");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Retroalimentación</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Tu voz nos ayuda a crecer</h1>
        <p className="text-muted-foreground mt-2">
          CalmPath está pensada para acompañarte. Cuéntanos qué funciona, qué falla y qué te gustaría ver.
        </p>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 rounded-3xl bg-secondary/50 border border-border/60 p-10 text-center"
          >
            <span className="grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground mx-auto">
              <Check className="w-7 h-7" />
            </span>
            <div className="font-display text-2xl mt-4">Gracias por escribir</div>
            <p className="text-muted-foreground text-sm mt-1">Tu mensaje fue recibido. Cada palabra cuenta.</p>
            <button
              onClick={() => setDone(false)}
              className="mt-6 rounded-full bg-card border border-border px-5 py-2.5 text-sm hover:bg-mist transition"
            >
              Enviar otro
            </button>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="grid sm:grid-cols-3 gap-3">
              {TYPES.map((t) => {
                const active = type === t.v;
                const Icon = t.icon;
                return (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => setType(t.v)}
                    className={`text-left rounded-2xl border p-4 transition ${
                      active
                        ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                        : "bg-card border-border hover:bg-mist"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="font-medium mt-2 text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className={inputCls}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email (opcional)"
                className={inputCls}
              />
            </div>

            {type === "experiencia" && (
              <div className="rounded-2xl bg-mist p-4 flex items-center justify-between">
                <span className="text-sm">¿Qué tan a gusto te sientes con la app?</span>
                <Stars value={rating} onChange={setRating} />
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder={
                type === "bug"
                  ? "Describe lo que pasó y los pasos para reproducirlo…"
                  : type === "sugerencia"
                  ? "Cuéntanos tu idea con el mayor detalle posible…"
                  : "Comparte tu experiencia con CalmPath…"
              }
              className={inputCls}
            />

            <button
              type="submit"
              className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition text-sm";
