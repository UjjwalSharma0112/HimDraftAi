import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  provider: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      default: "local",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", userSchema);
