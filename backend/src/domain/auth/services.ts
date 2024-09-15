import { inject, injectable } from 'tsyringe';
import { RoleAssignments, Roles } from '../../common/types/api';
import { AppUserRepository } from '../../infrastructure/database/repositories/AppUserRepository';
import { AuthenticationError, ErrorMessages, FailToGenerateTokens, UserDoNotExists } from '../common/errors';
import { TokenService } from '../../infrastructure/jwtToken/services';
import { PasswordService } from '../password/services';
import { User } from './types';

@injectable()
export class AppAuthService {
  constructor(
    @inject(AppUserRepository) private readonly appUserRepository: AppUserRepository,
    @inject(PasswordService) private readonly passwordService: PasswordService,
    @inject(TokenService) private readonly tokenService: TokenService
  ) {}

  async registerUser(user_id: number, userName: string, email: string, password: string) {
    try {
      const hashedPassword = await this.passwordService.hashPassword(password);
      const user = { user_id, userName, email, roles: { [Roles.USER]: true }, password: hashedPassword };
      await this.appUserRepository.addPassword(user);
    } catch (error) {
      console.error('something went wrong in the userservice', error);
      throw error;
    }
  }

  public async login(email: string, passwordInput: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.appUserRepository.getUserByEmail(email);
      if (!user) {
        throw new UserDoNotExists(ErrorMessages.NOT_EXISTING_USER);
      }
      const passwordFromDB = user.password;
      const passwordMatchDB = await this.passwordService.checkCredentials(passwordInput, passwordFromDB);

      if (!passwordMatchDB) {
        throw new AuthenticationError(ErrorMessages.INVALID_CREDENTIALS);
      }
      const roles = this.addUserRole(user);
      const accessToken = this.tokenService.generateAccessToken({
        userInfo: { id: user.user_id, roles, email, userName: user.userName },
      });
      const refreshToken = this.tokenService.generateRefreshToken({ email });
      if (!refreshToken || !accessToken) {
        throw new FailToGenerateTokens(ErrorMessages.FAIL_TO_GENERATE_TOKENS);
      }
      await this.appUserRepository.updateRefreshToken(refreshToken, email);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('something went wrong in the login service', error);
      throw error;
    }
  }

  public async logoutUser(userId: string) {
    try {
      const response = await this.appUserRepository.clearRefreshTokenWithUserId(userId);
      return response;
    } catch (error) {
      console.error('something went wrong in the logout service after two attempts', error);
      throw error;
    }
  }

  // TODO : move to another file
  public addUserRole(user: User) {
    const defaultRole: RoleAssignments = { [Roles.USER]: true };
    const userRolesFromDB = user.roles as RoleAssignments;
    return { ...defaultRole, ...userRolesFromDB };
  }
}
