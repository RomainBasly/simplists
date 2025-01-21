import { injectable, inject } from 'tsyringe';
import { AppUserRepository } from '../../infrastructure/database/repositories/AppUserRepository';

@injectable()
export default class AppUserService {
  public constructor(@inject(AppUserRepository) private readonly appUserRepository: AppUserRepository) {}

  public async getUserByEmail(email: string) {
    try {
      const userId = await this.appUserRepository.getUserIdByEmail(email);
      return userId;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByUserId(userId: number) {
    try {
      const user = await this.appUserRepository.getUserNameByUserId(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
