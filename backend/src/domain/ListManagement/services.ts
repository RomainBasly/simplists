import { injectable, inject, delay } from 'tsyringe';
import { IBeneficiary, List } from './types';
import { AppListManagementRepository } from '../../infrastructure/database/repositories/AppListManagementRepository';
import UserInvitationsService from '../Invitations/services';
import { AppUserInvitationsRepository } from '../../infrastructure/database/repositories/AppUserInvitationsRepository';
import { ListValidatorService } from './validation';
import { UUID } from 'crypto';
import { WebSocketClientService } from '../../infrastructure/webSockets/services';
import { ErrorMessages, ForbiddenError } from '../common/errors';
import { RedisPubSubService } from '../../infrastructure/gcp-pubsub/services';
import AppUserService from '../user';
import { AppNotificationsService } from '../NotificationsManagement/services';
import { INotificationElement } from '../NotificationsManagement/types';

type User = {
  user_id: number;
  userName: string;
};

type Beneficiary = {
  'app-users': User;
};

type ListType = {
  id: string;
  listName: string;
  thematic: string;
  description: string;
  beneficiaries: Beneficiary[];
};

type IElementType = {
  'app-lists': ListType;
};

export type IUpdatedCoreData = {
  thematic?: string;
  listName?: string;
  description?: string;
  access_level?: string;
};

export type IUpdatedEmails = {
  beneficiaryEmails: {
    removedBeneficiaries: string[];
  };
  invitedEmails: {
    addedEmails: string[];
    removedEmails: string[];
  };
};

@injectable()
export class ListManagementService {
  public constructor(
    @inject(delay(() => WebSocketClientService)) private readonly webSocketService: WebSocketClientService,
    @inject(delay(() => RedisPubSubService)) private readonly redisPubSubService: RedisPubSubService,
    @inject(AppListManagementRepository) private readonly appListManagementRepository: AppListManagementRepository,
    @inject(UserInvitationsService) private readonly userInvitationsService: UserInvitationsService,
    @inject(AppUserInvitationsRepository) private readonly appUserInvitationsRepository: AppUserInvitationsRepository,
    @inject(ListValidatorService) private readonly listValidatorService: ListValidatorService,
    @inject(AppUserService) private readonly appUserService: AppUserService,
    @inject(AppNotificationsService) private readonly appNotificationsService: AppNotificationsService
  ) {}

  public async createList(inputs: List, creatorUserName: string, creatorEmail: string) {
    try {
      const { emails, description, name, thematic } = inputs;
      const createListInputForListCreation = {
        listName: inputs.name,
        access_level: inputs.accessLevel,
        description: inputs.description,
        cyphered: false,
        thematic: inputs.thematic,
      };

      const dataListCreation = await this.appListManagementRepository.createList(createListInputForListCreation);
      if (dataListCreation?.id) {
        await this.appUserInvitationsRepository.addUserToListAsBeneficiary(dataListCreation.id, inputs.creatorId);
      }

      const validatedEmailAddresses = await this.listValidatorService.validateEmails(emails);
      if (validatedEmailAddresses.length > 0) {
        await this.userInvitationsService.addPeopleToListInvitations(
          validatedEmailAddresses,
          dataListCreation.id,
          inputs.creatorId,
          creatorEmail,
          creatorUserName,
          name,
          thematic,
          description
        );
      }
    } catch (error) {
      throw error;
    }
  }

  public async suppressListByListId(listId: UUID, userId: number) {
    try {
      const canUserSuppressList = await this.appListManagementRepository.isUserAllowedToSuppressList(listId, userId);
      if (!canUserSuppressList) {
        throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
      }
      await this.appListManagementRepository.deleteListBy(listId);
    } catch (error) {
      throw error;
    }
  }

