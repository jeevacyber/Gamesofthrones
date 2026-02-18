import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Flame, Trophy, History, LogOut, ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChallengeCard from "@/components/ChallengeCard";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";

const challenges = [
  { title: "The Dragon's Whisper", description: "A hidden message lies within the dragon's breath. Decode the ancient cipher.", points: 100, difficulty: "Easy" as const, hash: "3a4a07d7f3878ffb9432dbf428deca4998ee77075957cc17ef0401628219268f", downloadLink: "/challenges/dragons_whisper.zip" },
  { title: "Burning Pages", description: "A web application guards a secret. Find the vulnerability and claim the flag.", points: 150, difficulty: "Easy" as const, hash: "4c58d68b75c5139d2e4b6aff779c6c22d8bd6213c339be8e62fe98bff3e5f3bd", downloadLink: "/challenges/burning_pages.zip" },
  { title: "Ember Trail", description: "Follow the trail of digital embers to uncover hidden metadata.", points: 200, difficulty: "Medium" as const, hash: "d355b28b1727e0a4240cfea6f2da7145161596d254522484ef5e9f6e35f91dea", downloadLink: "/challenges/ember_trail.zip" },
  { title: "Fire & Smoke", description: "Steganography challenge — the flag hides within the flames.", points: 250, difficulty: "Medium" as const, hash: "c153222611d0138de7770e36ec0c79afa47ffff689f565f4a70440a59b3704b1", downloadLink: "/challenges/fire_and_smoke.zip" },
  { title: "Valyrian Script", description: "An ancient encoding scheme protects this flag. Crack it.", points: 200, difficulty: "Medium" as const, hash: "a466091d2a5c502af8953f108e74d35a1ad0086c369609a1060e8ddcdd27bb81", downloadLink: "/challenges/valyrian_script.zip" },
  { title: "Dragon's Lair", description: "Navigate the filesystem of a compromised server to find evidence.", points: 300, difficulty: "Hard" as const, hash: "4607a329c9c383280356b2e6d0790fd8e38550ae741228a5919cba98da1e36fd", downloadLink: "/challenges/dragons_lair.zip" },
  { title: "Flame Keeper", description: "OSINT challenge — find the keeper of the eternal flame.", points: 150, difficulty: "Easy" as const, hash: "c416e54503d82ae607646288ba3bc3aece2cae406431f4794029c9771d63e393", downloadLink: "/challenges/flame_keeper.zip" },
  { title: "Molten Core", description: "A binary hidden in molten data. Extract and analyze.", points: 350, difficulty: "Hard" as const, hash: "d4f49bda7599f1f12d9d59e9b0213da00e18e190401323f2972f42c2976ffd72", downloadLink: "/challenges/molten_core.zip" },
  { title: "Ash & Bone", description: "Forensics challenge — recover deleted artifacts from the ashes.", points: 300, difficulty: "Hard" as const, hash: "d57062f6884f734111d7bc2529ef5327536c3b327f0f4cfb19e9fcf429512ef7", downloadLink: "/challenges/ash_and_bone.zip" },
  { title: "Dragonfire", description: "The final challenge. Combine all skills to claim the ultimate flag.", points: 500, difficulty: "Hard" as const, hash: "e6ddaf875651dbe8cf1993a384ed70787747cd765743e4642b389eb61e108a03", downloadLink: "/challenges/dragonfire.zip" },
];

