import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Input, Button, Loader } from "../components/ui";
import useDescriptions from "../hooks/useDescriptions";
import type { MainLayoutContext } from "../layouts/MainLayout";

export default function GeneratorPage() {
  const { showToast } = useOutletContext<MainLayoutContext>();
  const navigate = useNavigate();
  const { createProduct } = useDescriptions();

  const [productName, setProductName] = useState("Organic Himalayan Shilajit");
  const [category, setCategory] = useState("Shilajit");
  const [altitude, setAltitude] = useState("250g");
  const [tone] = useState("Cultural Story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      showToast("Product name is required!", "error");
      return;
    }

    setIsGenerating(true);

    setTimeout(async () => {
      let copy = "";
      if (category === "Honey") {
        copy = `Nestled in the remote, mist-kissed ridges of the Himalayas, our ${productName} represents a centuries-old harmony between bees and pristine nature. Hand-harvested by generational honey hunters, this raw, golden elixir preserves all natural enzymes and offers a delicate floral taste.`;
      } else if (category === "Shilajit") {
        copy = `Forged in the heart of the Himalayas over centuries, our ${productName} is harvested from steep black rock faces at high altitudes. Rich in fulvic acid and trace minerals, it is a sacred adaptogen purified to bring ancient longevity secrets in its purest form.`;
      } else {
        copy = `Grown in mineral-dense, glacial-fed soils of Himalayan hillsides, our ${productName} is tended by small farmer cooperatives. Sundried and stone-milled using age-old methods, these traditional crops bring rich, authentic mountain flavors straight to your home.`;
      }

      setGeneratedContent(copy);
      setIsGenerating(false);
      showToast("Description generated successfully!", "success");

      try {
        await createProduct({
          productName,
          ingredients: [category],
          weight: altitude,
          features: ["Himalayan Sourced", tone],
          tone: tone.toLowerCase().includes("health") ? "health" : tone.toLowerCase().includes("luxury") ? "indulgent" : "natural",
          generatedDescription: copy
        });
        showToast("Saved to API collection!", "success");
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-border pb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase">AI Copywriting Generator</h1>
        <p className="text-[11px] sm:text-xs text-secondary-text mt-1">
          Input parameters to generate copy and create product entries directly via the API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
          <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
            Configuration Properties
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            <Input
              label="Product Title"
              id="gen-product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Pure Himalayan Shilajit"
              required
            />

            <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
              <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                Product Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3.5 py-2.5 rounded-[4px] text-xs sm:text-sm text-primary-text focus:outline-none"
              >
                <option value="Honey">Organic Honey</option>
                <option value="Shilajit">Shilajit Resin</option>
                <option value="Herbs & Spices">Herbs & Spices</option>
                <option value="Grains">Mountain Grains & Millets</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
              <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                Weight / Size
              </label>
              <input
                type="text"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                className="w-full bg-container-bg border border-outline-border px-3.5 py-2 rounded-[4px] text-xs"
                placeholder="e.g. 250g"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={isGenerating}>
              {isGenerating ? "Processing Copy..." : "Generate Description"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-container-bg border border-outline-border rounded-[4px] p-6 h-full flex flex-col justify-between min-h-[400px]">
          <div className="space-y-4 flex-1 flex flex-col">
            <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
              Generated Copy Output
            </h3>

            {isGenerating ? (
              <div className="flex-1 flex flex-col justify-center items-center py-16">
                <Loader variant="spinner" size="lg" className="mb-4" />
                <Loader variant="skeleton" className="max-w-md w-full" />
              </div>
            ) : generatedContent ? (
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full flex-1 min-h-[220px] p-4 bg-surface-bg border border-outline-border rounded-[4px] text-xs sm:text-sm text-primary-text font-sans focus:outline-none resize-none"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-secondary-text text-xs">
                Configure your product settings and click Generate.
              </div>
            )}
          </div>

          {generatedContent && !isGenerating && (
            <div className="pt-4 border-t border-outline-border mt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-secondary-text">
                Words: {generatedContent.split(/\s+/).filter(Boolean).length}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs py-1.5 px-3" onClick={copyToClipboard}>
                  Copy Copy
                </Button>
                <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => navigate("/")}>
                  View on Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
