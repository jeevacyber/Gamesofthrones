import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  team: string;
  score: number;
  lastSolve: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  theme: "fire" | "ice" | "cyber";
}

const Leaderboard = ({ entries, theme }: LeaderboardProps) => {
  const accentColor = theme === "fire" ? "text-fire-gold" : theme === "ice" ? "text-ice-blue" : "text-cyber-purple";
  const borderColor = theme === "fire" ? "border-fire-orange/20" : theme === "ice" ? "border-ice-blue/20" : "border-cyber-purple/20";

  return (
    <div className={`glass-card border ${borderColor} overflow-hidden`}>
      <div className="p-4 border-b border-border/30">
        <h3 className={`font-cinzel font-bold text-lg ${accentColor}`}>🏆 Leaderboard</h3>
      </div>
      <div className="divide-y divide-border/20">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center px-4 py-3 hover:bg-secondary/30 transition-colors"
          >
            <span className={`w-8 font-bold text-sm ${i < 3 ? accentColor : "text-muted-foreground"}`}>
              {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${entry.rank}`}
            </span>
            <span className="flex-1 text-sm font-mono text-foreground">{entry.team}</span>
            <span className={`text-sm font-bold ${accentColor} mr-4`}>{entry.score}</span>
            <span className="text-xs text-muted-foreground">{entry.lastSolve}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
