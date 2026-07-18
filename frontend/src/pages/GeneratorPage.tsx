import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Input, Button, Loader } from "../components/ui";
import useDescriptions from "../hooks/useDescriptions";
import type { MainLayoutContext } from "../layouts/MainLayout";
import aiApi from "../api/aiApi";
import type { ClarificationQuestion } from "../api/aiApi";

export default function GeneratorPage() {
  const { showToast } = useOutletContext<MainLayoutContext>();
  const navigate = useNavigate();
  const { createProduct } = useDescriptions();

  // Form states
  const [productName, setProductName] = useState("Organic Himalayan Shilajit");
  const [category, setCategory] = useState("Shilajit");
  const [altitude, setAltitude] = useState("250g");
  const [tone, setTone] = useState<"premium" | "traditional" | "health">("health");
  const [features, setFeatures] = useState<string>("Himalayan Sourced, Organic Purity");

  // AI & State Machine states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isVague, setIsVague] = useState(false);
  const [clarifications, setClarifications] = useState<ClarificationQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      showToast("Product name is required!", "error");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setIsVague(false);
    setClarifications([]);
    setAnswers({});

    try {
      const parsedFeatures = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const response = await aiApi.generate({
        productName: productName.trim(),
        ingredients: [category],
        weight: altitude.trim(),
        features: parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
        tone,
      });

      if (response.isVague && response.clarifications) {
        setIsVague(true);
        setClarifications(response.clarifications);
        showToast("AI requested additional details to improve copy quality.");
      } else if (response.copy) {
        setGeneratedContent(response.copy);
        showToast("Description generated successfully!", "success");

        await createProduct({
          productName: productName.trim(),
          ingredients: [category],
          weight: altitude.trim(),
          features: parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
          tone,
          generatedDescription: response.copy,
        });
        showToast("Saved to database!", "success");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to generate copy", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClarificationSubmit = async () => {
    // Validate that all questions are answered and no "Other" placeholder is left
    const unanswered = clarifications.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === "" || answers[q.id] === "Other"
    );
    if (unanswered.length > 0) {
      showToast("Please provide answers to all clarification questions.", "error");
      return;
    }

    setIsGenerating(true);

    try {
      const parsedFeatures = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const response = await aiApi.generate({
        productName: productName.trim(),
        ingredients: [category],
        weight: altitude.trim(),
        features: parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
        tone,
        answers,
      });

      if (response.copy) {
        setGeneratedContent(response.copy);
        setIsVague(false);
        setClarifications([]);
        setAnswers({});
        showToast("Refined description generated successfully!", "success");

        await createProduct({
          productName: productName.trim(),
          ingredients: [category],
          weight: altitude.trim(),
          features: parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
          tone,
          generatedDescription: response.copy,
        });
        showToast("Saved to database!", "success");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to generate copy", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelClarification = () => {
    setIsVague(false);
    setClarifications([]);
    setAnswers({});
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-outline-border pb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase bg-gradient-to-r from-primary-text via-secondary-text to-primary-text bg-clip-text text-transparent">
          AI Copywriting Generator
        </h1>
        <p className="text-[11px] sm:text-xs text-secondary-text mt-1">
          Craft high-converting, stories for traditional Himalayan exports with real-time AI clarification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Input Panel */}
        <div className="lg:col-span-5 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6 shadow-sm">
          <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3 flex items-center justify-between">
            <span>Configuration Properties</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 text-left font-sans">
                <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3 py-2 rounded-[4px] text-xs sm:text-sm text-primary-text focus:outline-none transition-colors"
                >
                  <option value="Honey">Organic Honey</option>
                  <option value="Shilajit">Shilajit Resin</option>
                  <option value="Herbs & Spices">Herbs & Spices</option>
                  <option value="Grains">Grains & Millets</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5 text-left font-sans">
                <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                  Weight / Size
                </label>
                <input
                  type="text"
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3 py-2 rounded-[4px] text-xs sm:text-sm text-primary-text focus:outline-none transition-colors"
                  placeholder="e.g. 250g"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 text-left font-sans">
              <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                Writing Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3 py-2 rounded-[4px] text-xs sm:text-sm text-primary-text focus:outline-none transition-colors"
              >
                <option value="health">Health & Vitality</option>
                <option value="premium">Premium & Luxury Storytelling</option>
                <option value="traditional">Traditional & Cultural Heritage</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5 text-left font-sans">
              <label className="text-[9px] sm:text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider flex justify-between">
                <span>Features (Comma Separated)</span>
                <span className="text-[8px] text-secondary-text lowercase">Optional</span>
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-3 py-2 rounded-[4px] text-xs sm:text-sm text-primary-text focus:outline-none transition-colors"
                placeholder="e.g. Pure, High Altitude, Organic"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center space-x-2 py-2.5 cursor-pointer font-semibold"
              disabled={isGenerating || isVague}
            >
              {isGenerating ? "Analyzing Input..." : "✨ Generate Description"}
            </Button>
          </form>
        </div>

        {/* Right Column - Output & Clarification Panel */}
        <div className={`lg:col-span-7 bg-container-bg border rounded-[4px] p-6 min-h-[420px] flex flex-col justify-between shadow-sm transition-all duration-300 ${
          isGenerating ? "border-primary-text shadow-md ring-1 ring-primary-text/10" : "border-outline-border"
        }`}>
          <div className="space-y-5 flex-1 flex flex-col">
            <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider border-b border-outline-border pb-3">
              Output Terminal
            </h3>

            {isGenerating && !isVague ? (
              <div className="flex-1 flex flex-col justify-center items-center py-16">
                <Loader variant="spinner" size="lg" className="mb-4" />
                <Loader variant="skeleton" className="max-w-md w-full" />
                <p className="text-[10px] font-mono text-secondary-text mt-3 animate-pulse">
                  Querying Gemini AI Service...
                </p>
              </div>
            ) : isVague ? (
              /* State Machine: Clarification view */
              <div className="flex-1 space-y-5 bg-surface-bg/50 border border-amber-500/20 rounded-[4px] p-5 animate-fadeIn">
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-sans font-bold text-xs uppercase tracking-wider">
                  <span className="text-sm">💬</span>
                  <span>AI Clarification Request</span>
                </div>
                <p className="text-xs text-secondary-text">
                  Your inputs are slightly vague. Refine the story by answering these quick questions:
                </p>

                <div className="space-y-5">
                  {clarifications.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wide">
                        {q.question}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                            className={`px-3 py-1.5 rounded-[4px] text-[11px] font-sans border transition-all cursor-pointer ${
                              answers[q.id] === opt
                                ? "bg-primary-text text-container-bg border-primary-text font-medium"
                                : "bg-container-bg text-secondary-text border-outline-border hover:border-secondary-text"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                        {q.allowCustom && (
                          <button
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => {
                                const current = prev[q.id];
                                const isOption = q.options.includes(current);
                                return { ...prev, [q.id]: current && !isOption ? current : "Other" };
                              })
                            }
                            className={`px-3 py-1.5 rounded-[4px] text-[11px] font-sans border transition-all cursor-pointer ${
                              answers[q.id] && !q.options.includes(answers[q.id])
                                ? "bg-primary-text text-container-bg border-primary-text font-medium"
                                : "bg-container-bg text-secondary-text border-outline-border hover:border-secondary-text"
                            }`}
                          >
                            Other...
                          </button>
                        )}
                      </div>

                      {q.allowCustom &&
                        answers[q.id] !== undefined &&
                        (!q.options.includes(answers[q.id]) || answers[q.id] === "Other") && (
                          <input
                            type="text"
                            placeholder="Type custom detail..."
                            value={answers[q.id] === "Other" ? "" : answers[q.id]}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            className="w-full mt-2 bg-container-bg border border-outline-border focus:border-primary-text px-3 py-2 rounded-[4px] text-xs text-primary-text focus:outline-none transition-colors"
                          />
                        )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-3 border-t border-outline-border">
                  <Button
                    variant="primary"
                    className="text-[11px] py-2 px-4 font-semibold"
                    onClick={handleClarificationSubmit}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Refinement generation..." : "⚡ Compile Refined Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[11px] py-2 px-4"
                    onClick={handleCancelClarification}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : generatedContent ? (
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="w-full flex-1 min-h-[240px] p-4 bg-surface-bg border border-outline-border rounded-[4px] text-xs sm:text-sm text-primary-text font-sans focus:outline-none focus:border-primary-text/40 resize-none leading-relaxed transition-all duration-200"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-secondary-text text-xs space-y-2">
                <span className="text-xl">✨</span>
                <span>Configure settings and trigger generator to create AI copywriting.</span>
              </div>
            )}
          </div>

          {generatedContent && !isGenerating && !isVague && (
            <div className="pt-4 border-t border-outline-border mt-4 flex items-center justify-between animate-fadeIn">
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
