import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import ProductDetailCard from "../components/products/ProductDetailCard";
import ProductFormModal from "../components/products/ProductFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import Loader from "../components/ui/Loader";
import useDescriptions from "../hooks/useDescriptions";
import type { ProductDescription, CreateDescriptionPayload } from "../types/description";
import type { MainLayoutContext } from "../layouts/MainLayout";

export default function DetailPage() {
  const { id } = useParams<{ id?: string }>();
  const { showToast } = useOutletContext<MainLayoutContext>();
  const navigate = useNavigate();

  const { products, loading, fetchProducts, getProductById, updateProduct, deleteProduct } = useDescriptions();
  const [product, setProduct] = useState<ProductDescription | null>(null);
  const [detailSearchQuery, setDetailSearchQuery] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDescription | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchProducts();
        if (id) {
          try {
            const item = await getProductById(id);
            setProduct(item);
          } catch {
            if (list.length > 0) setProduct(list[0]);
          }
        } else if (list.length > 0) {
          setProduct(list[0]);
        }
      } catch {
        showToast("Failed to load description details", "error");
      }
    };
    init();
  }, [id, fetchProducts, getProductById]);

  const handleDetailSearch = async (query: string) => {
    setDetailSearchQuery(query);
    try {
      const filtered = await fetchProducts(query);
      if (filtered.length > 0) setProduct(filtered[0]);
    } catch {
      showToast("Search failed", "error");
    }
  };

  const handleFormSubmit = async (payload: CreateDescriptionPayload, editingId?: string) => {
    if (editingId) {
      try {
        const updated = await updateProduct(editingId, payload);
        setProduct(updated);
        showToast("Product updated!", "success");
      } catch {
        showToast("Failed to update product", "error");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      showToast("Product deleted!", "success");
      navigate("/");
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

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-border pb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight uppercase">Description Detail View</h1>
        <p className="text-[11px] sm:text-xs text-secondary-text mt-1">
          Inspect product properties and generated copy details.
        </p>
      </div>

      <ProductDetailCard
        product={product}
        onEdit={() => setIsFormModalOpen(true)}
        onDelete={(p) => setProductToDelete(p)}
        onCopyText={handleCopyText}
        searchQuery={detailSearchQuery}
        onSearchChange={handleDetailSearch}
        productsList={products}
        onSelectProduct={(p) => {
          setProduct(p);
          navigate(`/detail/${p.id}`);
        }}
      />

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={product}
      />

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product Description"
        message={`Are you sure you want to delete "${productToDelete?.productName}"?`}
      />
    </div>
  );
}
