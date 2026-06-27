import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "../ui";
import type { ProductDescription, CreateDescriptionPayload } from "../../types/description";

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
        <span className="text-[9px] text-secondary-text/70 normal-case font-sans">Press Enter or comma to add</span>
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
              className="text-secondary-text hover:text-red-500 text-xs px-0.5"
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
  const [tone, setTone] = useState("health");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // Validation & UI state
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setWeight(initialData.weight || "250g");
      setTone(initialData.tone || "health");
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
  }, [initialData, isOpen]);

  const handleAiGenerate = () => {
    if (!productName.trim()) {
      setNameError("Product name is required for AI copy generation");
      return;
    }
    setIsGeneratingCopy(true);
    setTimeout(() => {
      const copy = `Forged in the heart of the pristine Himalayan valleys, our ${productName} (${weight}) is crafted using authentic ingredients. Formulated with a dedicated ${tone} vibe, it delivers unmatched purity, natural strength, and artisanal quality straight from high-altitude cooperative farms.`;
      setGeneratedDescription(copy);
      setIsGeneratingCopy(false);
    }, 600);
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
        tone: tone.trim(),
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
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs sm:text-sm bg-container-bg text-primary-text px-3.5 py-2.5 border border-outline-border rounded-[4px] outline-none focus:border-primary-text transition-colors"
              >
                <option value="health font-sans">Health & Wellness</option>
                <option value="natural">Natural & Raw</option>
                <option value="cozy">Cozy & Warm</option>
                <option value="indulgent">Indulgent Luxury</option>
                <option value="refreshing">Refreshing & Revitalizing</option>
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
              disabled={isGeneratingCopy}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{isGeneratingCopy ? "Generating..." : "✨ AI Assist Generate"}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-1.5 w-full text-left">
            <label htmlFor="modal-prod-desc" className="text-[10px] font-mono font-medium text-secondary-text uppercase tracking-wider">
              Product Description Story
            </label>
            <textarea
              id="modal-prod-desc"
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              placeholder="Enter marketing description or click AI Assist Generate..."
              className="w-full min-h-[100px] p-3.5 bg-surface-bg border border-outline-border rounded-[4px] text-xs sm:text-sm text-primary-text font-sans focus:outline-none focus:border-primary-text resize-none transition-colors"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
