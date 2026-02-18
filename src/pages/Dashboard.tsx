import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import { Trophy, Flag, Clock, User, ArrowLeft } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import API_URL from "@/config/api";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  rank: number;
  team: string;
  score: number;
  lastSolve: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teamScore, solveHistory, solvedR1, solvedR2 } = useGame();
  const [globalTeams, setGlobalTeams] = useState<any[]>([]);

  // Redirect if admin
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teams`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Sort for rank calculation
          const sorted = [...data].sort((a, b) => b.score - a.score);
          setGlobalTeams(sorted);
        }
      } catch (e) {
        console.error("Failed to fetch teams for ranking", e);
      }
    };
    fetchTeams();
    const interval = setInterval(fetchTeams, 3000);
    return () => clearInterval(interval);
  }, []);

  const rank = globalTeams.findIndex(t => t.teamName === user?.teamName) + 1;
  const totalFlags = solvedR1.length + solvedR2.length;

  const leaderboardEntries: LeaderboardEntry[] = globalTeams
    .slice(0, 5)
    .map((t, i) => ({
      rank: i + 1,
      team: t.teamName,
      score: t.score,
      lastSolve: t.lastSolve || "N/A"
    }));

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyber-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">Back</span>
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-cinzel text-3xl md:text-4xl font-bold gradient-text-cyber mb-8"
        >
          Team Dashboard
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: User, label: "Team", value: user?.teamName || "Guest", color: "text-cyber-purple" },
            { icon: Trophy, label: "Rank", value: rank > 0 ? `#${rank}` : "N/A", color: "text-fire-gold" },
            { icon: Flag, label: "Flags", value: `${totalFlags}`, color: "text-fire-orange" },
            { icon: Clock, label: "Score", value: teamScore.toLocaleString(), color: "text-ice-blue" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card neon-border p-4 text-center"
            >
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submission History */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card neon-border overflow-hidden">
            <div className="p-4 border-b border-border/30 flex justify-between items-center">
              <h3 className="font-cinzel font-bold text-lg text-cyber-purple">Live Solves</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">History</span>
            </div>
            <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto">
              {solveHistory.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground italic">No submission history yet.</div>
              ) : (
                solveHistory.map((s, i) => (
                  <div key={i} className="flex items-center px-4 py-3 hover:bg-secondary/10 transition-colors">
                    <span className="w-6 text-sm text-green-400">✓</span>
                    <div className="flex-1">
                      <p className="text-sm font-mono text-foreground">{s.challengeTitle}</p>
                      <p className="text-[10px] text-muted-foreground">{s.timestamp}</p>
                    </div>
                    <span className="text-xs font-bold text-cyber-purple">+{s.points}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Leaderboard entries={leaderboardEntries} theme="cyber" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
