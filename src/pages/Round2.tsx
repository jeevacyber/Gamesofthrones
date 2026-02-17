import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
// Round 2 Challenges
import { Snowflake, Trophy, History, Star, LogOut, ArrowLeft, Swords, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChallengeCard from "@/components/ChallengeCard";
import Leaderboard from "@/components/Leaderboard";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";

const challenges = [
  { title: "The Night's Watch", description: "Breach the firewall of the Night's Watch. Find the vulnerability.", points: 150, difficulty: "Easy" as const, hash: "92a59bfa4a821d6f6758607ba7214f4c39925b7dfeafca788264b82f52c7244f" },
  { title: "White Walker", description: "A zombie process holds the key. Terminate it and claim the flag.", points: 200, difficulty: "Medium" as const, hash: "33ea3444f50ab5f65211644b0a43e748f051aad12d48e83c69cf7fc0d8def041" },
  { title: "Iron Throne", description: "Escalate your privileges to sit on the Iron Throne.", points: 350, difficulty: "Hard" as const, hash: "6085ac70cf9bec7632c7424d3425c048ee57effbd75adecac8f9afeac7c4c2b0" },
  { title: "Winterfell Breach", description: "Exploit a buffer overflow in the castle defenses.", points: 300, difficulty: "Hard" as const, hash: "537286f8d859514c872ed3b7b62d70a80968fd8ae35dfb6b898f486ad076b74a" },
  { title: "Raven's Message", description: "Intercept and decode the encrypted raven message.", points: 200, difficulty: "Medium" as const, hash: "b3cc9ba1e9ccb29fcbba04d2f0116b3acf745e1adca13142c93167615665c052" },
  { title: "Stark's Secret", description: "Reverse engineer the Stark family's authentication mechanism.", points: 250, difficulty: "Medium" as const, hash: "93813242b1001000d13b473b6718b4b5be0c629cf8e16d4ebecffe10ceadca5f" },
  { title: "Wildfire", description: "A dangerous binary awaits. Defuse it to find the flag.", points: 400, difficulty: "Hard" as const, hash: "3d4d429770e7af6c5124e2f6376f27dd5d0986a2ca0462f239284966977807dd" },
  { title: "The Wall", description: "Bypass the wall's defense mechanisms using exploitation techniques.", points: 300, difficulty: "Hard" as const, hash: "458e286f01f460bf90965f7ac8c736b012b4ff53e4c994fc3d6699bf5a8a7a3e" },
  { title: "King's Landing", description: "Navigate a complex network to reach the king's secrets.", points: 250, difficulty: "Medium" as const, hash: "4b268e999bb60c4aa725b6e51ea2b1d4a301c67072edf2dc729fe4754650da08" },
  { title: "Faceless Men", description: "Authentication bypass — become no one to access everything.", points: 350, difficulty: "Hard" as const, hash: "65d91bf1fda333cd98099d9cd2b5f0f8910d0022b2c69dcc8c420d3e9bc836f4" },
  { title: "Valar Morghulis", description: "The ultimate challenge. All men must die — all flags must fall.", points: 500, difficulty: "Hard" as const, hash: "bf05be79abcc23c16eded043300b58caf8b0f7f561016c69d3d1d8aa2c820e9d" },
];

const mockLeaderboard = [
  { rank: 1, team: "IceBreakers", score: 2500, lastSolve: "1m ago" },
  { rank: 2, team: "WinterIsComing", score: 2100, lastSolve: "4m ago" },
  { rank: 3, team: "NightKings", score: 1800, lastSolve: "8m ago" },
  { rank: 4, team: "FrostByte", score: 1400, lastSolve: "15m ago" },
  { rank: 5, team: "WhiteHackers", score: 1100, lastSolve: "25m ago" },
];

const Round2 = () => {
  const { user, logout } = useAuth();
  const { completeRound2, solvedR2, submitFlag, round2Score, solveHistory, isTeamBanned } = useGame();
  const navigate = useNavigate();

  const r2History = solveHistory.filter(h => h.round === 2);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (user?.teamName && isTeamBanned(user.teamName)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <Shield className="w-24 h-24 text-red-600 mb-6" />
        <h1 className="font-cinzel text-5xl text-red-600 font-bold mb-4">DISQUALIFIED</h1>
        <p className="text-gray-400 font-mono text-xl mb-8">Your team has been disqualified from the tournament.</p>
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-900/30 border border-red-600/50 text-red-400 font-mono rounded hover:bg-red-900/50 transition-colors"
        >
          LOGOUT
        </button>
      </div>
    );
  }

  const handleSubmitRound = async () => {
    if (window.confirm("Are you sure you want to complete Round 2? This action cannot be undone.")) {
      await completeRound2();
      navigate("/rounds");
    }
  };

  const handleFlagSubmit = async (challengeId: string, flag: string, hash: string, points: number) => {
    try {
      const success = await submitFlag(challengeId, flag, hash, points, user?.teamName || "Unknown Team", 2);
      if (success) {
        console.log("Flag captured!");
      } else {
        alert("Incorrect Flag!");
      }
      return success;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom Header for Game Strings */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-ice-blue/20"
      >
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-ice-blue" />
          <span className="font-cinzel font-bold text-2xl gradient-text-ice">CTF 2026</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white font-cinzel font-bold border border-ice-blue/50 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(33,150,243,0.6)] transition-all transform hover:scale-105"
        >
          <LogOut size={18} /> LOGOUT
        </button>
      </motion.nav>

      <div className="fixed inset-0 z-0 bg-gray-900">
        <img
          src="/dragon.jpg"
          alt="Dragon Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=1920&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
      </div>

      <div className="relative z-40 pt-28 pb-16 px-4 max-w-6xl mx-auto">
        {/* Back Button - Sticky positioned for scroll */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/rounds')}
          className="sticky top-24 left-0 flex items-center gap-2 text-ice-blue hover:text-white transition-all mb-6 group backdrop-blur-md bg-black/70 px-4 py-2 rounded-lg border border-ice-blue/30 hover:border-ice-blue/60 hover:shadow-[0_0_25px_rgba(33,150,243,0.4)] shadow-lg z-50 w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm font-bold">Back to Rounds</span>
        </motion.button>

        {/* Epic Hero Section with Dragons Theme */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-8"
        >
          {/* Dramatic Title Section with glowing effect */}
          <motion.div
            animate={{
              textShadow: [
                "0 0 20px rgba(33, 150, 243, 0.5)",
                "0 0 40px rgba(33, 150, 243, 0.8)",
                "0 0 20px rgba(33, 150, 243, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-6 backdrop-blur-sm bg-black/30 rounded-2xl p-8 border border-ice-blue/20 shadow-[0_0_50px_rgba(33,150,243,0.2)]"
          >
            <Swords className="w-16 h-16 text-ice-blue mx-auto mb-4 drop-shadow-[0_0_20px_rgba(33,150,243,1)]" />
            <h1 className="font-cinzel text-5xl md:text-7xl font-black gradient-text-ice mb-3 drop-shadow-[0_0_40px_rgba(33,150,243,0.8)]">
              Game of Thrones CTF
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-ice-blue to-transparent mx-auto mb-4"
            />
            <p className="text-ice-frost font-mono text-lg mb-2 drop-shadow-[0_0_15px_rgba(33,150,243,0.6)] font-bold">
              ROUND 2 — 11 Challenges
            </p>
            <p className="text-gray-300 font-cinzel italic text-base">
              "Winter is Coming... and so are the Flags"
            </p>
          </motion.div>

          {/* Team Profile Circle - Enhanced */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-36 h-36 rounded-full border-4 border-ice-blue/60 shadow-[0_0_40px_rgba(33,150,243,0.6)] flex items-center justify-center bg-gradient-to-br from-black/80 to-blue-950/50 backdrop-blur-sm mb-4 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ice-blue/20 to-transparent group-hover:from-ice-blue/30 transition-all" />
              <span className="text-5xl font-cinzel font-bold text-ice-frost drop-shadow-[0_0_10px_rgba(33,150,243,0.8)] relative z-10">
                {user?.teamName?.charAt(0).toUpperCase() || "T"}
              </span>
            </motion.div>
            <h2 className="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-ice-blue via-ice-frost to-white mb-4 drop-shadow-[0_0_20px_rgba(33,150,243,0.5)]">
              {user?.teamName || "Team Name"}
            </h2>

            {/* Stats Row - Score & History */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-ice-blue/20 to-ice-blue/10 border border-ice-blue/30 backdrop-blur-md shadow-[0_0_15px_rgba(33,150,243,0.2)]"
              >
                <Trophy size={20} className="text-ice-frost drop-shadow-[0_0_10px_rgba(33,150,243,0.5)]" />
                <span className="text-ice-frost font-mono font-bold">{round2Score} pts</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-ice-blue/20 to-ice-blue/10 border border-ice-blue/30 backdrop-blur-md shadow-[0_0_15px_rgba(33,150,243,0.2)]"
              >
                <History size={20} className="text-blue-300 drop-shadow-[0_0_10px_rgba(33,150,243,0.5)]" />
                <span className="text-blue-300 font-mono font-bold">{solvedR2.length} Solves</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Challenges Grid with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {challenges.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            >
              <ChallengeCard
                {...c}
                index={i}
                theme="ice"
                hasInput={true}
                showSubmit={true}
                isSolved={solvedR2.includes(c.title)}
                onSubmit={(flag) => handleFlagSubmit(c.title, flag, c.hash, c.points)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Log (History) */}
        {r2History.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-16 backdrop-blur-md bg-black/40 rounded-xl border border-ice-blue/20 overflow-hidden"
          >
            <div className="p-4 bg-ice-blue/10 border-b border-ice-blue/20 flex items-center gap-2">
              <History className="text-ice-blue" size={20} />
              <h3 className="font-cinzel font-bold text-ice-frost">Mission Log (Round 2)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 text-ice-blue/70 font-mono text-xs uppercase">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Challenge</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ice-blue/10 text-sm">
                  {r2History.map((record, i) => (
                    <tr key={i} className="hover:bg-ice-blue/5">
                      <td className="p-3 font-mono text-gray-400">{record.timestamp}</td>
                      <td className="p-3 text-white">{record.challengeTitle}</td>
                      <td className="p-3 text-right font-bold text-ice-blue">+{record.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Epic Submit Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-16 mb-20"
        >
          <motion.button
            onClick={handleSubmitRound}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 50px rgba(33, 150, 243, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-16 py-5 text-2xl font-bold tracking-widest btn-ice overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-ice-blue/0 via-ice-frost/30 to-ice-blue/0"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <Swords className="w-6 h-6" />
              SUBMIT ROUND 2
              <Swords className="w-6 h-6" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div >
  );
};

export default Round2;
