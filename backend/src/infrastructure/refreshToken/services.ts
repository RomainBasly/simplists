import { inject, injectable } from 'tsyringe';
import { AppUserRepository } from '../../infrastructure/database/repositories/AppUserRepository';
import { IRefreshTokenService } from './types';

import { TokenService } from '../jwtToken/services';
import { verifyJwt } from '../../common/helpers';
import {
  NoPreexistingRefreshToken,
  ErrorMessages,
  ForbiddenError,
  accessTokenError,
  FailToGenerateTokens,
} from '../../domain/common/errors';
import { User } from '../../domain/auth/types';

@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(AppUserRepository) private readonly userRepository: AppUserRepository,
    @inject(TokenService) private readonly tokenService: TokenService
  ) {}

  public async getUserByRefreshToken(token: string): Promise<User | null> {
    const foundUser = await this.userRepository.getUserByRefreshToken(token);
    if (!foundUser) throw new NoPreexistingRefreshToken(ErrorMessages.NO_EXISTING_REFRESH_TOKEN);
    return foundUser;
  }

  public async disconnectUser(userId: string, refreshToken: string): Promise<void> {}

  public async handleTokenRefresh(
    existingRefreshToken: string,
    refreshTokenSecret: string,
    accessTokenSecret: string,
    foundUser: User
  ): Promise<{ newAccessToken: string }> {
    const decodedPayload = await verifyJwt(existingRefreshToken, refreshTokenSecret);
    if (!decodedPayload.email || foundUser.email !== decodedPayload.email) {
      throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
    }
    if (!accessTokenSecret) {
      throw new accessTokenError(ErrorMessages.ACCESSTOKEN_ERROR);
    }
    const { user_id, userName, email } = foundUser;
    const accessToken = this.tokenService.generateAccessToken({
      userInfo: { id: user_id, roles: foundUser.roles, userName, email },
    });
    if (!accessToken) {
      throw new FailToGenerateTokens(ErrorMessages.FAIL_TO_GENERATE_TOKENS);
    }
    return { newAccessToken: accessToken };
  }
}
