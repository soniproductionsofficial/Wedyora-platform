import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "../types";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  refreshTokenHash?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    refreshTokenHash: { type: String, select: false, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
