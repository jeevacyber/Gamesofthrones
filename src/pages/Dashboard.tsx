import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";
import { Trophy, Flag, Clock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockSubmissions = [
  { flag: "The Dragon's Whisper", correct: true, time: "14:32:10" },
  { flag: "Burning Pages", correct: true, time: "14:45:22" },
  { flag: "Ember Trail", correct: false, time: "15:01:05" },
  { flag: "Fire & Smoke", correct: true, time: "15:20:18" },
];

const mockLeaderboard = [
  { rank: 1, team: "FireBreathers", score: 2100, lastSolve: "2m ago" },
  { rank: 2, team: "DragonRiders", score: 1800, lastSolve: "5m ago" },
  { rank: 3, team: "MyTeam ⭐", score: 1500, lastSolve: "12m ago" },
  { rank: 4, team: "EmberSquad", score: 1200, lastSolve: "20m ago" },
  { rank: 5, team: "AshWalkers", score: 900, lastSolve: "30m ago" },
];

const Dashboard = () => {
  const navigate = useNavigate();

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
            { icon: User, label: "Team", value: "DragonRiders", color: "text-cyber-purple" },
            { icon: Trophy, label: "Rank", value: "#3", color: "text-fire-gold" },
            { icon: Flag, label: "Flags", value: "4/10", color: "text-fire-orange" },
            { icon: Clock, label: "Score", value: "1,500", color: "text-ice-blue" },
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
            <div className="p-4 border-b border-border/30">
              <h3 className="font-cinzel font-bold text-lg text-cyber-purple">Submission History</h3>
            </div>
            <div className="divide-y divide-border/20">
              {mockSubmissions.map((s, i) => (
                <div key={i} className="flex items-center px-4 py-3">
                  <span className={`w-6 text-sm ${s.correct ? "text-green-400" : "text-destructive"}`}>
                    {s.correct ? "✓" : "✗"}
                  </span>
                  <span className="flex-1 text-sm font-mono text-foreground">{s.flag}</span>
                  <span className="text-xs text-muted-foreground">{s.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Leaderboard entries={mockLeaderboard} theme="cyber" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
