import { jwtDecode } from "jwt-decode";

export default class TokenHelper {
  static isTokenExpiredOrInvalid = function (
    token: string | undefined,
  ): boolean {
    try {
      if (!token) return false;
      const decodedToken = jwtDecode(token);
      if (!decodedToken || !decodedToken.exp) {
        return true
      }
      const currentTime = Math.floor(Date.now() / 1000)
      return decodedToken.exp < currentTime
    } catch (error) {
      return true
    }
  }
}
