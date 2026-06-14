import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left relative">
        <div className="space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-medium text-accent uppercase tracking-widest bg-accent-soft border border-accent/20 px-3 py-1 rounded-pill">
              [org] · editorial history
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-fg transition-colors duration-300">
              About HimDraftAi
            </h1>
          </div>

          <div className="space-y-6 text-muted leading-relaxed text-base transition-colors duration-300">
            <p>
              At HimDraftAi, we bridge the gap between ancient Himalayan agricultural wisdom and modern digital commerce. The Himalayas are home to some of the world's most pure, nutrient-dense superfoods—wild raw honey, high-altitude shilajit, organic mountain millets, and fresh hand-plucked herbs. However, local farmers and small cooperatives often struggle to market these premium products effectively to global audiences.
            </p>
            <p>
              Our platform uses fine-tuned AI copy models to automatically generate high-converting, culturally rich e-commerce description copy. By highlighting factors like altitude of harvest, soil purity, ancient preparation methods, and local farmer cooperatives, HimDraftAi crafts product stories that resonate with conscious buyers.
            </p>
            <p>
              We are committed to fostering fair trade, empowering local communities in Uttarakhand, Kashmir, and neighboring regions, and ensuring that the cultural heritage of mountain agriculture is preserved and celebrated.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-line/60">
            <div className="grain p-5 rounded-card bg-raised border border-line transition-colors duration-300">
              <h3 className="font-serif font-semibold text-fg mb-2">Heritage Storytelling</h3>
              <p className="text-xs text-muted leading-relaxed">
                Preserving the cultural value, farmer stories, and geographical details unique to the Himalayas.
              </p>
            </div>
            <div className="grain p-5 rounded-card bg-raised border border-line transition-colors duration-300">
              <h3 className="font-serif font-semibold text-fg mb-2">E-Commerce Ready</h3>
              <p className="text-xs text-muted leading-relaxed">
                Optimized templates for Shopify, Amazon, Vercel storefronts, social media channels, and metadata.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
