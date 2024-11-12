export function findAuthorizationHeader(req) {
  const headers = req.headers;
  const authHeader =
    headers.Authorization ||
    headers.authorization ||
    headers.Authentication ||
    headers.authentication;

  return authHeader;
}
