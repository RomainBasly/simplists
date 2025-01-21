import { delay, inject, injectable } from 'tsyringe';
import { WebSocketClientService } from '../../infrastructure/webSockets/services';
import { ReturnedInvitedUsers } from '../ListManagement/types';
import { UUID } from 'crypto';
import { AppUserInvitationsRepository } from '../../infrastructure/database/repositories/AppUserInvitationsRepository';
import AppUserService from '../../domain/user/index';
import { RedisPubSubService } from '../../infrastructure/gcp-pubsub/services';
import { AppNotificationsService } from '../NotificationsManagement/services';

@injectable()
export default class UserInvitationsService {
  public constructor(
    @inject(delay(() => WebSocketClientService)) private readonly webSocketService: WebSocketClientService,
    @inject(delay(() => RedisPubSubService)) private readonly redisPubSubService: RedisPubSubService,
    @inject(AppUserInvitationsRepository) private readonly appUserInvitationsRepository: AppUserInvitationsRepository,
    @inject(AppUserService) private readonly appUserService: AppUserService,
    @inject(AppNotificationsService) private readonly appNotificationsService: AppNotificationsService
  ) {}

  public async addPeopleToListInvitations(
    invitedEmailAddresses: string[],
    listId: UUID,
    creatorId: number,
    creatorEmail: string,
    creatorUserName: string,
    listName: string,
    thematic: string,
    listDescription?: string
  ): Promise<void> {
    await this.appUserInvitationsRepository.inviteUsersToList(invitedEmailAddresses, listId, creatorId);
    const getPeopleToInvite = await this.appUserInvitationsRepository.getPeopleToInviteByListId(listId);
    await this.invitePeople(
      getPeopleToInvite,
      listId,
      creatorEmail,
      creatorUserName,
      listName,
      thematic,
      listDescription
    );
  }

  public async fetchUserInvitations(userId: string, status: number) {
    try {
      const data = await this.appUserInvitationsRepository.getListInvitationPerUser(userId, status);
      return data;
    } catch (error) {
      throw error;
    }
  }

  private async invitePeople(
    invitedUsers: ReturnedInvitedUsers[],
    listId: UUID,
    creatorEmail: string,
    creatorUserName: string,
    listName: string,
    thematic: string,
    listDescription?: string
  ) {
    // TODO: refacto to have one only transaction
    invitedUsers.forEach(async (invitation) => {
      if (invitation.is_already_active_user) {
        try {
          const redisPayload = {
            id: invitation.id,
            userId: invitation.user_id,
            status: 1,
            listId,
            creatorEmail,
            creatorUserName,
            listName,
            thematic,
            listDescription,
          };
          await this.redisPubSubService.publishEvent('list_creation', {
            action: 'list_creation',
            payload: redisPayload,
            userName: creatorUserName,
            beneficiaries: [
              {
                'app-users': {
                  user_id: invitation.user_id,
                },
              },
            ],
          });
          //userId : userId to invite
        } catch (error) {
          throw new Error(`message: ${error}`);
        }

        try {
          const payload = JSON.stringify({
            title: 'Vous avez été invité(e) à une nouvelle liste',
            body: `${creatorUserName} vous a invité à la liste ${listName}`,
            icon: '/images/logos/logo-48x48.png',
            url: `https://www.simplists.net/invitations`,
          });
          const beneficiary = {
            user_id: invitation.user_id ?? '',
          };

          await this.appNotificationsService.sendSinglePushNotification(beneficiary, payload);
        } catch (error) {
          throw error;
        }
      } else {
        // Todo : case 2 : send an email to those not registered in the app
      }
    });
  }

  public async changeInvitationStatus(invitationId: number, userId: number, listId: UUID, status: number) {
    try {
      const isAlreadyUser = await this.appUserInvitationsRepository.checkIfUserIsAlreadyBeneficiary(userId, listId);
      if (isAlreadyUser && isAlreadyUser.length > 0) {
        console.log(`User ${userId} is already a beneficiary of list ${listId}`);
        return;
      }
      const response = await this.appUserInvitationsRepository.changeInvitationStatus(
        invitationId,
        userId,
        listId,
        status
      );
      // get all the users that are beneficiaries of the list
      const beneficiairies = await this.appUserInvitationsRepository.getBeneficiariesByListId(listId, userId);
      const user = await this.appUserService.getUserByUserId(userId);

      await this.redisPubSubService.publishEvent('list_invitation_status_change', {
        action: 'list_invitation_status_change',
        status,
        beneficiairies,
        userName: user,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async updateExistingInvitationsForNewUsers(email: string) {
    try {
      const invitations = await this.appUserInvitationsRepository.getInvitationsByUserEmail(email);
      const data = await this.appUserService.getUserByEmail(email);
      const userId = data.user_id;

      invitations?.map(async (invitation) => {
        await this.appUserInvitationsRepository.updateExistingInvitationForNewUsers(invitation, userId);
      });
    } catch (error) {
      throw error;
    }
  }
}
