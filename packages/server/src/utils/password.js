/* eslint-disable no-undef */

/**
 * @typedef {import('bun')} Bun
 */

export async function hashPassword(password) {
  return Bun.password.hash(password);
}

export async function comparePassword(password, hashedPassword) {
  return Bun.password.verify(password, hashedPassword);
}
