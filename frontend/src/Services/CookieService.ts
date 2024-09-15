const SHORT_LIVED = 3600 * 1000;
const LONG_LIVED = 3600 * 24 * 30 * 1000;

export default class StorageService {
  private static instance: StorageService;
  private constructor() {}

  public static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  public setCookies(name: string, value: string, isAccessToken: boolean): void {
    if (!value || !name) throw new Error("Cookie name or value is empty");
    let date = new Date();
    let durationInNumber = isAccessToken ? SHORT_LIVED : LONG_LIVED;
    date.setTime(date.getTime() + durationInNumber);
    const expirationTimeIntUTC = date.toUTCString();

    document.cookie =
      name +
      "=" +
      value +
      "; expires=" +
      expirationTimeIntUTC +
      "; path=/; secure;sameSite=Lax";
  }

  public getToken(name: string): string | null {
    if (!localStorage.getItem(name)) {
      return null;
    }
    return localStorage.getItem(name);
  }

  // deleteCookie
}
