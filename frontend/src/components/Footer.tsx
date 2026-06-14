import { Link } from "react-router-dom";
import logoImg from "../assets/preview.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="grain bg-bg border-t border-line/60 text-muted py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description column */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <img
              src={logoImg}
              alt="HimShakti AI Logo"
              className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-base font-sans font-semibold text-fg transition-colors duration-300">
              HimShakti AI
            </span>
          </Link>
          <p className="text-sm text-muted max-w-sm leading-relaxed">
            Empowering traditional Himalayan food producers, farmers, and organic cooperatives with advanced AI copywriting and marketing solutions to share the purity of the mountains with the world.
          </p>
          <div className="flex gap-3 pt-2">
            {/* Social Buttons */}
            {["twitter", "github", "linkedin"].map((social) => (
              <a
                key={social}
                href={`https://${social}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-raised hover:bg-surface text-muted hover:text-accent border border-line flex items-center justify-center transition-all duration-300 focus-ring"
              >
                <span className="sr-only">{social}</span>
                {social === "twitter" && (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social === "github" && (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
                {social === "linkedin" && (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-fg uppercase tracking-widest">
            Workspace
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/dashboard" className="hover:text-accent transition-colors">
                AI Generator
              </Link>
            </li>
            <li>
              <a href="#features" className="hover:text-accent transition-colors">
                Copy Templates
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-accent transition-colors">
                Pricing Plans
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-fg uppercase tracking-widest">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-accent transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <a href="#press" className="hover:text-accent transition-colors">
                Press Kit
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-accent transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-line/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-faint">
        <p>
          &copy; {currentYear} HimShakti AI. Preserving Himalayan heritage under fair-trade principles.
        </p>
        <p className="flex gap-4">
          <a href="#privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-accent transition-colors">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
