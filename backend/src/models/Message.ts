import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  recipientUserId: Types.ObjectId;
  senderUserId?: Types.ObjectId | null;
  senderLabel: string;
  subject: string;
  body: string;
  kind: "customer" | "vendor" | "platform" | "system";
  read: boolean;
  relatedAssignmentId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    senderLabel: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    kind: {
      type: String,
      enum: ["customer", "vendor", "platform", "system"],
      default: "platform",
      index: true,
    },
    read: { type: Boolean, default: false, index: true },
    relatedAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ recipientUserId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
