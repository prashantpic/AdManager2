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
// import { ApiKeyGuard } from '../../guards/api-key.guard'; // Example: if using API key auth
// import { UseGuards } from '@nestjs/common'; // Uncomment if using guards
import { AffiliateMarketingService } from '../services/affiliate-marketing.service';
import { TrackConversionDto } from '../dto/conversions/track-conversion.dto';
import { ConversionResponseDto } from '../dto/conversions/conversion.response.dto';

@ApiTags('Affiliate Conversions')
@Controller('affiliate-marketing/conversions')
// @UseGuards(ApiKeyGuard) // Example: Protect with an API Key or other internal auth mechanism if needed
export class AffiliateConversionsController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Track an affiliate conversion (REQ-AMP-004)' })
  @ApiBody({ type: TrackConversionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conversion tracked successfully.',
    type: ConversionResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request. Invalid conversion data.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Duplicate Order ID.'}) // Example of potential conflict
  // Add ApiResponse for 401/403 if @UseGuards is active
  async trackConversion(
    @Body() trackConversionDto: TrackConversionDto,
  ): Promise<ConversionResponseDto> {
    return this.affiliateMarketingService.trackConversion(trackConversionDto);
  }
}