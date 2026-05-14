import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { MapPin, Sparkles, Wind, HeartPulse, Headphones, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalmPath — Encuentra lugares para tu estado emocional" },
      { name: "description", content: "Descubre cafés, parques, museos y bibliotecas según tu sensibilidad sensorial y tu estado de ánimo." },
      { property: "og:title", content: "CalmPath — Lugares para tu calma" },
      { property: "og:description", content: "Recomendaciones de lugares según ruido, luz, aromas y tu estado emocional." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/80 bg-primary/10 px-3 py-1.5 rounded-full">
              <Leaf className="w-3.5 h-3.5" /> Bienestar sensorial
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl mt-6 leading-[0.95]">
              Encuentra el lugar<br />que tu mente necesita.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              CalmPath recomienda cafeterías, parques, bibliotecas y museos según tu sensibilidad al ruido,
              la luz, los aromas y tu estado emocional actual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/onboarding"
                className="rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                Comenzar mi perfil
              </Link>
              <Link
                to="/dashboard"
                className="rounded-full bg-card border border-border px-6 py-3.5 text-sm font-medium hover:bg-mist transition"
              >
                Explorar mapa
              </Link>
            </div>
          </motion.div>

          {/* Visual mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-sky/60 via-mist to-sage/60 p-6 shadow-2xl shadow-primary/10 border border-white/60">
                <div className="glass rounded-2xl p-4 shadow-md">
                  <div className="text-xs text-muted-foreground">Ahora cerca de ti</div>
                  <div className="font-display text-xl mt-1">Café Susurro</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {["Silencioso", "Luz tenue", "Aroma suave"].map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/80 border border-border/60">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 relative h-56 rounded-2xl bg-white/40 overflow-hidden border border-white/50">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,oklch(0.92_0.05_165_/_0.5),transparent_60%)]" />
                  <div className="absolute" style={{ left: "50%", top: "50%" }}>
                    <span className="absolute inset-0 -m-3 rounded-full bg-primary/30 breathe" />
                    <span className="block w-3 h-3 rounded-full bg-primary ring-4 ring-white" />
                  </div>
                  {[{x:25,y:30},{x:70,y:25},{x:35,y:70},{x:75,y:65}].map((p,i)=>(
                    <span key={i} className="absolute w-2.5 h-2.5 rounded-full bg-secondary-foreground/60 ring-2 ring-white" style={{left:`${p.x}%`,top:`${p.y}%`}}/>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[{n:"Biblioteca Aurora",t:"1.1 km"},{n:"Parque Niebla",t:"0.8 km"}].map(c => (
                    <div key={c.n} className="glass rounded-xl p-3">
                      <div className="text-sm font-medium">{c.n}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{c.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2 className="font-display text-3xl sm:text-4xl text-center max-w-2xl mx-auto">
          Diseñado para tu sistema nervioso
        </h2>
        <p className="text-center text-muted-foreground mt-3 max-w-xl mx-auto">
          Reduce sobreestimulación o aumenta energía positiva, según lo que tu cuerpo y mente necesitan hoy.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: HeartPulse, title: "Perfil sensorial", desc: "Captura tu sensibilidad al ruido, luz, aromas y multitudes." },
            { icon: Sparkles, title: "Estado emocional", desc: "Indica cómo te sientes y qué necesitas: calma o estímulo." },
            { icon: MapPin, title: "Mapa cercano", desc: "Lugares filtrados por compatibilidad sensorial y distancia." },
            { icon: Wind, title: "Etiquetas claras", desc: "Silencioso, luz tenue, poca gente, aroma suave y más." },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-3xl p-6 border border-border/60"
            >
              <span className="grid place-items-center w-10 h-10 rounded-2xl bg-secondary text-secondary-foreground">
                <b.icon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-lg mt-4">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-secondary/40 border border-border/60 p-10 text-center">
          <Headphones className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-display text-2xl sm:text-3xl mt-4">Tu próxima pausa, hecha a tu medida.</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Crea tu perfil en menos de un minuto y descubre lugares que respetan tus sentidos.</p>
          <Link to="/onboarding" className="inline-block mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition">
            Comenzar
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        CalmPath · Prototipo de bienestar sensorial
      </footer>
    </div>
  );
}
