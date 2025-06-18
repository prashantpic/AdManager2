import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ArrayMinSize,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion
 */

// Custom validator function to be registered
function IsProductOrCollectionProvided(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isProductOrCollectionProvided',
      target: object.constructor,
      propertyName: propertyName, // Error will be associated with the property this decorator is on
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const dto = args.object as BogoItemConditionDto;
          const productIdsProvided = Array.isArray(dto.productIds) && dto.productIds.length > 0;
          const collectionIdsProvided = Array.isArray(dto.collectionIds) && dto.collectionIds.length > 0;
          
          // If the property being validated (productIds in this case) is not provided,
          // then collectionIds MUST be provided.
          // If productIds IS provided, this specific check for "OR" condition is met for productIds.
          // The goal is "at least one of them must be provided and non-empty".
          return productIdsProvided || collectionIdsProvided;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Either productIds or collectionIds must be provided and contain at least one ID.';
        }
      },
    });
  };
}


/**
 * DTO for defining the 'buy' condition items in a BOGO (Buy One, Get One Free) promotion.
 * Specifies which products/collections and in what quantity must be purchased to trigger the BOGO offer.
 * @REQ_PROMO_003
 */
export class BogoItemConditionDto {
  @ApiPropertyOptional({
    description:
      'List of product UUIDs that qualify for the "buy" condition. Requires at least one if `collectionIds` is not provided.',
    type: [String],
    format: 'uuid',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each productId must be a valid UUID.' })
  @ArrayMinSize(1, { message: 'productIds must contain at least one UUID if provided.' })
  @IsProductOrCollectionProvided() // Apply the custom validator here
  productIds?: string[];

  @ApiPropertyOptional({
    description:
      'List of collection UUIDs that qualify for the "buy" condition. Requires at least one if `productIds` is not provided.',
    type: [String],
    format: 'uuid',
    example: ['b2c3d4e5-f6a7-8901-2345-67890abcdef0'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each collectionId must be a valid UUID.' })
  @ArrayMinSize(1, { message: 'collectionIds must contain at least one UUID if provided.' })
  collectionIds?: string[];

  @ApiProperty({
    description: 'Minimum quantity of qualifying items to be purchased to trigger the offer.',
    type: Number,
    default: 1,
    minimum: 1,
    example: 2,
  })
  @IsInt({ message: 'Minimum quantity must be an integer.' })
  @Min(1, { message: 'Minimum quantity must be at least 1.' })
  minimumQuantity: number = 1;
}