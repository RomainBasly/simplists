import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import EmailVerificationServices from '../../../domain/emailVerification/services';
import AppEmailValidation from '../../../domain/emailVerification/validation';
import UserInvitationsService from '../../../domain/Invitations/services';
import NodeMailerService from '../../emails/nodeMailder';

@injectable()
export class AppEmailVerificationController {
  constructor(
    private readonly appEmailValidation: AppEmailValidation,
    @inject(NodeMailerService) private readonly nodeMailerService: NodeMailerService,
    @inject(EmailVerificationServices) private readonly emailVerificationServices: EmailVerificationServices,
    @inject(UserInvitationsService) private readonly userInvitationsService: UserInvitationsService
  ) {}

  public async publishAndSendVerificationCode(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      const verifiedEmailObject = await this.appEmailValidation.validateEmail(email);
      await this.nodeMailerService.sendVerifyCodeEmail(verifiedEmailObject.email);

      // if there are any invitations of lists attached to this email , update the column user-id
      await this.userInvitationsService.updateExistingInvitationsForNewUsers(email);
      res.status(200).json({ message: 'Success : Email sent, code publish, user-id updated' });
    } catch (error) {
      console.log('error get in the controller sendVerifEmail', error);
      next(error);
    }
  }

  public async verifyCode(req: Request, res: Response, next: NextFunction) {
    const { email, code } = req.body;

    try {
      const verifiedEmailObject = await this.appEmailValidation.validateEmail(email);
      const verifiedCodeObject = await this.appEmailValidation.validateCode(code);
      await this.emailVerificationServices.verifyCode({ email: verifiedEmailObject.email, code: verifiedCodeObject });
      res.status(200).json({ message: 'Code verified' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  public async getInvitationsByEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    try {
      // if there are any invitations of lists attached to this email , update the column user-id
      await this.userInvitationsService.updateExistingInvitationsForNewUsers(email);

      // res.status(200).json({ message: 'Success : Email sent, code publish, user-id updated' });
    } catch (error) {
      console.log('error get in the controller sendVerifEmail', error);
      next(error);
    }
  }
}
