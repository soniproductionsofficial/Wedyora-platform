import { Message, Assignment, Vendor, Customer, User } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";
import { sendMessageSchema } from "../utils/validators";
import { notifyUser } from "../services/notifications";

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ recipientUserId: req.user!.id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unread = await Message.countDocuments({
    recipientUserId: req.user!.id,
    read: false,
  });

  return success(res, { messages, unread });
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const message = await Message.findOne({
    _id: req.params.id,
    recipientUserId: req.user!.id,
  });
  if (!message) throw new AppError("Message not found", 404);

  message.read = true;
  await message.save();
  return success(res, { message });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { recipientUserId: req.user!.id, read: false },
    { read: true }
  );
  return success(res, { ok: true });
});

/**
 * Send a message related to an assignment (customer ↔ vendor)
 * or to a specific user id.
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const body = sendMessageSchema.parse(req.body);
  const sender = await User.findById(req.user!.id);
  if (!sender) throw new AppError("User not found", 404);

  let recipientUserId = body.recipientUserId;

  if (body.assignmentId) {
    const assignment = await Assignment.findById(body.assignmentId);
    if (!assignment) throw new AppError("Assignment not found", 404);

    const vendor = await Vendor.findById(assignment.vendorId);
    const customer = await Customer.findById(assignment.customerId);
    if (!vendor || !customer) {
      throw new AppError("Assignment parties not found", 404);
    }

    const vendorUserId = vendor.userId.toString();
    const customerUserId = customer.userId.toString();

    if (
      req.user!.id !== vendorUserId &&
      req.user!.id !== customerUserId
    ) {
      throw new AppError("Not a party to this assignment", 403);
    }

    recipientUserId =
      req.user!.id === vendorUserId ? customerUserId : vendorUserId;
  }

  if (!recipientUserId) {
    throw new AppError("recipientUserId or assignmentId is required", 422);
  }

  const kind =
    sender.role === "customer"
      ? "customer"
      : sender.role === "vendor"
        ? "vendor"
        : "platform";

  const message = await notifyUser({
    recipientUserId,
    senderUserId: sender._id,
    senderLabel: sender.fullName,
    subject: body.subject,
    body: body.body,
    kind,
    relatedAssignmentId: body.assignmentId ?? null,
  });

  return success(res, { message }, 201);
});
