import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Shield, Code, Lock, Search, Terminal } from "lucide-react";

const topics = [
  { icon: Shield, label: "Web Security" },
  { icon: Lock, label: "Cryptography" },
  { icon: Search, label: "Forensics" },
  { icon: Code, label: "Exploitation" },
  { icon: Terminal, label: "OSINT" },
  { icon: Flame, label: "Steganography" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fire-red/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-ice-blue/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Dragon emoji as hero visual */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl md:text-9xl mb-6"
        >
          🐉
        </motion.div>

        <h1 className="font-cinzel text-5xl md:text-7xl font-black mb-4 leading-tight">
          <span className="gradient-text-cyber">Capture</span>{" "}
          <span className="text-foreground">The</span>{" "}
          <span className="gradient-text-fire">Flag</span>{" "}
          <span className="text-muted-foreground text-3xl md:text-5xl block mt-2">2026</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground font-mono mb-8"
        >
          Where Code Becomes <span className="text-cyber-purple font-bold">Power</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/register" className="btn-cyber text-sm">Register Now</Link>
          <Link to="/login" className="btn-fire text-sm">Login</Link>
        </motion.div>
      </motion.div>

      {/* Topic icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-20"
      >
        {topics.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="glass-card p-4 flex flex-col items-center gap-2 hover:neon-border transition-all duration-300 group"
          >
            <t.icon className="w-6 h-6 text-cyber-purple group-hover:text-cyber-neon transition-colors" />
            <span className="text-xs text-muted-foreground">{t.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
