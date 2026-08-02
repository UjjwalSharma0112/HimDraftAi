import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LandingPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTone, setActiveTone] = useState<"premium" | "health" | "traditional">("premium");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkActive = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(darkActive);
    if (darkActive) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
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

  const sampleCopies = {
    premium: `Sourced from unpolluted 8,000ft Himalayan flora, our Raw Multi-Flora Himalayan Honey represents the pinnacle of artisanal purity. Cold-filtered to preserve wild enzymes, royal jelly, and rich antioxidants, each jar delivers an exquisite amber velvet texture with subtle floral undertones. Certified 100% organic and trace-verified from apiary to export jar.`,
    health: `Elevate your daily wellness with 100% Pure Himalayan Raw Honey. Naturally packed with wild enzymes, bio-active propolis, and immune-supporting antioxidants, this raw nectar helps boost natural vitality, soothe digestion, and promote clean sustained energy. Free from added sugars, processing, or heat treatment.`,
    traditional: `Hand-harvested by local Himalayan bee-keepers using age-old sustainable traditions, this Raw Multi-Flora Honey carries the authentic heritage of mountain wellness. Steeped in Ayurvedic tradition, our raw honey retains its natural crystallizing richness, delivering timeless purity straight from nature's pristine sanctuaries.`
  };

  return (
    <div className="min-h-screen bg-surface-bg text-primary-text font-sans antialiased selection:bg-primary-text selection:text-container-bg transition-colors duration-200">
      
      {/* Top Header matching app layout */}
      <header className="sticky top-0 z-50 bg-container-bg border-b border-outline-border">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="text-sm font-bold uppercase tracking-wider text-primary-text">
              HimDraft<span className="text-secondary-text">AI</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-text border-l border-outline-border pl-3 hidden sm:inline-block">
              Himalayan Organic Export Drafts
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-secondary-text">
            <a href="#features" className="hover:text-primary-text transition-colors">Features</a>
            <a href="#demo" className="hover:text-primary-text transition-colors">Interactive Engine</a>
            <a href="#compliance" className="hover:text-primary-text transition-colors">Export Standards</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-[4px] border border-outline-border bg-surface-bg text-primary-text flex items-center justify-center hover:bg-outline-border/40 transition cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1M3 12h1m16 0h1m-15.364-6.364l.707.707" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646" />
                </svg>
              )}
            </button>

            {token ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-primary-text text-container-bg text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-[4px] hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
              >
                Go to Workspace
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider px-3 py-2 text-secondary-text hover:text-primary-text transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-text text-container-bg text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-[4px] hover:opacity-95 transition cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 max-w-[1280px] mx-auto px-6 border-b border-outline-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Monochromatic Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-outline-border bg-container-bg text-[10px] font-mono uppercase tracking-widest text-secondary-text">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-text animate-pulse" />
            <span>AI Copy Engine v2.0</span>
            <span className="text-outline-border">•</span>
            <span>Export Compliance Ready</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-primary-text leading-[1.15]">
            Generate Export-Grade Copy For Himalayan Organic Products
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xs sm:text-sm text-secondary-text max-w-2xl mx-auto font-sans leading-relaxed">
            Create compliance-backed, tone-customized marketing descriptions for raw honeys, shilajit, organic teas, and wild spices powered by Google Gemini AI.
          </p>

          {/* CTA Buttons matching app styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(token ? "/dashboard" : "/login")}
              className="w-full sm:w-auto bg-primary-text text-container-bg text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-[4px] hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              Launch Workspace
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            <a
              href="#demo"
              className="w-full sm:w-auto border border-outline-border bg-container-bg text-primary-text text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-[4px] hover:bg-surface-bg transition cursor-pointer text-center"
            >
              Explore Interactive Demo
            </a>
          </div>

          {/* Stat Grid */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-mono">
            <div className="p-4 bg-container-bg border border-outline-border rounded-[4px] space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-primary-text">100%</div>
              <div className="text-[10px] uppercase text-secondary-text">Export Standard</div>
            </div>
            <div className="p-4 bg-container-bg border border-outline-border rounded-[4px] space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-primary-text">&lt; 1.2s</div>
              <div className="text-[10px] uppercase text-secondary-text">Latency</div>
            </div>
            <div className="p-4 bg-container-bg border border-outline-border rounded-[4px] space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-primary-text">3 Tones</div>
              <div className="text-[10px] uppercase text-secondary-text">Prem / Health / Trad</div>
            </div>
            <div className="p-4 bg-container-bg border border-outline-border rounded-[4px] space-y-1">
              <div className="text-xl sm:text-2xl font-bold text-primary-text">5,000+</div>
              <div className="text-[10px] uppercase text-secondary-text">Copies Drafted</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive AI Preview Demo (Aceternity Layout with HimDraftAI styling) */}
      <section id="demo" className="py-16 max-w-[1280px] mx-auto px-6 border-b border-outline-border">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-text font-semibold">
            Interactive Engine Preview
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-primary-text">
            Test Tone Positioning
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-container-bg border border-outline-border rounded-[4px] p-6 md:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-border pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-secondary-text block">Product Sample</span>
              <h3 className="text-sm font-bold uppercase text-primary-text">Raw Multi-Flora Himalayan Honey</h3>
            </div>

            {/* Monochromatic Tone Selector */}
            <div className="flex items-center gap-1 bg-surface-bg p-1 rounded-[4px] border border-outline-border">
              {(["premium", "health", "traditional"] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setActiveTone(tone)}
                  className={`text-[10px] font-mono uppercase px-3 py-1.5 rounded-[4px] transition cursor-pointer ${
                    activeTone === tone
                      ? "bg-primary-text text-container-bg font-bold"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Product Spec Tags */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px] text-secondary-text">
              WEIGHT: 500g
            </span>
            <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px] text-secondary-text">
              INGREDIENTS: Wild Flora, Royal Jelly
            </span>
            <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px] text-secondary-text">
              ORIGIN: 8,000ft Altitude
            </span>
          </div>

          {/* Generated Copy Display */}
          <div className="p-4 bg-surface-bg border border-outline-border rounded-[4px] text-xs font-sans leading-relaxed text-primary-text min-h-[120px] flex items-center">
            <p className="animate-fadeIn">{sampleCopies[activeTone]}</p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-secondary-text pt-2 border-t border-outline-border">
            <span>GEMINI AI MODEL 1.5 FLASH</span>
            <button
              onClick={() => navigate(token ? "/dashboard" : "/login")}
              className="text-xs font-bold uppercase tracking-wider text-primary-text hover:underline flex items-center gap-1 cursor-pointer"
            >
              Generate Your Product Copy &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* Bento Grid Feature Showcase matching HimDraftAI styling */}
      <section id="features" className="py-16 max-w-[1280px] mx-auto px-6 border-b border-outline-border">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-secondary-text font-semibold">
            System Features
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-primary-text">
            Engineered For Export Success
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-secondary-text block">01 / CONTEXT ENGINE</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text">
              Himalayan Organic AI Model
            </h3>
            <p className="text-xs text-secondary-text font-sans leading-relaxed">
              Trained on traditional Himalayan food categories—raw honey, shilajit, wild teas, herbs &amp; spices—ensuring authentic storytelling without generic marketing fluff.
            </p>
          </div>

          <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-secondary-text block">02 / TONE POSITIONING</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text">
              3 Brand Tones
            </h3>
            <p className="text-xs text-secondary-text font-sans leading-relaxed">
              Instantly toggle between Premium Luxury, Health &amp; Wellness, and Traditional Heritage positioning for different buyer personas.
            </p>
          </div>

          <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-secondary-text block">03 / SMART CLARIFICATION</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text">
              Interactive Q&amp;A
            </h3>
            <p className="text-xs text-secondary-text font-sans leading-relaxed">
              When input data is sparse, HimDraftAI asks targeted follow-up questions to refine altitude, certifications, and flavor notes.
            </p>
          </div>

          <div className="md:col-span-2 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-3">
            <span className="text-[10px] font-mono uppercase text-secondary-text block">04 / CLOUD DATABASE</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text">
              MongoDB Atlas Integration
            </h3>
            <p className="text-xs text-secondary-text font-sans leading-relaxed">
              Cloud persistence with full CRUD actions, search filters, and one-click copy export for global marketplace deployment.
            </p>
          </div>

        </div>
      </section>

      {/* Footer matching app style */}
      <footer className="py-8 max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase text-secondary-text">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-text">HimDraftAI &copy; {new Date().getFullYear()}</span>
            <span>•</span>
            <span>Himalayan Organic Export Generator</span>
          </div>

          <div className="flex items-center gap-4">
            <span>STATUS: ONLINE</span>
            <a
              href="https://github.com/UjjwalSharma0112/HimDraftAi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary-text transition"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