const Round1 = () => {
  const { user, logout } = useAuth();
  const { completeRound1, submitFlag, solvedR1, round1Score, solveHistory, isTeamBanned } = useGame();
  const navigate = useNavigate();

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const r1History = solveHistory.filter(h => h.round === 1);

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
    if (window.confirm("Are you sure you want to complete Round 1? This action cannot be undone.")) {
      await completeRound1();
      navigate("/rounds");
    }
  };

  const handleFlagSubmit = async (challengeId: string, flag: string, hash: string, points: number) => {
    try {
      const success = await submitFlag(challengeId, flag, hash, points, user?.teamName || "Unknown Team", 1);
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
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Custom Header */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-fire-orange/20"
      >
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-fire-orange" />
          <span className="font-cinzel font-bold text-2xl gradient-text-fire">CTF 2026</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white font-cinzel font-bold border border-fire-orange/50 px-6 py-2 rounded-lg bg-fire-red hover:bg-fire-ember shadow-[0_0_15px_rgba(255,87,34,0.6)] transition-all transform hover:scale-105"
        >
          <LogOut size={18} /> LOGOUT
        </button>
      </motion.nav>

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gray-900">
        <img
          src="/dragon-r1.jpg"
          alt="Dragon Background Round 1"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1593413554443-4ce69947761d?q=80&w=1920&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      </div>

      <div className="relative z-40 pt-28 pb-16 px-4 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/rounds')}
          className="sticky top-24 left-0 flex items-center gap-2 text-fire-orange hover:text-fire-gold transition-all mb-6 group backdrop-blur-md bg-black/70 px-4 py-2 rounded-lg border border-fire-orange/30 hover:border-fire-orange/60 hover:shadow-[0_0_25px_rgba(255,87,34,0.4)] shadow-lg z-50 w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm font-bold">Back to Rounds</span>
        </motion.button>

        {/* Epic Hero Section with Fire Theme */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-8"
        >
          <motion.div
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 87, 34, 0.5)",
                "0 0 40px rgba(255, 87, 34, 0.8)",
                "0 0 20px rgba(255, 87, 34, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-6 backdrop-blur-sm bg-black/30 rounded-2xl p-8 border border-fire-orange/20 shadow-[0_0_50px_rgba(255,87,34,0.2)]"
          >
            <Flame className="w-16 h-16 text-fire-orange mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,87,34,1)]" />
            <h1 className="font-cinzel text-5xl md:text-7xl font-black gradient-text-fire mb-3 drop-shadow-[0_0_40px_rgba(255,87,34,0.8)]">
              House of the Dragon
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-transparent via-fire-orange to-transparent mx-auto mb-4"
            />
            <p className="text-fire-gold font-mono text-lg mb-2 drop-shadow-[0_0_15px_rgba(255,87,34,0.6)] font-bold">
              ROUND 1 — 10 Challenges — Fire Kingdom
            </p>
            <p className="text-gray-300 font-cinzel italic text-base">
              "Dracarys... Let the games begin"
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
              className="w-36 h-36 rounded-full border-4 border-fire-orange/60 shadow-[0_0_40px_rgba(255,87,34,0.6)] flex items-center justify-center bg-gradient-to-br from-black/80 to-red-950/50 backdrop-blur-sm mb-4 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/20 to-transparent group-hover:from-fire-orange/30 transition-all" />
              <span className="text-5xl font-cinzel font-bold text-fire-gold drop-shadow-[0_0_10px_rgba(255,87,34,0.8)] relative z-10">
                {user?.teamName?.charAt(0).toUpperCase() || "T"}
              </span>
            </motion.div>
            <h2 className="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-fire-gold via-fire-orange to-white mb-4 drop-shadow-[0_0_20px_rgba(255,87,34,0.5)]">
              {user?.teamName || "Team Name"}
            </h2>

            {/* Stats Row - Score & History */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-fire-orange/20 to-fire-orange/10 border border-fire-orange/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,87,34,0.2)]"
              >
                <Trophy size={20} className="text-fire-gold drop-shadow-[0_0_10px_rgba(255,87,34,0.5)]" />
                <span className="text-fire-gold font-mono font-bold">{round1Score} pts</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-fire-orange/20 to-fire-orange/10 border border-fire-orange/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,87,34,0.2)]"
              >
                <History size={20} className="text-fire-red drop-shadow-[0_0_10px_rgba(255,87,34,0.5)]" />
                <span className="text-fire-red font-mono font-bold">{solvedR1.length} Solves</span>
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
                theme="fire"
                hasInput={true}
                showSubmit={true}
                downloadLink={c.downloadLink}
                isSolved={solvedR1.includes(c.title)}
                onSubmit={(flag) => handleFlagSubmit(c.title, flag, c.hash, c.points)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Log (History) */}
        {r1History.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-16 backdrop-blur-md bg-black/40 rounded-xl border border-fire-orange/20 overflow-hidden"
          >
            <div className="p-4 bg-fire-orange/10 border-b border-fire-orange/20 flex items-center gap-2">
              <History className="text-fire-orange" size={20} />
              <h3 className="font-cinzel font-bold text-fire-gold">Mission Log (Round 1)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 text-fire-orange/70 font-mono text-xs uppercase">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Challenge</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fire-orange/10 text-sm">
                  {r1History.map((record, i) => (
                    <tr key={i} className="hover:bg-fire-orange/5">
                      <td className="p-3 font-mono text-gray-400">{record.timestamp}</td>
                      <td className="p-3 text-white">{record.challengeTitle}</td>
                      <td className="p-3 text-right font-bold text-fire-orange">+{record.points}</td>
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
              boxShadow: "0 0 50px rgba(255, 87, 34, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-16 py-5 text-2xl font-bold tracking-widest btn-fire overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-fire-orange/0 via-fire-gold/30 to-fire-orange/0"
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
              <Flame className="w-6 h-6" />
              SUBMIT ROUND 1
              <Flame className="w-6 h-6" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Round1;