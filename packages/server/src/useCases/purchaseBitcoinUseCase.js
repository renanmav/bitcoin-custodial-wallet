import { getBitcoinPriceUseCase } from "./getBitcoinPriceUseCase";
import { readPlaidAccountBalanceUseCase } from "./readPlaidAccountBalanceUseCase";

import UserRepository from "~/repositories/userRepository";
import BitcoinService from "~/services/BitcoinService";
import PlaidService from "~/services/PlaidService";

export async function purchaseBitcoinUseCase(userId, amountUSD) {
  try {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.bitcoinAddress)
      throw new Error("User does not have a Bitcoin address");

    if (!user.plaidAccessToken)
      throw new Error("User does not have a linked bank account");

    const balance = await readPlaidAccountBalanceUseCase(user.plaidAccessToken);
    if (balance < amountUSD) {
      throw new Error("Insufficient funds in bank account");
    }

    const btcPriceUSD = await getBitcoinPriceUseCase();

    const amountBTC = Number((amountUSD / btcPriceUSD).toFixed(8));

    const transferResult = await PlaidService.createTransfer(
      user.plaidAccessToken,
      amountUSD,
      "Purchase Bitcoin",
    );

    const transaction = await BitcoinService.sendBitcoin(
      user.bitcoinAddress,
      amountBTC,
    );

    return {
      transaction,
      amountBTC,
      transferId: transferResult.transfer_id,
    };
  } catch (error) {
    console.error("Error purchasing Bitcoin:", error);
    throw error;
  }
}
