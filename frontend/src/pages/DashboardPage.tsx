import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardPage() {
  // --- AI Copywriter Workspace State ---
  const [productName, setProductName] = useState("Organic Himalayan Herbs");
  const [category, setCategory] = useState("Herbs & Spices");
  const [altitude, setAltitude] = useState("7,000 ft");
  const [tone, setTone] = useState("Cultural Story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [copied, setCopied] = useState(false);

  // Form submit generator
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCopied(false);

    setTimeout(() => {
      let copy = "";
      if (category === "Honey") {
        if (tone === "Cultural Story") {
          copy = `Nestled in the remote, mist-kissed ridges of the Himalayas at ${altitude}, our ${productName} represents a centuries-old harmony between bees and pristine nature. Hand-harvested by generational honey hunters, this raw, golden elixir carries the delicate floral essence of high-altitude blossoms. Unfiltered and raw, it preserves all natural enzymes and immune-boosting benefits, sharing the true sacred energy of the mountains with every spoonful.`;
        } else if (tone === "Premium Luxury") {
          copy = `Introducing the gold standard of high-altitude nectar. Our ${productName} is harvested at ${altitude} from untouched Himalayan wildflowers. This micro-batch honey is characterized by its deep, luxurious amber hue and intense floral bouquet. Unheated and minimally strained, it is a rare culinary treasure packed with powerful mountain antioxidants, presented for the discerning palate.`;
        } else {
          copy = `Buy 100% Pure Raw Himalayan Honey. Sourced at ${altitude}. Key benefits: raw, unpasteurized, organic wildflower honey. Ideal for boosting immunity, healthy sweetening, and natural wellness recipes. Order your jar of pure mountain wellness today.`;
        }
      } else if (category === "Shilajit") {
        if (tone === "Cultural Story") {
          copy = `Forged in the heart of the Himalayas over centuries, our ${productName} is harvested from steep black rock faces at ${altitude}. Known traditionally as the 'Destroyer of Weakness,' this purified shilajit resin is a sacred adaptogen used for vitality and strength. Hand-purified using pristine mountain spring water and Triphala, it brings you ancient longevity secrets in its purest form.`;
        } else if (tone === "Premium Luxury") {
          copy = `Experience high-performance wellness powered by the heights of the earth. Cultivated at ${altitude}, this ultra-grade ${productName} resin contains a high percentage of fulvic acid and trace minerals. Purified meticulously to meet top-tier purity certifications, it is the ultimate natural supplement to elevate your daily cognitive focus, energy, and physical resilience.`;
        } else {
          copy = `High-quality Pure Himalayan Shilajit Resin. Sourced at ${altitude}. Rich in Fulvic Acid and 80+ trace minerals. Boosts stamina, brain function, and natural immunity. Third-party lab tested for heavy metals. Shop the best organic shilajit online.`;
        }
      } else {
        if (tone === "Cultural Story") {
          copy = `Grown in the mineral-dense, glacial-fed soils of the Himalayan hillsides at ${altitude}, our ${productName} is tended by small farmer cooperatives. Sundried and stone-milled using age-old methods, these traditional crops are packed with pure nutrients. Each harvest supports local mountain livelihoods while bringing the rich, aromatic flavors of the valleys straight to your home.`;
        } else if (tone === "Premium Luxury") {
          copy = `Elevate your culinary creations with the ultimate mountain harvest. Grown at a pristine altitude of ${altitude}, this premium ${productName} is curated for peak potency, flavor, and purity. Carefully hand-selected and custom-packed, it delivers unmatched freshness and an authentic taste profile that stands in a class of its own.`;
        } else {
          copy = `Organic ${productName} from Himalayan Valleys. Cultivated at ${altitude} by local fair-trade cooperatives. 100% natural, pesticide-free, and sun-dried. Perfect for healthy cooking, culinary flavoring, and premium pantry upgrades. Fast shipping.`;
        }
      }
      setGeneratedCopy(copy);
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Workspace Mode Selection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6 mb-10 gap-4">
          <div className="text-left space-y-1">
            <h1 className="text-3xl font-serif font-medium tracking-tight text-fg transition-colors duration-300">
              HimShakti Copy Workspace
            </h1>
            <p className="text-muted text-sm max-w-xl transition-colors duration-300">
              Configure parameters and generate premium descriptions for
              Himalayan goods.
            </p>
          </div>
        </div>

        {/* Copywriter Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          {/* Left panel: Input parameters */}
          <div className="grain lg:col-span-5 bg-raised border border-line rounded-card p-6 shadow-soft space-y-6 transition-colors duration-300">
            <h2 className="text-sm font-mono font-medium border-b border-line pb-3 flex items-center gap-2 text-fg">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              [writer] · properties
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4 text-left">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                  placeholder="e.g. Kashmiri Saffron"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">
                  Product Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                >
                  <option value="Honey">Organic Honey</option>
                  <option value="Shilajit">Shilajit Resin</option>
                  <option value="Herbs & Spices">Herbs & Spices</option>
                  <option value="Grains">Mountain Grains & Millets</option>
                </select>
              </div>

              {/* Altitude */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">
                  Harvest Altitude
                </label>
                <select
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  className="w-full bg-surface/30 border border-line focus:border-accent rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none transition-colors focus-ring"
                >
                  <option value="5,000 ft">5,000 ft (Low Alpine)</option>
                  <option value="8,500 ft">8,500 ft (Mid Alpine)</option>
                  <option value="12,000 ft">12,000 ft (High Altitude)</option>
                  <option value="16,000 ft">16,000 ft (Glacial Valleys)</option>
                </select>
              </div>

              {/* Tone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-medium text-faint uppercase tracking-wider">
                  AI Vibe & Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Cultural Story", "Premium Luxury", "E-com SEO"].map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all ${
                          tone === t
                            ? "bg-accent-soft border-accent text-accent"
                            : "bg-surface/30 border-line text-muted hover:text-fg"
                        }`}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full mt-4 py-3 rounded-lg bg-accent text-accent-contrast hover:opacity-95 font-medium text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus-ring"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Generating description...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Generate Copy</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right panel: AI Generated output */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between">
            <div className="grain bg-raised border border-line rounded-card p-6 shadow-soft min-h-[420px] flex flex-col justify-between text-left transition-colors duration-300">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
                  <h2 className="text-sm font-mono font-medium flex items-center gap-2 text-fg">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                    [writer] · generated copy
                  </h2>
                  {generatedCopy && (
                    <span className="text-[9px] font-mono bg-surface border border-line px-2.5 py-1 rounded text-muted uppercase">
                      Format: {tone}
                    </span>
                  )}
                </div>

                {generatedCopy ? (
                  <div className="p-5 bg-surface/30 border border-line rounded-xl font-serif text-fg leading-relaxed text-base min-h-[220px] whitespace-pre-wrap animate-fadeIn transition-colors duration-300">
                    {generatedCopy}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-surface/50 border border-line flex items-center justify-center text-2xl text-accent shadow-sm">
                      ⚡
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-fg">
                        No description generated yet
                      </p>
                      <p className="text-xs text-muted max-w-xs mt-1 leading-relaxed">
                        Fill in the product details on the left panel and click
                        "Generate Copy" to review your copy story.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {generatedCopy && (
                <div className="mt-6 pt-4 border-t border-line flex flex-wrap gap-3 items-center justify-between">
                  <div className="text-xs font-mono text-muted">
                    Word Count: {generatedCopy.split(/\s+/).length} words
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`py-2 px-4 rounded-lg text-xs font-medium transition-all duration-350 flex items-center gap-1.5 focus-ring ${
                      copied
                        ? "bg-accent text-accent-contrast"
                        : "bg-surface hover:bg-line/40 text-fg border border-line"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
