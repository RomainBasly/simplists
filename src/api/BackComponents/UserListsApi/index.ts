import assert from "assert";
import BaseApiService, { ContentType } from "../BaseAPIService";
import { BackendError } from "@/Services/errorHandlingService";
import { IBeneficiary } from "@/components/Materials/UserLists/ListPage";

export type Cookie = {
  Cookie: string;
};

export type IUpdatedData = {
  id: string;
  listName?: string;
  thematic?: string;
  accessLevel?: string;
  description?: string;
  cyphered?: boolean;
};

export type IUpdatedEmails = {
  invitedEmails?: string[];
  beneficiaryEmails?: string[];
};

export default class ListsApi extends BaseApiService {
  private static instance: ListsApi;
  private readonly baseUrl = this.backEndUrl;

  private constructor() {
    super();
  }
  public static getInstance(): ListsApi {
    if (!this.instance) {
      this.instance = new ListsApi();
    }
    return this.instance;
  }

  public async getListsByUser(params: Cookie) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/get-user-lists`)
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

  public async getListItemsByListId(
    listId: string | string[] | undefined,
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/get-list/${listId}`)
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

  public async addItemToList(
    listId: string | string[] | undefined,
    content: string,
    beneficiaries: IBeneficiary[],
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/add-item-to-list/`)
    );

    try {
      return await this.postRequest<any>(
        url,
        { listId, content, beneficiaries },
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

  public async suppressItem(
    listId: string | string[] | undefined,
    elementId: string | string[] | undefined,
    beneficiaries: IBeneficiary[],
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/suppress-item/`)
    );

    try {
      return await this.postRequest<any>(
        url,
        { listId, elementId, beneficiaries },
        { Cookie: params.Cookie }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async suppressList(
    listId: string | string[] | undefined,
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/suppress-list/${listId}`)
    );

    try {
      return await this.deleteRequest<any>(
        url,
        { Cookie: params.Cookie }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async handleItemStatusChange(
    listId: string | string[] | undefined,
    elementId: string | string[] | undefined,
    status: boolean,
    beneficiaries: IBeneficiary[],
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/change-item-status/`)
    );

    try {
      return await this.postRequest<any>(
        url,
        { listId, elementId, status, beneficiaries },
        { Cookie: params.Cookie }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }
  public async handleItemContentChange(
    listId: string | string[] | undefined,
    elementId: string | string[] | undefined,
    contentUpdated: string,
    beneficiaries: IBeneficiary[],
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(
      this.baseUrl.concat("/lists").concat(`/update-list-content/`)
    );

    try {
      return await this.postRequest<any>(
        url,
        { listId, elementId, content: contentUpdated, beneficiaries },
        { Cookie: params.Cookie }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async createList(
    listName: string,
    invitedEmails: string[],
    thematic: string,
    accessLevel: string,
    description: string,
    cyphered: boolean,
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");
    const url = new URL(this.baseUrl.concat("/lists").concat(`/create-list/`));

    try {
      return await this.postRequest<any>(
        url,
        {
          listName,
          emails: invitedEmails,
          thematic,
          accessLevel,
          description,
          cyphered,
        },
        { Cookie: params.Cookie }
      );
    } catch (error) {
      if (error instanceof Response) {
        const errorBody: BackendError = await error.json();
        throw errorBody;
      }
      throw error;
    }
  }

  public async getListDefinitionByListId(
    listId: string | string[] | undefined,
    params: any
  ) {
    assert(this.baseUrl, "Backend URL is missing");

    try {
      const url = new URL(
        this.baseUrl.concat("/lists").concat(`/get-list-definition/${listId}`)
      );
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

  public async updateListSettings(
    id: string,
    updatedCoreData: IUpdatedData,
    updatedEmails: IUpdatedEmails,
    params: any
  ) {
    const listId = id;
    try {
      const url = new URL(
        this.baseUrl
          .concat("/lists")
          .concat(`/update-list-definition/${listId}`)
      );
      return await this.postRequest<any>(
        url,
        {
          updatedCoreData,
          updatedEmails,
        },
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
