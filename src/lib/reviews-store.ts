export interface Review {
  id: string;
  placeId: string;
  author: string;
  date: string;
  overall: number; // 1-5
  noise: number;
  comfort: number;
  ambiance: number;
  safety: number;
  comment: string;
  critique?: string;
}

const KEY = "calmpath:reviews";

const SEED: Review[] = [
  { id: "r1", placeId: "1", author: "Lucía", date: "2025-04-12", overall: 5, noise: 5, comfort: 5, ambiance: 5, safety: 5,
    comment: "Mi rincón favorito para escribir por las mañanas. La música apenas se escucha." },
  { id: "r2", placeId: "1", author: "Ander", date: "2025-03-30", overall: 4, noise: 4, comfort: 5, ambiance: 5, safety: 4,
    comment: "Acogedor y con personal amable. A veces se llena los sábados.", critique: "Más mesas individuales sería ideal." },
  { id: "r3", placeId: "2", author: "Marta", date: "2025-04-02", overall: 5, noise: 5, comfort: 4, ambiance: 5, safety: 5,
    comment: "Silencio absoluto y luz hermosa en la sala principal." },
  { id: "r4", placeId: "3", author: "Iván", date: "2025-04-18", overall: 5, noise: 4, comfort: 4, ambiance: 5, safety: 4,
    comment: "Caminar por aquí me ordena la cabeza. El sonido del río es terapia." },
  { id: "r5", placeId: "5", author: "Noa", date: "2025-04-22", overall: 4, noise: 3, comfort: 4, ambiance: 5, safety: 5,
    comment: "Energía creativa muy bonita, ideal para colaborar." },
];

function readAll(): Review[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}

export function getReviews(placeId: string): Review[] {
  return readAll().filter((r) => r.placeId === placeId).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function addReview(r: Review) {
  const all = readAll();
  all.unshift(r);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function averageRating(placeId: string): { avg: number; count: number } {
  const rs = getReviews(placeId);
  if (!rs.length) return { avg: 0, count: 0 };
  const avg = rs.reduce((s, r) => s + r.overall, 0) / rs.length;
  return { avg, count: rs.length };
}
