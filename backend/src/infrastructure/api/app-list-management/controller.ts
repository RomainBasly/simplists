import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { UUID } from 'crypto';
import { UserInfo } from '../../../common/types/api';
import { getFromJWTToken } from '../../../common/helpers';
import { ListManagementService } from '../../../domain/ListManagement/services';
import { ListValidatorService } from '../../../domain/ListManagement/validation';

@injectable()
export class ListManagementController {
  constructor(
    @inject(ListManagementService) private readonly listManagementService: ListManagementService,
    @inject(ListValidatorService) private readonly listValidatorService: ListValidatorService
  ) {}

  public async createList(req: Request, res: Response, next: NextFunction) {
    try {
      const { listName, accessLevel, description, emails: invitedEmails, cyphered, thematic } = req.body;
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const creatorUserName = userInfo.userName;
      const creatorEmail = userInfo.email;
      const creatorId = userInfo.id;
      const validatedInputs = await this.listValidatorService.preCheckListCreation({
        name: listName,
        accessLevel,
        description,
        creatorId,
        creatorEmail,
        creatorUserName,
        emails: invitedEmails,
        cyphered,
        thematic,
      });
      const response = await this.listManagementService.createList(validatedInputs, creatorUserName, creatorEmail);
      console.log('response from list creation in prod - controller', response);
      res.status(201).json({ message: 'new list created' });
    } catch (error) {
      next(error);
    }
  }

  public async suppressListByListId(req: Request, res: Response, next: NextFunction) {
    const id = req.params.listId as UUID;
    const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
    const userId = userInfo.id;
    try {
      await this.listManagementService.suppressListByListId(id, userId);
      res.status(200).json({ message: 'list successfully suppressed', success: true });
    } catch (error) {
      next(error);
    }
  }

  public async getListForUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const userId = userInfo.id;
      const data = await this.listManagementService.getListBeneficiariesById(userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  public async getListById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const listId = req.params.listId as UUID;

      const userId = userInfo.id;
      const data = await this.listManagementService.getListByListIdWithItems(listId, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  public async addItemToList(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const listId = req.body.listId as UUID;
      const userId = userInfo.id;
      const content = req.body.content;
      const beneficiaries = req.body.beneficiaries;
      const addedElement = await this.listManagementService.addItemToList(listId, userId, content, beneficiaries);
      res.status(200).json({ message: 'item added', addedElement });
    } catch (error) {
      next(error);
    }
  }

  public async suppressItemByListId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const elementId = req.body.elementId;
      const listId = req.body.listId as UUID;
      const beneficiaries = req.body.beneficiaries;
      const userId = userInfo.id;
      await this.listManagementService.suppressElementById(listId, userId, elementId, beneficiaries);
      res.status(200).json({ success: true, message: 'item suppressed' });
    } catch (error) {
      next(error);
    }
  }

  public async changeItemStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const elementId = req.body.elementId;
      const status = req.body.status;
      const listId = req.body.listId as UUID;
      const beneficiaries = req.body.beneficiaries;
      const userId = userInfo.id;
      const response = await this.listManagementService.changeItemStatus(
        listId,
        userId,
        elementId,
        status,
        beneficiaries
      );
      res.status(200).json({ success: true, message: 'status changed', itemStatusChanged: response });
    } catch (error) {
      next(error);
    }
  }

  public async updateItemContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const elementId = req.body.elementId;
      const content = req.body.content;
      const listId = req.body.listId;
      const beneficiaries = req.body.beneficiaries;
      const userId = userInfo.id;
      const response = await this.listManagementService.updateItemContent(
        listId,
        userId,
        elementId,
        content,
        beneficiaries
      );
      res.status(200).json({ success: true, message: 'content of the item updated', itemContentChanged: response });
    } catch (error) {
      next(error);
    }
  }

  public async getListDefinitionBydListId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const listId = req.params.listId as UUID;

      const userId = userInfo.id;
      const data = await this.listManagementService.getListByListIdWithoutItems(listId, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
  public async updateListDefinitionBydListId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userInfo } = getFromJWTToken(req, 'accessToken') as UserInfo;
      const listId = req.params.listId as UUID;

      const userId = userInfo.id;

      const { updatedCoreData, updatedEmails } = req.body;
      const data = await this.listManagementService.updateListByListId(listId, updatedCoreData, updatedEmails, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
