import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the affiliate application.',
    example: 'app1-a1b2-c3d4-e5f6-appID0000001',
  })
  applicationId: string;

  @ApiProperty({
    description: 'Name of the affiliate applicant.',
    example: 'John Doe',
  })
  affiliateName: string;

  @ApiProperty({
    description: 'Email of the affiliate applicant.',
    example: 'john.doe@example.com',
  })
  affiliateEmail: string;

  @ApiProperty({
    description: 'ID of the program the affiliate applied to.',
    example: 'prog1-p1r2-o3g4-r5a6-programID001',
  })
  programId: string;

  @ApiProperty({
    description: 'Name of the program the affiliate applied to.',
    example: 'Summer Sale Affiliate Program',
  })
  programName: string;

  @ApiProperty({
    description: 'Current status of the application.',
    example: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected'],
  })
  status: string; // e.g., 'Pending', 'Approved', 'Rejected'

  @ApiProperty({
    description: 'Timestamp when the application was submitted.',
    example: '2023-06-01T10:00:00.000Z',
  })
  submittedAt: Date;

  @ApiPropertyOptional({
    description: "Applicant's website URL, if provided.",
    example: 'https://johnsblog.com',
  })
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Description of promotional methods, if provided.',
    example: 'Social media marketing, blog posts, email campaigns.',
  })
  promotionalMethods?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the application was processed (approved/rejected).',
    example: '2023-06-02T15:30:00.000Z',
  })
  processedAt?: Date;

  @ApiPropertyOptional({
    description: 'ID of the merchant admin user who processed the application.',
    example: 'admin-usr-12345',
  })
  processedBy?: string; // Merchant Admin User ID
}