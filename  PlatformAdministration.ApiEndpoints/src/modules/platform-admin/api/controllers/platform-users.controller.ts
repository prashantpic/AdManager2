import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PlatformAdminGuard } from '../../infrastructure/guards/platform-admin.guard.ts';
import { IPlatformAdministrationService } from '../../application/platform-administration.service.interface.ts';
import { PlatformAdministratorDto } from '../../domain/dto/platform-users/platform-administrator.dto.ts';
import { CreatePlatformAdministratorRequestDto } from '../../domain/dto/platform-users/create-platform-administrator.request.dto.ts';
import { UpdatePlatformAdministratorRequestDto } from '../../domain/dto/platform-users/update-platform-administrator.request.dto.ts';

@ApiTags('Platform Administration')
@UseGuards(PlatformAdminGuard)
@Controller('platform-users')
export class PlatformUsersController {
  constructor(
    @Inject('IPlatformAdministrationService')
    private readonly platformAdminService: IPlatformAdministrationService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all platform administrators' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved platform administrators.',
    type: [PlatformAdministratorDto],
  })
  async getPlatformAdministrators(): Promise<PlatformAdministratorDto[]> {
    return this.platformAdminService.getPlatformAdministrators();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new platform administrator' })
  @ApiBody({ type: CreatePlatformAdministratorRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created platform administrator.',
    type: PlatformAdministratorDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists.',
  })
  async createPlatformAdministrator(
    @Body() dto: CreatePlatformAdministratorRequestDto,
  ): Promise<PlatformAdministratorDto> {
    return this.platformAdminService.createPlatformAdministrator(dto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a platform administrator by ID' })
  @ApiParam({ name: 'id', description: 'ID of the platform administrator' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved platform administrator.',
    type: PlatformAdministratorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Platform administrator not found.',
  })
  async getPlatformAdministratorById(
    @Param('id') id: string,
  ): Promise<PlatformAdministratorDto> {
    return this.platformAdminService.getPlatformAdministratorById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an existing platform administrator' })
  @ApiParam({
    name: 'id',
    description: 'ID of the platform administrator to update',
  })
  @ApiBody({ type: UpdatePlatformAdministratorRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated platform administrator.',
    type: PlatformAdministratorDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({
    status: 404,
    description: 'Platform administrator not found.',
  })
  async updatePlatformAdministrator(
    @Param('id') id: string,
    @Body() dto: UpdatePlatformAdministratorRequestDto,
  ): Promise<PlatformAdministratorDto> {
    return this.platformAdminService.updatePlatformAdministrator(id, dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a platform administrator' })
  @ApiParam({
    name: 'id',
    description: 'ID of the platform administrator to delete',
  })
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted platform administrator.',
  })
  @ApiResponse({
    status: 404,
    description: 'Platform administrator not found.',
  })
  async deletePlatformAdministrator(@Param('id') id: string): Promise<void> {
    return this.platformAdminService.deletePlatformAdministrator(id);
  }
}