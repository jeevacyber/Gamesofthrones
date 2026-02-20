import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Users, Flag, Clock, Crown, Download, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGame } from "@/hooks/useGame";
import API_URL from "@/config/api";
import { ROUND1_TITLES } from "@/data/challenges";

interface TeamData {
  _id: string; // MongoDB ID
  teamName: string;
  email: string;
  collegeName: string;
  solves: { challengeId: string; flag: string; points: number; timestamp: string }[];
  score: number;
  round1Completed?: boolean;
  round2Completed?: boolean;
}

const AdminDashboard = () => {
  const {
    round1Locked, round2Locked, toggleRound1, toggleRound2,
    banTeam, bannedTeams,
    resetUserRound
  } = useGame();
  const navigate = useNavigate();
  const [dbTeams, setDbTeams] = useState<TeamData[]>([]);
  const [historySearch, setHistorySearch] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teams`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDbTeams(data);
        } else {
          console.error("Fetched teams data is not an array:", data);
          setDbTeams([]);
        }
      } catch (e) {
        console.error("Failed to fetch teams", e);
      }
    };
    fetchTeams();
    const interval = setInterval(fetchTeams, 1000); // Polling for live updates
    return () => clearInterval(interval);
  }, []);

  const handleResetRound = async (userId: string, round: 1 | 2, teamName: string) => {
    if (confirm(`Are you sure you want to RE-OPEN Round ${round} for team "${teamName}"?`)) {
      if (resetUserRound) {
        await resetUserRound(userId, round);
        alert(`Round ${round} unlocked for ${teamName}. It may take a few seconds to reflect.`);
      } else {
        alert("Error: resetUserRound function not available.");
      }
    }
  };

  // Derive history from DB teams
  const dbHistory = dbTeams.flatMap(t =>
    (t.solves || []).map(s => ({
      teamName: t.teamName,
      challengeTitle: s.challengeId || "Unknown",
      points: s.points,
      timestamp: s.timestamp || "N/A",
      round: (ROUND1_TITLES.includes(s.challengeId) ? 1 : 2) as 1 | 2
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter(h =>
      h.teamName.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.challengeTitle.toLowerCase().includes(historySearch.toLowerCase())
    );

  // Filter banned and Sort by Rank (Score desc, then Time asc)
  const teams = dbTeams
    .filter(t => !bannedTeams.includes(t.teamName))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const lastA = a.solves && a.solves.length > 0 ? new Date(a.solves[a.solves.length - 1].timestamp).getTime() : Infinity;
      const lastB = b.solves && b.solves.length > 0 ? new Date(b.solves[b.solves.length - 1].timestamp).getTime() : Infinity;
      return lastA - lastB;
    });

  const handleBanTeam = (teamName: string) => {
    if (confirm(`Are you sure you want to ban/delete team "${teamName}"? Their progress will be hidden.`)) {
      banTeam(teamName);
    }
  };

  // Calculate stats for table
  const getRoundStats = (solves: any[]) => {
    const safeSolves = solves || [];
    const r1Solves = safeSolves.filter(s => s.challengeId && ROUND1_TITLES.includes(s.challengeId));
    const r2Solves = safeSolves.filter(s => s.challengeId && !ROUND1_TITLES.includes(s.challengeId));

    return {
      r1Count: r1Solves.length,
      r1Score: r1Solves.reduce((a: number, b: any) => a + (b.points || 0), 0),
      r2Count: r2Solves.length,
      r2Score: r2Solves.reduce((a: number, b: any) => a + (b.points || 0), 0)
    };
  };

  const totalSolves = teams.reduce((acc, t) => acc + (t.solves ? t.solves.length : 0), 0);

  const handleExportCSV = () => {
    const headers = ["Rank", "Team Name", "College Name", "Total Score", "R1 Score", "R2 Score", "Total Solves", "R1 Solves", "R2 Solves", "Last Solve Time", "Email", "Full Solve History (Challenge: Time)"];
    const rows = [...teams].map((t, index) => {
      const stats = getRoundStats(t.solves);
      const lastSolve = t.solves && t.solves.length > 0 ? t.solves[t.solves.length - 1].timestamp : "N/A";
      const historyStr = (t.solves || []).map(s => `${s.challengeId} (${s.points}pts) @ ${s.timestamp}`).join(" | ");
      return [index + 1, `"${t.teamName.replace(/"/g, '""')}"`, `"${t.collegeName.replace(/"/g, '""')}"`, t.score, stats.r1Score, stats.r2Score, t.solves ? t.solves.length : 0, stats.r1Count, stats.r2Count, `"${lastSolve}"`, `"${t.email}"`, `"${historyStr.replace(/"/g, '""')}"`].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ctf_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-royal-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-royal-red/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">Back</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <Crown className="w-8 h-8 text-royal-gold" />
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold gradient-text-gold">Admin Dashboard</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel font-bold text-lg gradient-text-fire">🐉 Round 1</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${round1Locked ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-400"}`}>
                {round1Locked ? "LOCKED" : "UNLOCKED"}
              </span>
            </div>
            <button onClick={toggleRound1} className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${round1Locked ? "btn-fire" : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"}`}>
              {round1Locked ? <Unlock size={16} /> : <Lock size={16} />}
              {round1Locked ? "Unlock Round 1" : "Lock Round 1"}
            </button>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel font-bold text-lg gradient-text-ice">⚔ Round 2</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${round2Locked ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-400"}`}>
                {round2Locked ? "LOCKED" : "UNLOCKED"}
              </span>
            </div>
            <button onClick={toggleRound2} className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${round2Locked ? "btn-ice" : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"}`}>
              {round2Locked ? <Unlock size={16} /> : <Lock size={16} />}
              {round2Locked ? "Unlock Round 2" : "Lock Round 2"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Teams", value: teams.length.toString(), color: "text-royal-gold" },
            { icon: Flag, label: "Total Solves", value: totalSolves.toString(), color: "text-fire-orange" },
            { icon: Clock, label: "Avg Time", value: "N/A", color: "text-ice-blue" },
            { icon: Crown, label: "Top Score", value: teams.length > 0 ? Math.max(...teams.map(t => t.score)).toString() : "0", color: "text-royal-gold" },
          ].map((s) => (
            <div key={s.label} className="admin-card p-4 text-center">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b border-royal-gold/20 flex items-center justify-between">
            <h3 className="font-cinzel font-bold text-lg gradient-text-gold">Registered Teams</h3>
            <button onClick={handleExportCSV} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-royal-gold/10 text-royal-gold border border-royal-gold/20 hover:bg-royal-gold/20 transition-colors">
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3">Team</th>
                  <th className="text-left p-3">College</th>
                  <th className="text-center p-3">R1 Score</th>
                  <th className="text-center p-3">R2 Score</th>
                  <th className="text-center p-3">Total Score</th>
                  <th className="text-center p-3">Last Solve</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {teams.map((t) => {
                  const stats = getRoundStats(t.solves);
                  return (
                    <tr key={t._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-sm font-mono text-foreground">{t.teamName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{t.collegeName}</td>
                      <td className="p-3 text-sm text-center text-fire-gold font-bold">{stats.r1Score}</td>
                      <td className="p-3 text-sm text-center text-ice-frost font-bold">{stats.r2Score}</td>
                      <td className="p-3 text-sm text-center text-royal-gold font-bold">{t.score}</td>
                      <td className="p-3 text-xs text-center text-muted-foreground font-mono">
                        {t.solves && t.solves.length > 0 ? t.solves[t.solves.length - 1].timestamp.split(',')[1] : "Never"}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleResetRound(t._id, 1, t.teamName)} className="text-xs px-2 py-1 bg-fire-orange/10 border border-fire-orange/30 text-fire-orange rounded hover:bg-fire-orange/20"><RefreshCw size={12} /></button>
                          <button onClick={() => handleResetRound(t._id, 2, t.teamName)} className="text-xs px-2 py-1 bg-ice-blue/10 border border-ice-blue/30 text-ice-blue rounded hover:bg-ice-blue/20"><RefreshCw size={12} /></button>
                          <button onClick={() => handleBanTeam(t.teamName)} className="text-destructive/60 hover:text-destructive"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
