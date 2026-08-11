import mongoose, { Schema, Document, Types } from "mongoose";

export type AssignmentStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  vendorId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: AssignmentStatus;
  assignmentDate: Date;
  eventDate?: Date;
  serviceCategory?: string;
  agreedPrice?: number;
  notes?: string;
  paymentStatus: "unpaid" | "pending" | "paid" | "refunded";
  stripePaymentIntentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "declined",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    assignmentDate: { type: Date, default: Date.now },
    eventDate: Date,
    serviceCategory: String,
    agreedPrice: { type: Number, min: 0 },
    notes: String,
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "refunded"],
      default: "unpaid",
    },
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

assignmentSchema.index({ vendorId: 1, customerId: 1, eventDate: 1 });

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
