import { useEffect, useState } from "react";

export type Mood =
  | "ansioso" | "estresado" | "cansado" | "tranquilo"
  | "desmotivado" | "saturado" | "feliz" | "concentracion";

export type Need = "calmarme" | "estimularme";
export type Budget = "bajo" | "medio" | "alto";

export interface SensoryProfile {
  name: string;
  age?: number;
  city?: string;
  budget: Budget;
  spendApprox?: number; // monedas locales aproximadas por visita
  noiseTolerance: 1 | 2 | 3 | 4 | 5;
  lighting: "tenue" | "natural" | "brillante" | "calida" | "fria";
  scents: string[];
  scentSensitivity: number;
  crowd: "muy-pocas" | "moderado" | "social" | "concurrido";
  weather: "fresco" | "templado" | "calido";
  need: Need;
  energy: number;
  mood: Mood;
  favorites: string[];
}

const KEY = "calmpath:profile";

export const defaultProfile: SensoryProfile = {
  name: "",
  age: undefined,
  budget: "medio",
  spendApprox: 15,
  noiseTolerance: 2,
  lighting: "tenue",
  scents: ["naturaleza"],
  scentSensitivity: 3,
  crowd: "muy-pocas",
  weather: "templado",
  need: "calmarme",
  energy: 5,
  mood: "tranquilo",
  favorites: ["cafeterias", "parques"],
};

export function useProfile() {
  const [profile, setProfile] = useState<SensoryProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // backfill defaults for older profiles
        setProfile({ ...defaultProfile, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  const save = (p: SensoryProfile) => {
    setProfile(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  };
  const clear = () => {
    setProfile(null);
    localStorage.removeItem(KEY);
  };
  return { profile, save, clear, loaded };
}
