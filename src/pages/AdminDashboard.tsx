import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Users, Flag, Clock, Crown, Download, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGame } from "@/hooks/useGame";
import API_URL from "@/config/api";

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
      timestamp: s.timestamp || "N/A", // Already formatted string from DB
      round: (["The Dragon's Whisper", "Burning Pages", "Ember Trail", "Fire & Smoke", "Valyrian Script", "Dragon's Lair", "Flame Keeper", "Molten Core", "Ash & Bone", "Dragonfire"].includes(s.challengeId) ? 1 : 2) as 1 | 2
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Filter banned
  const teams = dbTeams.filter(t => !bannedTeams.includes(t.teamName));

  const handleBanTeam = (teamName: string) => {
    if (confirm(`Are you sure you want to ban/delete team "${teamName}"? Their progress will be hidden.`)) {
      banTeam(teamName);
    }
  };

  // Calculate stats for table
  const getRoundStats = (solves: any[]) => {
    const safeSolves = solves || [];
    // Hardcoded lists for now to distinguish R1/R2
    const r1Titles = ["The Dragon's Whisper", "Burning Pages", "Ember Trail", "Fire & Smoke", "Valyrian Script", "Dragon's Lair", "Flame Keeper", "Molten Core", "Ash & Bone", "Dragonfire"];
    const r1Solves = safeSolves.filter(s => s.challengeId && r1Titles.includes(s.challengeId));
    const r2Solves = safeSolves.filter(s => s.challengeId && !r1Titles.includes(s.challengeId));

    return {
      r1Count: r1Solves.length,
      r1Score: r1Solves.reduce((a: number, b: any) => a + (b.points || 0), 0),
      r2Count: r2Solves.length,
      r2Score: r2Solves.reduce((a: number, b: any) => a + (b.points || 0), 0)
    };
  };

  const totalSolves = teams.reduce((acc, t) => acc + (t.solves ? t.solves.length : 0), 0);

  const handleExportCSV = () => {
    // 1. Define headers
    const headers = [
      "Team Name",
      "College Name",
      "Email",
      "R1 Score",
      "R2 Score",
      "Total Score",
      "R1 Solves",
      "R2 Solves",
      "Total Solves"
    ];

    // 2. Map data
    const rows = teams.map(t => {
      const stats = getRoundStats(t.solves);
      return [
        `"${t.teamName}"`, // Quote strings to handle commas
        `"${t.collegeName}"`,
        `"${t.email}"`,
        stats.r1Score,
        stats.r2Score,
        t.score,
        stats.r1Count,
        stats.r2Count,
        t.solves ? t.solves.length : 0
      ].join(",");
    });

    // 3. Combine
    const csvContent = [headers.join(","), ...rows].join("\n");

    // 4. Create Blob and Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ctf_teams_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-royal-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-royal-red/10 rounded-full blur-[80px]" />
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <Crown className="w-8 h-8 text-royal-gold" />
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold gradient-text-gold">Admin Dashboard</h1>
        </motion.div>

        {/* Round Controls */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel font-bold text-lg gradient-text-fire">🐉 Round 1</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${round1Locked ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-400"}`}>
                {round1Locked ? "LOCKED" : "UNLOCKED"}
              </span>
            </div>
            <button
              onClick={toggleRound1}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${round1Locked ? "btn-fire" : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                }`}
            >
              {round1Locked ? <Unlock size={16} /> : <Lock size={16} />}
              {round1Locked ? "Unlock Round 1" : "Lock Round 1"}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel font-bold text-lg gradient-text-ice">⚔ Round 2</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${round2Locked ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-400"}`}>
                {round2Locked ? "LOCKED" : "UNLOCKED"}
              </span>
            </div>
            <button
              onClick={toggleRound2}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${round2Locked ? "btn-ice" : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                }`}
            >
              {round2Locked ? <Unlock size={16} /> : <Lock size={16} />}
              {round2Locked ? "Unlock Round 2" : "Lock Round 2"}
            </button>
          </motion.div>
        </div>

        {/* Stats */}
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

        {/* Teams Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="admin-card overflow-hidden">
          <div className="p-4 border-b border-royal-gold/20 flex items-center justify-between">
            <h3 className="font-cinzel font-bold text-lg gradient-text-gold">Registered Teams - Database</h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-royal-gold/10 text-royal-gold border border-royal-gold/20 hover:bg-royal-gold/20 transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3">Team</th>
                  <th className="text-left p-3">College</th>
                  <th className="text-center p-3">R1 Solves</th>
                  <th className="text-center p-3">R1 Score</th>
                  <th className="text-center p-3">R2 Solves</th>
                  <th className="text-center p-3">R2 Score</th>
                  <th className="text-center p-3">Total Score</th>
                  <th className="text-center p-3">Re-Open</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {teams.length === 0 ? (
                  <tr><td colSpan={9} className="p-4 text-center text-muted-foreground">No active teams found in database.</td></tr>
                ) : (
                  teams.map((t) => {
                    const stats = getRoundStats(t.solves);
                    return (
                      <tr key={t._id} className={`hover:bg-secondary/20 transition-colors ${t.round1Completed || t.round2Completed ? "bg-royal-gold/5" : ""}`}>
                        <td className="p-3 text-sm font-mono text-foreground">
                          {t.teamName}
                          {(t.round1Completed) && <span className="ml-2 text-[10px] bg-fire-orange text-black px-1 rounded font-bold">R1 DONE</span>}
                          {(t.round2Completed) && <span className="ml-2 text-[10px] bg-ice-blue text-black px-1 rounded font-bold">R2 DONE</span>}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{t.collegeName}</td>
                        <td className="p-3 text-sm text-center text-fire-orange">{stats.r1Count}</td>
                        <td className="p-3 text-sm text-center text-fire-gold font-bold">{stats.r1Score}</td>
                        <td className="p-3 text-sm text-center text-ice-blue">{stats.r2Count}</td>
                        <td className="p-3 text-sm text-center text-ice-frost font-bold">{stats.r2Score}</td>
                        <td className="p-3 text-sm text-center text-royal-gold font-bold">{t.score}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleResetRound(t._id, 1, t.teamName)}
                              className="text-xs px-2 py-1 bg-fire-orange/10 border border-fire-orange/30 text-fire-orange rounded hover:bg-fire-orange/20 transition-colors"
                              title="Re-open Round 1 for this team"
                            >
                              <RefreshCw size={12} className="inline mr-1" />R1
                            </button>
                            <button
                              onClick={() => handleResetRound(t._id, 2, t.teamName)}
                              className="text-xs px-2 py-1 bg-ice-blue/10 border border-ice-blue/30 text-ice-blue rounded hover:bg-ice-blue/20 transition-colors"
                              title="Re-open Round 2 for this team"
                            >
                              <RefreshCw size={12} className="inline mr-1" />R2
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleBanTeam(t.teamName)}
                            className="text-destructive/60 hover:text-destructive transition-colors"
                            title="Delete Team"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Solve History Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="admin-card overflow-hidden mt-8">
          <div className="p-4 border-b border-royal-gold/20 flex items-center justify-between">
            <h3 className="font-cinzel font-bold text-lg gradient-text-ice">Live Solve History (Global)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Team</th>
                  <th className="text-center p-3">Round</th>
                  <th className="text-left p-3">Challenge</th>
                  <th className="text-center p-3">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {dbHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground italic">No solves yet.</td>
                  </tr>
                ) : (
                  dbHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3 text-sm text-muted-foreground font-mono">{record.timestamp}</td>
                      <td className="p-3 text-sm font-bold text-fire-orange">{record.teamName}</td>
                      <td className="p-3 text-sm text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${record.round === 1 ? "bg-fire-orange/20 text-fire-orange border-fire-orange/30" : "bg-ice-blue/20 text-ice-blue border-ice-blue/30"}`}>
                          R{record.round}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-foreground">{record.challengeTitle}</td>
                      <td className="p-3 text-sm text-center text-royal-gold font-bold">+{record.points}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
