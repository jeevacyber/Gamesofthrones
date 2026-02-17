import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-cyber-purple" />
            <span className="font-cinzel font-bold gradient-text-cyber">CTF 2026</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Capture The Flag — Where Code Becomes Power.
          </p>
        </div>
        <div>
          <h4 className="font-cinzel font-bold mb-3 text-foreground">Rounds</h4>
          <div className="flex flex-col gap-2">
            <Link to="/round/1" className="text-sm text-muted-foreground hover:text-fire-orange transition-colors">🐉 House of the Dragon</Link>
            <Link to="/round/2" className="text-sm text-muted-foreground hover:text-ice-blue transition-colors">⚔ Game of Thrones</Link>
            <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">🏆 Leaderboard</Link>
          </div>
        </div>
        <div>
          <h4 className="font-cinzel font-bold mb-3 text-foreground">Rules</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• No flag sharing</li>
            <li>• No attacking infrastructure</li>
            <li>• Fair play only</li>
            <li>• Have fun 🎉</li>
          </ul>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
        © 2026 Capture The Flag. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
