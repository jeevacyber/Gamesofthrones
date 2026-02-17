import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide login/signup buttons on landing page
  const isLandingPage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyber-purple" />
          <span className="font-cinzel font-bold text-lg gradient-text-cyber">CTF 2026</span>
        </Link>

        {/* Desktop */}
        {!isLandingPage && (
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.role === "admin" ? "Admin" : user.teamName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                <Link to="/register" className="btn-cyber text-xs py-2 px-4 rounded-lg">Register</Link>
              </>
            )}
          </div>
        )}

        {/* Mobile toggle - only show if not on landing page */}
        {!isLandingPage && (
          <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {open && !isLandingPage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-card border-t border-border/30 p-4 flex flex-col gap-3"
        >
          {user ? (
            <>
              <div className="text-sm text-muted-foreground pb-2 border-b border-border/30">
                {user.role === "admin" ? "Admin Panel" : user.teamName || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn-cyber text-xs py-2 px-4 rounded-lg text-center" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
