import { Sparkles } from "./Sparkles";
import type { ThemeSettings } from "@/lib/types";

// Site-wide animated backdrop — pattern & colours come from the admin theme.
export function AnimatedBackground({ theme }: { theme?: ThemeSettings }) {
  const pattern = theme?.pattern ?? "sparkles";
  const accent = theme?.accent ?? "#F4F4F4";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {pattern === "sparkles" && <Sparkles color={accent} />}

      {pattern === "grid" && <div className="absolute inset-0 bg-grid" />}

      {pattern === "dots" && <div className="absolute inset-0 bg-dots" />}

      {pattern === "aurora" && (
        <>
          <div
            className="absolute -left-[10%] top-[6%] h-[46rem] w-[46rem] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${hexA(accent, 0.16)}, transparent 62%)`,
              animation: "aurora-1 24s ease-in-out infinite",
            }}
          />
          <div
            className="absolute right-[-8%] top-[28%] h-[40rem] w-[40rem] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${hexA(accent, 0.12)}, transparent 62%)`,
              animation: "aurora-2 30s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Edge vignettes keep text crisp, in the chosen background colour */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />
    </div>
  );
}

function hexA(hex: string, a: number) {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16) || 255;
  const g = parseInt(v.slice(2, 4), 16) || 255;
  const b = parseInt(v.slice(4, 6), 16) || 255;
  return `rgba(${r},${g},${b},${a})`;
}
