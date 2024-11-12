import { createPlaidLinkTokenUseCase } from "~/useCases/createPlaidLinkTokenUseCase";
import { exchangePublicTokenUseCase } from "~/useCases/exchangePublicTokenUseCase";
import { readPlaidAccountBalanceUseCase } from "~/useCases/readPlaidAccountBalanceUseCase";

export const createLinkTokenController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) throw new Error("Could not find user");

    let isAndroid = false;
    const userAgent = req.headers["user-agent"];
    if (userAgent) {
      isAndroid = userAgent.toLowerCase().includes("android");
    }

    const linkToken = await createPlaidLinkTokenUseCase(
      userId.toString(),
      isAndroid,
    );

    res.status(200).json({
      message: "Link token created successfully",
      data: { linkToken },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exchangePublicTokenController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) throw new Error("Could not find user");

    const { publicToken } = req.body;
    if (!publicToken) throw new Error("Public token is required");

    const accessToken = await exchangePublicTokenUseCase(userId, publicToken);

    res.status(200).json({
      message: "Public token exchanged successfully",
      data: { accessToken },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const readPlaidAccountBalanceController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("Could not find user");

    const accessToken = user.plaidAccessToken;
    if (!accessToken) throw new Error("No account connected");

    const balance = await readPlaidAccountBalanceUseCase(accessToken);

    res.status(200).json({
      message: "Account balance read successfully",
      data: { balance },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
