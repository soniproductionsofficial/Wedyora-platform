import { randomUUID } from "crypto";
import type {
  Booking,
  Customer,
  Message,
  Notification,
  Payment,
  Review,
  ServiceOffering,
  Task,
  User,
  Vendor,
} from "../types/models.js";

/** In-memory demo store — used when DEMO_MODE=true (default). */
class Store {
  users: User[] = [];
  vendors: Vendor[] = [];
  customers: Customer[] = [];
  services: ServiceOffering[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];
  tasks: Task[] = [];
  notifications: Notification[] = [];
  messages: Message[] = [];
  reviews: Review[] = [];
  refreshTokens = new Map<string, string>(); // token -> userId

  id() {
    return randomUUID();
  }

  now() {
    return new Date().toISOString();
  }
}

export const db = new Store();
