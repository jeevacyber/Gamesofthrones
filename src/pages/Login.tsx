import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Login = () => {
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

    if (error) {
      setLoading(false);
      toast({ title: error, variant: "destructive" });
      return;
    }

    setLoading(false);
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/rounds");
    }
  };

  const handleAdminLogin = async () => {
    setEmail("admin@ctf2026.com");
    setPassword("Admin@123");
    setLoading(true);

    const { user, error } = await login("admin@ctf.com", "admin");

    setLoading(false);
    if (error) {
      toast({ title: "Admin login failed", variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4">
      <Navbar />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyber-purple/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-fire-red/10 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card neon-border p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-cyber-purple" />
            <h1 className="font-cinzel text-2xl font-bold gradient-text-cyber">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyber-purple transition-colors"
                placeholder="team@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-cyber-purple transition-colors pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-cyber w-full text-sm">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full flex items-center justify-center gap-2 glass-card px-4 py-3 text-sm font-bold uppercase tracking-wider text-fire-orange hover:bg-secondary/50 transition-all rounded-lg border border-fire-orange/30"
            >
              <Crown size={16} />
              Admin Login
            </button>
            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="text-cyber-purple hover:text-cyber-neon transition-colors">Register</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