  public async getListBeneficiariesById(userId: number): Promise<IElementType[]> {
    try {
      const beneficiaries = await this.appListManagementRepository.getListsByUserId(userId);

      if (!beneficiaries) {
        console.error('No beneficiaries or no list', beneficiaries);
        return [];
      }

      const filteredBeneficiaries = beneficiaries.map((element: any) => {
        if (element?.['app-lists'] && Array.isArray(element['app-lists'].beneficiaries)) {
          return {
            ...element,
            'app-lists': {
              ...element['app-lists'],
              beneficiaries: element['app-lists'].beneficiaries.filter(
                (beneficiary: { [x: string]: { user_id: number } }) => beneficiary['app-users'].user_id !== userId
              ),
            },
          };
        } else {
          console.error('Unexpected element structure', element);
          return element;
        }
      });

      return filteredBeneficiaries;
    } catch (error) {
      console.error('Error fetching list beneficiaries', error);
      throw error;
    }
  }

  public async getListByListIdWithItems(listId: UUID, userId: number) {
    try {
      const list = await this.appListManagementRepository.getListByIdWithItems(listId, userId);

      if (!list) {
        console.error('Unexpected list structure', list);
        return [];
      }

      const filteredBeneficiariesList = list.map((element: any) => {
        if (element?.['app-lists'] && Array.isArray(element['app-lists'].beneficiaries)) {
          return {
            ...element,
            'app-lists': {
              ...element['app-lists'],
              beneficiaries: element['app-lists'].beneficiaries.filter(
                (beneficiary: { [x: string]: { user_id: number } }) => beneficiary['app-users'].user_id !== userId
              ),
            },
          };
        } else {
          console.error('Unexpected element structure', element);
          return element; // or handle accordingly
        }
      });
      return filteredBeneficiariesList;
    } catch (error) {
      throw error;
    }
  }
  public async getListByListIdWithoutItems(listId: UUID, userId: number) {
    try {
      const list = await this.appListManagementRepository.getListByIdWithoutItems(listId);
      const filteredBeneficiaries = list?.map((element: any) => {
        const listName = element.listName;
        const thematic = element.thematic;
        const description = element.description;
        const access_level = element.access_level;
        const beneficiaries = element.beneficiaries;
        const invitedEmails = element.invited.filter((invitedPerson: { email: string; status: number }) => {
          return invitedPerson.status === 1;
        });
        return {
          listName,
          thematic,
          description,
          access_level,
          beneficiaries,
          invitedEmails,
        };
      });
      return filteredBeneficiaries;
    } catch (error) {
      throw error;
    }
  }

