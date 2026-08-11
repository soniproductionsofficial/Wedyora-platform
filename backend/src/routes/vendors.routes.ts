import { Router } from "express";
import * as vendor from "../controllers/vendorController";

/** Public vendor directory — mounted at /api/vendors */
const router = Router();

router.get("/", vendor.listVendors);

export default router;
