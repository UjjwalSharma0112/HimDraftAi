export interface ProductDescription {
  id: string;
  productName: string;
  ingredients: string[];
  weight: string;
  features: string[];
  tone: string;
  generatedDescription?: string;
}

export interface CreateDescriptionPayload {
  productName: string;
  ingredients: string[];
  weight: string;
  features: string[];
  tone: string;
  generatedDescription?: string;
}

export interface UpdateDescriptionPayload {
  productName?: string;
  ingredients?: string[];
  weight?: string;
  features?: string[];
  tone?: string;
  generatedDescription?: string;
}
