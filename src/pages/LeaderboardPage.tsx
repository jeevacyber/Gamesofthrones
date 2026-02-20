import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import { useEffect, useState } from "react";
import API_URL from "@/config/api";
import { ROUND1_TITLES, ROUND2_TITLES } from "@/data/challenges";

interface TeamEntry {
  rank: number;
  team: string;
  score: number;
  lastSolve: string;
}

const LeaderboardPage = () => {
  const [round1Teams, setRound1Teams] = useState<TeamEntry[]>([]);
  const [round2Teams, setRound2Teams] = useState<TeamEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teams`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Process Round 1 Leaderboard
          const r1Data = data.map(t => {
            const r1Solves = t.solves.filter((s: any) => ROUND1_TITLES.includes(s.challengeId));
            return {
              team: t.teamName,
              score: r1Solves.reduce((acc: number, s: any) => acc + s.points, 0),
              lastSolve: r1Solves.length > 0 ? r1Solves[r1Solves.length - 1].timestamp : "N/A"
            };
          }).sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const lastA = a.lastSolve !== "N/A" ? new Date(a.lastSolve).getTime() : Infinity;
            const lastB = b.lastSolve !== "N/A" ? new Date(b.lastSolve).getTime() : Infinity;
            return lastA - lastB;
          })
            .map((t, i) => ({ ...t, rank: i + 1 }));

          // Process Round 2 Leaderboard
          const r2Data = data.map(t => {
            const r2Solves = t.solves.filter((s: any) => ROUND2_TITLES.includes(s.challengeId));
            return {
              team: t.teamName,
              score: r2Solves.reduce((acc: number, s: any) => acc + s.points, 0),
              lastSolve: r2Solves.length > 0 ? r2Solves[r2Solves.length - 1].timestamp : "N/A"
            };
          }).sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const lastA = a.lastSolve !== "N/A" ? new Date(a.lastSolve).getTime() : Infinity;
            const lastB = b.lastSolve !== "N/A" ? new Date(b.lastSolve).getTime() : Infinity;
            return lastA - lastB;
          })
            .map((t, i) => ({ ...t, rank: i + 1 }));

          setRound1Teams(r1Data.slice(0, 5));
          setRound2Teams(r2Data.slice(0, 5));
        }
      } catch (e) {
        console.error("Failed to fetch leaderboard data", e);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

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
            <h3 className="font-cinzel text-lg font-bold gradient-text-fire mb-4 text-center">🐉 Round 1 — Kingdom of Fire</h3>
            <Leaderboard entries={round1Teams} theme="fire" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-cinzel text-lg font-bold gradient-text-ice mb-4 text-center">⚔ Round 2 — Kingdom of Ice</h3>
            <Leaderboard entries={round2Teams} theme="ice" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
