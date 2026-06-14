import { useState } from "react";

interface CardProps {
  title: string;
  category: string;
  badge: string;
  price: string;
  description: string;
  highlightIcon: string;
}

export default function Card({ title, category, badge, price, description, highlightIcon }: CardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grain group relative rounded-card bg-raised border border-line p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-soft overflow-hidden">
      {/* Decorative hover corner gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-accent/0 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
      
      <div>
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest bg-accent-soft border border-accent/25 px-2.5 py-0.5 rounded-pill">
            {category}
          </span>
          <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-line">
            {badge}
          </span>
        </div>

        {/* Product Visual Indicator */}
        <div className="w-full h-40 rounded-card bg-surface/50 border border-line flex items-center justify-center mb-5 relative overflow-hidden group-hover:border-accent/30 transition-all duration-300">
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:opacity-10 dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:14px_14px]" />
          
          <div className="relative z-10 w-14 h-14 rounded-full bg-raised border border-line flex items-center justify-center group-hover:scale-105 transition-transform duration-300 text-3xl shadow-sm">
            {highlightIcon}
          </div>
          
          {/* Altitude Tag Overlay */}
          <span className="absolute bottom-2 right-2 text-[9px] font-mono text-faint bg-raised/80 px-2 py-0.5 rounded border border-line">
            Certified Pure
          </span>
        </div>

        {/* Product Title and Price */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-serif font-semibold text-fg group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <span className="text-lg font-serif font-semibold text-accent">{price}</span>
        </div>

        {/* AI Description Container */}
        <div className="relative p-3.5 bg-surface/30 border border-line rounded-lg mb-4 font-serif text-xs text-muted leading-relaxed max-h-28 overflow-y-auto transition-colors duration-300">
          {description}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-line/40">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-350 flex items-center justify-center gap-1.5 focus-ring ${
            copied
              ? "bg-accent text-accent-contrast"
              : "bg-surface hover:bg-line/40 text-fg border border-line"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy Description</span>
            </>
          )}
        </button>

        <button className="p-2 rounded-lg bg-surface hover:bg-line/45 text-muted hover:text-accent border border-line transition-all duration-300 focus-ring">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 4.75L17.24 9m-4 13v-5h-.581m0 0a8.003 8.003 0 01-15.357-2L1.76 15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
