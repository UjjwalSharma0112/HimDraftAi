import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logoImg from "../assets/preview.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/85 border-b border-line/50 px-4 py-3.5 sm:px-6 lg:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="HimShakti AI Logo"
            className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg font-sans font-semibold tracking-tight text-fg transition-colors duration-300">
            HimShakti <span className="text-accent font-sans font-medium text-base bg-accent-soft px-2 py-0.5 rounded-md ml-1 border border-accent/10">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-all duration-300 relative py-2 ${
                      isActive
                        ? "text-accent"
                        : "text-muted hover:text-fg"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full animate-fadeIn" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Theme Toggler (Paper vs Ink) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-line bg-raised hover:bg-surface flex items-center justify-center text-muted hover:text-fg transition-all duration-350 focus-ring"
            title={isDark ? "Switch to Paper (Light Mode)" : "Switch to Ink (Dark Mode)"}
          >
            {isDark ? (
              // Ink droplet / Moon alternative representing Paper Mode
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Ink Bottle / droplet representing Ink Mode
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-accent text-accent-contrast font-medium text-xs hover:opacity-90 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-ring"
          >
            Launch Workspace
          </Link>
        </div>

        {/* Mobile menu button and theme toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Toggler (Paper vs Ink) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-line bg-raised hover:bg-surface flex items-center justify-center text-muted hover:text-fg transition-all duration-300"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-fg hover:bg-surface border border-transparent hover:border-line focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg className="block h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              <svg className="block h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bg border-t border-line/30 mt-3 py-4 rounded-xl px-2 animate-fadeIn" id="mobile-menu">
          <div className="space-y-1.5 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2.5 text-base font-medium transition-all ${
                    isActive
                      ? "bg-accent-soft text-accent border-l-4 border-accent"
                      : "text-muted hover:bg-surface hover:text-fg"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-line/30 px-4">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-accent text-accent-contrast font-medium text-center hover:opacity-90 shadow-md transition-all duration-300"
              >
                Launch Workspace
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
