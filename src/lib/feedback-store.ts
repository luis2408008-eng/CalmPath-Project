export type FeedbackType = "bug" | "sugerencia" | "experiencia";

export interface Feedback {
  id: string;
  type: FeedbackType;
  name?: string;
  email?: string;
  message: string;
  rating?: number;
  date: string;
}

const KEY = "calmpath:feedback";

export function getFeedback(): Feedback[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function addFeedback(f: Feedback) {
  const all = getFeedback();
  all.unshift(f);
  localStorage.setItem(KEY, JSON.stringify(all));
}
