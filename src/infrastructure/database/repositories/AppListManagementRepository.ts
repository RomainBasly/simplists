import { injectable } from 'tsyringe';
import supabase from '../supabaseConfig';
import { IInputAppList, SupabaseReturnedList } from '../../../domain/ListManagement/types';
import { UUID } from 'crypto';

@injectable()
export class AppListManagementRepository {
  public constructor() {}

  public async createList(inputsAppList: IInputAppList): Promise<SupabaseReturnedList> {
    const { data, error } = await supabase.from('app-lists').insert(inputsAppList).select();

    if (error) {
      throw new Error('Problem creating the list');
    }
    return data && data.length > 0 ? data[0] : null;
  }

  public async getListsByUserId(userId: number) {
    const { data, error } = await supabase
      .from('app-list-beneficiaries')
      .select(
        `
        app-lists:app-list-id (
          id,
          listName,
          description,
          thematic,
          beneficiaries:app-list-beneficiaries (
            app-users:user-id (
              user_id,
              userName
            )
          )
        )
      `
      )
      .eq('user-id', userId);

    if (error) {
      throw new Error('Problem getting the lists');
    }
    return data && data.length > 0 ? data : null;
  }

  public async getListByIdWithItems(listId: UUID, userId: number) {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .select(
          `
          app-lists:app-list-id (
            id,
            listName,
            description,
            thematic,
            beneficiaries:app-list-beneficiaries (
              app-users:user-id (
                user_id,
                userName
              )
            ),
            items:app-list-items (
              id,
              updated_at,
              content,
              statusOpen
            )
          )
        `
        )
        .eq('user-id', userId)
        .eq('app-list-id', listId);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getListByIdWithoutItems(listId: UUID) {
    try {
      const { data } = await supabase
        .from('app-lists')
        .select(
          `
          id,
          listName,
          description,
          thematic,
          access_level,
          beneficiaries:app-list-beneficiaries (
            app-users:user-id (
		          email
            )	
		      ), 
          invited:app-list-invitations (
            email, 
		        status
          )
        `
        )
        .eq('id', listId);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addItemToList(listId: UUID, content: string) {
    try {
      const { data } = await supabase
        .from('app-list-items')
        .insert([{ content, statusOpen: true, list_id: listId }])
        .select('id, updated_at, content,statusOpen');
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async isUserAllowedToChangeList(listId: UUID, userId: number): Promise<any> {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .select('*')
        .eq('user-id', userId)
        .eq('app-list-id', listId);
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async suppressItemById(listId: UUID, elementId: string) {
    try {
      return await supabase.from('app-list-items').delete().eq('id', elementId).eq('list_id', listId);
    } catch (error) {
      throw error;
    }
  }

  public async changeItemStatus(listId: UUID, elementId: string, status: boolean) {
    try {
      const currentTimestamp = new Date().toISOString();
      const { data } = await supabase
        .from('app-list-items')
        .update({ statusOpen: status, updated_at: currentTimestamp })
        .eq('id', elementId)
        .eq('list_id', listId)
        .select();

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async updateItemContent(listId: UUID, elementId: string, content: string) {
    try {
      const currentTimestamp = new Date().toISOString();
      const { data } = await supabase
        .from('app-list-items')
        .update({ content, updated_at: currentTimestamp, statusOpen: true })
        .eq('id', elementId)
        .eq('list_id', listId)
        .select('id, updated_at, content, statusOpen');
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async updateList(listId: UUID, updatedCoreData: any, updatedEmails: any, userId: number): Promise<boolean> {
    try {
      const { description, thematic, access_level, listName } = updatedCoreData;
      const { removedBeneficiariesEmails = [] } = updatedEmails.beneficiaryEmails || {};
      const { invitedEmailsAdded = [], removedInvitedEmails = [] } = updatedEmails.invitedEmails || {};

      const { data } = await supabase.rpc('update_list_and_emails', {
        p_list_id: listId,
        new_list_name: listName || null,
        new_description: description || null,
        new_thematic: thematic || null,
        new_access_level: access_level || null,
        removed_beneficiaries: removedBeneficiariesEmails || '[]',
        added_invited_emails: invitedEmailsAdded || '[]',
        removed_invited_emails: removedInvitedEmails || '[]',
        creator_id: userId,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async isUserAllowedToSuppressList(listId: UUID, userId: number) {
    try {
      const { data } = await supabase
        .from('app-list-beneficiaries')
        .select('*')
        .eq('app-list-id', listId)
        .eq('user-id', userId);
      if (data && data.length > 0) return true;
      return false;
    } catch (error) {
      throw error;
    }
  }

  public async deleteListBy(listId: UUID) {
    try {
      const { data } = await supabase.from('app-lists').delete().eq('id', listId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
