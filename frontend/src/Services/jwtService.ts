import { jwtVerify, decodeJwt, JWTPayload } from "jose";
import { JwtPayload } from "jsonwebtoken";

export default class JwtService {
  private static instance: JwtService | null = null;
  // private readonly accessTokenSecret: string | null = null;
  // private readonly refreshTokenSecret: string | null = null;

  private constructor() {
    // const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    // const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    // if (!accessTokenSecret || !refreshTokenSecret) {
    //   throw new Error("error here");
    // }
    // this.accessTokenSecret = accessTokenSecret;
    // this.refreshTokenSecret = refreshTokenSecret;
  }

  public static getInstance(): JwtService {
    if (!this.instance) {
      this.instance = new JwtService();
    }
    return this.instance;
  }

  // async isRefreshTokenValid(token: string): Promise<boolean> {
  //   try {
  //     const key = new TextEncoder().encode(this.refreshTokenSecret);
  //     const { payload } = await jwtVerify(token, key);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  public decodeJwt(token: string | null): JWTPayload | null {
    try {
      if (token) {
        return decodeJwt(token);
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public isTokenExpired(token: string, bufferInSeconds = 30): boolean {
    const decodedToken = decodeJwt(token);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (decodedToken === null) {
      return true;
    }

    const expirationTime = decodedToken.exp;
    if (typeof expirationTime !== "number") {
      return true;
    }

    return expirationTime < (currentTimeInSeconds + bufferInSeconds);
  }
}
