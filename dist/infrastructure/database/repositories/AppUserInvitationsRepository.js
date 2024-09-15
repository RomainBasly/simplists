"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUserInvitationsRepository = void 0;
const tsyringe_1 = require("tsyringe");
const supabaseConfig_1 = __importDefault(require("../supabaseConfig"));
let AppUserInvitationsRepository = class AppUserInvitationsRepository {
    constructor() { }
    async inviteUsersToList(invitedEmailAddresses, listId, creatorId) {
        const email_list = invitedEmailAddresses.join(',');
        try {
            const { data, error } = await supabaseConfig_1.default.rpc('add_people_to_list_invitations', {
                emails_text: email_list,
                list_id: listId,
                creator_id: creatorId,
            });
            if (error) {
                throw new Error('Problem adding elements inside the list invitation');
            }
            return data && data.length > 0 ? data[0] : null;
        }
        catch (error) {
            throw new Error('Problem adding elements inside the list invitation, in the catch');
        }
    }
    async addUserToListAsBeneficiary(listId, userId) {
        try {
            const { data } = await supabaseConfig_1.default
                .from('app-list-beneficiaries')
                .insert([{ 'user-id': userId, 'app-list-id': listId }])
                .select();
            return data;
        }
        catch (error) {
            throw new Error('error adding single list beneficiary');
        }
    }
    async getPeopleToInviteByListId(listId) {
        try {
            const { data, error } = await supabaseConfig_1.default
                .from('app-list-invitations')
                .select('id, email, list_id, is_already_active_user, is_already_invited, user_id')
                .eq('list_id', listId)
                .eq('is_already_invited', false);
            if (error)
                throw new Error('error getting people invited in the list');
            return data;
        }
        catch (error) {
            throw new Error('error getting people invited (catch)');
        }
    }
    async getListInvitationPerUser(userId, status) {
        try {
            let { data } = await supabaseConfig_1.default
                .from('app-list-invitations')
                .select(`id, list_id, user_id, status, app-lists:list_id ( listName, description, thematic ), app-users:creator_id ( email, userName )`)
                .eq('user_id', userId)
                .eq('status', status)
                .order('created_at', { ascending: false });
            return data;
        }
        catch (error) {
            throw new Error('error getting people invitations');
        }
    }
    async changeInvitationStatus(invitationId, userId, listId, status) {
        try {
            const { data } = await supabaseConfig_1.default.rpc('handle_list_invitation', {
                invitation_id: invitationId,
                user_id: userId,
                app_list_id: listId,
                invitation_status: status,
            });
            return data;
        }
        catch (error) {
            throw new Error('error changing the status of the invitation');
        }
    }
    async checkIfUserIsAlreadyBeneficiary(userId, listId) {
        try {
            const { data } = await supabaseConfig_1.default
                .from('app-list-beneficiaries')
                .select('*')
                .eq('user-id', userId)
                .eq('app-list-id', listId);
            return data;
        }
        catch (error) {
            throw new Error('error changing the status of the invitation');
        }
    }
    async getInvitationsByUserEmail(email) {
        try {
            const { data } = await supabaseConfig_1.default.from('app-list-invitations').select('id').eq('email', email);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async updateExistingInvitationForNewUsers(invitation, user_id) {
        try {
            const { data } = await supabaseConfig_1.default.from('app-list-invitations').update({ user_id }).eq('id', invitation.id);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppUserInvitationsRepository = AppUserInvitationsRepository;
exports.AppUserInvitationsRepository = AppUserInvitationsRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], AppUserInvitationsRepository);
