import { Router } from "express";
import * as messages from "../controllers/messageController";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../utils/http";
import { sendMessageSchema } from "../utils/validators";

const router = Router();

router.use(authenticate);

router.get("/", messages.listMessages);
router.post("/", validateBody(sendMessageSchema), messages.sendMessage);
router.post("/read-all", messages.markAllRead);
router.post("/:id/read", messages.markMessageRead);

export default router;
