import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { AffiliateRegistrationRequestDto } from '../../dto/public/registration/affiliate-registration.request.dto';

@ApiTags('Public - Affiliate Registration')
@Controller('affiliate-marketing/public')
export class AffiliateRegistrationPublicController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Submit an affiliate program application (REQ-AMP-002)' })
  @ApiBody({ type: AffiliateRegistrationRequestDto })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Affiliate application submitted successfully. It will be reviewed by the merchant.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request. Invalid application data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program ID not found.' })
  async register(
    @Body() registrationDto: AffiliateRegistrationRequestDto,
  ): Promise<void> {
    return this.affiliateMarketingService.registerAffiliate(registrationDto);
  }
}