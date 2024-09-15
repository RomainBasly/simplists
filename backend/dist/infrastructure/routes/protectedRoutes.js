"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controller_1 = require("../api/app-list-management/controller");
const controller_2 = require("../api/app-user-invitations/controller");
const appListManagementController = tsyringe_1.container.resolve(controller_1.ListManagementController);
const appUserInvitationsController = tsyringe_1.container.resolve(controller_2.AppUserInvitationsController);
const protectedRoutes = (0, express_1.Router)();
protectedRoutes
    .post('/api/lists/create-list', (req, res, next) => {
    appListManagementController.createList(req, res, next);
})
    .get('/api/lists/get-user-invitations/:status', (req, res, next) => {
    appUserInvitationsController.getUserInvitations(req, res, next);
})
    .post('/api/lists/handle-list-invitation-status/:invitationId', (req, res, next) => {
    appUserInvitationsController.handleListInvitationStatus(req, res, next);
})
    .get('/api/lists/get-user-lists', (req, res, next) => {
    appListManagementController.getListForUserById(req, res, next);
})
    .get('/api/lists/get-list-definition/:listId', (req, res, next) => {
    appListManagementController.getListDefinitionBydListId(req, res, next);
})
    .post('/api/lists/update-list-definition/:listId', (req, res, next) => {
    appListManagementController.updateListDefinitionBydListId(req, res, next);
})
    .get('/api/lists/get-list/:listId', (req, res, next) => {
    appListManagementController.getListById(req, res, next);
})
    .post('/api/lists/add-item-to-list/', (req, res, next) => {
    appListManagementController.addItemToList(req, res, next);
})
    .post('/api/lists/suppress-item/', (req, res, next) => {
    appListManagementController.suppressItemByListId(req, res, next);
})
    .post('/api/lists/change-item-status/', (req, res, next) => {
    appListManagementController.changeItemStatus(req, res, next);
})
    .post('/api/lists/update-list-content/', (req, res, next) => {
    appListManagementController.updateItemContent(req, res, next);
})
    .delete('/api/lists/suppress-list/:listId', (req, res, next) => {
    appListManagementController.suppressListByListId(req, res, next);
});
exports.default = protectedRoutes;
