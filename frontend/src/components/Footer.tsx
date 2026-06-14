import { Link } from "react-router-dom";
import logoImg from "../assets/preview.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="grain bg-bg border-t border-line/60 text-muted py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
        
        {/* Brand Description column */}
        <div className="space-y-2.5 max-w-md text-left">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <img
              src={logoImg}
              alt="HimShakti AI Logo"
              className="w-6 h-6 rounded-md object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-sm font-sans font-semibold text-fg transition-colors duration-300">
              HimShakti AI
            </span>
          </Link>
          <p className="text-xs text-muted leading-relaxed">
            Empowering traditional Himalayan food producers, farmers, and
            organic cooperatives with advanced AI copywriting and marketing
            solutions to share the purity of the mountains with the world.
          </p>
        </div>

        {/* Sitemap Links Column */}
        <div className="space-y-2 text-left">
          <h3 className="text-[10px] font-mono font-bold text-fg uppercase tracking-widest">
            Sitemap
          </h3>
          <ul className="flex flex-col sm:flex-row gap-x-5 gap-y-1 text-xs">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-accent transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-line/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-faint">
        <p>
          &copy; {currentYear} HimShakti AI. Preserving Himalayan heritage under
          fair-trade principles.
        </p>
      </div>
    </footer>
  );
}
