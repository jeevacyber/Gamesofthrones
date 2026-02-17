import { motion } from "framer-motion";
import { useState } from "react";
import { ReactNode } from "react";

interface ChallengeCardProps {
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  index: number;
  theme: "fire" | "ice";
  hasInput?: boolean;
  showSubmit?: boolean;
  downloadLink?: string;
  isSolved?: boolean;
  onSubmit?: (flag: string) => Promise<boolean> | void;
}

const diffColors = {
  Easy: { fire: "text-fire-gold", ice: "text-ice-frost" },
  Medium: { fire: "text-fire-orange", ice: "text-ice-blue" },
  Hard: { fire: "text-fire-red", ice: "text-ice-steel" },
};

const ChallengeCard = ({ title, description, points, difficulty, index, theme, hasInput, showSubmit, downloadLink, isSolved, onSubmit }: ChallengeCardProps) => {
  const cardClass = theme === "fire" ? "fire-card" : "ice-card";
  const diffColor = diffColors[difficulty][theme];
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");

  const handleSubmit = async () => {
    if (onSubmit) {
      if (!flag.trim()) {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }

      // @ts-ignore
      const success = await onSubmit(flag);

      if (success) {
        setFlag(""); // Clear input on success
        setStatus("idle");
      } else {
        setStatus("error");
        // Optionally shake or show error message
        setTimeout(() => setStatus("idle"), 2000);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`${cardClass} p-6 transition-all duration-200 ${isSolved ? "border-green-500/50 bg-green-900/10" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-cinzel font-bold text-lg text-foreground flex items-center gap-2">
          {title}
          {isSolved && <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded font-bold">SOLVED</span>}
        </h3>
        <span className={`text-xs font-bold uppercase tracking-wider ${diffColor}`}>{difficulty}</span>
      </div>
      <p className={`text-sm mb-4 font-semibold leading-relaxed ${theme === "fire" ? "text-white/90" : "text-white/95"}`}>{description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm font-bold ${theme === "fire" ? "text-fire-gold" : "text-ice-blue"}`}>
          {points} pts
        </span>
        {downloadLink && (
          <a
            href={downloadLink}
            download
            className={`text-xs px-3 py-1 rounded-md ${theme === "fire" ? "bg-fire-orange/10 text-fire-orange border border-fire-orange/20" : "bg-ice-blue/10 text-ice-blue border border-ice-blue/20"} hover:opacity-80 transition-opacity flex items-center gap-1 no-underline`}
          >
            Download
          </a>
        )}
      </div>

      {hasInput && !isSolved && (
        <div className="mt-4 flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            value={flag}
            onChange={(e) => { setFlag(e.target.value); setStatus("idle"); }}
            placeholder="ctf{...}"
            className={`flex-1 px-3 py-2 text-sm bg-black/30 border rounded-md focus:outline-none transition-colors font-mono ${status === "error" ? "border-red-500" : (theme === "fire" ? "border-fire-orange/30 focus:border-fire-orange text-fire-gold placeholder:text-fire-orange/40" : "border-ice-blue/30 focus:border-ice-blue text-ice-frost placeholder:text-ice-blue/40")}`}
          />
          {showSubmit && (
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${theme === "fire"
                ? "bg-fire-orange hover:bg-fire-red text-black shadow-[0_0_10px_rgba(255,87,34,0.4)]"
                : "bg-ice-blue hover:bg-ice-frost text-black shadow-[0_0_10px_rgba(33,150,243,0.4)]"
                }`}
            >
              Submit
            </button>
          )}
        </div>
      )}
      {isSolved && (
        <div className="mt-4 text-center py-2 bg-green-500/20 border border-green-500/30 rounded text-green-400 font-bold font-mono text-sm">
          FLAG CAPTURED
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;
