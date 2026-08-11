import { Router } from "express";
import * as vendor from "../controllers/vendorController";
import { authenticate, authorize } from "../middleware/auth";
import { validateBody } from "../utils/http";
import {
  vendorProfileUpdateSchema,
  acceptTermsSchema,
} from "../utils/validators";

/** Authenticated vendor self-service routes — mounted at /api/vendor */
const router = Router();

router.use(authenticate, authorize("vendor"));

router.get("/profile", vendor.getVendorProfile);
router.put(
  "/profile",
  validateBody(vendorProfileUpdateSchema),
  vendor.updateVendorProfile
);
router.post("/deposit", vendor.createVendorDeposit);
router.post(
  "/accept-terms",
  validateBody(acceptTermsSchema),
  vendor.acceptVendorTerms
);
router.get("/assignments", vendor.getAssignedCustomers);

export default router;
