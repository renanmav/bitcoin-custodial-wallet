import { signinUseCase } from "~/useCases/signinUseCase";
import { signupUseCase } from "~/useCases/signupUseCase";
import { generateToken } from "~/utils/jwt";

export async function signupController(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await signupUseCase(name, email, password);
    const token = generateToken(user);
    res.status(201).json({
      message: "User created successfully",
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function signinController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await signinUseCase(email, password);
    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
}

export async function meController(req, res) {
  try {
    const user = req.user;
    if (!user) throw new Error("Could not find user");

    console.log("Reading user", user);

    res.status(200).json({
      message: "User fetched successfully",
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          bitcoinAddress: user.bitcoinAddress,
          plaidAccessToken: user.plaidAccessToken,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
