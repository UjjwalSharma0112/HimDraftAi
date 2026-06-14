import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function HomePage() {
  const sampleProducts = [
    {
      title: "Pristine Shilajit Resin",
      category: "Wellness & Health",
      badge: "Best Seller",
      price: "$39.99",
      description:
        "Sourced from high-altitude rock crevices in the Garhwal Himalayas at 16,000 feet. Purified using traditional Triphala methods, HimShakti Raw Shilajit is a potent, mineral-rich adaptogen. Restores natural energy, sharpens mental clarity, and boosts immune response. Certified organic and lab-tested.",
      highlightIcon: "🏔️",
    },
    {
      title: "Rhododendron Wild Honey",
      category: "Organic Foods",
      badge: "Limited Batch",
      price: "$24.99",
      description:
        "Harvested by heritage bee-collectors from high cliffs of Uttarakhand. This rare amber honey features nectar gathered exclusively from wild spring rhododendron blossoms. Unpasteurized and unfiltered, delivering rich floral undertones and natural throat-soothing enzymes.",
      highlightIcon: "🍯",
    },
    {
      title: "Kashmiri Mongra Saffron",
      category: "Spices & Herbs",
      badge: "Grade A+",
      price: "$18.50",
      description:
        "Stigmas are hand-harvested during dawn in the historic soils of Pampore. Kashmiri Mongra Saffron is renowned for its intense crimson hue, unmatched aroma, and high safranal content. Just three threads enrich dishes with a luxurious golden color and therapeutic antioxidants.",
      highlightIcon: "🌸",
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Products Grid Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-mono font-medium text-accent uppercase tracking-widest bg-accent-soft border border-accent/20 px-3 py-1 rounded-pill">
              [demo] · generated copies
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-fg transition-colors duration-300">
              AI-Generated Copy in <span className="text-accent">Action</span>
            </h2>
            <p className="text-muted text-base max-w-xl mx-auto transition-colors duration-300">
              See how HimShakti AI crafts rich, cultural product stories and
              high-impact marketing descriptions for authentic Himalayan
              offerings. Click 'Copy' to use these descriptions instantly.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProducts.map((product, index) => (
              <Card
                key={index}
                title={product.title}
                category={product.category}
                badge={product.badge}
                price={product.price}
                description={product.description}
                highlightIcon={product.highlightIcon}
              />
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 bg-surface/30 border-t border-line/60 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-fg transition-colors duration-300">
                Write In Three Easy Steps
              </h2>
              <p className="text-muted text-sm transition-colors duration-300">
                Our AI handles everything from origin story to SEO metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="grain bg-raised border border-line p-6 rounded-card space-y-4 transition-colors duration-300">
                <div className="w-9 h-9 rounded-lg bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-mono font-medium">
                  01
                </div>
                <h3 className="text-lg font-serif font-semibold text-fg">
                  Input Details
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Enter your product name, select ingredients, specify the
                  altitude of harvest, and choose the traditional processing
                  method.
                </p>
              </div>

              {/* Step 2 */}
              <div className="grain bg-raised border border-line p-6 rounded-card space-y-4 transition-colors duration-300">
                <div className="w-9 h-9 rounded-lg bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-mono font-medium">
                  02
                </div>
                <h3 className="text-lg font-serif font-semibold text-fg">
                  Select Vibe & Format
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Choose a tone like "Cultural Story", "SEO Bullet Points", or
                  "Premium E-commerce". Support both English and local dialects.
                </p>
              </div>

              {/* Step 3 */}
              <div className="grain bg-raised border border-line p-6 rounded-card space-y-4 transition-colors duration-300">
                <div className="w-9 h-9 rounded-lg bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-mono font-medium">
                  03
                </div>
                <h3 className="text-lg font-serif font-semibold text-fg">
                  Publish Copy
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Instantly download or copy descriptions tailored for Amazon,
                  Shopify, or brand websites. Built-in compliance checks
                  included.
                </p>
              </div>
            </div>

            {/* Quick CTA banner */}
            <div className="grain mt-16 bg-raised border border-line rounded-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-soft transition-colors duration-300">
              <div className="text-left space-y-1">
                <h3 className="text-xl font-serif font-semibold text-fg">
                  Ready to boost your sales conversion?
                </h3>
                <p className="text-muted text-sm">
                  Start writing premium Himalayan product listings today.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-lg bg-accent text-accent-contrast font-medium text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap focus-ring"
              >
                Open Workspace
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
