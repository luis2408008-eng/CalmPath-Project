import type { SensoryProfile } from "./profile-store";

export type SensoryTag =
  | "silencioso" | "luz-tenue" | "aroma-suave" | "poca-gente"
  | "energetico" | "social" | "luz-natural" | "musica-suave"
  | "naturaleza" | "creativo";

export interface Place {
  id: string;
  name: string;
  type: "cafeteria" | "biblioteca" | "parque" | "museo" | "coworking" | "restaurante" | "creativo";
  description: string;
  noise: 1 | 2 | 3 | 4 | 5;
  light: "tenue" | "natural" | "brillante" | "calida" | "fria";
  crowd: "muy-pocas" | "moderado" | "social" | "concurrido";
  scent: string;
  vibe: "calmante" | "estimulante" | "neutral";
  distanceKm: number;
  quietHours: string;
  tags: SensoryTag[];
  emotional: string;
  // grid coords on mock map (0-100)
  x: number;
  y: number;
}

export const PLACES: Place[] = [
  { id: "1", name: "Café Susurro", type: "cafeteria", description: "Cafetería de especialidad con rincones íntimos y música acústica baja.", noise: 2, light: "tenue", crowd: "muy-pocas", scent: "café tostado", vibe: "calmante", distanceKm: 0.4, quietHours: "9–11 · 15–17", tags: ["silencioso","luz-tenue","aroma-suave","musica-suave"], emotional: "Refugio acogedor para pensar despacio.", x: 28, y: 35 },
  { id: "2", name: "Biblioteca Aurora", type: "biblioteca", description: "Sala de lectura silenciosa con luz natural filtrada y plantas.", noise: 1, light: "natural", crowd: "muy-pocas", scent: "papel y madera", vibe: "calmante", distanceKm: 1.1, quietHours: "Todo el día", tags: ["silencioso","poca-gente","luz-natural"], emotional: "Calma profunda, sensación de orden.", x: 62, y: 22 },
  { id: "3", name: "Parque Niebla", type: "parque", description: "Sendero arbolado junto al río, sonido de agua y aves.", noise: 2, light: "natural", crowd: "moderado", scent: "naturaleza", vibe: "calmante", distanceKm: 0.8, quietHours: "Mañanas temprano", tags: ["naturaleza","aroma-suave","luz-natural"], emotional: "Reconexión, respiración amplia.", x: 18, y: 70 },
  { id: "4", name: "Museo del Silencio", type: "museo", description: "Salas amplias con instalaciones sonoras minimalistas.", noise: 1, light: "tenue", crowd: "moderado", scent: "neutro", vibe: "calmante", distanceKm: 2.3, quietHours: "11–13", tags: ["silencioso","luz-tenue","poca-gente"], emotional: "Contemplación serena.", x: 75, y: 60 },
  { id: "5", name: "Estudio Norte", type: "creativo", description: "Coworking creativo con luz cálida, plantas y café siempre listo.", noise: 3, light: "calida", crowd: "social", scent: "café", vibe: "estimulante", distanceKm: 1.6, quietHours: "—", tags: ["energetico","social","creativo","musica-suave"], emotional: "Energía cálida para crear.", x: 50, y: 50 },
  { id: "6", name: "Mercado Lumen", type: "restaurante", description: "Mercado gastronómico vibrante con luz natural y colores.", noise: 4, light: "brillante", crowd: "concurrido", scent: "comida", vibe: "estimulante", distanceKm: 1.2, quietHours: "—", tags: ["energetico","social"], emotional: "Estímulo positivo, vida urbana.", x: 80, y: 30 },
  { id: "7", name: "Jardín Botánico Sur", type: "parque", description: "Invernadero con humedad cálida y aroma a tierra húmeda.", noise: 2, light: "natural", crowd: "moderado", scent: "lavanda y tierra", vibe: "calmante", distanceKm: 3.2, quietHours: "Cualquier hora", tags: ["naturaleza","aroma-suave","luz-natural","poca-gente"], emotional: "Sensorial suave, despierta sentidos.", x: 35, y: 82 },
  { id: "8", name: "Studio Vinilo", type: "cafeteria", description: "Café con vinilos de jazz suave y luz de tungsteno.", noise: 3, light: "calida", crowd: "social", scent: "café", vibe: "estimulante", distanceKm: 0.6, quietHours: "Tardes", tags: ["musica-suave","social","creativo"], emotional: "Cálido, ligeramente social.", x: 42, y: 18 },
];

export interface Scored extends Place {
  score: number;
  matchReasons: string[];
}

export function recommendPlaces(profile: SensoryProfile): Scored[] {
  const wantsCalm = profile.need === "calmarme";
  return PLACES.map((p) => {
    let score = 50;
    const reasons: string[] = [];

    // Vibe match
    if (wantsCalm && p.vibe === "calmante") { score += 25; reasons.push("Ambiente calmante"); }
    if (!wantsCalm && p.vibe === "estimulante") { score += 25; reasons.push("Ambiente estimulante"); }

    // Noise tolerance: profile.noiseTolerance is what they tolerate
    const noiseDiff = profile.noiseTolerance - p.noise;
    if (noiseDiff >= 0) score += 10; else score -= Math.abs(noiseDiff) * 8;

    // Lighting
    if (profile.lighting === p.light) { score += 10; reasons.push("Iluminación ideal"); }

    // Crowd
    if (profile.crowd === p.crowd) { score += 10; reasons.push("Cantidad de personas que prefieres"); }

    // Mood adjustments
    const calmingMoods: typeof profile.mood[] = ["ansioso","estresado","saturado"];
    if (calmingMoods.includes(profile.mood) && p.vibe === "calmante") { score += 10; reasons.push(`Bueno para ${profile.mood}`); }
    if (profile.mood === "desmotivado" && p.vibe === "estimulante") { score += 10; reasons.push("Activa la energía"); }
    if (profile.mood === "concentracion" && p.tags.includes("silencioso")) { score += 8; reasons.push("Apto para concentrarse"); }

    // Favorites
    const typeMap: Record<string,string> = {
      cafeterias: "cafeteria", bibliotecas: "biblioteca", parques: "parque",
      museos: "museo", coworkings: "coworking", restaurantes: "restaurante",
      naturales: "parque", creativos: "creativo",
    };
    if (profile.favorites.some((f) => typeMap[f] === p.type)) { score += 8; reasons.push("Tipo favorito"); }

    // Scent
    if (profile.scents.some((s) => p.scent.toLowerCase().includes(s))) { score += 5; }

    return { ...p, score: Math.max(0, Math.min(100, score)), matchReasons: reasons };
  }).sort((a, b) => b.score - a.score);
}

const STORE_KEY = "calmpath:custom-places";
export function getCustomPlaces(): Place[] {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch { return []; }
}
export function addCustomPlace(p: Place) {
  const all = getCustomPlaces();
  all.unshift(p);
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}
