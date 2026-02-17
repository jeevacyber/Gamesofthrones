import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sha256 } from "@/utils/crypto";
import API_URL from "@/config/api";

export interface SolveRecord {
    teamName: string;
    challengeTitle: string;
    points: number;
    timestamp: string;
    round: 1 | 2;
}

interface GameContextType {
    round1Locked: boolean;
    round2Locked: boolean;
    toggleRound1: () => void;
    toggleRound2: () => void;
    round1Completed: boolean;
    round2Completed: boolean;
    completeRound1: () => void;
    completeRound2: () => void;
    resetRound1: () => void;
    resetRound2: () => void;
    teamScore: number;
    round1Score: number;
    round2Score: number;
    solvedR1: string[];
    solvedR2: string[];
    submitFlag: (challengeId: string, flagInput: string, expectedHash: string, points: number, teamName: string, roundNumber: 1 | 2) => Promise<boolean>;
    solveHistory: SolveRecord[];
    bannedTeams: string[];
    banTeam: (teamName: string) => void;
    isTeamBanned: (teamName: string) => boolean;
    resetUserRound: (userId: string, round: 1 | 2) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [round1Locked, setRound1Locked] = useState(true);
    const [round2Locked, setRound2Locked] = useState(true);
    const [round1Completed, setRound1Completed] = useState(false);
    const [round2Completed, setRound2Completed] = useState(false);

    // Separate Scores
    const [round1Score, setRound1Score] = useState(0);
    const [round2Score, setRound2Score] = useState(0);

    // Separate Solved Challenges
    const [solvedR1, setSolvedR1] = useState<string[]>([]);
    const [solvedR2, setSolvedR2] = useState<string[]>([]);

    // Banned Teams
    const [bannedTeams, setBannedTeams] = useState<string[]>([]);

    const [solveHistory, setSolveHistory] = useState<SolveRecord[]>([]);

