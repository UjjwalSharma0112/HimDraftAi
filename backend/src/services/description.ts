import Description from "../models/Description";
import mongoose from "mongoose";

// Map mongoose document to the ProductDescription format expected by the frontend
const mapToProductDescription = (doc: any) => {
  return {
    id: doc._id.toString(),
    productName: doc.productName,
    ingredients: doc.ingredients || [],
    weight: doc.weight || "",
    features: doc.features || [],
    tone: doc.tone,
    generatedDescription: doc.generatedDescription,
  };
};

export const getAllDescriptions = async (userId: string) => {
  const descriptions = await Description.find({ userId }).sort({ createdAt: -1 });
  return descriptions.map(mapToProductDescription);
};

export const getDescriptionById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findOne({ _id: id, userId });
  return description ? mapToProductDescription(description) : null;
};

export const createDescription = async (userId: string, data: any) => {
  const description = await Description.create({
    ...data,
    userId: new mongoose.Types.ObjectId(userId),
  });
  return mapToProductDescription(description);
};

export const updateDescription = async (id: string, userId: string, data: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true }
  );
  return description ? mapToProductDescription(description) : null;
};

export const deleteDescription = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findOneAndDelete({ _id: id, userId });
  return description ? mapToProductDescription(description) : null;
};

export const searchDescriptions = async (query: string, userId: string) => {
  const q = String(query || "").trim();
  if (!q) {
    return getAllDescriptions(userId);
  }
  const descriptions = await Description.find({
    userId,
    productName: { $regex: q, $options: "i" }
  }).sort({ createdAt: -1 });
  return descriptions.map(mapToProductDescription);
};
