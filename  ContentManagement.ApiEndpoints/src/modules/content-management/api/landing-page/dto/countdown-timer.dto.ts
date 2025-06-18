import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * @file countdown-timer.dto.ts
 * @description DTO for countdown timer configuration on landing pages.
 * @requirement REQ-6-007
 * @namespace AdManager.ContentManagement.Api.V1.LandingPage.Dto
 */

/**
 * DTO representing a configurable countdown timer for landing pages.
 */
export class CountdownTimerDto {
  /**
   * Target date and time for the countdown.
   * Should be in ISO 8601 format.
   * @example "2024-12-31T23:59:59.000Z"
   */
  @ApiProperty({
    description: 'Target date and time for the countdown (ISO 8601).',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public endDate: Date;

  /**
   * Text to display alongside/after the timer (e.g., "Sale Ends!").
   * @example "Hurry, Sale Ends Soon!"
   */
  @ApiProperty({
    description:
      'Text to display alongside/after the timer (e.g., "Sale Ends!").',
    example: 'Hurry, Sale Ends Soon!',
    required: false,
  })
  @IsOptional()
  @IsString()
  public displayText?: string;
}