import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { UUID } from 'crypto';
import { ReturnedInvitedUsers } from '../../../domain/ListManagement/types';

@injectable()
export class AppUserInvitationsRepository {
  public constructor() {}

  public async inviteUsersToList(invitedEmailAddresses: string[], listId: UUID, creatorId: number) {
    const email_list = invitedEmailAddresses.join(',');
    try {
      const { data, error } = await supabase.rpc('add_people_to_list_invitations', {
        emails_text: email_list,
        list_id: listId,
        creator_id: creatorId,
      });
      if (error) {
        throw new Error('Problem adding elements inside the list invitation');
      }
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      throw new Error('Problem adding elements inside the list invitation, in the catch');
    }
  }

  public async addUserToListAsBeneficiary(listId: UUID, userId: number) {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .insert([{ 'user-id': userId, 'app-list-id': listId }])
        .select();
      return data;
    } catch (error) {
      throw new Error('error adding single list beneficiary');
    }
  }

  public async getPeopleToInviteByListId(listId: UUID): Promise<ReturnedInvitedUsers[]> {
    try {
      const { data, error } = await supabase
        .from('app-list-invitations')
        .select('id, email, list_id, is_already_active_user, is_already_invited, user_id')
        .eq('list_id', listId)
        .eq('is_already_invited', false);
      if (error) throw new Error('error getting people invited in the list');
      return data;
    } catch (error) {
      throw new Error('error getting people invited (catch)');
    }
  }

  public async getListInvitationPerUser(userId: string, status: number) {
    try {
      let { data } = await supabase
        .from('app-list-invitations')
        .select(
          `id, list_id, user_id, status, app-lists:list_id ( listName, description, thematic ), app-users:creator_id ( email, userName )`
        )
        .eq('user_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false });
      return data;
    } catch (error) {
      throw new Error('error getting people invitations');
    }
  }

  public async changeInvitationStatus(invitationId: number, userId: number, listId: UUID, status: number) {
    try {
      const { data } = await supabase.rpc('handle_list_invitation', {
        invitation_id: invitationId,
        user_id: userId,
        app_list_id: listId,
        invitation_status: status,
      });
      return data;
    } catch (error) {
      throw new Error('error changing the status of the invitation');
    }
  }

  public async checkIfUserIsAlreadyBeneficiary(userId: number, listId: UUID) {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .select('*')
        .eq('user-id', userId)
        .eq('app-list-id', listId);

      return data;
    } catch (error) {
      throw new Error('error changing the status of the invitation');
    }
  }

  public async getInvitationsByUserEmail(email: string) {
    try {
      const { data } = await supabase.from('app-list-invitations').select('id').eq('email', email);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async updateExistingInvitationForNewUsers(invitation: { id: number }, user_id: number) {
    try {
      const { data } = await supabase.from('app-list-invitations').update({ user_id }).eq('id', invitation.id);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
