import { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button, Loader, Modal } from "../components/ui";
import useDescriptions from "../hooks/useDescriptions";
import type { MainLayoutContext } from "../layouts/MainLayout";
import aiApi from "../api/aiApi";
import type { ClarificationQuestion } from "../api/aiApi";

const PRESET_CATEGORIES = [
  "Shilajit Resin",
  "Organic Honey",
  "Herbs & Spices",
  "Grains & Millets",
  "Tea & Infusions",
  "Desi Ghee & Oils",
  "Dry Fruits & Nuts",
];

const PRESET_PROMPTS = [
  {
    title: "Organic Himalayan Shilajit",
    category: "Shilajit Resin",
    weight: "250g",
    tone: "health" as const,
    features: "Purified Resin, Fulvic Acid Rich, High Altitude 18000ft",
  },
  {
    title: "Wild Himalayan Cliff Honey",
    category: "Organic Honey",
    weight: "500g",
    tone: "traditional" as const,
    features: "Raw Unfiltered, Multi-Floral, Traditional Honey Hunters",
  },
  {
    title: "Highland Red Rice & Millets",
    category: "Grains & Millets",
    weight: "1kg",
    tone: "premium" as const,
    features: "Ancient Grain, Glacial Water Irrigated, High Fiber",
  },
];

// Custom HimAI Brand Avatar Icon
const HimAiAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-400/30">
    <svg
      className="w-4 h-4 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 20l7-12 3 5 4-7 4 14H3z"
      />
      <circle cx="14" cy="6" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  promptText?: string;
  productName?: string;
  category?: string;
  weight?: string;
  tone?: "premium" | "traditional" | "health";
  features?: string;
  isGenerating?: boolean;
  isVague?: boolean;
  clarifications?: ClarificationQuestion[];
  answers?: Record<string, string>;
  copy?: string;
  isSaved?: boolean;
}

