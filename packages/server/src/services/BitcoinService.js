import Client from "bitcoin-core";

class BitcoinService {
  constructor() {
    const BITCOIN_RPC_USER = process.env.BITCOIN_RPC_USER;
    const BITCOIN_RPC_PASSWORD = process.env.BITCOIN_RPC_PASSWORD;

    if (!BITCOIN_RPC_USER || !BITCOIN_RPC_PASSWORD) {
      throw new Error("BITCOIN_RPC_USER and BITCOIN_RPC_PASSWORD must be set");
    }

    this.client = new Client({
      network: "regtest",
      host: "bitcoind",
      port: 18443,
      username: BITCOIN_RPC_USER,
      password: BITCOIN_RPC_PASSWORD,
    });
  }

  async generateNewAddress() {
    try {
      const response = await this.client.command("getnewaddress");
      console.log("BitcoinService > generateNewAddress", response);
      return response;
    } catch (error) {
      console.error("Error generating new Bitcoin address:", error);
      throw new Error("Failed to generate new Bitcoin address");
    }
  }

  async generateBlocks(address, blocks = 1) {
    try {
      await this.client.command("generatetoaddress", blocks, address);
      return true;
    } catch (error) {
      console.error("Error generating blocks:", error);
      throw new Error("Failed to generate blocks");
    }
  }

  async getBalance() {
    try {
      const balance = await this.client.command("getbalance");
      console.log("BitcoinService > getBalance", balance);
      return balance;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw new Error("Failed to get balance");
    }
  }

  async ensureSufficientFunds(amount) {
    const balance = await this.getBalance();
    if (balance < amount) {
      console.log("Insufficient funds. Generating more coins...");
      const address = await this.generateNewAddress();
      await this.generateBlocks(address, 101);
      const newBalance = await this.getBalance();
      console.log("New balance after generating coins:", newBalance);
    }
  }

  async sendBitcoin(address, amount) {
    try {
      console.log(
        "BitcoinService > sendBitcoin > preparing to send",
        address,
        amount,
      );
      await this.ensureSufficientFunds(amount);
      const response = await this.client.command(
        "sendtoaddress",
        address,
        amount,
      );
      console.log("BitcoinService > sendBitcoin > response", response);
      await this.generateBlocks(address);
      return response;
    } catch (error) {
      console.error("Error sending Bitcoin:", error);
      throw new Error(error.message);
    }
  }

  async getAddressBalance(address) {
    try {
      const balance = await this.client.command(
        "getreceivedbyaddress",
        address,
      );
      console.log("BitcoinService > getAddressBalance", address, balance);
      return balance;
    } catch (error) {
      console.error("Error getting address balance:", error);
      throw new Error("Failed to get address balance");
    }
  }
}

export default new BitcoinService();
