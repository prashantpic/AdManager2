import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClassValidationPipe implements PipeTransform<any> {
  constructor(private readonly validatorOptions?: ValidatorOptions) {}

  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      ...this.validatorOptions,
    });
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    // Return the original value if transform: true is not set in global pipe options,
    // or return the transformed object if transformation is desired.
    // The SDS specifies 'return value' or 'object if transformation is desired'.
    // NestJS default behavior with { transform: true } in useGlobalPipes is to return the transformed instance.
    // So, returning 'object' is more aligned with typical usage.
    return object;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): any {
    return errors.map(err => {
      // Recursively format children errors if they exist
      const formatChildren = (childErrors: ValidationError[]): any => {
        return childErrors.reduce((acc, childErr) => {
          acc[childErr.property] = childErr.constraints ? Object.values(childErr.constraints) : formatChildren(childErr.children || []);
          return acc;
        }, {});
      };

      if (err.children && err.children.length > 0) {
        return {
          property: err.property,
          errors: formatChildren(err.children),
        };
      }
      return {
        property: err.property,
        errors: err.constraints ? Object.values(err.constraints) : ['Unknown validation error'],
      };
    });
  }
}