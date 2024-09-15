import { injectable, inject } from 'tsyringe';
import { AppEmailVerificationTokenRepository } from '../../infrastructure/database/repositories/AppEmailVerificationTokenRepository';
import { EmailCodeError, EmailValidityCodeError, ErrorMessages } from '../common/errors';

export interface CodeVerificationPayload {
  email: string;
  code: { code: string };
}

@injectable()
export default class EmailVerificationServices {
  constructor(
    @inject(AppEmailVerificationTokenRepository)
    private readonly appEmailVerificationTokenRepository: AppEmailVerificationTokenRepository
  ) {}
  public async verifyCode(payload: CodeVerificationPayload) {
    const { email, code } = payload;
    try {
      const response = await this.appEmailVerificationTokenRepository.getAppEmailVerificationRecord(email);
      const isCodeCorrect = code.code === response.code;
      if (!isCodeCorrect) throw new EmailCodeError(ErrorMessages.INCORRECT_CODE);
      const isExpiryStillValid = new Date(Date.now()) < new Date(response.expiry_date);
      if (!isExpiryStillValid) throw new EmailValidityCodeError(ErrorMessages.NO_MORE_VALID);
      if (isCodeCorrect && isExpiryStillValid) {
        await this.appEmailVerificationTokenRepository.updateIsEmailVerified(email);
      }
    } catch (error) {
      console.error('something went wrong in the userservice', error);
      throw error;
    }
  }
}
