import { signinUseCase } from "../signinUseCase";

import UserRepository from "~/repositories/userRepository";
import { comparePassword } from "~/utils/password";

jest.mock("~/repositories/userRepository");
jest.mock("~/utils/password");
jest.spyOn(console, "log").mockImplementation(() => {});

describe("signinUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign in a user with valid credentials", async () => {
    const mockUser = {
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
    };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(true);

    const result = await signinUseCase("john@example.com", "password123");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword",
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw an error if user is not found", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      signinUseCase("nonexistent@example.com", "password123"),
    ).rejects.toThrow("User not found");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith(
      "nonexistent@example.com",
    );
    expect(comparePassword).not.toHaveBeenCalled();
  });

  it("should throw an error if password is invalid", async () => {
    const mockUser = {
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
    };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(false);

    await expect(
      signinUseCase("john@example.com", "wrongpassword"),
    ).rejects.toThrow("Invalid password");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(comparePassword).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedPassword",
    );
  });

  it("should handle errors from UserRepository", async () => {
    UserRepository.findByEmail.mockRejectedValue(new Error("Database error"));

    await expect(
      signinUseCase("john@example.com", "password123"),
    ).rejects.toThrow("Database error");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(comparePassword).not.toHaveBeenCalled();
  });

  it("should handle errors from comparePassword", async () => {
    const mockUser = {
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
    };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    comparePassword.mockRejectedValue(new Error("Comparison error"));

    await expect(
      signinUseCase("john@example.com", "password123"),
    ).rejects.toThrow("Comparison error");

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword",
    );
  });

  it("should handle empty email", async () => {
    UserRepository.findByEmail.mockResolvedValue(null);

    await expect(signinUseCase("", "password123")).rejects.toThrow(
      "User not found",
    );

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("");
    expect(comparePassword).not.toHaveBeenCalled();
  });

  it("should handle empty password", async () => {
    const mockUser = {
      id: "1",
      email: "john@example.com",
      password: "hashedPassword",
    };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(false);

    await expect(signinUseCase("john@example.com", "")).rejects.toThrow(
      "Invalid password",
    );

    expect(UserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(comparePassword).toHaveBeenCalledWith("", "hashedPassword");
  });
});
