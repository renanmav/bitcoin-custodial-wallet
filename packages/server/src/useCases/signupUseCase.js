import UserEntity from "~/entities/User";
import UserRepository from "~/repositories/userRepository";
import { hashPassword } from "~/utils/password";

export async function signupUseCase(name, email, password) {
  console.log("Signing up with name:", name, "email:", email);

  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = new UserEntity(name, email, hashedPassword);
  return UserRepository.create(user);
}
