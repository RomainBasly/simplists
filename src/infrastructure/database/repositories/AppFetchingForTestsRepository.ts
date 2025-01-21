import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { UUID } from 'crypto';

@injectable()
export class AppFunctionsForTestsRepository {
  public constructor() {}
  public async getVerificationCode(email: string): Promise<number | null> {
    try {
      const response = await this.getUserIdWithEmail(email);
      if (response) {
        const userId = response[0].user_id;
        const { data, error } = await supabase
          .from('app-email-verification-token')
          .select('code')
          .eq('user_id', userId);
        if (data) {
          const code = data[0].code;
          return code;
        }
        return null;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  private async getUserIdWithEmail(email: string): Promise<Array<{ user_id: number }> | null> {
    try {
      const { data, error } = await supabase.from('app-users').select('user_id').eq('email', email);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async removeTestUserByEmail(email: string) {
    try {
      await supabase.from('app-users').delete().eq('email', email);
    } catch (error) {
      throw error;
    }
  }

  public async getBeneficiariesByListId(listId: UUID, userId: number) {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .select('app-users:user-id(user_id, userName)')
        .eq('app-list-id', listId)
        .neq('user-id', userId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
