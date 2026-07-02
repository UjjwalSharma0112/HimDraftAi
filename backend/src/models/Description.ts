import mongoose, { Schema, Document } from "mongoose";

export interface IDescription extends Document {
  userId: mongoose.Types.ObjectId;
  productName: string;
  ingredients: string[];
  weight: string;
  features: string[];
  tone: string;
  generatedDescription: string;
}

const descriptionSchema = new Schema<IDescription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    ingredients: [
      {
        type: String,
      },
    ],

    weight: String,

    features: [
      {
        type: String,
      },
    ],

    tone: {
      type: String,
      enum: ["premium", "traditional", "health"],
      required: true,
    },

    generatedDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IDescription>("Description", descriptionSchema);
