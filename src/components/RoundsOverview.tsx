import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Snowflake } from "lucide-react";

const RoundsOverview = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-4xl md:text-5xl font-bold text-center mb-4"
        >
          Two <span className="gradient-text-cyber">Rounds</span>, Two Kingdoms
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-16 max-w-xl mx-auto"
        >
          Battle through fire and ice. Each kingdom holds its own challenges.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Round 1 - Fire */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/round/1" className="block fire-card p-8 group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-8 h-8 text-fire-orange" />
                <h3 className="font-cinzel text-2xl font-bold gradient-text-fire">House of the Dragon</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-mono">ROUND 1 — 10 FLAGS</p>
              <p className="text-foreground/80 mb-6">
                Web Security, OSINT, Cryptography, Steganography, and Digital Forensics. Enter the Fire Kingdom.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Web Security", "OSINT", "Crypto", "Stego", "Forensics"].map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-fire-orange/10 text-fire-orange border border-fire-orange/20">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>

          {/* Round 2 - Ice */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/round/2" className="block ice-card p-8 group hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Snowflake className="w-8 h-8 text-ice-blue" />
                <h3 className="font-cinzel text-2xl font-bold gradient-text-ice">Game of Thrones CTF</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-mono">ROUND 2 — 11 FLAGS</p>
              <p className="text-foreground/80 mb-6">
                Machine Exploitation, Privilege Escalation, Binary Exploitation, and Reverse Engineering. Enter the Ice Kingdom.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Exploitation", "PrivEsc", "Binary", "Reverse Eng."].map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-ice-blue/10 text-ice-blue border border-ice-blue/20">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoundsOverview;
