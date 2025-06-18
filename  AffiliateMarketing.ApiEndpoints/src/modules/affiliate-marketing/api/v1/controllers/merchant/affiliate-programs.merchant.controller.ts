import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { CreateProgramDto } from '../../dto/merchant/programs/create-program.dto';
import { UpdateProgramDto } from '../../dto/merchant/programs/update-program.dto';
import { ProgramResponseDto } from '../../dto/merchant/programs/program.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

// Define a basic interface for the authenticated user object
interface AuthenticatedUser {
  userId: string;
  merchantId: string;
  roles: string[];
}

@ApiTags('Merchant - Affiliate Programs')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliateProgramsMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Post()
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Create a new affiliate program (REQ-AMP-001)' })
  @ApiBody({ type: CreateProgramDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The affiliate program has been successfully created.',
    type: ProgramResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async createProgram(
    @AuthUser() user: AuthenticatedUser,
    @Body() createProgramDto: CreateProgramDto,
  ): Promise<ProgramResponseDto> {
    return this.affiliateMarketingService.createProgram(
      user.merchantId,
      createProgramDto,
    );
  }

  @Get()
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'List all affiliate programs for the merchant (REQ-AMP-001)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of affiliate programs.',
    type: [ProgramResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getPrograms(@AuthUser() user: AuthenticatedUser): Promise<ProgramResponseDto[]> {
    return this.affiliateMarketingService.listProgramsForMerchant(user.merchantId);
  }

  @Get(':programId')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get a specific affiliate program by ID (REQ-AMP-001)' })
  @ApiParam({ name: 'programId', description: 'ID of the affiliate program', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the affiliate program.',
    type: ProgramResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getProgramById(
    @AuthUser() user: AuthenticatedUser,
    @Param('programId', ParseUUIDPipe) programId: string,
  ): Promise<ProgramResponseDto> {
    return this.affiliateMarketingService.getProgramById(user.merchantId, programId);
  }

  @Put(':programId')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Update an existing affiliate program (REQ-AMP-001)' })
  @ApiParam({ name: 'programId', description: 'ID of the affiliate program to update', type: String })
  @ApiBody({ type: UpdateProgramDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The affiliate program has been successfully updated.',
    type: ProgramResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async updateProgram(
    @AuthUser() user: AuthenticatedUser,
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ): Promise<ProgramResponseDto> {
    return this.affiliateMarketingService.updateProgram(
      user.merchantId,
      programId,
      updateProgramDto,
    );
  }

  @Delete(':programId')
  @Roles('MerchantAdmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an affiliate program (REQ-AMP-001)' })
  @ApiParam({ name: 'programId', description: 'ID of the affiliate program to delete', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The affiliate program has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async deleteProgram(
    @AuthUser() user: AuthenticatedUser,
    @Param('programId', ParseUUIDPipe) programId: string,
  ): Promise<void> {
    return this.affiliateMarketingService.deleteProgram(user.merchantId, programId);
  }
}