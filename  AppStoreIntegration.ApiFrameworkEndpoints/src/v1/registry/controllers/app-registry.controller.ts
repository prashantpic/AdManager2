import { Controller, Post, Get, Put, Param, Body, UseGuards, Logger, HttpCode, HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AppRegistryService } from '../services/app-registry.service';
import { RegisterAppDto } from '../dto/register-app.dto';
import { AppResponseDto } from '../dto/app-response.dto';
import { UpdateAppDto } from '../dto/update-app.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Assuming developer portal access might also use JWT
import { User } from '../../common/decorators/user.decorator'; // Custom decorator to get authenticated developer
import { AuthenticatedDeveloper } from '../../common/models/authenticated-developer.model'; // Placeholder for developer user model

/**
 * API controller for third-party application registration and management by developers.
 * Endpoints require developer authentication.
 */
@ApiTags('AppRegistry')
@Controller('registry/apps')
// @UseGuards(JwtAuthGuard) // Apply guard if developer authentication uses JWTs from a developer portal session
// @ApiBearerAuth('jwt') // If using JWT for developer auth
export class AppRegistryController {
  private readonly logger = new Logger(AppRegistryController.name);

  constructor(private readonly appRegistryService: AppRegistryService) {}

  /**
   * Registers a new third-party application.
   * @param registerAppDto - Data for registering the new application.
   * @param developer - The authenticated developer performing the action.
   * @returns The details of the newly registered application.
   */
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new third-party application' })
  @ApiBody({ type: RegisterAppDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Application registered successfully.', type: AppResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid application data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Developer not authenticated.' }) // If @UseGuards(JwtAuthGuard) is active
  async registerApp(
    @Body() registerAppDto: RegisterAppDto,
    @User() developer: AuthenticatedDeveloper, // Assuming @User() decorator extracts developer info
  ): Promise<AppResponseDto> {
    this.logger.log(`Developer ${developer?.id || 'unknown'} attempting to register app: ${registerAppDto.appName}`);
    if (!developer || !developer.id) {
        // This check depends on how developer authentication is established.
        // If @UseGuards is used, this might be redundant.
        this.logger.warn('Attempt to register app without authenticated developer.');
        throw new ForbiddenException('Authenticated developer context is required.');
    }
    const app = await this.appRegistryService.registerNewApp(registerAppDto, developer.id);
    this.logger.log(`App ${app.appName} (ID: ${app.clientId}) registered successfully by developer ${developer.id}.`);
    // Note: client_secret should be shown only once and not stored in AppResponseDto for subsequent retrievals.
    // The AppResponseDto from registerNewApp might temporarily include it for the immediate response.
    return app;
  }

  /**
   * Retrieves details of a specific registered application owned by the developer.
   * @param appId - The ID of the application to retrieve.
   * @param developer - The authenticated developer.
   * @returns The application details.
   */
  @Get('/:appId')
  @ApiOperation({ summary: 'Get details of a registered application' })
  @ApiParam({ name: 'appId', description: 'The ID of the application', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Application details retrieved.', type: AppResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access to application denied.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Developer not authenticated.' }) // If @UseGuards(JwtAuthGuard) is active
  async getMyApp(
    @Param('appId') appId: string,
    @User() developer: AuthenticatedDeveloper,
  ): Promise<AppResponseDto> {
    this.logger.log(`Developer ${developer?.id} attempting to retrieve app: ${appId}`);
    if (!developer || !developer.id) {
        this.logger.warn(`Attempt to get app ${appId} without authenticated developer.`);
        throw new ForbiddenException('Authenticated developer context is required.');
    }
    const app = await this.appRegistryService.getAppDetails(appId, developer.id);
    if (!app) {
      this.logger.warn(`App ${appId} not found for developer ${developer.id}.`);
      throw new NotFoundException(`Application with ID ${appId} not found or not accessible.`);
    }
    return app;
  }

  /**
   * Updates details of a specific registered application owned by the developer.
   * @param appId - The ID of the application to update.
   * @param updateAppDto - Data to update the application with.
   * @param developer - The authenticated developer.
   * @returns The updated application details.
   */
  @Put('/:appId')
  @ApiOperation({ summary: 'Update details of a registered application' })
  @ApiParam({ name: 'appId', description: 'The ID of the application', type: String })
  @ApiBody({ type: UpdateAppDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Application updated successfully.', type: AppResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid update data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access to application denied.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Developer not authenticated.' }) // If @UseGuards(JwtAuthGuard) is active
  async updateMyApp(
    @Param('appId') appId: string,
    @Body() updateAppDto: UpdateAppDto,
    @User() developer: AuthenticatedDeveloper,
  ): Promise<AppResponseDto> {
    this.logger.log(`Developer ${developer?.id} attempting to update app: ${appId}`);
     if (!developer || !developer.id) {
        this.logger.warn(`Attempt to update app ${appId} without authenticated developer.`);
        throw new ForbiddenException('Authenticated developer context is required.');
    }
    const app = await this.appRegistryService.updateAppDetails(appId, updateAppDto, developer.id);
    this.logger.log(`App ${appId} updated successfully by developer ${developer.id}.`);
    return app;
  }

  /**
   * Lists all applications registered by the authenticated developer.
   * @param developer - The authenticated developer.
   * @returns A list of applications.
   */
  @Get('/mine/all') // Changed path slightly to avoid conflict if `/mine` was intended as a resource name
  @ApiOperation({ summary: 'List all applications registered by the developer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Applications listed successfully.', type: [AppResponseDto] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Developer not authenticated.' }) // If @UseGuards(JwtAuthGuard) is active
  async listMyApps(
    @User() developer: AuthenticatedDeveloper,
  ): Promise<AppResponseDto[]> {
    this.logger.log(`Developer ${developer?.id} attempting to list their apps.`);
    if (!developer || !developer.id) {
        this.logger.warn('Attempt to list apps without authenticated developer.');
        throw new ForbiddenException('Authenticated developer context is required.');
    }
    return this.appRegistryService.listDeveloperApps(developer.id);
  }
}