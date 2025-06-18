export class ApiResponseDto<T> {
  public readonly success: boolean;
  public readonly message?: string;
  public readonly data?: T;
  public readonly correlationId?: string;


  constructor(success: boolean, data?: T, message?: string, correlationId?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.correlationId = correlationId;
  }

  static success<T>(data: T, message?: string, correlationId?: string): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, correlationId);
  }

  static error<T = null>(message: string, correlationId?: string, data?: T): ApiResponseDto<T | null > {
    return new ApiResponseDto(false, data ?? null, message, correlationId);
  }
}