/**
 * @fileoverview DTO for updating schema markup for a page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

/**
 * Defines the structure for updating schema markup with a JSON object.
 */
export class UpdateSchemaMarkupRequestDto {
  @ApiProperty({
    type: 'object',
    description: 'The schema.org compliant JSON-LD object.',
    example: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Awesome T-Shirt',
      description: 'This is an awesome T-Shirt.',
    },
  })
  @IsObject()
  @IsNotEmpty()
  schemaJson: object;
}