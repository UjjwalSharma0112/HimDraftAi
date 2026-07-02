import Description from "../models/Description";
import User from "../models/User";
import mongoose from "mongoose";

// Helper to get or create a default user ID to satisfy the model requirement
const getOrCreateDefaultUser = async (): Promise<mongoose.Types.ObjectId> => {
  let user = await User.findOne({ email: "default@himshakti.com" });
  if (!user) {
    user = await User.create({
      name: "Default User",
      email: "default@himshakti.com",
      passwordHash: "dummyhash",
      provider: "local",
    });
  }
  return user._id as mongoose.Types.ObjectId;
};

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

export const getAllDescriptions = async () => {
  const descriptions = await Description.find().sort({ createdAt: -1 });
  return descriptions.map(mapToProductDescription);
};

export const getDescriptionById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findById(id);
  return description ? mapToProductDescription(description) : null;
};

export const createDescription = async (data: any) => {
  const userId = await getOrCreateDefaultUser();
  const description = await Description.create({
    ...data,
    userId,
  });
  return mapToProductDescription(description);
};

export const updateDescription = async (id: string, data: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
  return description ? mapToProductDescription(description) : null;
};

export const deleteDescription = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  const description = await Description.findByIdAndDelete(id);
  return description ? mapToProductDescription(description) : null;
};

export const searchDescriptions = async (query: string) => {
  const q = String(query || "").trim();
  if (!q) {
    return getAllDescriptions();
  }
  const descriptions = await Description.find({
    productName: { $regex: q, $options: "i" }
  }).sort({ createdAt: -1 });
  return descriptions.map(mapToProductDescription);
};
