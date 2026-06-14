import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="grain spotlight relative overflow-hidden bg-bg py-20 px-4 sm:px-6 lg:px-8 border-b border-line/50 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading and Text */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent text-xs font-mono font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            [pipeline] · traditional authenticity
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-fg tracking-tight leading-[1.1] transition-colors duration-300">
            Write the Soul of the
            <span className="block mt-2 text-accent">
              Himalayas
            </span>
            Into Your Brand
          </h1>
          
          <p className="text-lg text-muted max-w-xl leading-relaxed transition-colors duration-300">
            HimShakti AI generates high-converting product copies, cultural stories, and SEO-optimized descriptions specifically designed for traditional Himalayan foods, organic honey, and high-altitude crops.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-lg bg-accent text-accent-contrast font-medium text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-ring"
            >
              Generate Descriptions
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 rounded-lg bg-raised hover:bg-surface text-fg font-medium text-sm border border-line hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-ring"
            >
              Explore Mission
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-line/60 max-w-lg">
            <div>
              <p className="text-3xl font-serif font-semibold text-accent">10x</p>
              <p className="text-[10px] font-mono text-faint uppercase tracking-wider mt-1">Faster Writing</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-semibold text-accent">98%</p>
              <p className="text-[10px] font-mono text-faint uppercase tracking-wider mt-1">Cultural Verity</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-semibold text-accent">2.5x</p>
              <p className="text-[10px] font-mono text-faint uppercase tracking-wider mt-1">Sales Uplift</p>
            </div>
          </div>
          </div>

        {/* Right Column: Interactive Demo Mockup */}
        <div className="lg:col-span-5 w-full">
          <div className="relative group">
            {/* Outer decorative border/glow */}
            <div className="absolute -inset-0.5 rounded-xl bg-accent opacity-20 blur-sm group-hover:opacity-30 transition duration-500" />
            
            {/* The main panel */}
            <div className="relative rounded-xl bg-raised border border-line shadow-soft p-6 space-y-4 text-left overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-line/40">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-warn/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-muted/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                </div>
                <span className="text-[10px] text-faint font-mono">himshakti-ai-writer.v1</span>
              </div>

              {/* Form Input Mockup */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-faint uppercase tracking-wider">Product Name</label>
                <div className="px-3 py-2 bg-surface/50 border border-line/60 rounded-md text-sm text-fg font-semibold transition-colors duration-300">
                  Organic Himalayan Wildflower Honey
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-faint uppercase tracking-wider">Core Ingredients & Origin</label>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-surface border border-line text-muted rounded text-[10px] font-mono">Altitude 8,500ft</span>
                  <span className="px-2 py-0.5 bg-surface border border-line text-muted rounded text-[10px] font-mono">Rhododendron Nectar</span>
                  <span className="px-2 py-0.5 bg-surface border border-line text-muted rounded text-[10px] font-mono">Raw & Pure</span>
                </div>
              </div>

              {/* Action Button Sim */}
              <button className="w-full py-2.5 rounded-lg bg-accent text-accent-contrast font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus-ring">
                <span>Description Generated!</span>
              </button>

              {/* Output Copy Preview */}
              <div className="space-y-1.5 pt-2 border-t border-line/45">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-faint uppercase tracking-wider">Generated E-commerce Copy</span>
                  <span className="text-[10px] text-accent font-mono font-semibold">98% match</span>
                </div>
                <div className="p-3 bg-surface/30 rounded-lg text-xs text-muted leading-relaxed border border-line/50 font-serif transition-colors duration-300">
                  "Harvested by hand in the pristine alpine meadows of Kedarnath at 8,500 feet, our wildflower honey captures the pure, untamed spirit of the Himalayas. Infused with wild rhododendron nectar, this raw, unfiltered amber gold brings immune-boosting enzymes and a delicate floral finish right to your table."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
