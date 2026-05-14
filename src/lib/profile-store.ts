import { useEffect, useState } from "react";

export type Mood =
  | "ansioso" | "estresado" | "cansado" | "tranquilo"
  | "desmotivado" | "saturado" | "feliz" | "concentracion";

export type Need = "calmarme" | "estimularme";

export interface SensoryProfile {
  name: string;
  age?: number;
  city?: string;
  noiseTolerance: 1 | 2 | 3 | 4 | 5; // 1 muy silencioso - 5 muy ruidoso ok
  lighting: "tenue" | "natural" | "brillante" | "calida" | "fria";
  scents: string[];
  scentSensitivity: number; // 1-5
  crowd: "muy-pocas" | "moderado" | "social" | "concurrido";
  weather: "fresco" | "templado" | "calido";
  need: Need;
  energy: number; // 1-10
  mood: Mood;
  favorites: string[];
}

const KEY = "calmpath:profile";

export const defaultProfile: SensoryProfile = {
  name: "",
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
      if (raw) setProfile(JSON.parse(raw));
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
