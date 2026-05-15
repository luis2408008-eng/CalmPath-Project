import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { defaultProfile, useProfile, type SensoryProfile, type Mood, type Need, type Budget } from "@/lib/profile-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Tu perfil sensorial — CalmPath" },
      { name: "description", content: "Configura tu perfil sensorial y emocional para recibir recomendaciones personalizadas." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Sobre ti", "Presupuesto", "Vista", "Oído", "Olfato y entorno", "Cómo te sientes", "Tus lugares"] as const;

function Onboarding() {
  const { profile, save } = useProfile();
  const [data, setData] = useState<SensoryProfile>(profile ?? defaultProfile);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const update = <K extends keyof SensoryProfile>(k: K, v: SensoryProfile[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const next = () => {
    if (step === STEPS.length - 1) {
      save(data);
      navigate({ to: "/dashboard" });
    } else setStep((s) => s + 1);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-10">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Paso {step + 1} de {STEPS.length}</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">{STEPS[step]}</h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-6"
          >
            {step === 0 && <BasicStep data={data} update={update} />}
            {step === 1 && <BudgetStep data={data} update={update} />}
            {step === 2 && <SightStep data={data} update={update} />}
            {step === 3 && <HearingStep data={data} update={update} />}
            {step === 4 && <ScentStep data={data} update={update} />}
            {step === 5 && <EmotionStep data={data} update={update} />}
            {step === 6 && <FavoritesStep data={data} update={update} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-muted-foreground disabled:opacity-30 hover:text-foreground transition"
          >
            ← Atrás
          </button>
          <button
            onClick={next}
            className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            {step === STEPS.length - 1 ? "Ver recomendaciones" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      {children}
    </div>
  );
}

function Chips<T extends string>({ value, options, onChange, multi = false }: {
  value: T | T[]; options: { v: T; label: string }[]; onChange: (v: any) => void; multi?: boolean;
}) {
  const isActive = (v: T) => Array.isArray(value) ? value.includes(v) : value === v;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = isActive(o.v);
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => {
              if (multi) {
                const arr = (value as T[]).includes(o.v)
                  ? (value as T[]).filter((x) => x !== o.v)
                  : [...(value as T[]), o.v];
                onChange(arr);
              } else onChange(o.v);
            }}
            className={`px-4 py-2 rounded-full text-sm border transition flex items-center gap-1.5 ${
              active ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-card border-border hover:bg-mist"
            }`}
          >
            {active && <Check className="w-3.5 h-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ScaleField({ label, value, onChange, min = 1, max = 5, minLabel, maxLabel }: any) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-24">{minLabel}</span>
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <span className="text-xs text-muted-foreground w-24 text-right">{maxLabel}</span>
      </div>
      <div className="text-center text-sm font-medium text-primary mt-1">{value}</div>
    </Field>
  );
}

function BasicStep({ data, update }: any) {
  return (
    <>
      <Field label="Tu nombre">
        <input
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="¿Cómo te llamas?"
          className="w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Edad">
          <input type="number" value={data.age ?? ""} onChange={(e) => update("age", Number(e.target.value) || undefined)}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition" />
        </Field>
        <Field label="Ciudad">
          <input value={data.city ?? ""} onChange={(e) => update("city", e.target.value)}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition" />
        </Field>
      </div>
    </>
  );
}

function BudgetStep({ data, update }: any) {
  const options: { v: Budget; label: string; hint: string }[] = [
    { v: "bajo", label: "Bajo", hint: "Lugares gratuitos o económicos" },
    { v: "medio", label: "Medio", hint: "Cafés, restaurantes accesibles" },
    { v: "alto", label: "Alto", hint: "Sin restricciones de precio" },
  ];
  return (
    <>
      <Field label="¿Cuál es tu presupuesto disponible?">
        <div className="grid grid-cols-3 gap-2">
          {options.map((o) => {
            const active = data.budget === o.v;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => update("budget", o.v)}
                className={`text-left rounded-2xl border p-4 transition ${
                  active
                    ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                    : "bg-card border-border hover:bg-mist"
                }`}
              >
                <div className="font-display text-lg">{o.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{o.hint}</div>
              </button>
            );
          })}
        </div>
      </Field>
      <Field label={`Gasto aproximado por visita: ${data.spendApprox ?? 0}`}>
        <input
          type="range"
          min={0}
          max={80}
          step={5}
          value={data.spendApprox ?? 0}
          onChange={(e) => update("spendApprox", Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Gratis</span><span>$$$</span>
        </div>
      </Field>
    </>
  );
}


  return (
    <>
      <Field label="¿Qué tipo de iluminación prefieres?">
        <Chips value={data.lighting} onChange={(v: any) => update("lighting", v)} options={[
          { v: "tenue", label: "Luz tenue" },
          { v: "natural", label: "Luz natural" },
          { v: "calida", label: "Luces cálidas" },
          { v: "fria", label: "Luces frías" },
          { v: "brillante", label: "Luz brillante" },
        ]} />
      </Field>
    </>
  );
}

function HearingStep({ data, update }: any) {
  return (
    <>
      <ScaleField label="¿Qué nivel de ruido toleras?" value={data.noiseTolerance} onChange={(v: any) => update("noiseTolerance", v)}
        minLabel="Muy silencioso" maxLabel="Ambiente activo" />
    </>
  );
}

function ScentStep({ data, update }: any) {
  return (
    <>
      <Field label="¿Qué aromas te relajan?">
        <Chips multi value={data.scents} onChange={(v: any) => update("scents", v)} options={[
          { v: "café", label: "Café" },
          { v: "naturaleza", label: "Naturaleza" },
          { v: "lavanda", label: "Lavanda" },
          { v: "dulces", label: "Dulces" },
          { v: "neutro", label: "Sin olores fuertes" },
        ]} />
      </Field>
      <ScaleField label="Sensibilidad a olores" value={data.scentSensitivity} onChange={(v: any) => update("scentSensitivity", v)}
        minLabel="Baja" maxLabel="Alta" />
      <Field label="Cantidad de personas que prefieres">
        <Chips value={data.crowd} onChange={(v: any) => update("crowd", v)} options={[
          { v: "muy-pocas", label: "Muy pocas" },
          { v: "moderado", label: "Moderado" },
          { v: "social", label: "Ambiente social" },
          { v: "concurrido", label: "Concurrido" },
        ]} />
      </Field>
      <Field label="Clima preferido">
        <Chips value={data.weather} onChange={(v: any) => update("weather", v)} options={[
          { v: "fresco", label: "Fresco" }, { v: "templado", label: "Templado" }, { v: "calido", label: "Cálido" },
        ]} />
      </Field>
    </>
  );
}

function EmotionStep({ data, update }: any) {
  return (
    <>
      <Field label="Ahora mismo necesito…">
        <Chips value={data.need} onChange={(v: Need) => update("need", v)} options={[
          { v: "calmarme", label: "Calmarme" },
          { v: "estimularme", label: "Estimularme" },
        ]} />
      </Field>
      <ScaleField label="Nivel de energía" value={data.energy} onChange={(v: any) => update("energy", v)} min={1} max={10}
        minLabel="Muy bajo" maxLabel="Muy alto" />
      <Field label="¿Cómo te sientes?">
        <Chips value={data.mood} onChange={(v: Mood) => update("mood", v)} options={[
          { v: "ansioso", label: "Ansioso" },
          { v: "estresado", label: "Estresado" },
          { v: "saturado", label: "Saturado" },
          { v: "cansado", label: "Cansado" },
          { v: "desmotivado", label: "Desmotivado" },
          { v: "tranquilo", label: "Tranquilo" },
          { v: "feliz", label: "Feliz" },
          { v: "concentracion", label: "Necesito concentrarme" },
        ]} />
      </Field>
    </>
  );
}

function FavoritesStep({ data, update }: any) {
  return (
    <Field label="¿Qué tipos de lugares te gustan?">
      <Chips multi value={data.favorites} onChange={(v: any) => update("favorites", v)} options={[
        { v: "cafeterias", label: "Cafeterías" },
        { v: "museos", label: "Museos" },
        { v: "bibliotecas", label: "Bibliotecas" },
        { v: "parques", label: "Parques" },
        { v: "coworkings", label: "Coworkings" },
        { v: "restaurantes", label: "Restaurantes tranquilos" },
        { v: "naturales", label: "Espacios naturales" },
        { v: "creativos", label: "Espacios creativos" },
      ]} />
    </Field>
  );
}
