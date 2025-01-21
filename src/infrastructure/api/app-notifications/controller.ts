import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { getFromJWTToken } from '../../../common/helpers';
import { UserInfo } from '../../../common/types/api';
import { AppNotificationsService } from '../../../domain/NotificationsManagement/services';
import assert from 'assert';
import { UUID } from 'crypto';

export type ISubscription = {
  endpoint: string;
  expirationTime: Date | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

@injectable()
export class AppNotificationsController {
  constructor(@inject(AppNotificationsService) private readonly appNotificationsService: AppNotificationsService) {}

  public async fetchNotificationsPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const userId = userInfo.id.toString();
      const data = await this.appNotificationsService.fetchNotificationsPreferences(userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  public async getNotificationsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const userId = userInfo.id.toString();
      const data = await this.appNotificationsService.getNotifications(userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public async subscribeToNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscription, userAgent } = req.body;
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      assert(subscription, 'Not subscription info to send notifications');
      assert(userAgent, 'Not userAgent info to send notifications');
      assert(userInfo.id, 'Not id info to send notifications');
      await this.appNotificationsService.subscribe(userInfo.id.toString(), subscription, userAgent);
      res.status(200).json({ message: 'Suscription taken into account' });
    } catch (error) {
      next(error);
    }
  }
  public async updateNotificationsPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscription, userAgent } = req.body;
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      assert(subscription, 'Not subscription info to send notifications');
      assert(userAgent, 'Not userAgent info to send notifications');
      assert(userInfo.id, 'Not id info to send notifications');
      await this.appNotificationsService.updateSubscription(userInfo.id.toString(), subscription, userAgent);
      res.status(200).json({ message: 'Suscription taken into account' });
    } catch (error) {
      next(error);
    }
  }
  public async modifyNotificationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { notificationId, isNew } = req.body;
      assert(notificationId, 'No notificationId');

      await this.appNotificationsService.modifyNotificationStatus(notificationId, isNew);
      res.status(200).json({ success: true, message: 'Modification taken into account' });
    } catch (error) {
      next(error);
    }
  }

  public async deleteNotificationById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.notificationId as UUID;
    assert(id, 'No NotificationId info to delete notification');
    try {
      await this.appNotificationsService.suppressNotificationById(id);
      res.status(200).json({ message: 'notification successfully suppressed', success: true });
    } catch (error) {
      next(error);
    }
  }
}
