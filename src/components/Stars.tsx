import { Star } from "lucide-react";

export function Stars({ value, onChange, size = 18 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const interactive = !!onChange;
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            className={interactive ? "cursor-pointer hover:scale-110 transition" : "cursor-default"}
            aria-label={`${n} estrellas`}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? "fill-primary text-primary" : "text-muted-foreground/40"}
            />
          </button>
        );
      })}
    </div>
  );
}
