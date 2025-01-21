import assert from "assert";
import BaseApiService, { ContentType } from "../BaseAPIService";
import { Cookie } from "../UserListsApi";
import { BackendError } from "@/Services/errorHandlingService";

export default class NotificationsApi extends BaseApiService {
  private static instance: NotificationsApi;
  private readonly baseURL = this.backEndUrl;

  private constructor() {
    super();
    NotificationsApi.instance = this;
  }

  public static getInstance(): NotificationsApi {
    if (!this.instance) this.instance = new NotificationsApi();
    return this.instance;
  }

  public async getNotificationsPreferences(params: Cookie) {
    assert(this.baseURL, "missing URL inside get notifications request");
    const url = new URL(
      this.baseURL
        .concat("/notifications")
        .concat("/fetch-notifications-preferences")
    );

    try {
      return await this.getRequest<any>(url, ContentType.JSON, {
        Cookie: params.Cookie,
      });
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }
  public async getNotifications(params: Cookie) {
    assert(this.baseURL, "missing URL inside get notifications request");
    const url = new URL(
      this.baseURL.concat("/notifications").concat("/get-notifications")
    );

    try {
      return await this.getRequest<any>(url, ContentType.JSON, {
        Cookie: params.Cookie,
      });
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async setNotificationsPreferences(
    params: any,
    type: string,
    subscription?: any,
    userAgent?: string
  ) {
    assert(this.baseURL, "missing URL inside set Notification request");
    const url = new URL(
      this.baseURL.concat("/notifications").concat(`/${type}`)
    );

    try {
      return await this.postRequest<any>(
        url,
        { subscription, userAgent },
        {
          Cookie: params.Cookie,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async deleteNotification(notificationId: string, params: any) {
    assert(this.baseURL, "missing URL inside set Notification request");
    const url = new URL(
      this.baseURL
        .concat("/notifications")
        .concat(`/delete-notification-by/${notificationId}`)
    );

    try {
      return await this.deleteRequest<any>(url, { Cookie: params.Cookie });
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async modifyNotificationStatus(
    notificationId: number,
    isNew: boolean,
    params: any
  ) {
    assert(this.baseURL, "missing URL inside set Notification request");
    const url = new URL(
      this.baseURL
        .concat("/notifications")
        .concat("/modify-notification-status")
    );

    try {
      return await this.postRequest<any>(
        url,
        { notificationId, isNew },
        { Cookie: params.Cookie }
      );
    } catch (error) {
      throw error;
    }
  }
}
