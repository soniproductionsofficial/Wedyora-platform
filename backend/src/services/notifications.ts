import { Message } from "../models/Message";
import { Types } from "mongoose";

export async function notifyUser(params: {
  recipientUserId: Types.ObjectId | string;
  senderUserId?: Types.ObjectId | string | null;
  senderLabel: string;
  subject: string;
  body: string;
  kind?: "customer" | "vendor" | "platform" | "system";
  relatedAssignmentId?: Types.ObjectId | string | null;
}) {
  return Message.create({
    recipientUserId: params.recipientUserId,
    senderUserId: params.senderUserId ?? null,
    senderLabel: params.senderLabel,
    subject: params.subject,
    body: params.body,
    kind: params.kind ?? "platform",
    relatedAssignmentId: params.relatedAssignmentId ?? null,
  });
}
