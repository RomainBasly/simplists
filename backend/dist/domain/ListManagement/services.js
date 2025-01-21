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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListManagementService = void 0;
const tsyringe_1 = require("tsyringe");
const AppListManagementRepository_1 = require("../../infrastructure/database/repositories/AppListManagementRepository");
const services_1 = __importDefault(require("../Invitations/services"));
const AppUserInvitationsRepository_1 = require("../../infrastructure/database/repositories/AppUserInvitationsRepository");
const validation_1 = require("./validation");
const services_2 = require("../../infrastructure/webSockets/services");
const errors_1 = require("../common/errors");
const services_3 = require("../../infrastructure/gcp-pubsub/services");
const user_1 = __importDefault(require("../user"));
const services_4 = require("../NotificationsManagement/services");
let ListManagementService = class ListManagementService {
    constructor(webSocketService, redisPubSubService, appListManagementRepository, userInvitationsService, appUserInvitationsRepository, listValidatorService, appUserService, appNotificationsService) {
        this.webSocketService = webSocketService;
        this.redisPubSubService = redisPubSubService;
        this.appListManagementRepository = appListManagementRepository;
        this.userInvitationsService = userInvitationsService;
        this.appUserInvitationsRepository = appUserInvitationsRepository;
        this.listValidatorService = listValidatorService;
        this.appUserService = appUserService;
        this.appNotificationsService = appNotificationsService;
        this.createNotificationContent = (beneficiaries, url, type, content, creator_id) => {
            const notifications = beneficiaries.map((beneficiary) => {
                const element = {
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
    async createList(inputs, creatorUserName, creatorEmail) {
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
            if (dataListCreation === null || dataListCreation === void 0 ? void 0 : dataListCreation.id) {
                await this.appUserInvitationsRepository.addUserToListAsBeneficiary(dataListCreation.id, inputs.creatorId);
            }
            const validatedEmailAddresses = await this.listValidatorService.validateEmails(emails);
            if (validatedEmailAddresses.length > 0) {
                await this.userInvitationsService.addPeopleToListInvitations(validatedEmailAddresses, dataListCreation.id, inputs.creatorId, creatorEmail, creatorUserName, name, thematic, description);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async suppressListByListId(listId, userId) {
        try {
            const canUserSuppressList = await this.appListManagementRepository.isUserAllowedToSuppressList(listId, userId);
            if (!canUserSuppressList) {
                throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
            }
            await this.appListManagementRepository.deleteListBy(listId);
        }
        catch (error) {
            throw error;
        }
    }
    async getListBeneficiariesById(userId) {
        try {
            const beneficiaries = await this.appListManagementRepository.getListsByUserId(userId);
            if (!beneficiaries) {
                console.error('No beneficiaries or no list', beneficiaries);
                return [];
            }
            const filteredBeneficiaries = beneficiaries.map((element) => {
                if ((element === null || element === void 0 ? void 0 : element['app-lists']) && Array.isArray(element['app-lists'].beneficiaries)) {
                    return Object.assign(Object.assign({}, element), { 'app-lists': Object.assign(Object.assign({}, element['app-lists']), { beneficiaries: element['app-lists'].beneficiaries.filter((beneficiary) => beneficiary['app-users'].user_id !== userId) }) });
                }
                else {
                    console.error('Unexpected element structure', element);
                    return element;
                }
            });
            return filteredBeneficiaries;
        }
        catch (error) {
            console.error('Error fetching list beneficiaries', error);
            throw error;
        }
    }
    async getListByListIdWithItems(listId, userId) {
        try {
            const list = await this.appListManagementRepository.getListByIdWithItems(listId, userId);
            if (!list) {
                console.error('Unexpected list structure', list);
                return [];
            }
            const filteredBeneficiariesList = list.map((element) => {
                if ((element === null || element === void 0 ? void 0 : element['app-lists']) && Array.isArray(element['app-lists'].beneficiaries)) {
                    return Object.assign(Object.assign({}, element), { 'app-lists': Object.assign(Object.assign({}, element['app-lists']), { beneficiaries: element['app-lists'].beneficiaries.filter((beneficiary) => beneficiary['app-users'].user_id !== userId) }) });
                }
                else {
                    console.error('Unexpected element structure', element);
                    return element; // or handle accordingly
                }
            });
            return filteredBeneficiariesList;
        }
        catch (error) {
            throw error;
        }
    }
    async getListByListIdWithoutItems(listId, userId) {
        try {
            const list = await this.appListManagementRepository.getListByIdWithoutItems(listId);
            const filteredBeneficiaries = list === null || list === void 0 ? void 0 : list.map((element) => {
                const listName = element.listName;
                const thematic = element.thematic;
                const description = element.description;
                const access_level = element.access_level;
                const beneficiaries = element.beneficiaries;
                const invitedEmails = element.invited.filter((invitedPerson) => {
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
        }
        catch (error) {
            throw error;
        }
    }
    async addItemToList(listName, listId, userId, content, beneficiaries) {
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
            const notificationBody = `${creator === null || creator === void 0 ? void 0 : creator.userName} a ajouté ${content} à la liste ${listName}`;
            const url = `https://www.simplists.net/lists/user-list/${listId}`;
            const pushNotificationPayload = JSON.stringify({
                title: "Ajout d'un nouvel item",
                body: notificationBody,
                icon: '/images/logos/logo-48x48.png',
                url,
            });
            await this.appNotificationsService.sendMultiplePushNotifications(beneficiaries, pushNotificationPayload);
            const notifications = this.createNotificationContent(beneficiaries, url, 'addition', notificationBody, creator === null || creator === void 0 ? void 0 : creator.user_id);
            await this.appNotificationsService.createNotificationsInDB(notifications);
            return item;
        }
        catch (error) {
            throw error;
        }
    }
    async suppressElementById(listName, item, listId, userId, itemId, beneficiaries) {
        try {
            const response = await this.appListManagementRepository.suppressItemById(listId, itemId);
            const creator = await this.appUserService.getUserByUserId(userId);
            const itemForPubSub = { id: itemId };
            const notificationBody = `${creator === null || creator === void 0 ? void 0 : creator.userName} a supprimé ${item} de la liste ${listName}`;
            const url = `https://www.simplists.net/lists/user-list/${listId}`;
            const notifications = this.createNotificationContent(beneficiaries, url, 'suppression', notificationBody, creator === null || creator === void 0 ? void 0 : creator.user_id);
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
        }
        catch (error) {
            throw error;
        }
    }
    async changeItemStatus(listName, listId, userId, elementId, element, status, beneficiaries) {
        try {
            const item = await this.appListManagementRepository.changeItemStatus(listId, elementId, status);
            const creator = await this.appUserService.getUserByUserId(userId);
            const notificationBody = status === false
                ? `${creator === null || creator === void 0 ? void 0 : creator.userName} a barré ${element} de la liste ${listName}`
                : `${creator === null || creator === void 0 ? void 0 : creator.userName} a ajouté ${element} à la liste ${listName}`;
            const url = `https://www.simplists.net/lists/user-list/${listId}`;
            const notifications = this.createNotificationContent(beneficiaries, url, 'suppression', notificationBody, creator === null || creator === void 0 ? void 0 : creator.user_id);
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
        }
        catch (error) {
            throw error;
        }
    }
    async updateItemContent(listId, userId, elementId, content, beneficiaries) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async updateListByListId(listId, updatedCoreData, updatedEmails, userId) {
        try {
            await this.listValidatorService.verifyUpdatedCoreListSettings(updatedCoreData);
            await this.listValidatorService.verifyUpdatedEmailsSettings(updatedEmails);
            const response = await this.appListManagementRepository.updateList(listId, updatedCoreData, updatedEmails, userId);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.ListManagementService = ListManagementService;
exports.ListManagementService = ListManagementService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)((0, tsyringe_1.delay)(() => services_2.WebSocketClientService))),
    __param(1, (0, tsyringe_1.inject)((0, tsyringe_1.delay)(() => services_3.RedisPubSubService))),
    __param(2, (0, tsyringe_1.inject)(AppListManagementRepository_1.AppListManagementRepository)),
    __param(3, (0, tsyringe_1.inject)(services_1.default)),
    __param(4, (0, tsyringe_1.inject)(AppUserInvitationsRepository_1.AppUserInvitationsRepository)),
    __param(5, (0, tsyringe_1.inject)(validation_1.ListValidatorService)),
    __param(6, (0, tsyringe_1.inject)(user_1.default)),
    __param(7, (0, tsyringe_1.inject)(services_4.AppNotificationsService)),
    __metadata("design:paramtypes", [services_2.WebSocketClientService,
        services_3.RedisPubSubService,
        AppListManagementRepository_1.AppListManagementRepository,
        services_1.default,
        AppUserInvitationsRepository_1.AppUserInvitationsRepository,
        validation_1.ListValidatorService,
        user_1.default,
        services_4.AppNotificationsService])
], ListManagementService);
