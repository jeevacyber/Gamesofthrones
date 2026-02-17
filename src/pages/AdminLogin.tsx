import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Crown, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const AdminLogin = () => {
    const [showPw, setShowPw] = useState(false);
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { user, error } = await login(email, password);

        setLoading(false);
        if (error) {
            toast({ title: error, variant: "destructive" });
            return;
        }

        // Check if user is actually admin
        if (user?.role !== "admin") {
            toast({ title: "Access Denied: Admin credentials required", variant: "destructive" });
            return;
        }

        toast({ title: "Admin login successful!" });
        navigate("/admin");
    };

    return (
        <div className="min-h-screen bg-background relative flex items-center justify-center px-4">
            <Navbar />
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-royal-gold/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-fire-red/10 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Participant Login</span>
                </button>

                <div className="glass-card neon-border p-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="w-8 h-8 text-royal-gold" />
                        <h1 className="font-cinzel text-2xl font-bold gradient-text-gold">Admin Login</h1>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mb-6">Authorized Personnel Only</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/50 border border-royal-gold/30 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-royal-gold transition-colors"
                                placeholder="admin@ctf.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Admin Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary/50 border border-royal-gold/30 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-royal-gold transition-colors pr-10"
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full btn-fire text-sm py-3 rounded-lg font-bold uppercase tracking-wider">
                            {loading ? "Authenticating..." : "Access Admin Panel"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            Not an admin?{" "}
                            <button onClick={() => navigate("/login")} className="text-cyber-purple hover:text-cyber-neon transition-colors">
                                Participant Login
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
