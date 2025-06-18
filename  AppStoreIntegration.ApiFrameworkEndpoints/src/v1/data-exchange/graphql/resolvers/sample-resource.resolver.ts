import { Resolver, Query, Args, ID, ObjectType, Field, InputType, Int } from '@nestjs/graphql';
import { UseGuards, Logger, ForbiddenException } from '@nestjs/common';
import { DataAccessService } from '../../services/data-access.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ScopesGuard } from '../../../auth/guards/scopes.guard';
import { Scopes } from '../../../common/decorators/scopes.decorator';
import { CurrentApp } from '../../../common/decorators/current-app.decorator';
import { RegisteredApp } from '../../../common/models/registered-app.model';

/**
 * GraphQL Object Type for SampleResource.
 */
@ObjectType('SampleResourceType')
export class SampleResourceType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  value: number;

  @Field()
  createdAt: Date;
}

/**
 * GraphQL Input Type for filtering SampleResources.
 */
@InputType('SampleResourceFilterInput')
export class SampleResourceFilterInput {
  @Field({ nullable: true })
  nameContains?: string;

  @Field(() => Int, { nullable: true })
  minValue?: number;
}

/**
 * Example GraphQL resolver for third-party applications to access SampleResource data.
 * Protected by JWT authentication and scope checks.
 */
@Resolver(() => SampleResourceType)
@UseGuards(JwtAuthGuard, ScopesGuard)
export class SampleResourceResolver {
  private readonly logger = new Logger(SampleResourceResolver.name);

  constructor(private readonly dataAccessService: DataAccessService) {}

  /**
   * GraphQL query to fetch a list of sample resources.
   * @param app - The authenticated application from the JWT.
   * @param filter - Optional filter criteria.
   * @returns An array of sample resources.
   */
  @Query(() => [SampleResourceType], { name: 'sampleResources' })
  @Scopes('sample:read', 'graphql:sample:read') // Example scopes
  async getSampleResources(
    @CurrentApp() app: RegisteredApp,
    @Args('filter', { type: () => SampleResourceFilterInput, nullable: true }) filter?: SampleResourceFilterInput,
  ): Promise<SampleResourceType[]> {
    this.logger.log(`App ${app.clientId} querying sampleResources with filter: ${JSON.stringify(filter)}`);
     if (!app || !app.id) {
        this.logger.warn(`Attempt to query sampleResources without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    // Adapt DataAccessService to handle GraphQL specific filtering/pagination if needed,
    // or map filter to a more generic queryOptions for the service.
    // For this example, we pass the filter and app to a conceptual method in DataAccessService.
    return this.dataAccessService.fetchSampleResourcesGraphQL(app, filter);
  }

  /**
   * GraphQL query to fetch a single sample resource by its ID.
   * @param app - The authenticated application.
   * @param id - The ID of the sample resource.
   * @returns The sample resource, or null if not found.
   */
  @Query(() => SampleResourceType, { name: 'sampleResource', nullable: true })
  @Scopes('sample:read', 'graphql:sample:read') // Example scopes
  async getSampleResourceById(
    @CurrentApp() app: RegisteredApp,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<SampleResourceType | null> {
    this.logger.log(`App ${app.clientId} querying sampleResource with ID: ${id}`);
     if (!app || !app.id) {
        this.logger.warn(`Attempt to query sampleResource ${id} without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    return this.dataAccessService.fetchSampleResourceByIdGraphQL(app, id);
  }

  // Placeholder for a mutation if needed in the future
  // @Mutation(() => SampleResourceType)
  // @Scopes('sample:write')
  // async createSampleResource(
  //   @CurrentApp() app: RegisteredApp,
  //   @Args('input') input: CreateSampleResourceInput,
  // ): Promise<SampleResourceType> {
  //   this.logger.log(`App ${app.clientId} creating sample resource.`);
  //   return this.dataAccessService.createSampleResourceGraphQL(app, input);
  // }
}