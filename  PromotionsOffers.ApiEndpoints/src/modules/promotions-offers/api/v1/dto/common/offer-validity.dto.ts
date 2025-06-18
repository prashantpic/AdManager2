import {
  IsDate,
  IsOptional,
  MinDate,
  ValidateIf,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.Common
 */

@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
class IsEndDateAfterStartDateConstraint implements ValidatorConstraintInterface {
  validate(endDate: any, args: ValidationArguments) {
    const startDate = (args.object as OfferValidityDto).startDate;
    if (startDate && endDate) {
      return new Date(endDate) > new Date(startDate);
    }
    return true; // Pass if one is missing or if only startDate is present
  }

  defaultMessage(args: ValidationArguments) {
    return `End date (${args.value ? new Date(args.value).toISOString() : 'not set'}) must be after start date (${(args.object as OfferValidityDto).startDate ? new Date((args.object as OfferValidityDto).startDate).toISOString() : 'not set'}).`;
  }
}

function IsEndDateAfterStartDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEndDateAfterStartDateConstraint,
    });
  };
}

/**
 * DTO for defining the validity period of a promotion (start and end dates/times).
 * Captures the start and end dates for a promotional offer's active period.
 * @REQ_PROMO_005
 */
export class OfferValidityDto {
  @ApiProperty({
    description: 'The start date and time of the offer.',
    type: Date,
    example: '2024-08-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    description:
      'The end date and time of the offer. Must be after startDate if provided. Cannot be in the past.',
    type: Date,
    example: '2024-08-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @MinDate(new Date(), {
    message: 'End date cannot be in the past from the current date.',
  })
  @ValidateIf((o) => o.endDate !== undefined) // Apply next validator only if endDate is present
  @IsEndDateAfterStartDate({
    message: 'End date must be after the start date.',
  })
  endDate?: Date;
}