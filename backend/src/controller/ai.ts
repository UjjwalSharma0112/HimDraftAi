import { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai";

export const generateDescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productName, ingredients, weight, features, tone, answers } = req.body;

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      res.status(400).json({ message: "Product name is required." });
      return;
    }

    // Default or sanitize inputs
    const sanitizedIngredients = Array.isArray(ingredients) ? ingredients.map(String) : [];
    const sanitizedFeatures = Array.isArray(features) ? features.map(String) : [];
    const sanitizedWeight = typeof weight === "string" ? weight.trim() : "";
    
    // Ensure tone is one of the supported DB enums
    let sanitizedTone: "premium" | "traditional" | "health" = "health";
    if (tone === "premium" || tone === "traditional" || tone === "health") {
      sanitizedTone = tone;
    }

    const inputData: aiService.GenerateInput = {
      productName: productName.trim(),
      ingredients: sanitizedIngredients,
      weight: sanitizedWeight,
      features: sanitizedFeatures,
      tone: sanitizedTone
    };

    // If clarifications are already answered, proceed straight to copy generation
    if (answers && typeof answers === "object" && Object.keys(answers).length > 0) {
      const copy = await aiService.generateFinalProductCopy(inputData, answers);
      res.status(200).json({ isVague: false, copy });
      return;
    }

    // Otherwise, perform the vagueness/clarification analysis
    const analysis = await aiService.analyzeProductInput(inputData);

    if (analysis.isVague && analysis.clarifications && analysis.clarifications.length > 0) {
      res.status(200).json({
        isVague: true,
        clarifications: analysis.clarifications
      });
      return;
    }

    // If input details are sufficient, generate copy directly
    const copy = await aiService.generateFinalProductCopy(inputData);
    res.status(200).json({ isVague: false, copy });
  } catch (error: any) {
    console.error("Error generating AI description:", error);
    res.status(500).json({
      message: error?.message || "An error occurred during AI description generation."
    });
  }
};
