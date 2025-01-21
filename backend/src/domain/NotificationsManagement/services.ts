import assert from 'assert';
import { inject, injectable } from 'tsyringe';
import { AppNotificationsRepository } from '../../infrastructure/database/repositories/AppNotificationsRepository';
import initiatedWebPush from '../../infrastructure/webPush/webPushConfig';
import { IBeneficiary } from '../ListManagement/types';
import { ISubscription } from '../../infrastructure/api/app-notifications/controller';
import { INotificationElement } from './types';

@injectable()
export class AppNotificationsService {
  constructor(
    @inject(AppNotificationsRepository) private readonly appNotificationsRepository: AppNotificationsRepository
  ) {}

  public async subscribe(userId: string, subscription: ISubscription, userAgent: string) {
    try {
      const { endpoint } = subscription;
      await this.appNotificationsRepository.subscribe(
        parseInt(userId),
        endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth,
        userAgent
      );
    } catch (error) {
      throw error;
    }
  }
  public async updateSubscription(userId: string, subscription: ISubscription, userAgent: string) {
    try {
      const { endpoint } = subscription;
      await this.appNotificationsRepository.updateSubscription(
        parseInt(userId),
        endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth,
        userAgent
      );
    } catch (error) {
      throw error;
    }
  }

  public async modifyNotificationStatus(notificationId: string, isNew: boolean) {
    try {
      await this.appNotificationsRepository.modifyNotificationStatus(notificationId, isNew);
    } catch (error) {
      throw error;
    }
  }

  public async fetchNotificationsPreferences(userId: string) {
    try {
      assert(userId, 'No user Id in fetchNotifPreferences');
      const data = await this.appNotificationsRepository.fetchSubscriptions(userId);
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async getNotifications(userId: string) {
    try {
      assert(userId, 'No user Id in fetchNotifPreferences');
      const data = await this.appNotificationsRepository.getNotifications(userId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async sendMultiplePushNotifications(
    beneficiaries: IBeneficiary[],
    payload: string | Buffer | null | undefined
  ) {
    try {
      for (const beneficiary of beneficiaries) {
        const notificationsSettings = await this.fetchNotificationsPreferences(beneficiary['app-users']?.user_id);
        if (notificationsSettings) {
          const pushSubscription = {
            endpoint: notificationsSettings.endpoint,
            keys: {
              p256dh: notificationsSettings?.p256dh,
              auth: notificationsSettings?.auth,
            },
          };
          initiatedWebPush
            .sendNotification(pushSubscription, payload)
            .then(() => console.log('Notification sent successfully for :', beneficiary['app-users'].user_id))
            .catch((err) => console.error('Error sending push:', err));
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public async sendSinglePushNotification(
    beneficiary: { user_id: string },
    payload: string | Buffer | null | undefined
  ) {
    try {
      const notificationsSettings = await this.fetchNotificationsPreferences(beneficiary.user_id);
      if (notificationsSettings) {
        const pushSubscription = {
          endpoint: notificationsSettings.endpoint,
          keys: {
            p256dh: notificationsSettings?.p256dh,
            auth: notificationsSettings?.auth,
          },
        };
        initiatedWebPush
          .sendNotification(pushSubscription, payload)
          .then(() => console.log('Notification sent successfully for :', beneficiary.user_id))
          .catch((err) => console.error('Error sending push:', err));
      }
    } catch (error) {
      throw error;
    }
  }

  public async createNotificationsInDB(notificationElement: INotificationElement[]) {
    try {
      await this.appNotificationsRepository.createNotificationsInDB(notificationElement);
    } catch (error) {
      throw error;
    }
  }

  public async suppressNotificationById(notificationId: string) {
    try {
      await this.appNotificationsRepository.deleteNotificationBy(notificationId);
    } catch (error) {
      throw error;
    }
  }
}
