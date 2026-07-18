import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "../ui";
import type { ProductDescription, CreateDescriptionPayload } from "../../types/description";
import aiApi from "../../api/aiApi";
import type { ClarificationQuestion } from "../../api/aiApi";

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDescriptionPayload, editingId?: string) => Promise<void>;
  initialData?: ProductDescription | null;
}

// Reusable Tag Input Component for modern chip-based entry
interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange, placeholder = "Add new item..." }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/^,|,$/g, "");
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
      <label className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider flex justify-between items-center">
        <span>{label}</span>
        <span className="text-[9px] text-secondary-text/70 normal-case font-sans font-normal">Press Enter or comma to add</span>
      </label>
      
      <div className="w-full bg-surface-bg border border-outline-border p-2 rounded-[4px] min-h-[42px] flex flex-wrap items-center gap-1.5 focus-within:border-primary-text transition-colors">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-container-bg border border-outline-border px-2 py-0.5 rounded-[3px] text-xs font-medium text-primary-text"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-secondary-text hover:text-red-500 text-xs px-0.5 cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
        <div className="flex-1 flex items-center min-w-[120px]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-xs text-primary-text outline-none px-1 py-0.5"
          />
        </div>
      </div>
    </div>
  );
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [productName, setProductName] = useState("");
  const [weight, setWeight] = useState("250g");
  const [tone, setTone] = useState<"premium" | "traditional" | "health">("health");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Validation & UI state
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  // Clarification states
  const [isVague, setIsVague] = useState(false);
  const [clarifications, setClarifications] = useState<ClarificationQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setWeight(initialData.weight || "250g");
      const mappedTone = (initialData.tone === "premium" || initialData.tone === "traditional" || initialData.tone === "health")
        ? initialData.tone
        : "health";
      setTone(mappedTone);
      setIngredients(Array.isArray(initialData.ingredients) ? initialData.ingredients : initialData.ingredients ? [initialData.ingredients] : []);
      setFeatures(Array.isArray(initialData.features) ? initialData.features : initialData.features ? [initialData.features] : []);
      setGeneratedDescription(initialData.generatedDescription || "");
    } else {
      setProductName("");
      setWeight("250g");
      setTone("health");
      setIngredients(["Ragi", "Jaggery"]);
      setFeatures(["No preservatives", "Millet based"]);
      setGeneratedDescription("");
    }
    setNameError("");
    setIsVague(false);
    setClarifications([]);
    setAnswers({});
  }, [initialData, isOpen]);

  const handleAiGenerate = async () => {
    if (!productName.trim()) {
      setNameError("Product name is required for AI copy generation");
      return;
    }
    setIsGeneratingCopy(true);
    setIsVague(false);
    setClarifications([]);
    setAnswers({});

    try {
      const response = await aiApi.generate({
        productName: productName.trim(),
        ingredients,
        weight: weight.trim(),
        features: features.length > 0 ? features : ["Himalayan Sourced"],
        tone,
      });

      if (response.isVague && response.clarifications) {
        setIsVague(true);
        setClarifications(response.clarifications);
      } else if (response.copy) {
        setGeneratedDescription(response.copy);
      }
    } catch (err) {
      console.error("AI Generation error in modal:", err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleClarificationSubmit = async () => {
    const unanswered = clarifications.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === "" || answers[q.id] === "Other"
    );
    if (unanswered.length > 0) {
      return;
    }
    setIsGeneratingCopy(true);

    try {
      const response = await aiApi.generate({
        productName: productName.trim(),
        ingredients,
        weight: weight.trim(),
        features: features.length > 0 ? features : ["Himalayan Sourced"],
        tone,
        answers,
      });

      if (response.copy) {
        setGeneratedDescription(response.copy);
        setIsVague(false);
        setClarifications([]);
        setAnswers({});
      }
    } catch (err) {
      console.error("AI Generation clarification error in modal:", err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleCancelClarification = () => {
    setIsVague(false);
    setClarifications([]);
    setAnswers({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setNameError("Product name is required");
      return;
    }

    setNameError("");
    setIsSubmitting(true);

    try {
      const payload: CreateDescriptionPayload = {
        productName: productName.trim(),
        weight: weight.trim(),
        tone: tone,
        ingredients: ingredients,
        features: features,
        generatedDescription: generatedDescription.trim() || `${productName} - Premium Himalayan product.`
      };
      await onSubmit(payload, initialData?.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Product: ${initialData.productName}` : "Add New Product Description"}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving Changes..." : initialData ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-6 text-left font-sans">
        {/* SECTION 1: GENERAL INFORMATION */}
        <div className="space-y-4">
          <div className="border-b border-outline-border pb-1.5">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text">
              1. General Information
            </h4>
          </div>

          <Input
            label="Product Name"
            id="modal-prod-name"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              if (e.target.value.trim()) setNameError("");
            }}
            placeholder="e.g. Organic Himalayan Shilajit"
            required={true}
            error={nameError}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Weight / Net Quantity"
              id="modal-prod-weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 250g"
              required={true}
            />
            <div className="flex flex-col space-y-1.5 w-full text-left font-sans">
              <label htmlFor="modal-prod-tone" className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                Branding Tone <span className="text-red-500">*</span>
              </label>
              <select
                id="modal-prod-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full text-xs bg-container-bg text-primary-text px-3.5 py-2.5 border border-outline-border rounded-[4px] outline-none focus:border-primary-text transition-colors"
              >
                <option value="health">Health & Wellness</option>
                <option value="premium">Premium & Luxury Storytelling</option>
                <option value="traditional">Traditional & Cultural Heritage</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPOSITION & FEATURES */}
        <div className="space-y-4">
          <div className="border-b border-outline-border pb-1.5">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text">
              2. Composition & Key Features
            </h4>
          </div>

          <TagInput
            label="Ingredients"
            tags={ingredients}
            onChange={setIngredients}
            placeholder="Type ingredient and press Enter..."
          />

          <TagInput
            label="Key Features & Highlights"
            tags={features}
            onChange={setFeatures}
            placeholder="Type feature (e.g. Non-GMO) and press Enter..."
          />
        </div>

        {/* SECTION 3: CONTENT & AI GENERATION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-border pb-1.5">
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-primary-text">
              3. Generated Copy & Narrative
            </h4>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGeneratingCopy || isVague}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{isGeneratingCopy ? "Generating..." : "✨ AI Assist Generate"}</span>
            </button>
          </div>

          {isVague ? (
            /* Clarification Flow inline in Modal */
            <div className="space-y-4 bg-surface-bg border border-amber-500/20 rounded-[4px] p-4 animate-fadeIn">
              <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wide">
                <span>💬</span>
                <span>AI Clarification Requested</span>
              </div>
              <p className="text-[11px] text-secondary-text">
                Your input is slightly vague. Refine the details:
              </p>
              <div className="space-y-4">
                {clarifications.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <span className="text-[9px] font-mono font-medium text-secondary-text uppercase block">
                      {q.question}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`px-2 py-1 rounded-[3px] text-[10px] border transition-all cursor-pointer ${
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
                              return { ...prev, [q.id]: current && !q.options.includes(current) ? current : "Other" };
                            })
                          }
                          className={`px-2 py-1 rounded-[3px] text-[10px] border transition-all cursor-pointer ${
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
                          placeholder="Type answer..."
                          value={answers[q.id] === "Other" ? "" : answers[q.id]}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full bg-container-bg border border-outline-border focus:border-primary-text px-2 py-1 rounded-[4px] text-xs text-primary-text focus:outline-none transition-colors"
                        />
                      )}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 pt-2 border-t border-outline-border">
                <Button
                  variant="primary"
                  className="text-[10px] py-1 px-3"
                  onClick={handleClarificationSubmit}
                  disabled={isGeneratingCopy}
                >
                  {isGeneratingCopy ? "Generating..." : "Submit details"}
                </Button>
                <Button
                  variant="outline"
                  className="text-[10px] py-1 px-3"
                  onClick={handleCancelClarification}
                  disabled={isGeneratingCopy}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1.5 w-full text-left">
              <label htmlFor="modal-prod-desc" className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
                Product Description Story
              </label>
              <textarea
                id="modal-prod-desc"
                value={generatedDescription}
                onChange={(e) => setGeneratedDescription(e.target.value)}
                placeholder="Enter marketing description or click AI Assist Generate..."
                className="w-full min-h-[120px] p-3.5 bg-surface-bg border border-outline-border rounded-[4px] text-xs sm:text-sm text-primary-text font-sans focus:outline-none focus:border-primary-text resize-none transition-colors"
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
