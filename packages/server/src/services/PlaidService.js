import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

class PlaidService {
  constructor() {
    const PLAID_ENV = process.env.PLAID_ENV;
    const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
    const PLAID_SECRET = process.env.PLAID_SECRET;

    if (!PLAID_ENV || !PLAID_CLIENT_ID || !PLAID_SECRET) {
      throw new Error(
        "PLAID_ENV, PLAID_CLIENT_ID, and PLAID_SECRET must be set",
      );
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
          "PLAID-SECRET": PLAID_SECRET,
        },
      },
    });

    /** @type {import('plaid').PlaidApi} */
    this.client = new PlaidApi(configuration);

    /** @type {string} */
    this.clientName = "Renan Mav's BTC Wallet";
  }

  async getAccountBalance(accessToken) {
    try {
      const response = await this.client.accountsBalanceGet({
        access_token: accessToken,
      });

      // Assuming we're interested in the first account's available balance
      const balance = response.data.accounts[0].balances.available;

      return balance;
    } catch (error) {
      console.error("Error fetching account balance:", error);
      throw new Error("Error fetching account balance");
    }
  }

  async getAccountId(accessToken) {
    const response = await this.client.accountsGet({
      access_token: accessToken,
    });
    // Assuming the first account is the one we want to use
    return response.data.accounts[0].account_id;
  }

  async createTransfer(accessToken, amount, description) {
    try {
      console.log("Creating transfer", { accessToken, amount, description });

      // Format the amount as a string with 2 decimal places
      const formattedAmount = parseFloat(amount).toFixed(2);

      // Validate and truncate the description
      const validatedDescription = this.validateDescription(description);

      // Get the account ID
      const accountId = await this.getAccountId(accessToken);

      // Create a transfer authorization
      const authorizationResponse =
        await this.client.transferAuthorizationCreate({
          access_token: accessToken,
          account_id: accountId,
          type: "debit",
          network: "ach",
          amount: formattedAmount,
          ach_class: "ppd",
          user: {
            legal_name: this.clientName,
          },
        });

      const authorizationId = authorizationResponse.data.authorization.id;

      // Create the transfer using the authorization
      const transferResponse = await this.client.transferCreate({
        access_token: accessToken,
        account_id: accountId,
        authorization_id: authorizationId,
        amount: formattedAmount,
        description: validatedDescription,
      });

      return transferResponse.data.transfer;
    } catch (error) {
      console.error(
        "Error creating transfer:",
        error.response.data || error.message,
      );
      if (error.response.data) {
        throw new Error(error.response.data.error_message);
      } else {
        throw new Error("Error creating transfer");
      }
    }
  }

  validateDescription(description) {
    if (typeof description !== "string" || description.trim().length === 0) {
      throw new Error("Description must be a non-empty string");
    }
    return description.trim().slice(0, 15);
  }
}

export default new PlaidService();
