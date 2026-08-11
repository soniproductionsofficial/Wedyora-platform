import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  kind: "vendor_deposit" | "customer_assignment";
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "canceled";
  stripePaymentIntentId: string;
  assignmentId?: Types.ObjectId | null;
  vendorId?: Types.ObjectId | null;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: {
      type: String,
      enum: ["vendor_deposit", "customer_assignment"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "canceled"],
      default: "pending",
      index: true,
    },
    stripePaymentIntentId: { type: String, required: true, unique: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", default: null },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
