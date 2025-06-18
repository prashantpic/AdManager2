import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackingLinkResponseDto {
  @ApiProperty({
    description: 'ID of the program this tracking link belongs to.',
    example: 'prog_jklm0987',
  })
  programId: string;

  @ApiProperty({
    description: 'Name of the affiliate program.',
    example: 'Exclusive Winter Collection Program',
  })
  programName: string;

  @ApiProperty({
    description: 'The unique tracking URL for the affiliate for this program.',
    example: 'https://yourstore.com/track?pid=prog_jklm0987&aid=aff_xyz123&ref=WINTERPROMO',
  })
  trackingUrl: string;

  @ApiPropertyOptional({
    description: 'An associated coupon code, if applicable and generated for the affiliate.',
    example: 'WINTERAFF20',
  })
  couponCode?: string;
}