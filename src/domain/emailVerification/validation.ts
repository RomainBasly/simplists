import { injectable } from 'tsyringe';
import * as yup from 'yup';
import { ErrorMessages, ValidationError } from '../common/errors';

@injectable()
export default class AppEmailValidation {
  public async validateEmail(input: string): Promise<{ email: string }> {
    const schema = yup.object().shape({
      email: yup.string().email('Email format invalid').required('Email is required'),
    });
    try {
      const emailObject = { email: input };
      return await schema.validate(emailObject);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      }
      throw new Error('Error validating the email (appEmailValidation)');
    }
  }

  public async validateCode(input: string): Promise<any> {
    const schema = yup.object().shape({
      code: yup
        .string()
        .trim()
        .length(6, 'Code must be exactly 6 digits')
        .matches(/^\d{6}$/, 'code furnished not numbers')
        .required('code is required'),
    });

    try {
      const codeObject = { code: input };
      return await schema.validate(codeObject);
    } catch (error) {
      if (error instanceof yup.ValidationError)
        throw new ValidationError(ErrorMessages.VALIDATION_ERROR, error.message);
      throw new Error('Email validating the code');
    }
  }
}
