import { CustomBaseError } from './base.error';
import { ErrorCodes } from './error.codes';

export class BadRequestError extends CustomBaseError {
  constructor(message: string = 'Bad Request', code: string | number = ErrorCodes.BAD_REQUEST, context?: Record<string, any>) {
    super(message, 400, code, true, context);
  }
}

export class UnauthorizedError extends CustomBaseError {
  constructor(message: string = 'Unauthorized', code: string | number = ErrorCodes.UNAUTHENTICATED, context?: Record<string, any>) {
    super(message, 401, code, true, context);
  }
}

export class ForbiddenError extends CustomBaseError {
    constructor(message: string = 'Forbidden', code: string | number = ErrorCodes.PERMISSION_DENIED, context?: Record<string, any>) {
        super(message, 403, code, true, context);
    }
}

export class NotFoundError extends CustomBaseError {
  constructor(message: string = 'Resource Not Found', code: string | number = ErrorCodes.RESOURCE_NOT_FOUND, context?: Record<string, any>) {
    super(message, 404, code, true, context);
  }
}

export class ConflictError extends CustomBaseError {
    constructor(message: string = 'Resource Conflict', code: string | number = ErrorCodes.RESOURCE_CONFLICT, context?: Record<string, any>) {
        super(message, 409, code, true, context);
    }
}

export class UnprocessableEntityError extends CustomBaseError {
    constructor(message: string = 'Unprocessable Entity', code: string | number = ErrorCodes.VALIDATION_ERROR, context?: Record<string, any> | any[]) {
        super(message, 422, code, true, Array.isArray(context) ? { details: context } : context);
    }
}

export class InternalServerError extends CustomBaseError {
  constructor(message: string = 'Internal Server Error', code: string | number = ErrorCodes.INTERNAL_SERVER_ERROR, context?: Record<string, any>) {
    super(message, 500, code, false, context); 
  }
}