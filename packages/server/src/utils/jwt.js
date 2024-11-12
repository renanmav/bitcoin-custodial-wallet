import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET.length) {
  throw new Error("JWT_SECRET is not set");
}

export function generateToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET);
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
