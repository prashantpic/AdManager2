export interface IErrorResponse {
  readonly statusCode: number;
  readonly message: string;
  readonly code?: string | number; // Application-specific error code
  readonly timestamp: string; // ISO 8601
  readonly path?: string; // Request path
  readonly details?: Record<string, any> | any[]; // For validation errors or more context
  readonly correlationId?: string;
}