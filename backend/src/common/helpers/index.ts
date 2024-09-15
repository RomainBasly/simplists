import jwt, { JwtPayload } from 'jsonwebtoken';
import { ErrorMessages, JWTError } from '../../domain/common/errors';
import { Request, Response } from 'express';

export function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(new JWTError(ErrorMessages.JWT_ERROR));
      else resolve(decoded as JwtPayload);
    });
  });
}

export function cookieHandler(req: Request, res: Response, refreshToken: string) {
  return res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: false, // in dev mode use false
    maxAge: 24 * 3600 * 30 * 1000,
    path: '/',
  });
}

export function generateRandomNumber(): number {
  const array: Array<Number> = [];
  for (let i = 0; i < 7; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    array.push(randomNumber);
  }
  const result = parseInt(array.join(''));
  return result;
}

export function getFromJWTToken(req: Request, tokenType: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    throw new Error('no cookieHeader');
  }
  const token = retrieveTokenFromCookie(cookieHeader, tokenType);
  if (!token) throw new Error('no token accessible the method');
  const decoded = jwt.decode(token);
  return decoded;
}

export function retrieveTokenFromCookie(cookieHeader: string, tokenType: string) {
  try {
    const tokenString = cookieHeader?.split(';').find((row) => row.trim().startsWith(`${tokenType}=`));
    if (!tokenString) {
      throw new Error(`Token ${tokenType} not found`);
    }
    return tokenString.split('=')[1];
  } catch (error) {
    throw new Error(`Error retrieving ${tokenType} from cookie header: ${error}`);
  }
}

export function parseCookies(cookieHeader: string): { [key: string]: string } {
  const cookieStringSplitted = cookieHeader.split(';');
  const cookiesExtracted = cookieStringSplitted.reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = value;
    return cookies;
  }, {} as { [key: string]: string });
  return cookiesExtracted;
}
