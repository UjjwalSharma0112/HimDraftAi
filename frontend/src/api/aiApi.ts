import { apiRequest } from "./client";

export interface GeneratePayload {
  productName: string;
  ingredients: string[];
  weight: string;
  features: string[];
  tone: "premium" | "traditional" | "health";
  answers?: Record<string, string>;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  allowCustom: boolean;
}

export interface GenerateResponse {
  isVague: boolean;
  clarifications?: ClarificationQuestion[];
  copy?: string;
}

export const aiApi = {
  generate(payload: GeneratePayload): Promise<GenerateResponse> {
    return apiRequest<GenerateResponse>("/ai/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export default aiApi;
