import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  location: {
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  preferences: {
    budgetMin?: number;
    budgetMax?: number;
    preferredServices?: string[];
    guestCount?: number;
    notes?: string;
  };
  eventType: string;
  eventDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    location: {
      city: String,
      state: String,
      country: { type: String, default: "India" },
      lat: Number,
      lng: Number,
    },
    preferences: {
      budgetMin: Number,
      budgetMax: Number,
      preferredServices: [String],
      guestCount: Number,
      notes: String,
    },
    eventType: {
      type: String,
      default: "wedding",
      trim: true,
    },
    eventDate: Date,
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
