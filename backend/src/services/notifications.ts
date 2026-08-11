import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { db } from "../config/db.js";

let io: Server | null = null;

export function initSockets(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.corsOrigins, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (socket.handshake.headers.authorization?.toString().replace("Bearer ", "") ?? "");
      if (!token) return next(new Error("Unauthorized"));
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);

    socket.on("chat:send", (payload: { receiverId: string; body: string; bookingId?: string }) => {
      if (!payload?.receiverId || !payload?.body) return;
      const message = {
        id: db.id(),
        bookingId: payload.bookingId,
        senderId: userId,
        receiverId: payload.receiverId,
        body: String(payload.body).slice(0, 2000),
        createdAt: db.now(),
      };
      db.messages.push(message);
      io?.to(`user:${payload.receiverId}`).emit("chat:message", message);
      socket.emit("chat:message", message);
    });

    socket.on("task:subscribe", (bookingId: string) => {
      if (bookingId) socket.join(`booking:${bookingId}`);
    });
  });

  return io;
}

export function emitToUser(userId: string, event: string, data: unknown) {
  io?.to(`user:${userId}`).emit(event, data);
}

export function emitBooking(bookingId: string, event: string, data: unknown) {
  io?.to(`booking:${bookingId}`).emit(event, data);
}

export function notifyUser(input: {
  userId: string;
  type: string;
  message: string;
  link?: string;
}) {
  const notification = {
    id: db.id(),
    userId: input.userId,
    type: input.type,
    message: input.message,
    link: input.link,
    read: false,
    createdAt: db.now(),
  };
  db.notifications.unshift(notification);
  emitToUser(input.userId, "notification", notification);
  return notification;
}
