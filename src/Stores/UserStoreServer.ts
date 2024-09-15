export default class UserStoreServer {
  private static instance: UserStoreServer;
  private userId: string | null = null;
  public accessToken: string | null = null;
  public isOnline: boolean | null = null;

  private constructor() {}

  public static getInstance(): UserStoreServer {
    if (!UserStoreServer.instance) {
      UserStoreServer.instance = new UserStoreServer();
    }
    return UserStoreServer.instance;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getUserId(): string | null {
    if (this.userId) {
      return this.userId;
    }
    return null;
  }
}
