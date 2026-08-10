import { Router } from "express";
import * as customer from "../controllers/customerController";
import { authenticate, authorize } from "../middleware/auth";
import { validateBody } from "../utils/http";
import {
  customerSearchSchema,
  customerPaymentSchema,
} from "../utils/validators";

const router = Router();

router.use(authenticate, authorize("customer"));

router.post(
  "/search-vendors",
  validateBody(customerSearchSchema),
  customer.searchVendorsForCustomer
);

router.post(
  "/payments",
  validateBody(customerPaymentSchema),
  customer.createCustomerPayment
);

export default router;
