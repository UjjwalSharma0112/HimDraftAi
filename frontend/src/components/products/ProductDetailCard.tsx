import React from "react";
import Button from "../ui/Button";
import type { ProductDescription } from "../../types/description";

export interface ProductDetailCardProps {
  product: ProductDescription | null;
  onEdit: (product: ProductDescription) => void;
  onDelete: (product: ProductDescription) => void;
  onCopyText: (text: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  productsList?: ProductDescription[];
  onSelectProduct?: (product: ProductDescription) => void;
}

export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  product,
  onEdit,
  onDelete,
  onCopyText,
  searchQuery = "",
  onSearchChange,
  productsList = [],
  onSelectProduct,
}) => {
  const ingredientsList = product
    ? Array.isArray(product.ingredients)
      ? product.ingredients
      : [product.ingredients]
    : [];
  const featuresList = product
    ? Array.isArray(product.features)
      ? product.features
      : [product.features]
    : [];

  return (
    <div className="bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-6">
      {/* Top Header & Search Controls inside Product Detail Card */}
      <div className="space-y-4 border-b border-outline-border pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-primary-text">
            Product Details
          </h3>
          {product && (
            <div className="flex items-center gap-3">
              {onSearchChange && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Search Bar Input with Icon */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-secondary-text">
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
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Filter detail items..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full text-xs bg-surface-bg border border-outline-border pl-8 pr-3 py-2 rounded-[4px] outline-none text-primary-text placeholder:text-secondary-text/60 focus:border-primary-text transition-all font-sans"
                    />
                  </div>

                  {/* Aesthetic Select Dropdown */}
                  {productsList.length > 0 && onSelectProduct && (
                    <div className="relative min-w-[160px]">
                      <select
                        className="w-full text-xs bg-surface-bg border border-outline-border pl-3 pr-8 py-2 rounded-[4px] outline-none text-primary-text font-sans cursor-pointer focus:border-primary-text transition-all appearance-none truncate"
                        value={product?.id || ""}
                        onChange={(e) => {
                          const selected = productsList.find(
                            (p) => p.id === e.target.value,
                          );
                          if (selected) onSelectProduct(selected);
                        }}
                      >
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-secondary-text">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => onEdit(product)}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
              >
                Edit
              </button>
              <span className="text-outline-border">|</span>
              <button
                onClick={() => onDelete(product)}
                className="text-xs text-red-600 dark:text-red-400 font-semibold cursor-pointer hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Aesthetic Search Bar & Dropdown Controls */}
      </div>

      {!product ? (
        <div className="py-8 text-center text-xs text-secondary-text font-sans">
          Select or search a product to inspect details.
        </div>
      ) : (
        <div className="space-y-4 text-xs font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase text-secondary-text block">
              Product Name
            </span>
            <h4 className="text-sm sm:text-base font-semibold mt-0.5 text-primary-text">
              {product.productName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-secondary-text block">
                Weight
              </span>
              <p className="font-mono mt-0.5">{product.weight}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-secondary-text block">
                Tone
              </span>
              <p className="font-semibold mt-0.5 capitalize">{product.tone}</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-secondary-text block mb-1">
              Ingredients
            </span>
            <div className="flex flex-wrap gap-1">
              {ingredientsList.map((ing, idx) => (
                <span
                  key={idx}
                  className="bg-surface-bg border border-outline-border px-2 py-0.5 rounded-[4px] text-[10px]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {featuresList.length > 0 && (
            <div>
              <span className="text-[10px] font-mono uppercase text-secondary-text block mb-1">
                Features
              </span>
              <div className="flex flex-wrap gap-1">
                {featuresList.map((feat, idx) => (
                  <span
                    key={idx}
                    className="bg-surface-bg border border-outline-border px-2 py-0.5 rounded-[4px] text-[10px]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-[10px] font-mono uppercase text-secondary-text block mb-1">
              Generated Description
            </span>
            <div className="p-4 bg-surface-bg border border-outline-border rounded-[4px] leading-relaxed text-primary-text/90 min-h-[120px]">
              {product.generatedDescription || "No description generated yet."}
            </div>
          </div>

          <div className="pt-4 border-t border-outline-border flex justify-end">
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => onCopyText(product.generatedDescription || "")}
            >
              Copy Description Text
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailCard;
