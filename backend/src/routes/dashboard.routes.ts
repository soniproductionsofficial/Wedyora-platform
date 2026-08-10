import { Router } from "express";
import * as dashboard from "../controllers/dashboardController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/dashboard", authenticate, dashboard.getDashboard);

export default router;
