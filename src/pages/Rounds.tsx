import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
// Rounds page showing available challenges
import Navbar from "@/components/Navbar";
import { Shield, Sword, Lock, ArrowLeft } from "lucide-react";

import { useGame } from "@/hooks/useGame";
import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/hooks/useAuth";

const Rounds = () => {
    const navigate = useNavigate();
    const { round1Locked, round2Locked, round1Completed, round2Completed, isTeamBanned } = useGame();
    const { toast } = useToast();
    const { user } = useAuth();

    if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    const handleRoundClick = (round: string, isLocked: boolean, isCompleted: boolean) => {
        if (user?.teamName && isTeamBanned(user.teamName)) {
            toast({
                title: "Disqualified",
                description: "Your team has been disqualified and cannot participate.",
                variant: "destructive"
            });
            return;
        }

        // Check if admin has unlocked the round specifically for this user (overriding global lock if needed, though currently logic implies global lock is absolute)
        // For now, adhere to global lock
        if (isLocked) {
            toast({
                title: "Access Denied",
                description: "Admin has not approved this round yet.",
                variant: "destructive"
            });
            return;
        }

        // Check completion status
        if (isCompleted) {
            toast({
                title: "Round Completed",
                description: "You have already completed this round.",
            });
            return;
        }

        navigate(round);
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fire-orange/10 rounded-full blur-[120px]" />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <div className="max-w-4xl w-full">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-sm">Back</span>
                    </button>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center font-cinzel text-4xl md:text-5xl font-bold gradient-text-silver mb-12"
                    >
                        Select Your Challenge
                    </motion.h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Round 1 Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => handleRoundClick("/round/1", round1Locked, round1Completed)}
                            className="group cursor-pointer relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`glass-card neon-border p-8 h-full flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 ${round1Locked || round1Completed ? "opacity-70 grayscale" : ""}`}>
                                <div className="w-20 h-20 rounded-full bg-cyber-purple/10 flex items-center justify-center mb-6 group-hover:bg-cyber-purple/20 transition-colors">
                                    {round1Locked ? <Lock className="w-10 h-10 text-muted-foreground" /> : round1Completed ? <Shield className="w-10 h-10 text-green-500" /> : <Shield className="w-10 h-10 text-cyber-purple" />}
                                </div>
                                <h2 className="font-cinzel text-2xl font-bold text-cyber-purple mb-4">Round 1: House of the Dragon</h2>
                                <p className="text-muted-foreground mb-6">
                                    {round1Locked ? "Waiting for Admin Approval" : round1Completed ? "Round Completed! The Dragon's fire has forged your soul." : "Enter the Kingdom of Fire. Face the ancient trials of the Targaryen ancestors and claim your place in the archives."}
                                </p>
                                <span className={`w-full mt-auto ${round1Locked || round1Completed ? "btn-secondary cursor-not-allowed" : "btn-cyber"}`}>
                                    {round1Locked ? "Locked" : round1Completed ? "Completed" : "Enter Kingdom of Fire"}
                                </span>
                            </div>
                        </motion.div>

                        {/* Round 2 Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => handleRoundClick("/round/2", round2Locked, round2Completed)}
                            className="group cursor-pointer relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`glass-card neon-border p-8 h-full flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 border-fire-orange/30 ${round2Locked || round2Completed ? "opacity-70 grayscale" : ""}`}>
                                <div className="w-20 h-20 rounded-full bg-fire-orange/10 flex items-center justify-center mb-6 group-hover:bg-fire-orange/20 transition-colors">
                                    {round2Locked ? <Lock className="w-10 h-10 text-muted-foreground" /> : round2Completed ? <Sword className="w-10 h-10 text-green-500" /> : <Sword className="w-10 h-10 text-fire-orange" />}
                                </div>
                                <h2 className="font-cinzel text-2xl font-bold text-fire-orange mb-4">Round 2: Game of Thrones</h2>
                                <p className="text-muted-foreground mb-6">
                                    {round2Locked ? "Waiting for Admin Approval" : round2Completed ? "Round Completed! You have survived the long night." : "Venture into the Kingdom of Ice. The winter is here, and only the worthy may breach the defenses of the Seven Kingdoms."}
                                </p>
                                <span className={`w-full mt-auto ${round2Locked || round2Completed ? "btn-secondary cursor-not-allowed" : "btn-fire"}`}>
                                    {round2Locked ? "Locked" : round2Completed ? "Completed" : "Enter Kingdom of Ice"}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rounds;
