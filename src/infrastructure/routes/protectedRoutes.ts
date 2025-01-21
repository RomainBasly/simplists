import { Router } from 'express';
import { container } from 'tsyringe';
import { ListManagementController } from '../api/app-list-management/controller';
import { AppUserInvitationsController } from '../api/app-user-invitations/controller';
import { AppNotificationsController } from '../api/app-notifications/controller';

const appListManagementController = container.resolve(ListManagementController);
const appUserInvitationsController = container.resolve(AppUserInvitationsController);
const appNotificationsController = container.resolve(AppNotificationsController);

const protectedRoutes = Router();

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
  .get('/api/notifications/fetch-notifications-preferences', (req, res, next) => {
    appNotificationsController.fetchNotificationsPreferences(req, res, next);
  })
  .get('/api/notifications/get-notifications', (req, res, next) => {
    appNotificationsController.getNotificationsByUserId(req, res, next);
  })
  .post('/api/notifications/subscribe', (req, res, next) => {
    appNotificationsController.subscribeToNotifications(req, res, next);
  })
  .post('/api/notifications/update', (req, res, next) => {
    appNotificationsController.updateNotificationsPreferences(req, res, next);
  })
  .post('/api/notifications/modify-notification-status', (req, res, next) => {
    appNotificationsController.modifyNotificationStatus(req, res, next);
  })
  .delete('/api/notifications/delete-notification-by/:notificationId', (req, res, next) => {
    appNotificationsController.deleteNotificationById(req, res, next);
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

export default protectedRoutes;
