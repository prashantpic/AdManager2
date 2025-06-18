import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';
// Potentially import a specific error from @admanager/errors if decided
// import { UnprocessableEntityError } from '@admanager/errors'; 

/**
 * Validates a plain object against a DTO class.
 * Transforms the plain object to an instance of the DTO class.
 * Throws an array of ValidationError if validation fails, 
 * or a specific custom error like UnprocessableEntityError can be configured.
 * 
 * @param dtoClass The DTO class (constructor) to validate against.
 * @param plainObject The plain JavaScript object to validate.
 * @param validatorOptions Optional class-validator options. Defaults include whitelist and forbidNonWhitelisted.
 * @returns The validated and transformed DTO instance.
 * @throws Array<ValidationError> if validation fails (or a custom error if implemented).
 */
export async function validateObjectPayload<T extends object>(
  dtoClass: ClassConstructor<T>,
  plainObject: object,
  validatorOptions?: ValidatorOptions,
): Promise<T> {
  // Ensure the object is an instance of the DTO class for validators to work correctly
  const instance = plainToInstance(dtoClass, plainObject);

  const errors = await validate(instance, { 
    whitelist: true,              // Remove properties not in DTO
    forbidNonWhitelisted: true,   // Throw error if non-whitelisted properties are present
    ...validatorOptions           // Allow overriding default options
  });

  if (errors.length > 0) {
    // As per SDS: "Consider throwing a specific custom error (e.g., from @admanager/errors)"
    // Example: throw new UnprocessableEntityError('Validation failed', ErrorCodes.VALIDATION_ERROR, errors);
    // For now, re-throwing the array to be handled by consumer (e.g., NestJS exception filter)
    throw errors; 
  }
  return instance;
}