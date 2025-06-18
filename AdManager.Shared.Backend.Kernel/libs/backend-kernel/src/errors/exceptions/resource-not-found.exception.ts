import { BasePlatformException } from '@errors/base.exception';
import { HTTP_STATUS } from '@common/constants/http-status.constants';

export const RESOURCE_NOT_FOUND_CODE = 'RESOURCE_NOT_FOUND';

export class ResourceNotFoundException extends BasePlatformException {
  constructor(
    resourceName: string,
    resourceId?: string | number,
    message?: string,
  ) {
    const defaultMessage = resourceId
      ? `${resourceName} with ID '${resourceId}' not found.`
      : `${resourceName} not found.`;
    super(
      message || defaultMessage,
      HTTP_STATUS.NOT_FOUND,
      RESOURCE_NOT_FOUND_CODE,
    );
  }
}