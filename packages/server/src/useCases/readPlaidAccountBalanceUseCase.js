import PlaidService from "~/services/PlaidService";

export async function readPlaidAccountBalanceUseCase(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Invalid access token provided");
  }

  console.log("Fetching account balance for access token:", accessToken);

  try {
    const balance = await PlaidService.getAccountBalance(accessToken);
    return balance;
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw error;
  }
}
