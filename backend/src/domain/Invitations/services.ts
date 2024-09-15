import { delay, inject, injectable } from 'tsyringe';
import { WebSocketClientService } from '../../infrastructure/webSockets/services';
import { ReturnedInvitedUsers } from '../ListManagement/types';
import { UUID } from 'crypto';
import { AppUserInvitationsRepository } from '../../infrastructure/database/repositories/AppUserInvitationsRepository';
import AppUserService from '../../domain/user/index';

@injectable()
export default class UserInvitationsService {
  public constructor(
    @inject(delay(() => WebSocketClientService)) private readonly webSocketService: WebSocketClientService,
    @inject(AppUserInvitationsRepository) private readonly appUserInvitationsRepository: AppUserInvitationsRepository,
    @inject(AppUserService) private readonly appUserService: AppUserService
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
    invitedUsers.map((invitation) => {
      if (invitation.is_already_active_user) {
        try {
          //userId : userId to invite
          this.webSocketService.emit('list-invitation-backend', {
            id: invitation.id,
            userId: invitation.user_id,
            status: 1,
            listId,
            creatorEmail,
            creatorUserName,
            listName,
            thematic,
            listDescription,
          });
        } catch (error) {
          throw new Error(`message: ${error}`);
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
