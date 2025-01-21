import { injectable, inject } from 'tsyringe';
import { AppFunctionsForTestsRepository } from '../../infrastructure/database/repositories/AppFetchingForTestsRepository';
import { UUID } from 'crypto';

@injectable()
export class FunctionsForTestServices {
  constructor(
    @inject(AppFunctionsForTestsRepository) private readonly appTestRepository: AppFunctionsForTestsRepository
  ) {}

  public async getVerificationCodeElement(email: string) {
    try {
      return await this.appTestRepository.getVerificationCode(email);
    } catch (error) {
      throw error;
    }
  }

  public async removeTestUserByEmail(email: string) {
    try {
      await this.appTestRepository.removeTestUserByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  public async fetchUsersBeneficiariesByListIdForTest(listId: UUID, userId: number) {
    try {
      await this.appTestRepository.getBeneficiariesByListId(listId, userId);
    } catch (error) {
      throw error;
    }
  }
}
