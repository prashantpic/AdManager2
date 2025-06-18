import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'areNotEqual', async: false })
export class AreNotEqualConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    // This validation should only run if both values are present.
    // If one is undefined/null, it's not a "combination" to compare.
    // However, IsUUID already ensures they are strings if present.
    if (value === undefined || relatedValue === undefined) {
        return true; // Let IsOptional or IsNotEmpty handle presence.
    }
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must not be equal to ${relatedPropertyName}.`;
  }
}

/**
 * @class StackableCombinationDto
 * @description DTO for defining a pair of promotions that can be stacked.
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction
 */
export class StackableCombinationDto {
  @ApiProperty({
    description: 'The ID of the first promotion in the stackable combination.',
    format: 'uuid',
  })
  @IsUUID('4')
  @Validate(AreNotEqualConstraint, ['promotionIdB'], {
    message: 'promotionIdA must not be the same as promotionIdB.'
  })
  promotionIdA: string;

  @ApiProperty({
    description: 'The ID of the second promotion in the stackable combination.',
    format: 'uuid',
  })
  @IsUUID('4')
  promotionIdB: string;
}