import PlaidService from "~/services/PlaidService";

const ANDROID_PACKAGE_NAME = process.env.ANDROID_PACKAGE_NAME;
const IOS_REDIRECT_URI = process.env.IOS_REDIRECT_URI;

if (!ANDROID_PACKAGE_NAME || !IOS_REDIRECT_URI) {
  throw new Error("Plaid environment variables are not set");
}

export async function createPlaidLinkTokenUseCase(userId, isAndroid = false) {
  /** @type {import('plaid').LinkTokenCreateRequest} */
  const request = {
    user: {
      client_user_id: userId,
    },
    client_name: PlaidService.clientName,
    products: ["auth", "transactions", "transfer"],
    country_codes: ["US"],
    language: "en",
    ...(isAndroid
      ? { android_package_name: ANDROID_PACKAGE_NAME }
      : { redirect_uri: IOS_REDIRECT_URI }),
  };

  console.log("Generating link token with the following options:", request);

  try {
    const response = await PlaidService.client.linkTokenCreate(request);
    return response.data;
  } catch (error) {
    console.error("Error creating link token:", error);
    throw error;
  }
}
