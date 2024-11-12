import { generateBitcoinAddressUseCase } from "~/useCases/generateBitcoinAddressUseCase";
import { getBitcoinBalanceUseCase } from "~/useCases/getBitcoinBalanceUseCase";
import { getBitcoinPriceUseCase } from "~/useCases/getBitcoinPriceUseCase";
import { purchaseBitcoinUseCase } from "~/useCases/purchaseBitcoinUseCase";

export async function generateBitcoinAddressController(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) throw new Error("Could not find user");

    const bitcoinAddress = await generateBitcoinAddressUseCase(userId);

    res.status(200).json({
      message: "Bitcoin address generated successfully",
      data: { bitcoinAddress },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function purchaseBitcoinController(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) throw new Error("Could not find user");

    const { amountUSD } = req.body;
    if (!amountUSD) throw new Error("Amount is required");

    const { transaction, amountBTC } = await purchaseBitcoinUseCase(
      userId,
      amountUSD,
    );

    res.status(200).json({
      message: "Bitcoin purchase successful",
      data: { transaction, amountBTC },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getBitcoinBalanceController(req, res) {
  try {
    const user = req.user;
    if (!user) throw new Error("Could not find user");

    const bitcoinAddress = user.bitcoinAddress;
    if (!bitcoinAddress) throw new Error("Could not find bitcoin address");

    const balance = await getBitcoinBalanceUseCase(bitcoinAddress);

    res.status(200).json({
      message: "Bitcoin balance fetched successfully",
      data: { balance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getBitcoinPriceController(_, res) {
  try {
    const price = await getBitcoinPriceUseCase();

    res.status(200).json({
      message: "Bitcoin price fetched successfully",
      data: { price },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
