import assert from "assert";
import BaseApiService from "../BaseAPIService";
import { BackendError } from "@/Services/errorHandlingService";

export type ILogin = {
  email: string;
  password: string;
};

export type IRegister = {
  userName: string;
  email: string;
  password: string;
};

export type IDisconnect = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type IDisconnectResponse = {
  status: string;
  message: string;
  action: string;
  redirectUrl: string;
};

export interface ILoginResponse {
  accessToken?: string;
  refreshToken?: string;
  id: number;
  error?: string;
  message?: string;
}

export interface IRegisterResponse {
  error?: string;
  message?: string;
}

export default class AuthenticationApi extends BaseApiService {
  private static instance: AuthenticationApi;
  private readonly baseURL = this.backEndUrl;

  private constructor() {
    super();
    AuthenticationApi.instance = this;
  }

  public static getInstance(): AuthenticationApi {
    if (!AuthenticationApi.instance) {
      this.instance = new AuthenticationApi();
    }
    return this.instance;
  }

  public async login(params: ILogin): Promise<ILoginResponse> {
    assert(this.baseURL, "missing URL inside Auth login request");
    const url = new URL(this.baseURL.concat("/auth").concat("/login"));
    try {
      return await this.postRequest<ILoginResponse>(url, params);
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async register(params: IRegister): Promise<IRegisterResponse> {
    assert(this.baseURL, "missing URL inside Auth login request");
    const url = new URL(this.baseURL.concat("/auth").concat("/register"));

    try {
      return await this.postRequest<IRegisterResponse>(url, params);
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async disconnect(userId: string): Promise<IDisconnectResponse> {
    assert(this.baseURL, "missing URL inside Auth disconnection request");
    const url = new URL(this.baseURL.concat("/auth").concat("/logout-user"));

    try {
      return await this.postRequest<IDisconnectResponse>(url, { userId });
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }
}
