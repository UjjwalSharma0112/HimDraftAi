import mongoose, { Schema, Document } from "mongoose";

export interface IGenerationHistory extends Document {
  descriptionId: mongoose.Types.ObjectId;
  prompt: string;
  generatedText: string;
  tone: string;
}

const generationHistorySchema = new Schema<IGenerationHistory>(
  {
    descriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Description",
      required: true,
    },

    prompt: String,

    generatedText: String,

    tone: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IGenerationHistory>(
  "GenerationHistory",
  generationHistorySchema,
);
