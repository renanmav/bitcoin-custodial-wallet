import BitcoinService from "~/services/BitcoinService";

export async function getBitcoinBalanceUseCase(bitcoinAddress) {
  try {
    const balance = await BitcoinService.getAddressBalance(bitcoinAddress);
    return balance;
  } catch (error) {
    console.error("Error getting bitcoin balance:", error);
    throw error;
  }
}
