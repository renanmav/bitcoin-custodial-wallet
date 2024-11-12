import express from "express";

import {
  meController,
  signinController,
  signupController,
} from "~/controllers/authController";
import {
  generateBitcoinAddressController,
  getBitcoinBalanceController,
  getBitcoinPriceController,
  purchaseBitcoinController,
} from "~/controllers/bitcoinController";
import {
  createLinkTokenController,
  exchangePublicTokenController,
  readPlaidAccountBalanceController,
} from "~/controllers/plaidController";
import { authenticateUser } from "~/middlewares/auth";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.send("OK");
});

router.post("/signup", signupController);
router.post("/signin", signinController);

router.get("/me", authenticateUser, meController);

router.use("/plaid", authenticateUser);
router.post("/plaid/link/token/create", createLinkTokenController);
router.post("/plaid/item/public_token/exchange", exchangePublicTokenController);
router.get("/plaid/account/balance", readPlaidAccountBalanceController);

router.use("/bitcoin", authenticateUser);
router.post("/bitcoin/generate_address", generateBitcoinAddressController);
router.post("/bitcoin/purchase", purchaseBitcoinController);
router.get("/bitcoin/balance", getBitcoinBalanceController);
router.get("/bitcoin/price", getBitcoinPriceController);

export default router;
