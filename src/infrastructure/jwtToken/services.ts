import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { RoleAssignments, Roles } from '../../common/types/api';
import { Request } from 'express';
import { retrieveTokenFromCookie } from '../../common/helpers';
import { ErrorMessages, ForbiddenError } from '../../domain/common/errors';

export interface JwtPayloadAccessToken {
  userInfo: {
    id: number;
    roles: RoleAssignments;
    email: string;
    userName: string;
  };
}

@injectable()
export class TokenService {
  private readonly accessTokenSecret: string | undefined = process.env.ACCESS_TOKEN_SECRET;
  private readonly refreshTokenSecret: string | undefined = process.env.REFRESH_TOKEN_SECRET;

  constructor() {}

  public generateAccessToken(payload: JwtPayloadAccessToken): string | null {
    if (!this.accessTokenSecret) return null;
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '7200s' });
  }

  public generateRefreshToken(payload: { email: string }): string | null {
    if (!this.refreshTokenSecret) return null;
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '60d' });
  }

  public getUserIdFromAccessToken(req: Request): string {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
    }
    const accessToken = retrieveTokenFromCookie(cookieHeader, 'accessToken');
    if (!accessToken) {
      throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
    }
    const decoded = jwt.decode(accessToken) as JwtPayloadAccessToken | null;

    if (decoded && decoded.userInfo && decoded.userInfo.id) {
      return decoded.userInfo.id.toString();
    } else {
      throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
    }
  }
}
