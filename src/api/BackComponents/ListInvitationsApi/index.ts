import assert from "assert";
import BaseApiService, { ContentType } from "../BaseAPIService";
import { BackendError } from "@/Services/errorHandlingService";

export type GetInvitationsParams = {
  Cookie: string;
};

export default class ListInvitationsApi extends BaseApiService {
  private static instance: ListInvitationsApi;
  private readonly baseUrl = this.backEndUrl;

  private constructor() {
    super();
  }
  public static getInstance(): ListInvitationsApi {
    if (!this.instance) {
      this.instance = new ListInvitationsApi();
    }
    return this.instance;
  }

  public async getInvitations(
    status: string | string[] | undefined,
    params: GetInvitationsParams
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/get-user-invitations/${status}`)
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

  public async handleInvitationStatus(
    listId: string,
    invitationId: string,
    status: number,
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl
        .concat("/lists")
        .concat(`/handle-list-invitation-status/${invitationId}`)
    );
    try {
      return await this.postRequest<any>(
        url,
        { listId, status, invitationId },
        {
          Cookie: params.Cookie,
        }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }
}
