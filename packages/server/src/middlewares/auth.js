import UserRepository from "~/repositories/userRepository";
import { findAuthorizationHeader } from "~/utils/header";
import { verifyToken } from "~/utils/jwt";

export async function authenticateUser(req, res, next) {
  try {
    const authHeader = findAuthorizationHeader(req);
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const [, token] = authHeader.split(" ");
    const decoded = verifyToken(token);
    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid JWT token" });
    }

    req.user = user;
    next();
  } catch (_) {
    return res.status(401).json({ error: "Invalid JWT token" });
  }
}