    useEffect(() => {
        // Load initial state from localStorage
        const r1 = localStorage.getItem("round1Locked");
        const r2 = localStorage.getItem("round2Locked");
        const r1c = localStorage.getItem("round1Completed");
        const r2c = localStorage.getItem("round2Completed");
        const banned = localStorage.getItem("bannedTeams");

        if (r1 && r1 !== "undefined") {
            try { setRound1Locked(JSON.parse(r1)); } catch (e) { console.error("Error parsing r1", e); }
        }
        if (r2 && r2 !== "undefined") {
            try { setRound2Locked(JSON.parse(r2)); } catch (e) { console.error("Error parsing r2", e); }
        }

        if (r1c && r1c !== "undefined") {
            try { setRound1Completed(JSON.parse(r1c)); } catch (e) { console.error("Error parsing r1c", e); }
        }
        if (r2c && r2c !== "undefined") {
            try { setRound2Completed(JSON.parse(r2c)); } catch (e) { console.error("Error parsing r2c", e); }
        }
        if (banned && banned !== "undefined") {
            try { setBannedTeams(JSON.parse(banned)); } catch (e) { console.error("Error parsing banned", e); }
        }

        // Fetch user's solve data from database
        const fetchUserData = async () => {
            try {
                // Fetch Global Game State Check
                try {
                    const gamestateRes = await fetch(`${API_URL}/api/game-state`);
                    if (gamestateRes.ok) {
                        const state = await gamestateRes.json();
                        setRound1Locked(state.round1Locked);
                        setRound2Locked(state.round2Locked);
                        localStorage.setItem("round1Locked", JSON.stringify(state.round1Locked));
                        localStorage.setItem("round2Locked", JSON.stringify(state.round2Locked));
                    }
                } catch (e) {
                    // Ignore fetch error, rely on local state
                }

                const userJson = localStorage.getItem("mock_user");
                if (!userJson || userJson === "undefined") return;

                const user = JSON.parse(userJson);
                if (user.id) {
                    const response = await fetch(`${API_URL}/api/user/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();

                        // Separate solves by round based on challenge titles
                        const r1Titles = ["The Dragon's Whisper", "Burning Pages", "Ember Trail", "Fire & Smoke", "Valyrian Script", "Dragon's Lair", "Flame Keeper", "Molten Core", "Ash & Bone", "Dragonfire"];

                        const r1Solves = data.solves.filter((s: any) => r1Titles.includes(s.challengeId));
                        const r2Solves = data.solves.filter((s: any) => !r1Titles.includes(s.challengeId));

                        const r1Score = r1Solves.reduce((acc: number, s: any) => acc + s.points, 0);
                        const r2Score = r2Solves.reduce((acc: number, s: any) => acc + s.points, 0);

                        // Update state with database data
                        setSolvedR1(r1Solves.map((s: any) => s.challengeId));
                        setSolvedR2(r2Solves.map((s: any) => s.challengeId));
                        setRound1Score(r1Score);
                        setRound2Score(r2Score);

                        // Build history
                        const history = data.solves.map((s: any) => ({
                            teamName: data.teamName,
                            challengeTitle: s.challengeId,
                            points: s.points,
                            timestamp: s.timestamp, // Already formatted string from DB
                            round: (r1Titles.includes(s.challengeId) ? 1 : 2) as 1 | 2
                        })).reverse();
                        setSolveHistory(history);

                        // Sync to localStorage
                        localStorage.setItem("solvedR1", JSON.stringify(r1Solves.map((s: any) => s.challengeId)));
                        localStorage.setItem("solvedR2", JSON.stringify(r2Solves.map((s: any) => s.challengeId)));
                        localStorage.setItem("round1Score", r1Score.toString());
                        localStorage.setItem("round2Score", r2Score.toString());
                        localStorage.setItem("solveHistory", JSON.stringify(history));

                        // Sync Round Completion - IMPORTANT: Reset state if DB says false
                        // Handle potential undefined/null from DB by defaulting to false
                        const isR1Completed = !!data.round1Completed;
                        const isR2Completed = !!data.round2Completed;

                        setRound1Completed(isR1Completed);
                        localStorage.setItem("round1Completed", JSON.stringify(isR1Completed));

                        setRound2Completed(isR2Completed);
                        localStorage.setItem("round2Completed", JSON.stringify(isR2Completed));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data from DB:", error);
                // Fallback to localStorage logic...
                const s1 = localStorage.getItem("round1Score");
                const s2 = localStorage.getItem("round2Score");
                const sol1 = localStorage.getItem("solvedR1");
                const sol2 = localStorage.getItem("solvedR2");
                const history = localStorage.getItem("solveHistory");

                if (s1 && s1 !== "undefined") setRound1Score(parseInt(s1));
                if (s2 && s2 !== "undefined") setRound2Score(parseInt(s2));
                if (sol1 && sol1 !== "undefined") setSolvedR1(JSON.parse(sol1));
                if (sol2 && sol2 !== "undefined") setSolvedR2(JSON.parse(sol2));
                if (history && history !== "undefined") setSolveHistory(JSON.parse(history));
            }
        };

        fetchUserData();
        const interval = setInterval(fetchUserData, 1000); // Poll every 1 second for updates
        return () => clearInterval(interval);
    }, []);

    const toggleRound1 = async () => {
        const newState = !round1Locked;
        setRound1Locked(newState);
        localStorage.setItem("round1Locked", JSON.stringify(newState));
        try {
            await fetch(`${API_URL}/api/game-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ round1Locked: newState })
            });
        } catch (e) { console.error("Failed to sync state", e); }
    };

