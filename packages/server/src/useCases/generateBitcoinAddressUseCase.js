import UserRepository from "~/repositories/userRepository";
import BitcoinService from "~/services/BitcoinService";

export async function generateBitcoinAddressUseCase(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.bitcoinAddress) {
      throw new Error("Bitcoin address already exists");
    }

    const bitcoinAddress = await BitcoinService.generateNewAddress();

    await UserRepository.updateBitcoinAddress(userId, bitcoinAddress);

    return bitcoinAddress;
  } catch (error) {
    console.error("Error generating bitcoin address:", error);
    throw error;
  }
}
