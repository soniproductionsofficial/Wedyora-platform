import { Router } from "express";
import * as customer from "../controllers/customerController";
import { authenticate, authorize } from "../middleware/auth";
import { validateBody } from "../utils/http";
import {
  customerSearchSchema,
  customerPaymentSchema,
  customerProfileUpdateSchema,
  matchRequestSchema,
} from "../utils/validators";

const router = Router();

router.use(authenticate, authorize("customer"));

router.get("/profile", customer.getCustomerProfile);
router.put(
  "/profile",
  validateBody(customerProfileUpdateSchema),
  customer.updateCustomerProfile
);

router.post(
  "/search-vendors",
  validateBody(customerSearchSchema),
  customer.searchVendorsForCustomer
);

router.post(
  "/match",
  validateBody(matchRequestSchema),
  customer.requestVendorMatch
);

router.post(
  "/payments",
  validateBody(customerPaymentSchema),
  customer.createCustomerPayment
);

export default router;
