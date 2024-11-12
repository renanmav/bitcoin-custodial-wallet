import { signupUseCase } from "../signupUseCase";

import UserRepository from "~/repositories/userRepository";
import { hashPassword } from "~/utils/password";

jest.mock("~/repositories/userRepository");
jest.mock("~/utils/password");
jest.spyOn(console, "log").mockImplementation(() => {});

describe("signupUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user when given valid inputs", async () => {
    const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.create.mockResolvedValue(mockUser);
    hashPassword.mockResolvedValue("hashedPassword");

    const result = await signupUseCase(
      "John Doe",
      "john@example.com",
      "password123",
    );

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(UserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
      }),
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw an error if user already exists", async () => {
    UserRepository.findByEmail.mockResolvedValue({
      id: "1",
      email: "john@example.com",
    });

    await expect(
      signupUseCase("John Doe", "john@example.com", "password123"),
    ).rejects.toThrow("User already exists");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(UserRepository.create).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
  });

  it("should handle errors during user creation", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.create.mockRejectedValue(new Error("Database error"));
    hashPassword.mockResolvedValue("hashedPassword");

    await expect(
      signupUseCase("John Doe", "john@example.com", "password123"),
    ).rejects.toThrow("Database error");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(UserRepository.create).toHaveBeenCalled();
  });
});
