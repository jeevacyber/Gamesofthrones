import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";

const round1Lb = [
  { rank: 1, team: "FireBreathers", score: 2100, lastSolve: "2m ago" },
  { rank: 2, team: "DragonRiders", score: 1800, lastSolve: "5m ago" },
  { rank: 3, team: "BurnUnit", score: 1500, lastSolve: "12m ago" },
  { rank: 4, team: "EmberSquad", score: 1200, lastSolve: "20m ago" },
  { rank: 5, team: "AshWalkers", score: 900, lastSolve: "30m ago" },
];

const round2Lb = [
  { rank: 1, team: "IceBreakers", score: 2500, lastSolve: "1m ago" },
  { rank: 2, team: "WinterIsComing", score: 2100, lastSolve: "4m ago" },
  { rank: 3, team: "NightKings", score: 1800, lastSolve: "8m ago" },
  { rank: 4, team: "FrostByte", score: 1400, lastSolve: "15m ago" },
  { rank: 5, team: "WhiteHackers", score: 1100, lastSolve: "25m ago" },
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyber-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-6xl mb-4 block">🏆</span>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold gradient-text-cyber mb-2">Leaderboard</h1>
          <p className="text-muted-foreground font-mono">Real-time rankings across both kingdoms</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-cinzel text-lg font-bold gradient-text-fire mb-4 text-center">🐉 Round 1 — Fire Kingdom</h3>
            <Leaderboard entries={round1Lb} theme="fire" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-cinzel text-lg font-bold gradient-text-ice mb-4 text-center">⚔ Round 2 — Ice Kingdom</h3>
            <Leaderboard entries={round2Lb} theme="ice" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