  public async addItemToList(
    listName: string,
    listId: UUID,
    userId: number,
    content: string,
    beneficiaries: IBeneficiary[]
  ) {
    try {
      const inputs = { listId, userId, content };
      await this.listValidatorService.verifyInputAddOrUpdateItem(inputs);
      const item = await this.appListManagementRepository.addItemToList(listId, content);
      const creator = await this.appUserService.getUserByUserId(userId);
      this.redisPubSubService.publishEvent('add_item', {
        action: 'add_item',
        item,
        beneficiaries,
        userName: creator,
      });

      const notificationBody = `${creator?.userName} a ajouté ${content} à la liste ${listName}`;
      const url = `https://www.simplists.net/lists/user-list/${listId}`;

      const pushNotificationPayload = JSON.stringify({
        title: "Ajout d'un nouvel item",
        body: notificationBody,
        icon: '/images/logos/logo-48x48.png',
        url,
      });
      await this.appNotificationsService.sendMultiplePushNotifications(beneficiaries, pushNotificationPayload);

      const notifications = this.createNotificationContent(
        beneficiaries,
        url,
        'addition',
        notificationBody,
        creator?.user_id
      );

      await this.appNotificationsService.createNotificationsInDB(notifications);
      return item;
    } catch (error) {
      throw error;
    }
  }
  public async suppressElementById(
    listName: string,
    item: string,
    listId: UUID,
    userId: number,
    itemId: string,
    beneficiaries: IBeneficiary[]
  ) {
    try {
      const response = await this.appListManagementRepository.suppressItemById(listId, itemId);
      const creator = await this.appUserService.getUserByUserId(userId);
      const itemForPubSub = { id: itemId };

      const notificationBody = `${creator?.userName} a supprimé ${item} de la liste ${listName}`;
      const url = `https://www.simplists.net/lists/user-list/${listId}`;

      const notifications = this.createNotificationContent(
        beneficiaries,
        url,
        'suppression',
        notificationBody,
        creator?.user_id
      );

      this.redisPubSubService.publishEvent('delete_item', {
        action: 'delete_item',
        item: itemForPubSub,
        beneficiaries,
        userName: creator,
      });

      const pushNotificationPayload = JSON.stringify({
        title: "Suppression d'un item",
        body: notificationBody,
        icon: '/images/logos/logo-48x48.png',
        url,
      });
      await this.appNotificationsService.sendMultiplePushNotifications(beneficiaries, pushNotificationPayload);
      await this.appNotificationsService.createNotificationsInDB(notifications);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async changeItemStatus(
    listName: string,
    listId: UUID,
    userId: number,
    elementId: string,
    element: string,
    status: boolean,
    beneficiaries: IBeneficiary[]
  ) {
    try {
      const item = await this.appListManagementRepository.changeItemStatus(listId, elementId, status);

      const creator = await this.appUserService.getUserByUserId(userId);

      const notificationBody =
        status === false
          ? `${creator?.userName} a barré ${element} de la liste ${listName}`
          : `${creator?.userName} a ajouté ${element} à la liste ${listName}`;

      const url = `https://www.simplists.net/lists/user-list/${listId}`;

      const notifications = this.createNotificationContent(
        beneficiaries,
        url,
        'suppression',
        notificationBody,
        creator?.user_id
      );
      this.redisPubSubService.publishEvent('change_item_status', {
        action: 'change_item_status',
        item,
        beneficiaries,
        userName: creator,
      });

      const pushNotificationPayload = JSON.stringify({
        title: status === false ? 'Un item a été barré' : 'Un item a été ajouté',
        body: notificationBody,
        icon: '/images/logos/logo-48x48.png',
        url: `https://www.simplists.net/lists/user-list/${listId}`,
      });

      await this.appNotificationsService.sendMultiplePushNotifications(beneficiaries, pushNotificationPayload);
      await this.appNotificationsService.createNotificationsInDB(notifications);
      return item;
    } catch (error) {
      throw error;
    }
  }

  public async updateItemContent(
    listId: UUID,
    userId: number,
    elementId: string,
    content: string,
    beneficiaries: IBeneficiary[]
  ) {
    try {
      const inputs = { listId, userId, content };
      await this.listValidatorService.verifyInputAddOrUpdateItem(inputs);
      const item = await this.appListManagementRepository.updateItemContent(listId, elementId, content);
      const userName = await this.appUserService.getUserByUserId(userId);
      this.redisPubSubService.publishEvent('update_item_content', {
        action: 'update_item_content',
        item,
        beneficiaries,
        userName,
      });
      return item;
    } catch (error) {
      throw error;
    }
  }

  public async updateListByListId(
    listId: UUID,
    updatedCoreData: IUpdatedCoreData,
    updatedEmails: IUpdatedEmails,
    userId: number
  ) {
    try {
      await this.listValidatorService.verifyUpdatedCoreListSettings(updatedCoreData);
      await this.listValidatorService.verifyUpdatedEmailsSettings(updatedEmails);
      const response = await this.appListManagementRepository.updateList(
        listId,
        updatedCoreData,
        updatedEmails,
        userId
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  private readonly createNotificationContent = (
    beneficiaries: IBeneficiary[],
    url: string,
    type: string,
    content: string,
    creator_id?: number
  ) => {
    const notifications = beneficiaries.map((beneficiary: IBeneficiary) => {
      const element: INotificationElement = {
        url,
        content,
        isNew: true,
        type,
        creator_id,
        recipient_id: beneficiary['app-users'].user_id,
      };
      return element;
    });

    return notifications;
  };
}
