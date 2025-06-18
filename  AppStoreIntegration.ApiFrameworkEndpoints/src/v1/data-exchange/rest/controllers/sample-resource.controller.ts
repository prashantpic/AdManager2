import { Controller, Get, Param, Query, UseGuards, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DataAccessService } from '../../services/data-access.service';
import { SampleResourceDto } from '../dto/sample-resource.dto';
import { SampleResourceQueryDto } from '../dto/sample-resource-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ScopesGuard } from '../../../auth/guards/scopes.guard';
import { Scopes } from '../../../common/decorators/scopes.decorator';
import { CurrentApp } from '../../../common/decorators/current-app.decorator';
import { RegisteredApp } from '../../../common/models/registered-app.model';

/**
 * Example REST controller for third-party applications to access platform data (Sample Resources).
 * Protected by JWT authentication and scope checks.
 */
@ApiTags('DataExchangeREST')
@Controller('data/sample-resources')
@UseGuards(JwtAuthGuard, ScopesGuard)
@ApiBearerAuth('jwt')
export class SampleResourceController {
  private readonly logger = new Logger(SampleResourceController.name);

  constructor(private readonly dataAccessService: DataAccessService) {}

  /**
   * Retrieves a list of sample resources accessible by the app.
   * @param app - The authenticated application.
   * @param query - Query parameters for pagination, filtering, sorting.
   * @returns A paginated list of sample resources.
   */
  @Get('/')
  @Scopes('sample:read') // Example scope for reading sample resources
  @ApiOperation({ summary: 'List sample resources' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip.' })
  @ApiQuery({ name: 'filterByName', required: false, type: String, description: 'Filter resources by name (example filter).' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of sample resources.', type: PaginatedResponseDto<SampleResourceDto> })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient scope or app not permitted.' })
  async getResources(
    @CurrentApp() app: RegisteredApp,
    @Query() query: SampleResourceQueryDto,
  ): Promise<PaginatedResponseDto<SampleResourceDto>> {
    this.logger.log(`App ${app.clientId} requesting list of sample resources with query: ${JSON.stringify(query)}`);
     if (!app || !app.id) {
        this.logger.warn(`Attempt to list sample resources without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    return this.dataAccessService.fetchSampleResources(app, query);
  }

  /**
   * Retrieves a specific sample resource by ID.
   * @param id - The ID of the sample resource.
   * @param app - The authenticated application.
   * @returns The sample resource.
   */
  @Get('/:resourceId')
  @Scopes('sample:read') // Example scope
  @ApiOperation({ summary: 'Get a specific sample resource by ID' })
  @ApiParam({ name: 'resourceId', description: 'ID of the sample resource', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved sample resource.', type: SampleResourceDto })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient scope or app not permitted.' })
  @ApiResponse({ status: 404, description: 'Sample resource not found.' })
  async getResourceById(
    @Param('resourceId') id: string,
    @CurrentApp() app: RegisteredApp,
  ): Promise<SampleResourceDto> {
    this.logger.log(`App ${app.clientId} requesting sample resource with ID: ${id}`);
     if (!app || !app.id) {
        this.logger.warn(`Attempt to get sample resource ${id} without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    const resource = await this.dataAccessService.fetchSampleResourceById(app, id);
    if (!resource) {
      this.logger.warn(`Sample resource with ID ${id} not found for app ${app.clientId}.`);
      throw new NotFoundException(`Sample resource with ID ${id} not found.`);
    }
    return resource;
  }
}