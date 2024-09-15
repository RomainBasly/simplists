import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { ErrorMessages, UserAlreadyExistsError } from '../../../domain/common/errors';

export interface IVerificationCode {
  email: string;
  code: string;
  expiry_date: string;
}

@injectable()
export class AppEmailVerificationTokenRepository {
  public async registerToDB(email_address: string, verification_code: string, formatted_expiry_date: string) {
    const { error } = await supabase.rpc('set_verification_code_into_DB', {
      email_address,
      verification_code,
      formatted_expiry_date,
    });

    if (error) {
      if (error.code === 'P0001') {
        throw new UserAlreadyExistsError(ErrorMessages.ALREADY_EXISTING);
      }
    } else {
      console.log('user registration started');
    }
  }

  public async getAppEmailVerificationRecord(email_address: string): Promise<IVerificationCode> {
    const { data, error } = await supabase.rpc('get_email_verification_data_from_DB', {
      email_address,
    });
    // TODO : set a better error handler than this one too general
    if (error) throw new Error('problem inside the getEmailVerificationRecord');
    return data;
  }

  public async updateIsEmailVerified(email: string) {
    const { error } = await supabase.from('app-users').update({ is_email_verified: true }).eq('email', email);
    if (error) throw new Error();
  }
}
