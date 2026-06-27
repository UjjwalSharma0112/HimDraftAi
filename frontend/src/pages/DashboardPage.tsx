import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import ProductListTable from "../components/products/ProductListTable";
import ProductDetailCard from "../components/products/ProductDetailCard";
import ProductFormModal from "../components/products/ProductFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import useDescriptions from "../hooks/useDescriptions";
import type { ProductDescription, CreateDescriptionPayload } from "../types/description";
import type { MainLayoutContext } from "../layouts/MainLayout";

export default function DashboardPage() {
  const { showToast } = useOutletContext<MainLayoutContext>();
  const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useDescriptions();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductDescription | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDescription | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductDescription | null>(null);

  const loadDashboardProducts = useCallback(async (query = "") => {
    try {
      const list = await fetchProducts(query);
      if (list.length > 0 && !selectedProduct) {
        setSelectedProduct(list[0]);
      }
    } catch {
      showToast("Failed to fetch products", "error");
    }
  }, [fetchProducts, selectedProduct, showToast]);

  useEffect(() => {
    loadDashboardProducts();
  }, [loadDashboardProducts]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    loadDashboardProducts(query);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product: ProductDescription) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (payload: CreateDescriptionPayload, editingId?: string) => {
    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        if (selectedProduct?.id === editingId) setSelectedProduct(updated);
        showToast("Product description updated!", "success");
      } else {
        const created = await createProduct(payload);
        setSelectedProduct(created);
        showToast("Product description created!", "success");
      }
    } catch {
      showToast("Failed to save product", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      if (selectedProduct?.id === productToDelete.id) {
        const remaining = products.filter((p) => p.id !== productToDelete.id);
        setSelectedProduct(remaining.length > 0 ? remaining[0] : null);
      }
      showToast("Product deleted successfully!", "success");
    } catch {
      showToast("Failed to delete product", "error");
    } finally {
      setProductToDelete(null);
    }
  };

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase">
            Workspace Overview
          </h1>
          <p className="text-[11px] sm:text-xs text-secondary-text mt-1 max-w-xl">
            Manage generated descriptions and monitor copy performance for your Himalayan organic exports.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-4 py-2 rounded-[4px] hover:opacity-90 transition cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12">
          <ProductDetailCard
            product={selectedProduct}
            onEdit={handleOpenEdit}
            onDelete={setProductToDelete}
            onCopyText={handleCopyText}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            productsList={products}
            onSelectProduct={setSelectedProduct}
          />
        </div>

        <div className="lg:col-span-12 bg-container-bg border border-outline-border rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-border pb-3">
            <h3 className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider">
              Recent Copy Drafts
            </h3>
          </div>
          <ProductListTable
            products={products}
            loading={loading}
            selectedProductId={selectedProduct?.id}
            onSelectProduct={setSelectedProduct}
            onEditProduct={handleOpenEdit}
            onDeleteProduct={setProductToDelete}
          />
        </div>
      </div>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product Description"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
      />
    </div>
  );
}
