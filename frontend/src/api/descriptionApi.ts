import { apiRequest } from "./client";
import type { ProductDescription, CreateDescriptionPayload, UpdateDescriptionPayload } from "../types/description";

export const descriptionApi = {
  // GET /api/descriptions/
  getAll(): Promise<ProductDescription[]> {
    return apiRequest<ProductDescription[]>("/descriptions/");
  },

  // GET /api/descriptions/search?q={query}
  search(query: string): Promise<ProductDescription[]> {
    return apiRequest<ProductDescription[]>(`/descriptions/search?q=${encodeURIComponent(query)}`);
  },

  // GET /api/descriptions/{id}
  getById(id: string): Promise<ProductDescription> {
    return apiRequest<ProductDescription>(`/descriptions/${id}`);
  },

  // POST /api/descriptions
  create(payload: CreateDescriptionPayload): Promise<ProductDescription> {
    return apiRequest<ProductDescription>("/descriptions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // PUT /api/descriptions/{id}
  update(id: string, payload: UpdateDescriptionPayload): Promise<ProductDescription> {
    return apiRequest<ProductDescription>(`/descriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE /api/descriptions/{id}
  delete(id: string): Promise<void> {
    return apiRequest<void>(`/descriptions/${id}`, {
      method: "DELETE",
    });
  },
};

export default descriptionApi;