    const toggleRound2 = async () => {
        const newState = !round2Locked;
        setRound2Locked(newState);
        localStorage.setItem("round2Locked", JSON.stringify(newState));
        try {
            await fetch(`${API_URL}/api/game-state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ round2Locked: newState })
            });
        } catch (e) { console.error("Failed to sync state", e); }
    };

    const completeRound1 = async () => {
        if (!round1Completed) {
            setRound1Completed(true);
            localStorage.setItem("round1Completed", "true");

            try {
                const user = JSON.parse(localStorage.getItem("mock_user") || "{}");
                if (user.id) {
                    await fetch(`${API_URL}/api/complete-round`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, round: 1 })
                    });
                }
            } catch (e) {
                console.error("Failed to mark Round 1 as completed in DB", e);
            }
        }
    };

    const completeRound2 = async () => {
        if (!round2Completed) {
            setRound2Completed(true);
            localStorage.setItem("round2Completed", "true");

            try {
                const user = JSON.parse(localStorage.getItem("mock_user") || "{}");
                if (user.id) {
                    await fetch(`${API_URL}/api/complete-round`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, round: 2 })
                    });
                }
            } catch (e) {
                console.error("Failed to mark Round 2 as completed in DB", e);
            }
        }
    };

    const resetRound1 = () => {
        setRound1Completed(false);
        setRound1Score(0);
        setSolvedR1([]);
        localStorage.setItem("round1Completed", "false");
        localStorage.setItem("round1Score", "0");
        localStorage.setItem("solvedR1", "[]");
    };

    const resetRound2 = () => {
        setRound2Completed(false);
        setRound2Score(0);
        setSolvedR2([]);
        localStorage.setItem("round2Completed", "false");
        localStorage.setItem("round2Score", "0");
        localStorage.setItem("solvedR2", "[]");
    };

    const banTeam = (teamName: string) => {
        if (!bannedTeams.includes(teamName)) {
            const newBanned = [...bannedTeams, teamName];
            setBannedTeams(newBanned);
            localStorage.setItem("bannedTeams", JSON.stringify(newBanned));
        }
    };

    const isTeamBanned = (teamName: string) => {
        return bannedTeams.includes(teamName);
    };

    const resetUserRound = async (userId: string, round: 1 | 2) => {
        try {
            await fetch(`${API_URL}/api/reset-round-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, round })
            });
            // Ideally we would trigger a refresh of dbTeams in AdminDashboard or similar
        } catch (e) {
            console.error("Failed to reset round for user", e);
        }
    };

    const submitFlag = async (challengeId: string, flagInput: string, expectedHash: string, points: number, teamName: string, roundNumber: 1 | 2): Promise<boolean> => {
        // Backend simulation: Hash check
        const inputHash = await sha256(flagInput.trim());
        console.log(`Submitting flag: "${flagInput.trim()}"`);
        console.log(`Calculated Hash: ${inputHash}`);
        console.log(`Expected Hash:   ${expectedHash}`);

        if (inputHash === expectedHash) {
            const currentSolved = roundNumber === 1 ? solvedR1 : solvedR2;

            if (!currentSolved.includes(challengeId)) {
                // Call API to persist
                try {
                    const user = JSON.parse(localStorage.getItem("mock_user") || "{}");
                    if (user.id) {
                        await fetch(`${API_URL}/api/submit`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: user.id,
                                challengeId,
                                flag: flagInput,
                                points
                            }),
                        });
                    }
                } catch (e) {
                    console.error("Failed to save solve to DB", e);
                }

                // Update Solved Challenges Logic (Client Side)
                const newSolved = [...currentSolved, challengeId];

                if (roundNumber === 1) {
                    setSolvedR1(newSolved);
                    localStorage.setItem("solvedR1", JSON.stringify(newSolved));

                    setRound1Score(prev => {
                        const newScore = prev + points;
                        localStorage.setItem("round1Score", newScore.toString());
                        return newScore;
                    });
                } else {
                    setSolvedR2(newSolved);
                    localStorage.setItem("solvedR2", JSON.stringify(newSolved));

                    setRound2Score(prev => {
                        const newScore = prev + points;
                        localStorage.setItem("round2Score", newScore.toString());
                        return newScore;
                    });
                }

                // Update History
                const newRecord: SolveRecord = {
                    teamName,
                    challengeTitle: challengeId,
                    points,
                    timestamp: new Date().toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    }),
                    round: roundNumber
                };
                const newHistory = [newRecord, ...solveHistory];
                setSolveHistory(newHistory);
                localStorage.setItem("solveHistory", JSON.stringify(newHistory));

                return true;
            }
            return true; // Already solved
        }
        return false;
    };

    return (
        <GameContext.Provider value={{
            round1Locked,
            round2Locked,
            toggleRound1,
            toggleRound2,
            round1Completed,
            round2Completed,
            completeRound1,
            completeRound2,
            resetRound1,
            resetRound2,
            teamScore: round1Score + round2Score,
            round1Score,
            round2Score,
            solvedR1,
            solvedR2,
            submitFlag,
            solveHistory,
            bannedTeams,
            banTeam,
            isTeamBanned,
            resetUserRound
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
