import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { User, IAppUserRepository } from '../../../domain/auth/types';

@injectable()
export class AppUserRepository implements IAppUserRepository {
  public async addPassword(userData: User) {
    const { error } = await supabase
      .from('app-users')
      .update({ userName: userData.userName, password: userData.password })
      .eq('email', userData.email)
      .select();
    if (error) {
      throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('app-users').select().eq('email', email);
    if (error) {
      throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
    }
    return data ? data[0] : null;
  }
  public async getUserNameByUserId(userId: number): Promise<{ user_id: number; userName: string } | null> {
    const { data, error } = await supabase.from('app-users').select('user_id, userName').eq('user_id', userId);
    if (error) {
      throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
    }
    return data ? data[0] : null;
  }

  public async getUserIdByEmail(email: string): Promise<any> {
    const { data, error } = await supabase.from('app-users').select('user_id').eq('email', email);
    if (error) {
      throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
    }
    return data ? data[0] : null;
  }

  public async updateRefreshToken(refreshToken: string, email: string) {
    await supabase.from('app-users').update({ refreshToken: refreshToken }).eq('email', email);
  }

  public async findUserByRefreshToken(refreshToken: string) {
    return await supabase.from('app-users').select().eq('refreshToken', refreshToken);
  }

  public async clearRefreshTokenWithUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('app-users')
        .update({ refreshToken: '' })
        .eq('user_id', userId)
        .select();
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByRefreshToken(token: string): Promise<User | null> {
    const { data, error } = await supabase.from('app-users').select().eq('refreshToken', token);
    if (error) {
      throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
    }
    return data ? data[0] : null;
  }
}
