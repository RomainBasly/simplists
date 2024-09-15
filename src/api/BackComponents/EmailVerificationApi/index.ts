import assert from "assert";
import BaseApiService from "../BaseAPIService";
import { BackendError } from "@/Services/errorHandlingService";

export type ISendVerificationEmail = {
  email: string;
};

export type ISendVerificationCode = {
  email: string;
  code: string;
};

export default class EmailVerificationApi extends BaseApiService {
  private static instance: EmailVerificationApi;
  private readonly baseUrl = this.backEndUrl;

  private constructor() {
    super();
  }

  public static getInstance(): EmailVerificationApi {
    if (!this.instance) {
      this.instance = new EmailVerificationApi();
    }
    return this.instance;
  }

  public async sendVerificationEmail(
    params: ISendVerificationEmail
  ): Promise<any> {
    assert(this.baseUrl, "BackendURL is missing");
    const url = new URL(
      this.baseUrl.concat("/register").concat("/email-verification")
    );
    try {
      return await this.postRequest<any>(url, params);
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async sendVerificationCode(
    params: ISendVerificationCode
  ): Promise<any> {
    assert(this.baseUrl, "BackendURL is missing");
    const url = new URL(
      this.baseUrl.concat("/register").concat("/check-verification-code")
    );

    try {
      return await this.postRequest<ISendVerificationCode>(url, params);
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }
}
