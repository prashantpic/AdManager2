```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isUUID,
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'isCustomUuid' })
export class IsCustomUuidConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }
    // Use class-validator's built-in isUUID
    // For example, to specify a UUID version: return isUUID(value, '4');
    return isUUID(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid UUID.`;
  }
}

export function IsCustomUuid(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCustomUuidConstraint,
    });
  };
}
```