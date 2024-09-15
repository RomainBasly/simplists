import { injectable } from 'tsyringe';
import * as yup from 'yup';
import { ErrorMessages, ValidationError } from '../common/errors';
import { IInputAddToList, List } from './types';
import AppEmailValidation from '../emailVerification/validation';
import { UUID } from 'crypto';
import { IUpdatedCoreData, IUpdatedEmails } from './services';

@injectable()
export class ListValidatorService {
  public constructor(private readonly appEmailValidation: AppEmailValidation) {}

  public async preCheckListCreation(inputs: List) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      accessLevel: yup.string().required(),
      creatorEmail: yup.string().required(),
      creatorUserName: yup.string().required(),
      emails: yup.array().of(yup.string().required()),
      description: yup.string().optional(),
      cyphered: yup.boolean().optional(),
      creatorId: yup.number().required(),
      thematic: yup.string().required(),
    });

    try {
      return await schema.validate(inputs);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      }
      throw new Error('Error validating the list schema during precheck');
    }
  }

  public async validateEmails(emails: string[] | undefined) {
    let emailsAddress: string[] = [];
    if (emails) {
      await Promise.all(
        emails.map(async (email) => {
          const verifiedEmailObject = await this.appEmailValidation.validateEmail(email);
          emailsAddress.push(verifiedEmailObject.email);
        })
      );
    }
    return emailsAddress.length > 0 ? emailsAddress : [];
  }

  public async verifyInputAddOrUpdateItem(inputs: IInputAddToList) {
    const schema = yup.object().shape({
      listId: yup.string().required(),
      userId: yup.number().required(),
      content: yup.string().required(),
    });

    try {
      return await schema.validate(inputs);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      }
      throw new Error('Error validating the content schema during content creation or update of the list');
    }
  }

  public async verifyUpdatedCoreListSettings(updatedCoreData: IUpdatedCoreData) {
    const schema = yup.object().shape({
      thematic: yup.string().optional(),
      description: yup.string().optional(),
      access_level: yup.string().optional(),
      listName: yup.string().optional(),
    });

    try {
      return await schema.validate(updatedCoreData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      }
      throw new Error('Error validating the content schema during update of the settings of the list');
    }
  }
  public async verifyUpdatedEmailsSettings(updatedEmails: IUpdatedEmails) {
    const schema = yup.object().shape({
      beneficiaryEmails: yup.object({
        removedBeneficiaries: yup.array().optional().of(yup.string().email()),
      }),
      invitedEmails: yup.object({
        removedEmails: yup.array().optional().of(yup.string().email()),
        addedEmails: yup.array().optional().of(yup.string().email()),
      }),
    });

    try {
      return await schema.validate(updatedEmails);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      }
      throw new Error('Error validating the emails during the changes');
    }
  }
}
