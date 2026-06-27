import { useState, useCallback } from "react";
import descriptionApi from "../api/descriptionApi";
import type { ProductDescription, CreateDescriptionPayload, UpdateDescriptionPayload } from "../types/description";

export function useDescriptions() {
  const [products, setProducts] = useState<ProductDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = query ? await descriptionApi.search(query) : await descriptionApi.getAll();
      setProducts(data);
      return data;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch products";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await descriptionApi.getById(id);
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch product details";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload: CreateDescriptionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const created = await descriptionApi.create(payload);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      const msg = err?.message || "Failed to create product";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, payload: UpdateDescriptionPayload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await descriptionApi.update(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      const msg = err?.message || "Failed to update product";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await descriptionApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const msg = err?.message || "Failed to delete product";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export default useDescriptions;
