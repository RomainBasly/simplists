import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { User } from '../../../domain/auth/types';

@injectable()
export class AppRefreshTokenRepository {
  public async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
    const { data, error } = await supabase.from('app-users').select().eq('refreshToken', refreshToken);
    if (error) {
      throw new Error(`something when wrong in the appRefreshTokenRepository: ${error.message}`);
    }
    return data ? data[0] : null;
  }
}
