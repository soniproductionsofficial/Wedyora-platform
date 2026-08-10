import mongoose, { Schema, Document, Types } from "mongoose";

export type DepositStatus = "unpaid" | "pending" | "paid" | "waived";

export interface IVendor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  businessName: string;
  services: string[];
  pricing: {
    startingPrice: number;
    currency: string;
    packages?: Array<{
      title: string;
      description?: string;
      price: number;
    }>;
  };
  profilePhoto?: string;
  city?: string;
  bio?: string;
  depositStatus: DepositStatus;
  depositPaymentIntentId?: string | null;
  termsAccepted: boolean;
  termsAcceptedAt?: Date | null;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: { type: String, required: true, trim: true },
    services: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => Array.isArray(v),
        message: "services must be an array",
      },
    },
    pricing: {
      startingPrice: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "INR" },
      packages: [
        {
          title: { type: String, required: true },
          description: String,
          price: { type: Number, required: true, min: 0 },
        },
      ],
    },
    profilePhoto: String,
    city: { type: String, index: true },
    bio: String,
    depositStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "waived"],
      default: "unpaid",
      index: true,
    },
    depositPaymentIntentId: { type: String, default: null },
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: { type: Date, default: null },
    isListed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

vendorSchema.index({ businessName: "text", bio: "text", services: "text" });

export const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);
