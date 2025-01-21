import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import assert from 'assert';
import UserInvitationsService from '../../../domain/Invitations/services';
import { TokenService } from '../../jwtToken/services';

@injectable()
export class AppUserInvitationsController {
  constructor(
    @inject(UserInvitationsService) private readonly userInvitationsService: UserInvitationsService,
    @inject(TokenService) private readonly tokenService: TokenService
  ) {}

  public async getUserInvitations(req: Request, res: Response, next: NextFunction) {
    const userId = this.tokenService.getUserIdFromAccessToken(req);
    assert(userId, 'no userId given in the request');
    try {
      const { status } = req.params;
      const data = await this.userInvitationsService.fetchUserInvitations(userId, parseInt(status));
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public async handleListInvitationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { invitationId } = req.params;
      const { listId, status } = req.body;
      const userId = this.tokenService.getUserIdFromAccessToken(req);
      assert(listId, 'No listId');
      assert(invitationId, 'No invitationId');
      assert(userId, 'no userId given in the request');
      await this.userInvitationsService.changeInvitationStatus(
        parseInt(invitationId),
        parseInt(userId),
        listId,
        status
      );
      res.status(200).json({ message: 'Invitation modified' });
    } catch (error) {
      next(error);
    }
  }
}
