import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    teamName: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamMember1: "",
    teamMember2: "",
    teamMember3: "",
    collegeName: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await register(
      form.email,
      form.password,
      form.teamName,
      form.teamMember1,
      form.teamMember2,
      form.teamMember3,
      form.collegeName
    );

    setLoading(false);
    if (error) {
      toast({ title: error, variant: "destructive" });
    } else {
      toast({ title: "Registration successful! Please login." });
      navigate("/login");
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4">
      <Navbar />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-fire-orange/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cyber-purple/10 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card neon-border p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-fire-orange" />
            <h1 className="font-cinzel text-2xl font-bold gradient-text-fire">Register</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Team Name</label>
              <input
                type="text"
                value={form.teamName}
                onChange={(e) => update("teamName", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="Dragon Slayers"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Team Member 1</label>
              <input
                type="text"
                value={form.teamMember1}
                onChange={(e) => update("teamMember1", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="Member 1 Name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Team Member 2</label>
              <input
                type="text"
                value={form.teamMember2}
                onChange={(e) => update("teamMember2", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="Member 2 Name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Team Member 3</label>
              <input
                type="text"
                value={form.teamMember3}
                onChange={(e) => update("teamMember3", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="Member 3 Name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">College Name</label>
              <input
                type="text"
                value={form.collegeName}
                onChange={(e) => update("collegeName", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="College / University"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="team@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-fire-orange transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-fire w-full text-sm">
              {loading ? "Registering..." : "Register Team"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-fire-orange hover:text-fire-gold transition-colors">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
