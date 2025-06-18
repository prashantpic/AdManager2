import { HttpException, HttpStatus } from '@nestjs/common';

export class SagaExecutionException extends HttpException {
  constructor(
    message: string,
    public readonly sagaInstanceId: string,
    public readonly step: string, // e.g., SagaState enum value or descriptive step name
    public readonly internalErrorCode?: string, // Optional internal code for more specific error categorization
    cause?: Error,
  ) {
    super(
      HttpException.createBody(
        message,
        `Saga Execution Error: ${internalErrorCode || 'SAGA_STEP_FAILED'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause },
    );
    this.name = 'SagaExecutionException';
  }
}