export default function GeneratorPage() {
  const { showToast } = useOutletContext<MainLayoutContext>();
  const navigate = useNavigate();
  const { createProduct } = useDescriptions();

  // Active Prompt / Form states
  const [promptInput, setPromptInput] = useState("Organic Himalayan Shilajit");
  const [category, setCategory] = useState("Shilajit Resin");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [altitude, setAltitude] = useState("250g");
  const [tone, setTone] = useState<"premium" | "traditional" | "health">(
    "health",
  );
  const [features, setFeatures] = useState<string>(
    "Himalayan Sourced, Organic Purity",
  );

  // Step state
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Conversational Chat Messages Thread
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // View Story Modal state
  const [viewStoryContent, setViewStoryContent] = useState<ChatTurn | null>(
    null,
  );

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isGenerating]);

  const applyPreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setPromptInput(preset.title);
    setCategory(preset.category);
    setIsCustomCategory(false);
    setAltitude(preset.weight);
    setTone(preset.tone);
    setFeatures(preset.features);
    setActiveStep(3); // Jump to details step to verify and generate
    showToast(
      `Loaded preset details for "${preset.title}". Click Generate to write the description!`,
    );
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentInput = promptInput.trim();
    if (!currentInput) {
      showToast("Please enter a product name or refinement prompt!", "error");
      setActiveStep(1);
      return;
    }

    const effectiveCategory = isCustomCategory
      ? customCategoryInput.trim() || category
      : category;

    const isFollowUp = messages.length > 0;
    const initialUserMsg = messages.find((m) => m.role === "user");

    // Use initial product details if this is a follow-up refinement
    const targetProductName =
      isFollowUp && initialUserMsg?.productName
        ? initialUserMsg.productName
        : currentInput;
    const targetCategory =
      isFollowUp && initialUserMsg?.category
        ? initialUserMsg.category
        : effectiveCategory;
    const targetWeight =
      isFollowUp && initialUserMsg?.weight
        ? initialUserMsg.weight
        : altitude.trim();
    const targetTone =
      isFollowUp && initialUserMsg?.tone ? initialUserMsg.tone : tone;
    const targetFeatures =
      isFollowUp && initialUserMsg?.features
        ? initialUserMsg.features
        : features;

    const userTurnId = `user-${Date.now()}`;
    const assistantTurnId = `assistant-${Date.now()}`;

    const userTurn: ChatTurn = {
      id: userTurnId,
      role: "user",
      promptText: currentInput,
      productName: targetProductName,
      category: targetCategory,
      weight: targetWeight,
      tone: targetTone,
      features: targetFeatures,
    };

    const loadingAssistantTurn: ChatTurn = {
      id: assistantTurnId,
      role: "assistant",
      isGenerating: true,
      productName: targetProductName,
      category: targetCategory,
      weight: targetWeight,
      tone: targetTone,
    };

    setMessages((prev) => [...prev, userTurn, loadingAssistantTurn]);

    // Clear chat input bar like Gemini!
    setPromptInput("");
    setIsGenerating(true);

    try {
      const parsedFeatures = targetFeatures
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      // Build payload. If follow up, pass the follow_up_instruction in answers to bypass vagueness check!
      const answersPayload = isFollowUp
        ? {
            follow_up_instruction: `Refinement request from user: "${currentInput}". Please rewrite/update the story following this request.`,
          }
        : undefined;

      const response = await aiApi.generate({
        productName: targetProductName,
        ingredients: [targetCategory],
        weight: targetWeight,
        features:
          parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
        tone: targetTone,
        answers: answersPayload,
      });

      if (response.isVague && response.clarifications) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantTurnId
              ? {
                  ...msg,
                  isGenerating: false,
                  isVague: true,
                  clarifications: response.clarifications,
                  answers: {},
                }
              : msg,
          ),
        );
        showToast("Additional details requested to refine your story.");
      } else if (response.copy) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantTurnId
              ? {
                  ...msg,
                  isGenerating: false,
                  copy: response.copy,
                  isSaved: false,
                }
              : msg,
          ),
        );
        showToast(
          isFollowUp ? "Refined story written!" : "Story written successfully!",
          "success",
        );
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to generate copy", "error");
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantTurnId));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClarificationSubmit = async (
    turnId: string,
    clarifications: ClarificationQuestion[],
    answers: Record<string, string>,
  ) => {
    const unanswered = clarifications.filter(
      (q) =>
        !answers[q.id] ||
        answers[q.id].trim() === "" ||
        answers[q.id] === "Other",
    );
    if (unanswered.length > 0) {
      showToast("Please answer all questions.", "error");
      return;
    }

    const turn = messages.find((m) => m.id === turnId);
    if (!turn) return;

    const effectiveCategory = isCustomCategory
      ? customCategoryInput.trim() || category
      : category;

    setIsGenerating(true);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === turnId ? { ...m, isGenerating: true, isVague: false } : m,
      ),
    );

    try {
      const parsedFeatures = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const response = await aiApi.generate({
        productName:
          turn.productName || promptInput || "Organic Himalayan Product",
        ingredients: [effectiveCategory],
        weight: altitude.trim(),
        features:
          parsedFeatures.length > 0 ? parsedFeatures : ["Himalayan Sourced"],
        tone,
        answers,
      });

      if (response.copy) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === turnId
              ? {
                  ...m,
                  isGenerating: false,
                  isVague: false,
                  copy: response.copy,
                  isSaved: false,
                }
              : m,
          ),
        );
        showToast(
          "Refined story written! Click 'Save Story' to store it.",
          "success",
        );
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to refine story", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProductStory = async (turn: ChatTurn) => {
    if (!turn.copy) return;
    try {
      const effectiveCategory = turn.category || category;
      await createProduct({
        productName: turn.productName || "Himalayan Product",
        ingredients: [effectiveCategory],
        weight: turn.weight || altitude || "250g",
        features: features
          ? features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : ["Himalayan Sourced"],
        tone: turn.tone || tone,
        generatedDescription: turn.copy,
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === turn.id ? { ...m, isSaved: true } : m)),
      );
      showToast("Saved to Database!", "success");
    } catch {
      showToast("Failed to save product story", "error");
    }
  };

  const copyTextToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-6rem)] pb-8 font-sans">
      {/* Top Header */}
      <div className="border-b border-outline-border pb-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HimAiAvatar />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight uppercase bg-gradient-to-r from-primary-text via-secondary-text to-primary-text bg-clip-text text-transparent">
              HimAI Copywriter
            </h1>
            <p className="text-[11px] sm:text-xs text-secondary-text mt-0.5">
              Create engaging descriptions and marketing copy for your Himalayan
              organic products.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 space-y-6 pb-6 overflow-y-auto">
        {messages.length === 0 ? (
          /* Guided Wizard Card Welcoming Mode */
          <div className="py-6 space-y-8 animate-fadeIn">
            <div className="bg-container-bg border border-outline-border rounded-[16px] p-6 shadow-sm max-w-2xl mx-auto space-y-6">
              {/* Wizard Header with Step Progress */}
              <div className="flex items-center justify-between border-b border-outline-border pb-4">
                <div className="flex items-center gap-2.5">
                  <HimAiAvatar />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary-text">
                      Configure Product Story
                    </h2>
                    <p className="text-[10px] text-secondary-text">
                      Complete the steps to write premium Himalayan product copy
                    </p>
                  </div>
                </div>

                {/* Step Badge Progress Indicators */}
                <div className="flex items-center gap-1.5">
                  {([1, 2, 3] as const).map((s) => (
                    <span
                      key={s}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                        activeStep === s
                          ? "bg-emerald-600 text-white"
                          : activeStep > s
                            ? "bg-emerald-600/20 text-emerald-600"
                            : "bg-surface-bg text-secondary-text border border-outline-border"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 1: Product Name */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="wizard-prod-name"
                      className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text block"
                    >
                      Product Name
                    </label>
                    <p className="text-[11px] text-secondary-text leading-relaxed">
                      What is the name of your organic Himalayan export? (e.g.
                      Pure Shilajit Resin, Wild Cliff Honey)
                    </p>
                    <input
                      id="wizard-prod-name"
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="e.g. Organic Himalayan Shilajit"
                      className="w-full bg-surface-bg border border-outline-border focus:border-primary-text px-4 py-3 rounded-[10px] text-xs sm:text-sm text-primary-text outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        if (!promptInput.trim()) {
                          showToast(
                            "Please enter a product name first!",
                            "error",
                          );
                          return;
                        }
                        setActiveStep(2);
                      }}
                      className="text-xs py-2 px-5 font-semibold flex items-center gap-1.5 bg-primary-text text-container-bg hover:opacity-90 transition cursor-pointer"
                    >
                      <span>Next</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Tone Selection */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text block">
                      Brand Voice & Tone
                    </label>
                    <p className="text-[11px] text-secondary-text">
                      Select the storytelling style that best fits your product
                      positioning:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "health" as const,
                        label: "Health & Vitality",
                        desc: "Focuses on nutrients, wellness benefits, and organic purity.",
                      },
                      {
                        id: "premium" as const,
                        label: "Premium & Luxury",
                        desc: "Elegant narrative focusing on scarcity, purity, and craftsmanship.",
                      },
                      {
                        id: "traditional" as const,
                        label: "Traditional Heritage",
                        desc: "Steeped in ancestral mountain roots and local harvesting wisdom.",
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`p-4 rounded-[10px] border text-left transition-all cursor-pointer space-y-1.5 hover:shadow-xs ${
                          tone === t.id
                            ? "bg-emerald-600/10 border-emerald-600 text-primary-text font-medium"
                            : "bg-surface-bg/60 text-secondary-text border-outline-border hover:border-primary-text/40 hover:text-primary-text"
                        }`}
                      >
                        <div className="text-xs font-sans font-bold text-primary-text flex items-center justify-between">
                          <span>{t.label}</span>
                          {tone === t.id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <p className="text-[10px] text-secondary-text leading-relaxed">
                          {t.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2 border-t border-outline-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                      className="text-xs py-2 px-4"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setActiveStep(3)}
                      className="text-xs py-2 px-5 font-semibold flex items-center gap-1.5 bg-primary-text text-container-bg hover:opacity-90 transition cursor-pointer"
                    >
                      <span>Continue to Details</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Product Details */}
              {activeStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text block">
                      Product Details
                    </label>
                    <p className="text-[11px] text-secondary-text">
                      Provide optional ingredients, size, or highlights for the
                      AI to include:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Category */}
                    <div className="sm:col-span-4 space-y-1.5">
                      <label
                        htmlFor="card-cat-select"
                        className="text-[10px] font-mono font-medium text-secondary-text uppercase block"
                      >
                        Category
                      </label>
                      <select
                        id="card-cat-select"
                        value={isCustomCategory ? "custom" : category}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            setIsCustomCategory(true);
                            if (!customCategoryInput)
                              setCustomCategoryInput("Himalayan Organic");
                          } else {
                            setIsCustomCategory(false);
                            setCategory(e.target.value);
                          }
                        }}
                        className="w-full bg-surface-bg border border-outline-border px-3.5 py-2.5 rounded-[6px] text-xs text-primary-text outline-none focus:border-primary-text"
                      >
                        {PRESET_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="custom">
                          Other / Custom Category...
                        </option>
                      </select>

                      {isCustomCategory && (
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) =>
                            setCustomCategoryInput(e.target.value)
                          }
                          placeholder="Type custom category..."
                          className="w-full mt-1 bg-surface-bg border border-outline-border px-3 py-2 rounded-[6px] text-xs text-primary-text outline-none animate-fadeIn"
                          required
                        />
                      )}
                    </div>

                    {/* Weight / Size */}
                    <div className="sm:col-span-3 space-y-1.5">
                      <label
                        htmlFor="card-weight-input"
                        className="text-[10px] font-mono font-medium text-secondary-text uppercase block"
                      >
                        Weight / Size
                      </label>
                      <input
                        id="card-weight-input"
                        type="text"
                        value={altitude}
                        onChange={(e) => setAltitude(e.target.value)}
                        placeholder="e.g. 250g"
                        className="w-full bg-surface-bg border border-outline-border px-3.5 py-2.5 rounded-[6px] text-xs text-primary-text outline-none focus:border-primary-text"
                      />
                    </div>

                    {/* Key Highlights */}
                    <div className="sm:col-span-5 space-y-1.5">
                      <label
                        htmlFor="card-features-input"
                        className="text-[10px] font-mono font-medium text-secondary-text uppercase block"
                      >
                        Highlights (comma-separated)
                      </label>
                      <input
                        id="card-features-input"
                        type="text"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        placeholder="e.g. Organic Purity, Fulvic Acid"
                        className="w-full bg-surface-bg border border-outline-border px-3.5 py-2.5 rounded-[6px] text-xs text-primary-text outline-none focus:border-primary-text"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-outline-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveStep(2)}
                      className="text-xs py-2 px-4"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleGenerate()}
                      disabled={isGenerating}
                      className="text-xs py-2 px-5 font-semibold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-none transition cursor-pointer"
                    >
                      <span>
                        {isGenerating ? "Writing..." : "Generate Description"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Presets List */}
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider block">
                Try an Example Product Preset
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(item)}
                    className="p-3.5 rounded-[8px] bg-container-bg border border-outline-border hover:border-emerald-600/40 hover:bg-emerald-600/5 text-left transition-all group cursor-pointer hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-primary-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-secondary-text px-1.5 py-0.5 rounded bg-surface-bg border border-outline-border">
                        {item.weight}
                      </span>
                    </div>
                    <p className="text-[10px] text-secondary-text line-clamp-2">
                      {item.features}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Turn Chat Conversation Thread */
          <div className="space-y-6 animate-fadeIn">
            {messages.map((msg) =>
              msg.role === "user" ? (
                /* User Message Bubble */
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-2xl w-full bg-surface-bg border border-outline-border rounded-[10px] p-4 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-outline-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary-text text-container-bg flex items-center justify-center text-[10px] font-bold">
                          U
                        </div>
                        <span className="text-xs font-semibold text-primary-text">
                          Product Details
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-secondary-text capitalize">
                        Tone: {msg.tone}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-primary-text">
                        {msg.promptText}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-container-bg border border-outline-border text-secondary-text">
                          Category: {msg.category}
                        </span>
                        {msg.weight && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-container-bg border border-outline-border text-secondary-text">
                            Size: {msg.weight}
                          </span>
                        )}
                        {msg.features && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[4px] bg-container-bg border border-outline-border text-secondary-text">
                            Highlights: {msg.features}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* HimAI Response Bubble */
                <div key={msg.id} className="flex gap-3 items-start">
                  <HimAiAvatar />

                  <div className="flex-1 max-w-3xl">
                    {msg.isGenerating ? (
                      /* Loading Card */
                      <div className="bg-container-bg border border-outline-border rounded-[10px] p-5 space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                          <Loader variant="spinner" size="sm" />
                          <span>
                            HimAI is writing your product description...
                          </span>
                        </div>
                        <Loader variant="skeleton" className="w-full h-16" />
                      </div>
                    ) : msg.isVague && msg.clarifications ? (
                      /* Clarification Card */
                      <div className="bg-container-bg border border-amber-500/30 rounded-[10px] p-5 space-y-4 shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border-b border-amber-500/20 pb-2.5">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span>Quick Questions</span>
                        </div>

                        <p className="text-xs text-secondary-text leading-relaxed">
                          Please answer these questions so HimAI can craft the
                          best story:
                        </p>

                        <div className="space-y-4">
                          {msg.clarifications.map((q) => (
                            <div
                              key={q.id}
                              className="space-y-2 bg-surface-bg/60 p-3 rounded-[8px] border border-outline-border/50"
                            >
                              <label className="text-[11px] font-medium text-primary-text block">
                                {q.question}
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {q.options.map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() =>
                                      setMessages((prev) =>
                                        prev.map((m) =>
                                          m.id === msg.id
                                            ? {
                                                ...m,
                                                answers: {
                                                  ...m.answers,
                                                  [q.id]: opt,
                                                },
                                              }
                                            : m,
                                        ),
                                      )
                                    }
                                    className={`px-2.5 py-1 rounded-[4px] text-xs transition-all cursor-pointer ${
                                      msg.answers?.[q.id] === opt
                                        ? "bg-primary-text text-container-bg font-semibold"
                                        : "bg-container-bg text-secondary-text border border-outline-border hover:border-primary-text"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="primary"
                          className="text-xs py-2 px-4 font-semibold"
                          onClick={() =>
                            handleClarificationSubmit(
                              msg.id,
                              msg.clarifications || [],
                              msg.answers || {},
                            )
                          }
                        >
                          Write Description
                        </Button>
                      </div>
                    ) : msg.copy ? (
                      /* Final Copy Card with View & Save Options */
                      <div className="bg-container-bg border border-outline-border rounded-[10px] p-5 space-y-4 shadow-sm animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-outline-border pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary-text">
                              Product Story
                            </span>
                            {msg.isSaved ? (
                              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                                Saved to Database
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                                Draft Copy
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-secondary-text">
                            Words:{" "}
                            {msg.copy.split(/\s+/).filter(Boolean).length}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-primary-text font-sans leading-relaxed line-clamp-4 bg-surface-bg/50 p-3.5 rounded-[6px] border border-outline-border/40">
                          {msg.copy}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex gap-2">
                            {/* View Story Button */}
                            <Button
                              variant="outline"
                              className="text-xs py-1.5 px-3 flex items-center gap-1"
                              onClick={() => setViewStoryContent(msg)}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>View Story</span>
                            </Button>

                            {/* Copy Text Button */}
                            <Button
                              variant="outline"
                              className="text-xs py-1.5 px-3 flex items-center gap-1"
                              onClick={() => copyTextToClipboard(msg.copy)}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Copy</span>
                            </Button>
                          </div>

                          {/* Save Story Button */}
                          {!msg.isSaved ? (
                            <Button
                              variant="primary"
                              className="text-xs py-1.5 px-3.5 font-semibold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                              onClick={() => handleSaveProductStory(msg)}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>Save Story</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="text-xs py-1.5 px-3 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              onClick={() => navigate("/")}
                            >
                              <span>View on Dashboard →</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Gemini Chat Bar for Follow-up Refinements (only shown once conversation starts) */}
      {messages.length > 0 && (
        <div className="sticky bottom-0 mt-auto pt-4 bg-gradient-to-t from-container-bg via-container-bg/95 to-transparent z-10">
          <form
            onSubmit={handleGenerate}
            className="bg-container-bg border border-outline-border rounded-[16px] p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-fadeIn"
          >
            <div className="flex flex-col sm:flex-row gap-2.5 items-center">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask HimAI for follow-up changes (e.g. 'Make it shorter', 'Highlight organic purity')..."
                className="flex-1 w-full bg-surface-bg border border-outline-border focus:border-primary-text focus:ring-2 focus:ring-emerald-500/10 px-4 py-3 rounded-[12px] text-xs sm:text-sm text-primary-text outline-none transition-all placeholder:text-secondary-text/60"
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-[12px] shrink-0 cursor-pointer flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  "Writing..."
                ) : (
                  <>
                    <span>Send</span>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* View Story Modal */}
      {viewStoryContent && (
        <Modal
          isOpen={Boolean(viewStoryContent)}
          onClose={() => setViewStoryContent(null)}
          title={`Product Story: ${viewStoryContent.productName || "Himalayan Organic"}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-secondary-text font-mono">
                Words:{" "}
                {viewStoryContent.copy?.split(/\s+/).filter(Boolean).length ||
                  0}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => copyTextToClipboard(viewStoryContent.copy)}
                >
                  Copy Text
                </Button>
                {!viewStoryContent.isSaved && (
                  <Button
                    variant="primary"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 border-none text-white"
                    onClick={async () => {
                      await handleSaveProductStory(viewStoryContent);
                      setViewStoryContent(null);
                    }}
                  >
                    Save Story
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-left font-sans">
            <div className="flex flex-wrap gap-2 text-xs border-b border-outline-border pb-3">
              <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px]">
                Category: {viewStoryContent.category}
              </span>
              <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px] capitalize">
                Tone: {viewStoryContent.tone}
              </span>
              {viewStoryContent.weight && (
                <span className="bg-surface-bg border border-outline-border px-2.5 py-1 rounded-[4px]">
                  Size: {viewStoryContent.weight}
                </span>
              )}
            </div>

            <div className="p-4 bg-surface-bg border border-outline-border rounded-[6px] text-xs sm:text-sm text-primary-text leading-relaxed font-sans whitespace-pre-wrap">
              {viewStoryContent.copy}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
