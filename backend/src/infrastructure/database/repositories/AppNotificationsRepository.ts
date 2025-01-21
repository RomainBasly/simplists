import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { INotificationElement } from '../../../domain/NotificationsManagement/types';

type IFetchSubscription = {
  subscription_id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string;
};

@injectable()
export class AppNotificationsRepository {
  public async subscribe(userId: number, endpoint: string, p256dh: string, auth: string, userAgent: string) {
    try {
      await supabase
        .from('app-subscriptions')
        .insert([
          {
            user_id: userId,
            endpoint,
            p256dh,
            auth,
            userAgent,
          },
        ])
        .select();
    } catch (error) {
      throw error;
    }
  }

  public async updateSubscription(userId: number, endpoint: string, p256dh: string, auth: string, userAgent: string) {
    try {
      await supabase
        .from('app-subscriptions')
        .update({
          endpoint,
          p256dh,
          auth,
          userAgent,
        })
        .eq('user_id', userId);
    } catch (error) {
      throw error;
    }
  }

  public async modifyNotificationStatus(notificationId: string, isNew: boolean) {
    try {
      await supabase.from('app-notifications').update({ isNew }).eq('id', notificationId);
    } catch (error) {
      throw error;
    }
  }

  public async fetchSubscriptions(userId: string): Promise<IFetchSubscription | null> {
    try {
      const { data } = await supabase
        .from('app-subscriptions')
        .select('subscription_id, user_id, endpoint, p256dh, auth, userAgent')
        .eq('user_id', userId);

      if (data?.length && data?.length > 0) {
        return data[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  public async getNotifications(userId: string): Promise<any> {
    try {
      const { data } = await supabase.from('app-notifications').select('*').eq('recipient_id', userId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async createNotificationsInDB(notificationElement: INotificationElement[]): Promise<any> {
    try {
      const { data, error } = await supabase.from('app-notifications').insert(notificationElement).select();
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async deleteNotificationBy(notificationId: string) {
    try {
      const { data, error } = await supabase.from('app-notifications').delete().eq('id', notificationId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
