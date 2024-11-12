import UserRepository from "~/repositories/userRepository";
import PlaidService from "~/services/PlaidService";

export async function exchangePublicTokenUseCase(userId, publicToken) {
  /** @type {import('plaid').ItemPublicTokenExchangeRequest} */
  const request = {
    public_token: publicToken,
  };

  console.log("Exchanging public token with the following request:", request);

  try {
    const response = await PlaidService.client.itemPublicTokenExchange(request);

    const accessToken = response.data.access_token;
    await UserRepository.updateAccessToken(userId, accessToken);

    return response.data;
  } catch (error) {
    console.error("Error exchanging public token:", error);
    throw error;
  }
}
