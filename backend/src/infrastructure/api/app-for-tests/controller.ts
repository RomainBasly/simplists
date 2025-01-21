import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';

import { FunctionsForTestServices } from '../../../domain/fetchingForTests/services';

@injectable()
export class AppForTestsController {
  constructor(@inject(FunctionsForTestServices) private readonly functionForTestsService: FunctionsForTestServices) {}

  public async getVerificationCodeForJest(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.params.email;
      const code = await this.functionForTestsService.getVerificationCodeElement(email);
      res.json({ code });
    } catch (error) {
      next(error);
    }
  }

  public async removeEmailFunctionAfterTest(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this.functionForTestsService.removeTestUserByEmail(email);
      res.status(200).send({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
  public async fetchUsersBeneficiariesByListIdForTest(req: Request, res: Response, next: NextFunction) {
    try {
      const listId = req.body.listId;
      const userId = req.body.userId;
      const response = await this.functionForTestsService.fetchUsersBeneficiariesByListIdForTest(listId, userId);
      res.status(200).send({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
}
