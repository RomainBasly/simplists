import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { RefreshTokenService } from '../../refreshToken/services';
import { retrieveTokenFromCookie } from '../../../common/helpers';
import { ErrorMessages } from '../../../domain/common/errors';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

@injectable()
export class AppRefreshTokenController {
  constructor(@inject(RefreshTokenService) private readonly refreshTokenService: RefreshTokenService) {}
  async generateNewAccessToken(req: Request, res: Response, next: NextFunction) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ message: 'Unauthorized 1' });
    }
    const refreshToken = retrieveTokenFromCookie(cookieHeader, 'refreshToken');
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized 2' });
    }

    if (!refreshTokenSecret) throw new Error('no refreshTokenSecret in middleware');
    if (!accessTokenSecret) throw new Error('no accessTokenSecret in middleware');
    try {
      const foundUser = await this.refreshTokenService.getUserByRefreshToken(refreshToken);
      if (!foundUser) return res.status(401).json({ error: ErrorMessages.UNAUTHORIZED });
      const { newAccessToken } = await this.refreshTokenService.handleTokenRefresh(
        refreshToken,
        refreshTokenSecret,
        accessTokenSecret,
        foundUser
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
}
