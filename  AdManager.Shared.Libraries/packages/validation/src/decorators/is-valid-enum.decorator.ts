import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false, name: 'isValidEnum' })
export class IsValidEnumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [enumObject] = args.constraints;
    if (typeof value === 'undefined' || value === null) {
      // Let @IsOptional or @IsNotEmpty handle this if they are present.
      // If the field is not optional and value is undefined/null,
      // other validators should catch it. This validator only checks
      // if the *provided* value is part of the enum.
      return true; 
    }
    return Object.values(enumObject).includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [enumObject] = args.constraints;
    const enumValues = Object.values(enumObject).join(', ');
    return `${args.property} must be one of the following values: ${enumValues}`;
  }
}

export function IsValidEnum(enumObject: object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObject],
      validator: IsValidEnumConstraint,
    });
  };
}