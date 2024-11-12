import UserRepository from "~/repositories/userRepository";
import { comparePassword } from "~/utils/password";

export async function signinUseCase(email, password) {
  console.log("Signing in with email:", email);

  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
}
