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
let ListManagementService = class ListManagementService {
    constructor(webSocketService, appListManagementRepository, userInvitationsService, appUserInvitationsRepository, listValidatorService) {
        this.webSocketService = webSocketService;
        this.appListManagementRepository = appListManagementRepository;
        this.userInvitationsService = userInvitationsService;
        this.appUserInvitationsRepository = appUserInvitationsRepository;
        this.listValidatorService = listValidatorService;
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
            if (dataListCreation && dataListCreation.id) {
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
                throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR); // send me an alarm and an error I can send back. Is it the responsability of the service? What does he do?
            }
            await this.appListManagementRepository.deleteListByListId(listId);
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
                if (element && element['app-lists'] && Array.isArray(element['app-lists'].beneficiaries)) {
                    return Object.assign(Object.assign({}, element), { 'app-lists': Object.assign(Object.assign({}, element['app-lists']), { beneficiaries: element['app-lists'].beneficiaries.filter((beneficiary) => beneficiary['app-users'].user_id !== userId) }) });
                }
                else {
                    console.error('Unexpected element structure', element);
                    return element; // or handle accordingly
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
                if (element && element['app-lists'] && Array.isArray(element['app-lists'].beneficiaries)) {
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
    async addItemToList(listId, userId, content, beneficiaries) {
        try {
            const inputs = { listId, userId, content };
            await this.listValidatorService.verifyInputAddOrUpdateItem(inputs);
            // const isAllowed = await this.appListManagementRepository.isUserAllowedToChangeList(listId, userId);
            // if (isAllowed.length > 0) {
            const addedItem = await this.appListManagementRepository.addItemToList(listId, content);
            this.webSocketService.emit('adding-item-to-list-backend', {
                addedItem,
                beneficiaries,
            });
            return addedItem;
            // }
        }
        catch (error) {
            throw error;
        }
    }
    async suppressElementById(listId, userId, elementId, beneficiaries) {
        try {
            const isAllowed = await this.appListManagementRepository.isUserAllowedToChangeList(listId, userId);
            // if (isAllowed.length > 0) {
            const response = await this.appListManagementRepository.suppressItemById(listId, elementId);
            this.webSocketService.emit('suppress-item-from-list-backend', {
                elementId,
                beneficiaries,
            });
            return response;
            // }
        }
        catch (error) {
            throw error;
        }
    }
    async changeItemStatus(listId, userId, elementId, status, beneficiaries) {
        try {
            const updatedItem = await this.appListManagementRepository.changeItemStatus(listId, elementId, status);
            this.webSocketService.emit('change-item-status-backend', {
                updatedItem,
                beneficiaries,
            });
            return updatedItem;
        }
        catch (error) {
            throw error;
        }
    }
    async updateItemContent(listId, userId, elementId, content, beneficiaries) {
        try {
            const inputs = { listId, userId, content };
            await this.listValidatorService.verifyInputAddOrUpdateItem(inputs);
            const updatedItem = await this.appListManagementRepository.updateItemContent(listId, elementId, content);
            this.webSocketService.emit('update-item-content-backend', {
                updatedItem,
                beneficiaries,
            });
            return updatedItem;
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
    __param(1, (0, tsyringe_1.inject)(AppListManagementRepository_1.AppListManagementRepository)),
    __param(2, (0, tsyringe_1.inject)(services_1.default)),
    __param(3, (0, tsyringe_1.inject)(AppUserInvitationsRepository_1.AppUserInvitationsRepository)),
    __param(4, (0, tsyringe_1.inject)(validation_1.ListValidatorService)),
    __metadata("design:paramtypes", [services_2.WebSocketClientService,
        AppListManagementRepository_1.AppListManagementRepository,
        services_1.default,
        AppUserInvitationsRepository_1.AppUserInvitationsRepository,
        validation_1.ListValidatorService])
], ListManagementService);
