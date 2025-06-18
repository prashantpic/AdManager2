import { BasePlatformException } from '@errors/base.exception';
import { HTTP_STATUS } from '@common/constants/http-status.constants';

export const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';

export class ValidationException extends BasePlatformException {
  public readonly validationErrors: Record<string, string[]> | string[];

  constructor(
    errors: Record<string, string[]> | string[],
    message: string = 'Input data validation failed',
  ) {
    super(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      VALIDATION_ERROR_CODE,
      Array.isArray(errors) ? { general: errors } : errors,
    );
    this.validationErrors = errors;
  }
}