# Software Design Specification (SDS) for AnalyticsReporting.ApiEndpoints (REPO-ANALYTICS-004)

## 1. Introduction

This document outlines the software design specification for the `AnalyticsReporting.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints to access advertising performance reports and analytics. It provides merchants with data on campaign performance (ROAS, CPA, CTR), A/B test results, and customizable dashboards, enabling them to gain insights into their advertising efforts across multiple networks.

This SDS will detail the design of each file within the repository, including its purpose, dependencies, methods, and how it contributes to fulfilling the specified requirements.

**Architectural Style:** Microservices
**Framework:** NestJS 10.3.9
**Language:** TypeScript 5.4.5
**Technology Stack:** Node.js 20.15.0 (LTS), REST, JSON, JWT, Amazon API Gateway (as entry point), NestJS 10.3.9, OpenAPI 3.1.0, Amazon DynamoDB, Amazon RDS (PostgreSQL)

## 2. Global Configurations & Setup Files

### 2.1. `package.json`
   - **Purpose:** Manages Node.js project dependencies including NestJS framework, class-validator, class-transformer, @nestjs/swagger, and development tools. Defines scripts for running, building, and testing the application.
   - **Key Dependencies:**
     - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
     - `@nestjs/config`
     - `@nestjs/swagger`
     - `@nestjs/passport`, `passport`, `passport-jwt`
     - `class-validator`, `class-transformer`
     - `reflect-metadata`, `rxjs`
     - Dev Dependencies: `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `typescript`, `ts-loader`, `ts-node`, `@types/*`, `jest`, `supertest`, `eslint`, `prettier`
   - **Scripts:**
     - `start:dev`: Runs the application in development mode with hot-reloading.
     - `build`: Compiles the TypeScript code to JavaScript.
     - `start:prod`: Runs the built application in production.
     - `lint`: Lints the codebase.
     - `test`: Runs unit tests.
     - `test:e2e`: Runs end-to-end tests.
   - **Documentation:** Standard package.json file for a NestJS TypeScript project.

### 2.2. `tsconfig.json`
   - **Purpose:** Configures the TypeScript compiler, specifying target ECMAScript version, module system, decorators, paths, and strict type-checking options.
   - **Key Compiler Options:**
     - `module`: "commonjs"
     - `declaration`: true
     - `removeComments`: true
     - `emitDecoratorMetadata`: true
     - `experimentalDecorators`: true
     - `allowSyntheticDefaultImports`: true
     - `target`: "ES2021"
     - `sourceMap`: true
     - `outDir`: "./dist"
     - `baseUrl`: "./"
     - `incremental`: true
     - `strictNullChecks`: true
     - `noImplicitAny`: true
     - `strictBindCallApply`: true
     - `forceConsistentCasingInFileNames`: true
     - `noFallthroughCasesInSwitch`: true
     - `paths`: (As needed for module aliasing)
   - **Documentation:** TypeScript configuration file ensuring consistent compilation settings.

### 2.3. `nest-cli.json`
   - **Purpose:** Provides configuration for the NestJS command-line interface, including collection, sourceRoot, and compilerOptions for building the application.
   - **Content:**
     json
     {
       "$schema": "https://json.schemastore.org/nest-cli",
       "collection": "@nestjs/schematics",
       "sourceRoot": "src",
       "compilerOptions": {
         "deleteOutDir": true,
         "webpack": true,
         "tsConfigPath": "tsconfig.build.json"
       }
     }
     
   - **Documentation:** Configuration file for the NestJS CLI.

## 3. Application Entry Point & Root Module

### 3.1. `src/main.ts`
   - **Purpose:** Creates an instance of the NestJS application, sets up global middleware/pipes/filters, enables Swagger documentation, and starts the HTTP listener.
   - **Key Logic:**
     - Import `NestFactory` from `@nestjs/core`.
     - Import `AppModule` from `./app.module`.
     - Import `ClassValidationPipe` from `./common/pipes/class-validation.pipe`.
     - Import `HttpExceptionFilter` from `./common/filters/http-exception.filter`.
     - Import `ResponseInterceptor` from `./common/interceptors/response.interceptor`.
     - Import `DocumentBuilder`, `SwaggerModule` from `@nestjs/swagger`.
     - Import `ConfigService` from `@nestjs/config`.
   - **`bootstrap()` async function:**
     - Create application instance: `const app = await NestFactory.create(AppModule);`
     - Enable CORS: `app.enableCors();` (Configure as needed)
     - Global Pipes: `app.useGlobalPipes(new ClassValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));`
     - Global Filters: `app.useGlobalFilters(new HttpExceptionFilter());`
     - Global Interceptors: `app.useGlobalInterceptors(new ResponseInterceptor());`
     - Swagger Setup:
       - Create `DocumentBuilder` instance: `new DocumentBuilder().setTitle('Ad Manager - Analytics & Reporting API').setDescription('API endpoints for advertising performance reports and analytics.').setVersion('1.0').addBearerAuth().build();`
       - Create Swagger document: `const document = SwaggerModule.createDocument(app, config);`
       - Setup Swagger UI: `SwaggerModule.setup('api-docs/analytics', app, document);` (Ensure unique path if multiple Swagger docs exist in a monolith/gateway)
     - Get `ConfigService`: `const configService = app.get(ConfigService);`
     - Get port from config: `const port = configService.get<number>('ANALYTICS_API_PORT') || 3004;`
     - Start listener: `await app.listen(port);`
     - Log application start: `console.log(\`Analytics Reporting API is running on: ${await app.getUrl()}\`);`
   - **Requirement Mapping:** Implicitly supports all API requirements by setting up the server and documentation.

### 3.2. `src/app.module.ts`
   - **Purpose:** Imports all major modules of the application, including configuration and feature modules like `AnalyticsReportingV1Module`.
   - **Decorator:** `@Module`
   - **Imports:**
     - `ConfigModule` (from `./config/config.module`)
     - `AnalyticsReportingV1Module` (from `./modules/analytics-reporting/api/v1/api-v1.module`)
   - **Controllers:** `[]` (Root module usually doesn't have controllers)
   - **Providers:** `[]` (Root module usually doesn't have global providers unless essential)
   - **Requirement Mapping:** Aggregates modules that fulfill specific requirements.

## 4. Configuration Module

### 4.1. `src/config/config.module.ts`
   - **Purpose:** Uses NestJS `ConfigModule` to load environment variables and provide them application-wide through a `ConfigService`.
   - **Decorator:** `@Module`
   - **Imports:**
     - `NestConfigModule` from `@nestjs/config`.
   - **Configuration within imports:**
     - `NestConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', // or specific env files like .env.development, .env.production load: [() => ({ /* custom config objects if needed */ })], validate: (config) => { /* Joi or class-validator based validation for env vars */ return config; }})`
   - **Exports:** `NestConfigModule` (implicitly made global by `isGlobal: true`)
   - **Environment Variables to be considered (from `file_structure_json.configuration` and general needs):**
     - `ANALYTICS_API_PORT`
     - `JWT_SECRET`
     - `JWT_EXPIRATION_TIME`
     - `DYNAMODB_ANALYTICS_TABLE_NAME` (e.g., AdManagerAnalytics)
     - `DYNAMODB_ABTEST_RESULTS_TABLE_NAME` (e.g., AdManagerABTestResults)
     - `CORE_PLATFORM_API_URL`
     - `CORE_PLATFORM_API_KEY`
     - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (for AWS SDK, though better handled by IAM roles in production)
   - **Requirement Mapping:** Supports overall application operation.

## 5. Common Modules (Guards, Pipes, Interceptors, Filters)

### 5.1. `src/common/guards/jwt-auth.guard.ts`
   - **Purpose:** Extends `AuthGuard('jwt')` to protect routes. Validates JWT token from request headers and attaches user information to the request object.
   - **Class:** `JwtAuthGuard` extends `AuthGuard('jwt')`
   - **Decorator:** `@Injectable()`
   - **Method: `canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>`**
     - Logic: Calls `super.canActivate(context)`. Handles potential errors or custom logic post-authentication if needed.
     - Returns `true` if JWT is valid and user is authenticated, otherwise throws `UnauthorizedException` (handled by `super` or custom logic).
   - **Dependencies:** `passport`, `@nestjs/passport`, `@nestjs/jwt` (implicitly through Passport strategy setup elsewhere, typically in an AuthModule not detailed here but assumed present for JWT strategy registration).
   - **Requirement Mapping:** General security for all authenticated API endpoints.

### 5.2. `src/common/pipes/class-validation.pipe.ts`
   - **Purpose:** Automatically validates incoming request DTOs against their defined validation rules using `class-validator`. Transforms plain objects to class instances using `class-transformer`.
   - **Class:** `ClassValidationPipe` implements `PipeTransform`
   - **Decorator:** `@Injectable()`
   - **Constructor:** (Optional) Can take `ValidatorOptions` from `class-validator`.
   - **Method: `async transform(value: any, { metatype }: ArgumentMetadata): Promise<any>`**
     - Logic:
       - If `!metatype` or `!this.toValidate(metatype)`, return `value`.
       - Convert plain object to class instance: `const object = plainToClass(metatype, value);`
       - Validate the object: `const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true, /* other options */ });`
       - If `errors.length > 0`, throw `new BadRequestException(this.formatErrors(errors));`
       - Return `value` (or `object` if transformation is desired beyond validation).
   - **Private Method: `toValidate(metatype: Function): boolean`**
     - Logic: Checks if metatype is one of the basic JavaScript types (String, Boolean, Number, Array, Object). If so, validation is skipped.
   - **Private Method: `formatErrors(errors: ValidationError[]): any`**
     - Logic: Formats validation errors into a user-friendly structure.
   - **Dependencies:** `class-validator`, `class-transformer`, `@nestjs/common`.
   - **Requirement Mapping:** Ensures data integrity for all DTO-based request bodies and query parameters.

### 5.3. `src/common/interceptors/response.interceptor.ts`
   - **Purpose:** Wraps successful API responses in a consistent structure, e.g., `{ statusCode: number, message: string, data: any, success: boolean }`.
   - **Class:** `ResponseInterceptor<T>` implements `NestInterceptor<T, StandardResponse<T>>`
     - `StandardResponse<T> { statusCode: number; message: string; data: T; success: boolean; }` (Define this interface)
   - **Decorator:** `@Injectable()`
   - **Method: `intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>>`**
     - Logic:
       - Get HTTP context: `const ctx = context.switchToHttp();`
       - Get response object: `const response = ctx.getResponse<Response>();`
       - Use `next.handle().pipe(map(data => ({ statusCode: response.statusCode, message: 'Success', // Or derive from context/data data, success: true })));`
   - **Dependencies:** `rxjs/operators`, `@nestjs/common`.
   - **Requirement Mapping:** Provides consistent API experience.

### 5.4. `src/common/filters/http-exception.filter.ts`
   - **Purpose:** Catches all `HttpException` instances and formats them into a standardized JSON error response.
   - **Class:** `HttpExceptionFilter` implements `ExceptionFilter`
   - **Decorator:** `@Catch(HttpException)`
   - **Method: `catch(exception: HttpException, host: ArgumentsHost): void`**
     - Logic:
       - Get HTTP context: `const ctx = host.switchToHttp();`
       - Get response object: `const response = ctx.getResponse<Response>();`
       - Get request object: `const request = ctx.getRequest<Request>();`
       - Get status code: `const status = exception.getStatus();`
       - Get exception response: `const exceptionResponse = exception.getResponse();`
       - Format error message:
         typescript
         const errorResponseMessage = typeof exceptionResponse === 'string' 
           ? { message: exceptionResponse, error: exception.name }
           : (exceptionResponse as any);
         
       - Send JSON response:
         json
         response.status(status).json({
           statusCode: status,
           timestamp: new Date().toISOString(),
           path: request.url,
           success: false,
           ...errorResponseMessage
         });
         
   - **Dependencies:** `@nestjs/common`.
   - **Requirement Mapping:** Standardizes error reporting.

## 6. Analytics Reporting API V1 Module

### 6.1. `src/modules/analytics-reporting/api/v1/api-v1.module.ts`
   - **Purpose:** Aggregates all controllers, services, and providers related to the V1 Analytics Reporting API.
   - **Decorator:** `@Module`
   - **Imports:**
     - `ConfigModule` (if service needs direct config access, otherwise usually injected)
     - (Potentially a shared `DatabaseModule` or `DynamoDBModule` if data access is abstracted further, otherwise services will handle SDK directly or via providers)
   - **Controllers:**
     - `PerformanceV1Controller`
     - `ABTestV1Controller`
     - `DashboardV1Controller`
     - `ReportExportV1Controller`
     - `InsightsV1Controller`
   - **Providers:**
     - `AnalyticsReportingV1Service`
     - `PerformanceMetricCalculatorV1Service`
     - `{ provide: 'IAnalyticsDataProvider', useClass: AnalyticsDataProviderDynamoDBService }` (Assuming a concrete implementation like `AnalyticsDataProviderDynamoDBService`)
     - `{ provide: 'ICorePlatformDataProvider', useClass: CorePlatformDataProviderHttpService }` (Assuming a concrete implementation)
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002, REQ-ARP-003, REQ-ARP-004, REQ-ARP-008, REQ-CPSI-007, "3.1.1 (Reporting and Analytics - Advertising Specific)".

### 6.2. Constants

#### 6.2.1. `src/modules/analytics-reporting/api/v1/constants/report-types.enum.ts`
   - **Purpose:** Provides standardized names for report types.
   - **Enum:** `ReportType`
     - `CAMPAIGN_PERFORMANCE = 'CAMPAIGN_PERFORMANCE'`
     - `AD_SET_PERFORMANCE = 'AD_SET_PERFORMANCE'`
     - `AD_PERFORMANCE = 'AD_PERFORMANCE'`
     - `AGGREGATED_NETWORK_PERFORMANCE = 'AGGREGATED_NETWORK_PERFORMANCE'`
     - `AB_TEST_RESULT = 'AB_TEST_RESULT'`
   - **Requirement Mapping:** REQ-ARP-001, REQ-ARP-003.

#### 6.2.2. `src/modules/analytics-reporting/api/v1/constants/metric-names.enum.ts`
   - **Purpose:** Provides standardized names for performance metrics.
   - **Enum:** `MetricName`
     - `ROAS = 'ROAS'`
     - `CPA = 'CPA'`
     - `CTR = 'CTR'`
     - `IMPRESSIONS = 'IMPRESSIONS'`
     - `CLICKS = 'CLICKS'`
     - `CONVERSIONS = 'CONVERSIONS'`
     - `SPEND = 'SPEND'`
     - `REACH = 'REACH'`
     - `CONVERSION_RATE = 'CONVERSION_RATE'`
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002.

### 6.3. Data Transfer Objects (DTOs)

#### 6.3.1. Request DTOs (`src/modules/analytics-reporting/api/v1/dto/request/`)

##### 6.3.1.1. `performance-report-query.dto.ts` (`PerformanceReportQueryDto`)
   - **Purpose:** Defines structure for performance report queries.
   - **Properties:**
     - `startDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-01', description: 'Start date in YYYY-MM-DD format' })`)
     - `endDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-31', description: 'End date in YYYY-MM-DD format' })`)
     - `campaignIds?: string[]` (`@IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional({ type: [String], format: 'uuid', description: 'Filter by specific campaign IDs' })`)
     - `adNetworkIds?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ type: [String], description: 'Filter by specific ad network IDs (e.g., google, facebook)' })`)
     - `dimensions?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ example: ['campaign', 'adNetwork'], description: 'Dimensions to group by' })`)
     - `metrics?: MetricName[]` (`@IsArray() @IsEnum(MetricName, { each: true }) @IsOptional() @ApiPropertyOptional({ enum: MetricName, isArray: true, description: 'Specific metrics to include' })`)
     - `granularity?: 'daily' | 'weekly' | 'monthly' | 'summary'` (`@IsIn(['daily', 'weekly', 'monthly', 'summary']) @IsOptional() @ApiPropertyOptional({ enum: ['daily', 'weekly', 'monthly', 'summary'], description: 'Time granularity for the report' })`)
     - `page?: number` (`@IsInt() @Min(1) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })`)
     - `limit?: number` (`@IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ example: 10, description: 'Items per page for pagination' })`)
     - `sortBy?: string` (`@IsString() @IsOptional() @ApiPropertyOptional({ example: 'spend', description: 'Field to sort by' })`)
     - `sortOrder?: 'ASC' | 'DESC'` (`@IsIn(['ASC', 'DESC']) @IsOptional() @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Sort order' })`)
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002, REQ-ARP-003.

##### 6.3.1.2. `ab-test-report-query.dto.ts` (`ABTestReportQueryDto`)
   - **Purpose:** Defines structure for A/B test report queries.
   - **Properties:**
     - `testId: string` (`@IsUUID('4') @ApiProperty({ example: '...', description: 'A/B Test ID' })`)
     - `startDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-01' })`)
     - `endDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-31' })`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.1.3. `widget-config.dto.ts` (`WidgetConfigDto`)
   - **Purpose:** Defines structure for individual widget configurations.
   - **Properties:**
     - `widgetId?: string` (`@IsUUID('4') @IsOptional() @ApiPropertyOptional({ description: 'Unique ID for the widget, generated by system if not provided' })`)
     - `widgetType: string` (`@IsString() @IsNotEmpty() @ApiProperty({ example: 'line-chart', description: 'Type of widget (e.g., line-chart, bar-chart, kpi-card)' })`)
     - `title?: string` (`@IsString() @IsOptional() @ApiPropertyOptional({ example: 'Spend Over Time' })`)
     - `metrics: MetricName[]` (`@IsArray() @IsEnum(MetricName, { each: true }) @ArrayMinSize(1) @ApiProperty({ enum: MetricName, isArray: true, example: [MetricName.SPEND, MetricName.ROAS] })`)
     - `dimensions?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ example: ['date', 'campaignName'] })`)
     - `filters?: any` (`@IsObject() @IsOptional() @ApiPropertyOptional({ description: 'JSON object for widget-specific filters, e.g., { campaignId: "uuid" }' })`)
     - `chartOptions?: any` (`@IsObject() @IsOptional() @ApiPropertyOptional({ description: 'Specific chart rendering options' })`)
     - `size?: { w: number, h: number, x: number, y: number }` (`@IsObject() @ValidateNested() @Type(() => WidgetSizePositionDto) @IsOptional() @ApiPropertyOptional({ description: 'Widget size and position on the dashboard grid' })`)
       - Create `WidgetSizePositionDto` with properties `w, h, x, y` (all `@IsInt() @Min(0)`)
   - **Requirement Mapping:** REQ-ARP-003.

##### 6.3.1.4. `custom-dashboard-config.dto.ts` (`CustomDashboardConfigDto`)
   - **Purpose:** Defines structure for custom dashboard configurations.
   - **Properties:**
     - `dashboardName: string` (`@IsString() @IsNotEmpty() @Length(3, 100) @ApiProperty({ example: 'My Q1 Performance Dashboard' })`)
     - `widgets: WidgetConfigDto[]` (`@IsArray() @ValidateNested({ each: true }) @Type(() => WidgetConfigDto) @ArrayMinSize(0) @ApiProperty({ type: [WidgetConfigDto] })`)
   - **Requirement Mapping:** REQ-ARP-003.

##### 6.3.1.5. `report-export-query.dto.ts` (`ReportExportQueryDto`)
   - **Purpose:** Defines parameters for exporting reports.
   - **Properties:**
     - `reportType: ReportType` (`@IsEnum(ReportType) @ApiProperty({ enum: ReportType, example: ReportType.CAMPAIGN_PERFORMANCE })`)
     - `format: 'csv' | 'pdf'` (`@IsIn(['csv', 'pdf']) @ApiProperty({ enum: ['csv', 'pdf'], example: 'csv' })`)
     - `filters: PerformanceReportQueryDto` (`@ValidateNested() @Type(() => PerformanceReportQueryDto) @ApiProperty({ type: PerformanceReportQueryDto })`) // Can also be a more generic filter DTO if A/B test reports are exportable
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.3.2. Response DTOs (`src/modules/analytics-reporting/api/v1/dto/response/`)

##### 6.3.2.1. `ad-performance.dto.ts` (`AdPerformanceDto`)
   - **Purpose:** Defines structure for individual ad performance metrics.
   - **Properties:**
     - `adId: string` (`@ApiProperty()`)
     - `adName?: string` (`@ApiPropertyOptional()`)
     - `roas?: number` (`@ApiPropertyOptional()`)
     - `cpa?: number` (`@ApiPropertyOptional()`)
     - `ctr?: number` (`@ApiPropertyOptional()`)
     - `impressions: number` (`@ApiProperty()`)
     - `clicks: number` (`@ApiProperty()`)
     - `conversions: number` (`@ApiProperty()`)
     - `spend: number` (`@ApiProperty()`)
     - `reach?: number` (`@ApiPropertyOptional()`)
     - `conversionRate?: number` (`@ApiPropertyOptional()`)
   - **Requirement Mapping:** REQ-ARP-001.

##### 6.3.2.2. `ad-set-performance.dto.ts` (`AdSetPerformanceDto`)
   - **Purpose:** Defines structure for ad set performance metrics.
   - **Properties:**
     - `adSetId: string` (`@ApiProperty()`)
     - `adSetName: string` (`@ApiProperty()`)
     - `roas?: number` (`@ApiPropertyOptional()`)
     - `cpa?: number` (`@ApiPropertyOptional()`)
     - `ctr?: number` (`@ApiPropertyOptional()`)
     - `impressions: number` (`@ApiProperty()`)
     - `clicks: number` (`@ApiProperty()`)
     - `conversions: number` (`@ApiProperty()`)
     - `spend: number` (`@ApiProperty()`)
     - `reach?: number` (`@ApiPropertyOptional()`)
     - `conversionRate?: number` (`@ApiPropertyOptional()`)
     - `ads?: AdPerformanceDto[]` (`@ApiPropertyOptional({ type: [AdPerformanceDto] })`)
   - **Requirement Mapping:** REQ-ARP-001.

##### 6.3.2.3. `campaign-performance.dto.ts` (`CampaignPerformanceDto`)
   - **Purpose:** Defines structure for campaign performance metrics.
   - **Properties:**
     - `campaignId: string` (`@ApiProperty()`)
     - `campaignName: string` (`@ApiProperty()`)
     - `roas?: number` (`@ApiPropertyOptional()`)
     - `cpa?: number` (`@ApiPropertyOptional()`)
     - `ctr?: number` (`@ApiPropertyOptional()`)
     - `impressions: number` (`@ApiProperty()`)
     - `clicks: number` (`@ApiProperty()`)
     - `conversions: number` (`@ApiProperty()`)
     - `spend: number` (`@ApiProperty()`)
     - `reach?: number` (`@ApiPropertyOptional()`)
     - `conversionRate?: number` (`@ApiPropertyOptional()`)
     - `adNetworkId?: string` (`@ApiPropertyOptional({ description: 'Identifier for the ad network' })`)
     - `adNetworkName?: string` (`@ApiPropertyOptional({ description: 'Name of the ad network' })`)
     - `adSets?: AdSetPerformanceDto[]` (`@ApiPropertyOptional({ type: [AdSetPerformanceDto] })`)
     - `status?: string` (`@ApiPropertyOptional({ description: 'Current status of the campaign' })`) // REQ-CMO-007 refers to viewing status
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001.

##### 6.3.2.4. `aggregated-performance.dto.ts` (`AggregatedPerformanceDto`)
   - **Purpose:** Defines structure for aggregated performance metrics.
   - **Properties:**
     - `totalSpend: number` (`@ApiProperty()`)
     - `totalImpressions: number` (`@ApiProperty()`)
     - `totalClicks: number` (`@ApiProperty()`)
     - `totalConversions: number` (`@ApiProperty()`)
     - `averageRoas?: number` (`@ApiPropertyOptional()`)
     - `averageCpa?: number` (`@ApiPropertyOptional()`)
     - `averageCtr?: number` (`@ApiPropertyOptional()`)
     - `averageConversionRate?: number` (`@ApiPropertyOptional()`)
     - `totalReach?: number` (`@ApiPropertyOptional()`)
     - `breakdown?: CampaignPerformanceDto[] | any[]` (Define `any[]` more specifically if possible, e.g., `NetworkPerformanceDto[]`) (`@ApiPropertyOptional({ description: 'Breakdown by a dimension, e.g., per ad network or per campaign' })`)
     - `metricsDocumentationUrl?: string` (`@ApiPropertyOptional({ description: 'URL to documentation explaining standardized metrics and discrepancies.'})`) // For REQ-ARP-002
   - **Requirement Mapping:** REQ-ARP-002.

##### 6.3.2.5. `ab-test-variant-performance.dto.ts` (`ABTestVariantPerformanceDto`)
   - **Purpose:** Defines structure for A/B test variant performance.
   - **Properties:**
     - `variantId: string` (`@ApiProperty()`)
     - `variantName: string` (`@ApiProperty()`)
     - `conversionRate?: number` (`@ApiPropertyOptional()`)
     - `ctr?: number` (`@ApiPropertyOptional()`)
     - `cpa?: number` (`@ApiPropertyOptional()`)
     - `roas?: number` (`@ApiPropertyOptional()`)
     - `impressions: number` (`@ApiProperty()`)
     - `clicks: number` (`@ApiProperty()`)
     - `conversions: number` (`@ApiProperty()`)
     - `spend: number` (`@ApiProperty()`)
     - `isWinner?: boolean` (`@ApiPropertyOptional({ description: 'Indicates if this variant is the statistically significant winner' })`)
     - `confidenceLevel?: number` (`@ApiPropertyOptional({ example: 0.95, description: 'Confidence level if statistically significant' })`)
     - `pValue?: number` (`@ApiPropertyOptional({ example: 0.04, description: 'P-value for statistical significance test' })`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.2.6. `ab-test-result.dto.ts` (`ABTestResultDto`)
   - **Purpose:** Defines structure for A/B test results.
   - **Properties:**
     - `testId: string` (`@ApiProperty()`)
     - `testName: string` (`@ApiProperty()`)
     - `variants: ABTestVariantPerformanceDto[]` (`@ApiProperty({ type: [ABTestVariantPerformanceDto] })`)
     - `winningVariantId?: string` (`@ApiPropertyOptional({ description: 'ID of the statistically significant winning variant, if any' })`)
     - `statisticalSignificanceSummary?: string` (`@ApiPropertyOptional({ description: 'A summary of the statistical significance findings' })`)
     - `startDate?: string` (`@ApiPropertyOptional()`)
     - `endDate?: string` (`@ApiPropertyOptional()`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.2.7. `actionable-insight.dto.ts` (`ActionableInsightDto`)
   - **Purpose:** Defines structure for actionable insights.
   - **Properties:**
     - `insightId: string` (`@ApiProperty()`)
     - `title: string` (`@ApiProperty()`)
     - `description: string` (`@ApiProperty()`)
     - `recommendation?: string` (`@ApiPropertyOptional()`)
     - `relatedEntityType?: 'campaign' | 'adSet' | 'ad' | 'product' | 'audienceSegment'` (`@ApiPropertyOptional()`)
     - `relatedEntityId?: string` (`@ApiPropertyOptional()`)
     - `severity?: 'high' | 'medium' | 'low' | 'info'` (`@ApiPropertyOptional()`)
     - `insightType?: string` (`@ApiPropertyOptional({ example: 'PerformanceTrend', description: 'Type of insight, e.g., Anomaly, Trend, Opportunity' })`)
     - `supportingData?: any` (`@ApiPropertyOptional({ description: 'Data points supporting the insight' })`)
   - **Requirement Mapping:** REQ-ARP-008.

##### 6.3.2.8. `data-ingestion-status.dto.ts` (`DataIngestionStatusDto`)
   - **Purpose:** Defines structure for data ingestion status.
   - **Properties:**
     - `dataSource: string` (`@ApiProperty({ example: 'Google Ads Performance Data' })`)
     - `lastSuccessfulSync?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional()`)
     - `status: 'Healthy' | 'Syncing' | 'Delayed' | 'Error' | 'PendingInitialSync'` (`@ApiProperty()`)
     - `processedRecordsLastSync?: number` (`@ApiPropertyOptional()`)
     - `averageLatencyMsLastSync?: number` (`@ApiPropertyOptional()`)
     - `nextScheduledSync?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional()`)
     - `details?: string` (`@ApiPropertyOptional({ description: 'Additional details, especially in case of errors.' })`)
   - **Requirement Mapping:** REQ-ARP-005 (NFR, but API provides status).

### 6.4. Interfaces (`src/modules/analytics-reporting/api/v1/interfaces/`)

#### 6.4.1. `analytics-data-provider.interface.ts` (`IAnalyticsDataProvider`)
   - **Purpose:** Defines a contract for fetching processed campaign performance data, aggregated data, and A/B test results from data stores.
   - **Token:** `'IAnalyticsDataProvider'`
   - **Methods:**
     - `getCampaignPerformanceData(merchantId: string, query: PerformanceReportQueryDto): Promise<{ data: (CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto)[], totalCount: number }>`
       - Logic: Fetches detailed performance data based on query (dimensions, granularity determine the DTO type). Implements drill-down logic. Accesses data stored as per REQ-ARP-007 (e.g., DynamoDB).
     - `getAggregatedPerformanceData(merchantId: string, query: PerformanceReportQueryDto): Promise<AggregatedPerformanceDto>`
       - Logic: Fetches and aggregates performance data across specified dimensions.
     - `getABTestResults(merchantId: string, query: ABTestReportQueryDto): Promise<ABTestResultDto>`
       - Logic: Fetches A/B test results, including variant performance and possibly pre-calculated significance data.
     - `getRawDataForDashboardWidget(merchantId: string, widgetConfig: WidgetConfigDto): Promise<any>`
       - Logic: Fetches data specific to a dashboard widget configuration.
     - `getMerchantDashboardConfig(merchantId: string, dashboardId: string): Promise<CustomDashboardConfigDto | null>`
     - `saveMerchantDashboardConfig(merchantId: string, dashboardId: string, config: CustomDashboardConfigDto): Promise<CustomDashboardConfigDto>`
     - `listMerchantDashboards(merchantId: string): Promise<{id: string, name: string}[]>`
     - `getDataIngestionStatus(merchantId: string): Promise<DataIngestionStatusDto[]>`
       - Logic: Fetches status of various data ingestion pipelines relevant to analytics. REQ-ARP-005.
   - **Requirement Mapping:** REQ-ARP-007, REQ-ARP-003, REQ-ARP-005.
   - **Note:** Concrete implementation (e.g., `AnalyticsDataProviderDynamoDBService`) would handle interaction with DynamoDB using `DYNAMODB_ANALYTICS_TABLE_NAME` and `DYNAMODB_ABTEST_RESULTS_TABLE_NAME` from config.

#### 6.4.2. `core-platform-data.interface.ts` (`ICorePlatformDataProvider`)
   - **Purpose:** Defines a contract for fetching attributed order and sales data from the `[PlatformName]` core e-commerce platform.
   - **Token:** `'ICorePlatformDataProvider'`
   - **Methods:**
     - `getAttributedOrderData(merchantId: string, dateRange: { startDate: string, endDate: string }, attributionParams?: { campaignIds?: string[], adSetIds?: string[], adIds?: string[] }): Promise<{ orderId: string, orderValue: number, conversionTime: string, items: {productId: string, quantity: number, price: number}[] }[]>`
       - Logic: Makes HTTP calls to `CORE_PLATFORM_API_URL` using `CORE_PLATFORM_API_KEY` to fetch order data necessary for ROAS/CPA.
   - **Requirement Mapping:** REQ-CPSI-007.
   - **Note:** Concrete implementation (e.g., `CorePlatformDataProviderHttpService`) would use an HTTP client like `@nestjs/axios`.

### 6.5. Services (`src/modules/analytics-reporting/api/v1/services/`)

#### 6.5.1. `performance-metric-calculator.v1.service.ts` (`PerformanceMetricCalculatorV1Service`)
   - **Purpose:** Calculates key derived metrics like ROAS and CPA.
   - **Decorator:** `@Injectable()`
   - **Constructor:**
     - `constructor(@Inject('ICorePlatformDataProvider') private readonly corePlatformDataProvider: ICorePlatformDataProvider)`
   - **Methods:**
     - `public calculateRoas(spend: number, revenue: number): number`
       - Logic: `if (spend === 0) return 0; return parseFloat((revenue / spend).toFixed(2));` Handle division by zero.
     - `public calculateCpa(spend: number, conversions: number): number`
       - Logic: `if (conversions === 0) return 0; return parseFloat((spend / conversions).toFixed(2));` Handle division by zero.
     - `public calculateConversionRate(conversions: number, clicks: number): number`
       - Logic: `if (clicks === 0) return 0; return parseFloat(((conversions / clicks) * 100).toFixed(2));`
     - `public async enrichPerformanceDataWithDerivedMetrics<T extends { spend: number; clicks: number; conversions: number; campaignId?: string; adSetId?: string; adId?: string }>(performanceEntries: T[], merchantId: string, dateRange: { startDate: string, endDate: string }): Promise<(T & { roas?: number; cpa?: number; conversionRate?: number })[]>`
       - Logic:
         - For each entry, fetch relevant attributed sales data from `corePlatformDataProvider.getAttributedOrderData()` based on `merchantId`, `dateRange`, and attribution parameters (e.g., `campaignId` from entry).
         - Sum up `orderValue` to get `revenue` for that entry.
         - Calculate `roas`, `cpa`, `conversionRate` using the methods above.
         - Return enriched entries.
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-CPSI-007.

#### 6.5.2. `analytics-reporting.v1.service.ts` (`AnalyticsReportingV1Service`)
   - **Purpose:** Orchestrates fetching, processing, and formatting data for all analytics reports, dashboards, and insights.
   - **Decorator:** `@Injectable()`
   - **Constructor:**
     - `constructor(@Inject('IAnalyticsDataProvider') private readonly dataProvider: IAnalyticsDataProvider, private readonly metricCalculator: PerformanceMetricCalculatorV1Service, private readonly configService: ConfigService)`
   - **Methods:**
     - `public async getPerformanceReport(merchantId: string, query: PerformanceReportQueryDto): Promise<{ data: any[], totalCount: number, metadata?: any }>`
       - Logic:
         - Validate `merchantId`.
         - Call `dataProvider.getCampaignPerformanceData(merchantId, query)` to get raw/partially aggregated data.
         - If query requests ROAS/CPA/ConversionRate, and data needs enrichment (e.g., at campaign level), call `metricCalculator.enrichPerformanceDataWithDerivedMetrics` with appropriate date range from query.
         - Handles drill-down logic for REQ-ARP-001 by adjusting query to `dataProvider`.
         - If query implies aggregated (cross-network) view REQ-ARP-002:
           - Fetch data potentially from multiple sources or already aggregated by `dataProvider`.
           - Standardize metrics. Add `metricsDocumentationUrl` to response.
         - Apply pagination, sorting from `query`.
         - Return data in the expected DTO structure along with `totalCount`.
     - `public async getABTestReport(merchantId: string, query: ABTestReportQueryDto): Promise<ABTestResultDto>`
       - Logic:
         - Validate `merchantId`, `query.testId`.
         - Call `dataProvider.getABTestResults(merchantId, query)`.
         - If significance isn't pre-calculated by dataProvider, this service might perform/trigger statistical significance calculation (e.g., chi-squared test for conversion rates, t-test for continuous metrics) using a helper or library. (REQ-ARP-004)
         - Format results into `ABTestResultDto`.
     - `public async getCustomDashboardData(merchantId: string, dashboardId: string): Promise<any[]>` // Return type should be more specific, e.g., `WidgetDataDto[]`
       - Logic:
         - Fetch dashboard configuration using `dataProvider.getMerchantDashboardConfig(merchantId, dashboardId)`.
         - For each widget in the config:
           - Construct specific queries based on `widget.metrics`, `widget.dimensions`, `widget.filters`.
           - Call `dataProvider.getRawDataForDashboardWidget` or `getPerformanceReport` with tailored queries.
           - Enrich data with derived metrics if needed.
           - Format data for the specific `widget.widgetType`.
         - Return an array of widget data. (REQ-ARP-003)
     - `public async saveCustomDashboardConfig(merchantId: string, dashboardId: string | undefined, config: CustomDashboardConfigDto): Promise<CustomDashboardConfigDto>`
       - Logic:
         - Validate `merchantId`, `config`.
         - If `dashboardId` is not provided (new dashboard), generate one.
         - Call `dataProvider.saveMerchantDashboardConfig(merchantId, dashboardId, config)`. (REQ-ARP-003)
     - `public async listCustomDashboards(merchantId: string): Promise<{id: string, name: string}[]>`
       - Logic: Call `dataProvider.listMerchantDashboards(merchantId)`. (REQ-ARP-003)
     - `public async generateExportableReport(merchantId: string, query: ReportExportQueryDto): Promise<{ data: Buffer, fileName: string, contentType: string }>`
       - Logic:
         - Based on `query.reportType` and `query.filters`, fetch data (similar to `getPerformanceReport` or `getABTestReport`).
         - If `query.format === 'csv'`: Convert data to CSV format (use a library like `papaparse` or custom logic).
         - If `query.format === 'pdf'`: Convert data to PDF (use a library like `pdfmake` or `puppeteer` for rendering HTML to PDF).
         - Return buffer, filename, and content type. (REQ-ARP-003)
     - `public async getActionableInsights(merchantId: string, context?: any): Promise<ActionableInsightDto[]>`
       - Logic:
         - Fetch relevant performance data (e.g., trends, anomalies, comparisons).
         - Apply business rules or (future) ML models to identify insights (e.g., "Campaign X ROAS dropped by 30% last week", "Ad Creative Y has significantly higher CTR").
         - Format into `ActionableInsightDto[]`. (REQ-ARP-008)
     - `public async getDataIngestionStatus(merchantId: string): Promise<DataIngestionStatusDto[]>`
       - Logic: Call `dataProvider.getDataIngestionStatus(merchantId)`. (REQ-ARP-005 - NFR, reporting status)
   - **Requirement Mapping:** Covers all REQ-ARP and REQ-CMO-007, REQ-CPSI-007.

### 6.6. Controllers (`src/modules/analytics-reporting/api/v1/controllers/`)

General decorators for all controllers: `@ApiTags('Analytics Reporting V1')`, `@Controller('analytics/v1')`, `@UseGuards(JwtAuthGuard)`.
All merchant-specific endpoints will expect `x-merchant-id: string` in headers.

#### 6.6.1. `performance.v1.controller.ts` (`PerformanceV1Controller`)
   - **Path:** `analytics/v1/performance`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /campaigns` (`getCampaignPerformance`):
       - `@ApiOperation({ summary: 'Get detailed campaign performance data with drill-down capabilities.' })`
       - `@ApiOkResponse({ description: 'Campaign performance data retrieved successfully.', type: [CampaignPerformanceDto] })` // Type might be more generic array based on query
       - `@ApiQuery({ name: 'startDate', type: String, required: false, description: 'YYYY-MM-DD' })` ... (all relevant query params from `PerformanceReportQueryDto`)
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Query() query: PerformanceReportQueryDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<PaginatedResponseDto<CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto>>` (Define `PaginatedResponseDto`)
       - Logic: Calls `analyticsService.getPerformanceReport(merchantId, query)`.
       - Requirement Mapping: REQ-CMO-007, REQ-ARP-001.
     - `GET /aggregated` (`getAggregatedPerformance`):
       - `@ApiOperation({ summary: 'Get aggregated performance data across networks/campaigns.' })`
       - `@ApiOkResponse({ description: 'Aggregated performance data retrieved.', type: AggregatedPerformanceDto })`
       - (Similar `@ApiQuery` and `@ApiHeader` as above)
       - Parameters: `@Query() query: PerformanceReportQueryDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<AggregatedPerformanceDto>`
       - Logic: Calls `analyticsService.getPerformanceReport(merchantId, { ...query, granularity: 'summary' })` or a dedicated aggregation method.
       - Requirement Mapping: REQ-ARP-002.
     - `GET /ingestion-status` (`getDataIngestionStatus`):
       - `@ApiOperation({ summary: 'Get status of analytics data ingestion pipelines.' })`
       - `@ApiOkResponse({ description: 'Data ingestion statuses retrieved.', type: [DataIngestionStatusDto] })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<DataIngestionStatusDto[]>`
       - Logic: Calls `analyticsService.getDataIngestionStatus(merchantId)`.
       - Requirement Mapping: REQ-ARP-005.

#### 6.6.2. `abtest.v1.controller.ts` (`ABTestV1Controller`)
   - **Path:** `analytics/v1/abtests`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`getABTestResults`):
       - `@ApiOperation({ summary: 'Get A/B test results analysis.' })`
       - `@ApiOkResponse({ description: 'A/B test results retrieved.', type: ABTestResultDto })`
       - `@ApiQuery({ name: 'testId', type: String, required: true, description: 'UUID of the A/B test' })`
       - `@ApiQuery({ name: 'startDate', type: String, required: false, description: 'YYYY-MM-DD' })`
       - `@ApiQuery({ name: 'endDate', type: String, required: false, description: 'YYYY-MM-DD' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Query() query: ABTestReportQueryDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<ABTestResultDto>`
       - Logic: Calls `analyticsService.getABTestReport(merchantId, query)`.
       - Requirement Mapping: REQ-ARP-004.

#### 6.6.3. `dashboard.v1.controller.ts` (`DashboardV1Controller`)
   - **Path:** `analytics/v1/dashboards`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`listDashboards`):
       - `@ApiOperation({ summary: 'List all custom dashboards for the merchant.' })`
       - `@ApiOkResponse({ type: [{id: 'uuid', name: 'Dashboard Name'}] })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<{id: string, name: string}[]>`
       - Logic: Calls `analyticsService.listCustomDashboards(merchantId)`.
     - `POST /` (`createDashboardConfig`):
       - `@ApiOperation({ summary: 'Create a new custom dashboard configuration.' })`
       - `@ApiCreatedResponse({ description: 'Dashboard configuration created.', type: CustomDashboardConfigDto })`
       - `@ApiBody({ type: CustomDashboardConfigDto })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Body() configDto: CustomDashboardConfigDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.saveCustomDashboardConfig(merchantId, undefined, configDto)`.
     - `GET /:dashboardId` (`getDashboardConfig`):
       - `@ApiOperation({ summary: 'Get a specific custom dashboard configuration.' })`
       - `@ApiOkResponse({ description: 'Dashboard configuration retrieved.', type: CustomDashboardConfigDto })`
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.getCustomDashboardConfig(merchantId, dashboardId)`. (This method needs to be added to the service/provider interface)
     - `PUT /:dashboardId` (`updateDashboardConfig`):
       - `@ApiOperation({ summary: 'Update an existing custom dashboard configuration.' })`
       - `@ApiOkResponse({ description: 'Dashboard configuration updated.', type: CustomDashboardConfigDto })`
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid' })`
       - `@ApiBody({ type: CustomDashboardConfigDto })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Body() configDto: CustomDashboardConfigDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.saveCustomDashboardConfig(merchantId, dashboardId, configDto)`.
     - `GET /:dashboardId/data` (`getDashboardData`):
       - `@ApiOperation({ summary: 'Get data for a specific custom dashboard.' })`
       - `@ApiOkResponse({ description: 'Dashboard data retrieved.', type: [Object] })` // Define WidgetDataDto[]
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<any[]>` // Should be `WidgetDataDto[]`
       - Logic: Calls `analyticsService.getCustomDashboardData(merchantId, dashboardId)`.
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.6.4. `report-export.v1.controller.ts` (`ReportExportV1Controller`)
   - **Path:** `analytics/v1/report-exports`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`exportReport`):
       - `@ApiOperation({ summary: 'Generate and export a report in CSV or PDF format.' })`
       - `@ApiOkResponse({ description: 'Report file stream.' })` // Swagger might not fully represent stream, use appropriate content type.
       - `@Header('Content-Type', 'application/octet-stream')` // Or specific like 'text/csv', 'application/pdf'
       - `@ApiQuery({ name: 'reportType', enum: ReportType })`
       - `@ApiQuery({ name: 'format', enum: ['csv', 'pdf'] })`
       - (Other filter params from `PerformanceReportQueryDto` would be part of nested `filters` in `ReportExportQueryDto`)
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Query() query: ReportExportQueryDto`, `@Res({ passthrough: true }) res: Response`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<StreamableFile | void>`
       - Logic:
         - Calls `analyticsService.generateExportableReport(merchantId, query)`.
         - Sets response headers: `res.set({ 'Content-Type': result.contentType, 'Content-Disposition': \`attachment; filename="${result.fileName}"\`, });`
         - Returns `new StreamableFile(result.data)`.
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.6.5. `insights.v1.controller.ts` (`InsightsV1Controller`)
   - **Path:** `analytics/v1/insights`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`getActionableInsights`):
       - `@ApiOperation({ summary: 'Get actionable insights based on performance data.' })`
       - `@ApiOkResponse({ description: 'Actionable insights retrieved.', type: [ActionableInsightDto] })`
       - `@ApiQuery({ name: 'context', type: String, required: false, description: 'Optional context for insights, e.g., specific campaignId or "overall"' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier' })`
       - Parameters: `@Query('context') context?: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<ActionableInsightDto[]>`
       - Logic: Calls `analyticsService.getActionableInsights(merchantId, context ? JSON.parse(context) : undefined)`.
   - **Requirement Mapping:** REQ-ARP-008.

## 7. Data Storage Considerations (Conceptual for this API)

-   **Campaign Performance Logs & A/B Test Results (REQ-ARP-007):** Stored in Amazon DynamoDB. The `IAnalyticsDataProvider` implementation will be responsible for querying this data. Table names (`DYNAMODB_ANALYTICS_TABLE_NAME`, `DYNAMODB_ABTEST_RESULTS_TABLE_NAME`) will be sourced from `ConfigService`.
    -   Schema design for DynamoDB tables should support efficient querying by `merchantId`, date ranges, `campaignId`, `adSetId`, `adId`, `testId`, `variantId`. Use Global Secondary Indexes (GSIs) appropriately.
    -   Consider sort keys for time-series data (e.g., `timestamp` or `date#entityId`).
-   **Custom Dashboard Configurations:** Could be stored in DynamoDB or PostgreSQL, managed via `IAnalyticsDataProvider`.
-   **Order Data (for ROAS/CPA):** Fetched from `[PlatformName]` core platform via `ICorePlatformDataProvider` as per REQ-CPSI-007. Not stored directly in this microservice's primary datastore unless cached or temporarily processed.

## 8. Data Ingestion NFR (REQ-ARP-005)

-   While this API repository primarily serves data, the `AnalyticsReportingV1Service` and `PerformanceV1Controller` will expose an endpoint (`/performance/ingestion-status`) to report on the status, latency, and throughput of backend data ingestion pipelines as per REQ-ARP-005.
-   The actual ingestion pipelines (e.g., Lambda functions, Kinesis streams processing ad network data and core platform orders, populating DynamoDB) are outside the scope of this API repository but are critical dependencies for the data it serves. The `IAnalyticsDataProvider` will fetch status from a source where this information is maintained (e.g., a dedicated status table or CloudWatch metrics).

## 9. Security Considerations

-   All endpoints (except potentially Swagger docs) are protected by `JwtAuthGuard`.
-   Merchant-specific data access is enforced by requiring `x-merchant-id` header and using it in all service and data provider calls to scope data.
-   Input validation using `ClassValidationPipe` prevents common injection flaws at the DTO level.
-   Standard NestJS security practices are followed.

## 10. Error Handling

-   `HttpExceptionFilter` provides global, standardized JSON error responses.
-   Services should throw appropriate `HttpException` (e.g., `NotFoundException`, `BadRequestException`, `InternalServerErrorException`) for business logic errors or data access issues.

## 11. Future Considerations / Extensibility
-   **Report Scheduling (FeatureToggle: `enableReportScheduling`):**
    -   If enabled, new DTOs for scheduling parameters (frequency, recipients).
    -   New controller endpoints (`POST /scheduled-reports`, `GET /scheduled-reports`).
    -   Service logic to store schedules and integrate with a job scheduler (e.g., cron, AWS EventBridge Scheduler) to trigger `generateExportableReport` and email/notify.
-   **Advanced Insight Generation (FeatureToggle: `enableAdvancedInsightGeneration`):**
    -   `AnalyticsReportingV1Service.getActionableInsights` could integrate with more sophisticated analytics engines or ML models.
-   **Versioning:** The current module is `V1`. Future API versions can be introduced as new modules (e.g., `api-v2.module.ts`) allowing parallel existence.
markdown
# Software Design Specification (SDS) for AnalyticsReporting.ApiEndpoints (REPO-ANALYTICS-004)

## 1. Introduction

This document outlines the software design specification for the `AnalyticsReporting.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints to access advertising performance reports and analytics. It provides merchants with data on campaign performance (ROAS, CPA, CTR), A/B test results, and customizable dashboards, enabling them to gain insights into their advertising efforts across multiple networks.

This SDS will detail the design of each file within the repository, including its purpose, dependencies, methods, and how it contributes to fulfilling the specified requirements.

**Architectural Style:** Microservices
**Framework:** NestJS 10.3.9
**Language:** TypeScript 5.4.5
**Technology Stack:** Node.js 20.15.0 (LTS), REST, JSON, JWT, Amazon API Gateway (as entry point), NestJS 10.3.9, OpenAPI 3.1.0, Amazon DynamoDB, Amazon RDS (PostgreSQL)

## 2. Global Configurations & Setup Files

### 2.1. `package.json`
   - **Purpose:** Manages Node.js project dependencies including NestJS framework, class-validator, class-transformer, @nestjs/swagger, and development tools. Defines scripts for running, building, and testing the application.
   - **Key Dependencies:**
     - `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
     - `@nestjs/config`
     - `@nestjs/swagger`
     - `@nestjs/passport`, `passport`, `passport-jwt`
     - `class-validator`, `class-transformer`
     - `reflect-metadata`, `rxjs`
     - Dev Dependencies: `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `typescript`, `ts-loader`, `ts-node`, `@types/*`, `jest`, `supertest`, `eslint`, `prettier`
   - **Scripts:**
     - `start:dev`: Runs the application in development mode with hot-reloading.
     - `build`: Compiles the TypeScript code to JavaScript.
     - `start:prod`: Runs the built application in production.
     - `lint`: Lints the codebase.
     - `test`: Runs unit tests.
     - `test:e2e`: Runs end-to-end tests.
   - **Documentation:** Standard package.json file for a NestJS TypeScript project.

### 2.2. `tsconfig.json`
   - **Purpose:** Configures the TypeScript compiler, specifying target ECMAScript version, module system, decorators, paths, and strict type-checking options.
   - **Key Compiler Options:**
     - `module`: "commonjs"
     - `declaration`: true
     - `removeComments`: true
     - `emitDecoratorMetadata`: true
     - `experimentalDecorators`: true
     - `allowSyntheticDefaultImports`: true
     - `target`: "ES2021"
     - `sourceMap`: true
     - `outDir`: "./dist"
     - `baseUrl`: "./"
     - `incremental`: true
     - `strictNullChecks`: true
     - `noImplicitAny`: true
     - `strictBindCallApply`: true
     - `forceConsistentCasingInFileNames`: true
     - `noFallthroughCasesInSwitch`: true
     - `paths`: (As needed for module aliasing)
   - **Documentation:** TypeScript configuration file ensuring consistent compilation settings.

### 2.3. `nest-cli.json`
   - **Purpose:** Provides configuration for the NestJS command-line interface, including collection, sourceRoot, and compilerOptions for building the application.
   - **Content:**
     json
     {
       "$schema": "https://json.schemastore.org/nest-cli",
       "collection": "@nestjs/schematics",
       "sourceRoot": "src",
       "compilerOptions": {
         "deleteOutDir": true,
         "webpack": true,
         "tsConfigPath": "tsconfig.build.json"
       }
     }
     
   - **Documentation:** Configuration file for the NestJS CLI.

## 3. Application Entry Point & Root Module

### 3.1. `src/main.ts`
   - **Purpose:** Creates an instance of the NestJS application, sets up global middleware/pipes/filters, enables Swagger documentation, and starts the HTTP listener.
   - **Key Logic:**
     - Import `NestFactory` from `@nestjs/core`.
     - Import `AppModule` from `./app.module`.
     - Import `ClassValidationPipe` from `./common/pipes/class-validation.pipe`.
     - Import `HttpExceptionFilter` from `./common/filters/http-exception.filter`.
     - Import `ResponseInterceptor` from `./common/interceptors/response.interceptor`.
     - Import `DocumentBuilder`, `SwaggerModule` from `@nestjs/swagger`.
     - Import `ConfigService` from `@nestjs/config`.
   - **`bootstrap()` async function:**
     - Create application instance: `const app = await NestFactory.create(AppModule);`
     - Enable CORS: `app.enableCors();` (Configure as needed)
     - Global Pipes: `app.useGlobalPipes(new ClassValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));`
     - Global Filters: `app.useGlobalFilters(new HttpExceptionFilter());`
     - Global Interceptors: `app.useGlobalInterceptors(new ResponseInterceptor());`
     - Swagger Setup:
       - Create `DocumentBuilder` instance: `new DocumentBuilder().setTitle('Ad Manager - Analytics & Reporting API').setDescription('API endpoints for advertising performance reports and analytics.').setVersion('1.0').addBearerAuth().build();`
       - Create Swagger document: `const document = SwaggerModule.createDocument(app, config);`
       - Setup Swagger UI: `SwaggerModule.setup('api-docs/analytics', app, document);` (Ensure unique path if multiple Swagger docs exist in a monolith/gateway)
     - Get `ConfigService`: `const configService = app.get(ConfigService);`
     - Get port from config: `const port = configService.get<number>('ANALYTICS_API_PORT') || 3004;`
     - Start listener: `await app.listen(port);`
     - Log application start: `console.log(\`Analytics Reporting API is running on: ${await app.getUrl()}\`);`
   - **Requirement Mapping:** Implicitly supports all API requirements by setting up the server and documentation.

### 3.2. `src/app.module.ts`
   - **Purpose:** Imports all major modules of the application, including configuration and feature modules like `AnalyticsReportingV1Module`.
   - **Decorator:** `@Module`
   - **Imports:**
     - `ConfigModule` (from `./config/config.module`)
     - `AnalyticsReportingV1Module` (from `./modules/analytics-reporting/api/v1/api-v1.module`)
   - **Controllers:** `[]` (Root module usually doesn't have controllers)
   - **Providers:** `[]` (Root module usually doesn't have global providers unless essential)
   - **Requirement Mapping:** Aggregates modules that fulfill specific requirements.

## 4. Configuration Module

### 4.1. `src/config/config.module.ts`
   - **Purpose:** Uses NestJS `ConfigModule` to load environment variables and provide them application-wide through a `ConfigService`.
   - **Decorator:** `@Module`
   - **Imports:**
     - `NestConfigModule` from `@nestjs/config`.
   - **Configuration within imports:**
     - `NestConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', // or specific env files like .env.development, .env.production load: [() => ({ /* custom config objects if needed */ })], validate: (config) => { /* Joi or class-validator based validation for env vars */ return config; }})`
   - **Exports:** `NestConfigModule` (implicitly made global by `isGlobal: true`)
   - **Environment Variables to be considered (from `file_structure_json.configuration` and general needs):**
     - `ANALYTICS_API_PORT`
     - `JWT_SECRET`
     - `JWT_EXPIRATION_TIME`
     - `DYNAMODB_ANALYTICS_TABLE_NAME` (e.g., AdManagerAnalytics)
     - `DYNAMODB_ABTEST_RESULTS_TABLE_NAME` (e.g., AdManagerABTestResults)
     - `CORE_PLATFORM_API_URL`
     - `CORE_PLATFORM_API_KEY`
     - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (for AWS SDK, though better handled by IAM roles in production)
   - **Requirement Mapping:** Supports overall application operation.

## 5. Common Modules (Guards, Pipes, Interceptors, Filters)

### 5.1. `src/common/guards/jwt-auth.guard.ts`
   - **Purpose:** Extends `AuthGuard('jwt')` to protect routes. Validates JWT token from request headers and attaches user information to the request object.
   - **Class:** `JwtAuthGuard` extends `AuthGuard('jwt')`
   - **Decorator:** `@Injectable()`
   - **Method: `canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>`**
     - Logic: Calls `super.canActivate(context)`. Handles potential errors or custom logic post-authentication if needed.
     - Returns `true` if JWT is valid and user is authenticated, otherwise throws `UnauthorizedException` (handled by `super` or custom logic).
   - **Dependencies:** `passport`, `@nestjs/passport`, `@nestjs/jwt` (implicitly through Passport strategy setup elsewhere, typically in an AuthModule not detailed here but assumed present for JWT strategy registration).
   - **Requirement Mapping:** General security for all authenticated API endpoints.

### 5.2. `src/common/pipes/class-validation.pipe.ts`
   - **Purpose:** Automatically validates incoming request DTOs against their defined validation rules using `class-validator`. Transforms plain objects to class instances using `class-transformer`.
   - **Class:** `ClassValidationPipe` implements `PipeTransform`
   - **Decorator:** `@Injectable()`
   - **Constructor:** (Optional) Can take `ValidatorOptions` from `class-validator`.
   - **Method: `async transform(value: any, { metatype }: ArgumentMetadata): Promise<any>`**
     - Logic:
       - If `!metatype` or `!this.toValidate(metatype)`, return `value`.
       - Convert plain object to class instance: `const object = plainToClass(metatype, value);`
       - Validate the object: `const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true, /* other options */ });`
       - If `errors.length > 0`, throw `new BadRequestException(this.formatErrors(errors));`
       - Return `value` (or `object` if transformation is desired beyond validation).
   - **Private Method: `toValidate(metatype: Function): boolean`**
     - Logic: Checks if metatype is one of the basic JavaScript types (String, Boolean, Number, Array, Object). If so, validation is skipped.
   - **Private Method: `formatErrors(errors: ValidationError[]): any`**
     - Logic: Formats validation errors into a user-friendly structure.
   - **Dependencies:** `class-validator`, `class-transformer`, `@nestjs/common`.
   - **Requirement Mapping:** Ensures data integrity for all DTO-based request bodies and query parameters.

### 5.3. `src/common/interceptors/response.interceptor.ts`
   - **Purpose:** Wraps successful API responses in a consistent structure, e.g., `{ statusCode: number, message: string, data: any, success: boolean }`.
   - **Class:** `ResponseInterceptor<T>` implements `NestInterceptor<T, StandardResponse<T>>`
     - `StandardResponse<T> { statusCode: number; message: string; data: T; success: boolean; }` (Define this interface)
   - **Decorator:** `@Injectable()`
   - **Method: `intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>>`**
     - Logic:
       - Get HTTP context: `const ctx = context.switchToHttp();`
       - Get response object: `const response = ctx.getResponse<Response>();`
       - Use `next.handle().pipe(map(data => ({ statusCode: response.statusCode, message: 'Success', // Or derive from context/data data, success: true })));`
   - **Dependencies:** `rxjs/operators`, `@nestjs/common`.
   - **Requirement Mapping:** Provides consistent API experience.

### 5.4. `src/common/filters/http-exception.filter.ts`
   - **Purpose:** Catches all `HttpException` instances and formats them into a standardized JSON error response.
   - **Class:** `HttpExceptionFilter` implements `ExceptionFilter`
   - **Decorator:** `@Catch(HttpException)`
   - **Method: `catch(exception: HttpException, host: ArgumentsHost): void`**
     - Logic:
       - Get HTTP context: `const ctx = host.switchToHttp();`
       - Get response object: `const response = ctx.getResponse<Response>();`
       - Get request object: `const request = ctx.getRequest<Request>();`
       - Get status code: `const status = exception.getStatus();`
       - Get exception response: `const exceptionResponse = exception.getResponse();`
       - Format error message:
         typescript
         const errorResponseMessage = typeof exceptionResponse === 'string' 
           ? { message: exceptionResponse, error: exception.name }
           : (exceptionResponse as any);
         
       - Send JSON response:
         json
         response.status(status).json({
           statusCode: status,
           timestamp: new Date().toISOString(),
           path: request.url,
           success: false,
           ...errorResponseMessage
         });
         
   - **Dependencies:** `@nestjs/common`.
   - **Requirement Mapping:** Standardizes error reporting.

## 6. Analytics Reporting API V1 Module

### 6.1. `src/modules/analytics-reporting/api/v1/api-v1.module.ts`
   - **Purpose:** Aggregates all controllers, services, and providers related to the V1 Analytics Reporting API.
   - **Decorator:** `@Module`
   - **Imports:**
     - `ConfigModule` (if service needs direct config access, otherwise usually injected)
     - (Potentially a shared `DatabaseModule` or `DynamoDBModule` if data access is abstracted further, otherwise services will handle SDK directly or via providers)
   - **Controllers:**
     - `PerformanceV1Controller`
     - `ABTestV1Controller`
     - `DashboardV1Controller`
     - `ReportExportV1Controller`
     - `InsightsV1Controller`
   - **Providers:**
     - `AnalyticsReportingV1Service`
     - `PerformanceMetricCalculatorV1Service`
     - `{ provide: 'IAnalyticsDataProvider', useClass: AnalyticsDataProviderDynamoDBService }` (Assuming a concrete implementation like `AnalyticsDataProviderDynamoDBService`)
     - `{ provide: 'ICorePlatformDataProvider', useClass: CorePlatformDataProviderHttpService }` (Assuming a concrete implementation)
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002, REQ-ARP-003, REQ-ARP-004, REQ-ARP-008, REQ-CPSI-007, "3.1.1 (Reporting and Analytics - Advertising Specific)".

### 6.2. Constants

#### 6.2.1. `src/modules/analytics-reporting/api/v1/constants/report-types.enum.ts`
   - **Purpose:** Provides standardized names for report types.
   - **Enum:** `ReportType`
     - `CAMPAIGN_PERFORMANCE = 'CAMPAIGN_PERFORMANCE'`
     - `AD_SET_PERFORMANCE = 'AD_SET_PERFORMANCE'`
     - `AD_PERFORMANCE = 'AD_PERFORMANCE'`
     - `AGGREGATED_NETWORK_PERFORMANCE = 'AGGREGATED_NETWORK_PERFORMANCE'`
     - `AB_TEST_RESULT = 'AB_TEST_RESULT'`
   - **Requirement Mapping:** REQ-ARP-001, REQ-ARP-003.

#### 6.2.2. `src/modules/analytics-reporting/api/v1/constants/metric-names.enum.ts`
   - **Purpose:** Provides standardized names for performance metrics.
   - **Enum:** `MetricName`
     - `ROAS = 'ROAS'`
     - `CPA = 'CPA'`
     - `CTR = 'CTR'`
     - `IMPRESSIONS = 'IMPRESSIONS'`
     - `CLICKS = 'CLICKS'`
     - `CONVERSIONS = 'CONVERSIONS'`
     - `SPEND = 'SPEND'`
     - `REACH = 'REACH'`
     - `CONVERSION_RATE = 'CONVERSION_RATE'`
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002.

### 6.3. Data Transfer Objects (DTOs)

#### 6.3.1. Request DTOs (`src/modules/analytics-reporting/api/v1/dto/request/`)

##### 6.3.1.1. `performance-report-query.dto.ts` (`PerformanceReportQueryDto`)
   - **Purpose:** Defines structure for performance report queries.
   - **Properties:**
     - `startDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-01', description: 'Start date in YYYY-MM-DD format' })`)
     - `endDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-31', description: 'End date in YYYY-MM-DD format' })`)
     - `campaignIds?: string[]` (`@IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional({ type: [String], format: 'uuid', description: 'Filter by specific campaign IDs' })`)
     - `adNetworkIds?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ type: [String], description: 'Filter by specific ad network IDs (e.g., google, facebook)' })`)
     - `dimensions?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ example: ['campaign', 'adNetwork'], description: 'Dimensions to group by' })`)
     - `metrics?: MetricName[]` (`@IsArray() @IsEnum(MetricName, { each: true }) @IsOptional() @ApiPropertyOptional({ enum: MetricName, isArray: true, description: 'Specific metrics to include' })`)
     - `granularity?: 'daily' | 'weekly' | 'monthly' | 'summary'` (`@IsIn(['daily', 'weekly', 'monthly', 'summary']) @IsOptional() @ApiPropertyOptional({ enum: ['daily', 'weekly', 'monthly', 'summary'], description: 'Time granularity for the report' })`)
     - `page?: number` (`@IsInt() @Min(1) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })`)
     - `limit?: number` (`@IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ example: 10, description: 'Items per page for pagination' })`)
     - `sortBy?: string` (`@IsString() @IsOptional() @ApiPropertyOptional({ example: 'spend', description: 'Field to sort by' })`)
     - `sortOrder?: 'ASC' | 'DESC'` (`@IsIn(['ASC', 'DESC']) @IsOptional() @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Sort order' })`)
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-ARP-002, REQ-ARP-003.

##### 6.3.1.2. `ab-test-report-query.dto.ts` (`ABTestReportQueryDto`)
   - **Purpose:** Defines structure for A/B test report queries.
   - **Properties:**
     - `testId: string` (`@IsUUID('4') @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'A/B Test ID' })`)
     - `startDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-01' })`)
     - `endDate?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-01-31' })`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.1.3. `widget-config.dto.ts` (`WidgetConfigDto`)
   - **Purpose:** Defines structure for individual widget configurations.
   - **Class:** `WidgetSizePositionDto`
     - `w: number` (`@IsInt() @Min(1) @ApiProperty()`)
     - `h: number` (`@IsInt() @Min(1) @ApiProperty()`)
     - `x: number` (`@IsInt() @Min(0) @ApiProperty()`)
     - `y: number` (`@IsInt() @Min(0) @ApiProperty()`)
   - **Class:** `WidgetConfigDto`
     - `widgetId?: string` (`@IsUUID('4') @IsOptional() @ApiPropertyOptional({ description: 'Unique ID for the widget, generated by system if not provided' })`)
     - `widgetType: string` (`@IsString() @IsNotEmpty() @ApiProperty({ example: 'line-chart', description: 'Type of widget (e.g., line-chart, bar-chart, kpi-card)' })`)
     - `title?: string` (`@IsString() @IsOptional() @ApiPropertyOptional({ example: 'Spend Over Time' })`)
     - `metrics: MetricName[]` (`@IsArray() @IsEnum(MetricName, { each: true }) @ArrayMinSize(1) @ApiProperty({ enum: MetricName, isArray: true, example: [MetricName.SPEND, MetricName.ROAS] })`)
     - `dimensions?: string[]` (`@IsArray() @IsString({ each: true }) @IsOptional() @ApiPropertyOptional({ example: ['date', 'campaignName'] })`)
     - `filters?: any` (`@IsObject() @IsOptional() @ApiPropertyOptional({ description: 'JSON object for widget-specific filters, e.g., { campaignId: "uuid" }' })`)
     - `chartOptions?: any` (`@IsObject() @IsOptional() @ApiPropertyOptional({ description: 'Specific chart rendering options' })`)
     - `size?: WidgetSizePositionDto` (`@IsObject() @ValidateNested() @Type(() => WidgetSizePositionDto) @IsOptional() @ApiPropertyOptional({ description: 'Widget size and position on the dashboard grid' })`)
   - **Requirement Mapping:** REQ-ARP-003.

##### 6.3.1.4. `custom-dashboard-config.dto.ts` (`CustomDashboardConfigDto`)
   - **Purpose:** Defines structure for custom dashboard configurations.
   - **Properties:**
     - `dashboardName: string` (`@IsString() @IsNotEmpty() @Length(3, 100) @ApiProperty({ example: 'My Q1 Performance Dashboard' })`)
     - `widgets: WidgetConfigDto[]` (`@IsArray() @ValidateNested({ each: true }) @Type(() => WidgetConfigDto) @ArrayMinSize(0) @ApiProperty({ type: [WidgetConfigDto] })`)
   - **Requirement Mapping:** REQ-ARP-003.

##### 6.3.1.5. `report-export-query.dto.ts` (`ReportExportQueryDto`)
   - **Purpose:** Defines parameters for exporting reports.
   - **Properties:**
     - `reportType: ReportType` (`@IsEnum(ReportType) @ApiProperty({ enum: ReportType, example: ReportType.CAMPAIGN_PERFORMANCE })`)
     - `format: 'csv' | 'pdf'` (`@IsIn(['csv', 'pdf']) @ApiProperty({ enum: ['csv', 'pdf'], example: 'csv' })`)
     - `filters: PerformanceReportQueryDto` (`@ValidateNested() @Type(() => PerformanceReportQueryDto) @ApiProperty({ type: PerformanceReportQueryDto })`) // Can also be a more generic filter DTO if A/B test reports are exportable
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.3.2. Response DTOs (`src/modules/analytics-reporting/api/v1/dto/response/`)

##### 6.3.2.1. `ad-performance.dto.ts` (`AdPerformanceDto`)
   - **Purpose:** Defines structure for individual ad performance metrics.
   - **Properties:**
     - `adId: string` (`@ApiProperty({ example: 'a3e6c1f8-6d3b-4f1a-8c9e-2a7b4d0f8e9c' })`)
     - `adName?: string` (`@ApiPropertyOptional({ example: 'Summer Sale Ad 1' })`)
     - `roas?: number` (`@ApiPropertyOptional({ example: 4.5, type: 'number', format: 'float' })`)
     - `cpa?: number` (`@ApiPropertyOptional({ example: 10.25, type: 'number', format: 'float' })`)
     - `ctr?: number` (`@ApiPropertyOptional({ example: 2.1, type: 'number', format: 'float' })`)
     - `impressions: number` (`@ApiProperty({ example: 10000 })`)
     - `clicks: number` (`@ApiProperty({ example: 210 })`)
     - `conversions: number` (`@ApiProperty({ example: 20 })`)
     - `spend: number` (`@ApiProperty({ example: 205.00, type: 'number', format: 'float' })`)
     - `reach?: number` (`@ApiPropertyOptional({ example: 8000 })`)
     - `conversionRate?: number` (`@ApiPropertyOptional({ example: 9.52, type: 'number', format: 'float', description: 'Conversions per click (%)' })`)
   - **Requirement Mapping:** REQ-ARP-001.

##### 6.3.2.2. `ad-set-performance.dto.ts` (`AdSetPerformanceDto`)
   - **Purpose:** Defines structure for ad set performance metrics.
   - **Properties:**
     - `adSetId: string` (`@ApiProperty({ example: 'b2d5e0e7-5c2a-4e09-8b8f-1a6c3c0e7d8b' })`)
     - `adSetName: string` (`@ApiProperty({ example: 'Target Audience: Young Professionals' })`)
     - `roas?: number` (`@ApiPropertyOptional({ example: 5.1 })`)
     - `cpa?: number` (`@ApiPropertyOptional({ example: 9.80 })`)
     - `ctr?: number` (`@ApiPropertyOptional({ example: 2.3 })`)
     - `impressions: number` (`@ApiProperty({ example: 50000 })`)
     - `clicks: number` (`@ApiProperty({ example: 1150 })`)
     - `conversions: number` (`@ApiProperty({ example: 100 })`)
     - `spend: number` (`@ApiProperty({ example: 980.00 })`)
     - `reach?: number` (`@ApiPropertyOptional({ example: 40000 })`)
     - `conversionRate?: number` (`@ApiPropertyOptional({ example: 8.7 })`)
     - `ads?: AdPerformanceDto[]` (`@ApiPropertyOptional({ type: [AdPerformanceDto] })`)
   - **Requirement Mapping:** REQ-ARP-001.

##### 6.3.2.3. `campaign-performance.dto.ts` (`CampaignPerformanceDto`)
   - **Purpose:** Defines structure for campaign performance metrics.
   - **Properties:**
     - `campaignId: string` (`@ApiProperty({ example: 'c1c4d9d6-4b19-4c98-9a7e-09f8e7d6c5b3' })`)
     - `campaignName: string` (`@ApiProperty({ example: 'Q4 Holiday Campaign' })`)
     - `roas?: number` (`@ApiPropertyOptional({ example: 6.2 })`)
     - `cpa?: number` (`@ApiPropertyOptional({ example: 8.50 })`)
     - `ctr?: number` (`@ApiPropertyOptional({ example: 2.5 })`)
     - `impressions: number` (`@ApiProperty({ example: 200000 })`)
     - `clicks: number` (`@ApiProperty({ example: 5000 })`)
     - `conversions: number` (`@ApiProperty({ example: 500 })`)
     - `spend: number` (`@ApiProperty({ example: 4250.00 })`)
     - `reach?: number` (`@ApiPropertyOptional({ example: 150000 })`)
     - `conversionRate?: number` (`@ApiPropertyOptional({ example: 10.0 })`)
     - `adNetworkId?: string` (`@ApiPropertyOptional({ description: 'Identifier for the ad network', example: 'google-ads' })`)
     - `adNetworkName?: string` (`@ApiPropertyOptional({ description: 'Name of the ad network', example: 'Google Ads' })`)
     - `adSets?: AdSetPerformanceDto[]` (`@ApiPropertyOptional({ type: [AdSetPerformanceDto] })`)
     - `status?: string` (`@ApiPropertyOptional({ description: 'Current status of the campaign', example: 'Active' })`) // REQ-CMO-007 refers to viewing status
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001.

##### 6.3.2.4. `aggregated-performance.dto.ts` (`AggregatedPerformanceDto`)
   - **Purpose:** Defines structure for aggregated performance metrics.
   - **Properties:**
     - `totalSpend: number` (`@ApiProperty({ example: 15000.00 })`)
     - `totalImpressions: number` (`@ApiProperty({ example: 1000000 })`)
     - `totalClicks: number` (`@ApiProperty({ example: 25000 })`)
     - `totalConversions: number` (`@ApiProperty({ example: 2000 })`)
     - `averageRoas?: number` (`@ApiPropertyOptional({ example: 5.8 })`)
     - `averageCpa?: number` (`@ApiPropertyOptional({ example: 7.50 })`)
     - `averageCtr?: number` (`@ApiPropertyOptional({ example: 2.5 })`)
     - `averageConversionRate?: number` (`@ApiPropertyOptional({ example: 8.0 })`)
     - `totalReach?: number` (`@ApiPropertyOptional({ example: 750000 })`)
     - `breakdown?: CampaignPerformanceDto[] | any[]` (Define `any[]` more specifically if possible, e.g., `NetworkPerformanceDto[]`) (`@ApiPropertyOptional({ description: 'Breakdown by a dimension, e.g., per ad network or per campaign' })`)
     - `metricsDocumentationUrl?: string` (`@ApiPropertyOptional({ description: 'URL to documentation explaining standardized metrics and discrepancies.', example: 'https://docs.admanager.example.com/metrics-definitions' })`) // For REQ-ARP-002
   - **Requirement Mapping:** REQ-ARP-002.

##### 6.3.2.5. `ab-test-variant-performance.dto.ts` (`ABTestVariantPerformanceDto`)
   - **Purpose:** Defines structure for A/B test variant performance.
   - **Properties:**
     - `variantId: string` (`@ApiProperty({ example: 'var-a-uuid' })`)
     - `variantName: string` (`@ApiProperty({ example: 'Creative A - Blue Button' })`)
     - `conversionRate?: number` (`@ApiPropertyOptional({ example: 10.5 })`)
     - `ctr?: number` (`@ApiPropertyOptional({ example: 3.1 })`)
     - `cpa?: number` (`@ApiPropertyOptional({ example: 12.0 })`)
     - `roas?: number` (`@ApiPropertyOptional({ example: 4.8 })`)
     - `impressions: number` (`@ApiProperty({ example: 25000 })`)
     - `clicks: number` (`@ApiProperty({ example: 775 })`)
     - `conversions: number` (`@ApiProperty({ example: 81 })`)
     - `spend: number` (`@ApiProperty({ example: 972.00 })`)
     - `isWinner?: boolean` (`@ApiPropertyOptional({ description: 'Indicates if this variant is the statistically significant winner', example: true })`)
     - `confidenceLevel?: number` (`@ApiPropertyOptional({ example: 0.95, description: 'Confidence level if statistically significant' })`)
     - `pValue?: number` (`@ApiPropertyOptional({ example: 0.04, description: 'P-value for statistical significance test' })`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.2.6. `ab-test-result.dto.ts` (`ABTestResultDto`)
   - **Purpose:** Defines structure for A/B test results.
   - **Properties:**
     - `testId: string` (`@ApiProperty({ example: 'test-uuid-123' })`)
     - `testName: string` (`@ApiProperty({ example: 'Homepage CTA Button Color Test' })`)
     - `variants: ABTestVariantPerformanceDto[]` (`@ApiProperty({ type: [ABTestVariantPerformanceDto] })`)
     - `winningVariantId?: string` (`@ApiPropertyOptional({ description: 'ID of the statistically significant winning variant, if any', example: 'var-a-uuid' })`)
     - `statisticalSignificanceSummary?: string` (`@ApiPropertyOptional({ description: 'A summary of the statistical significance findings', example: 'Variant A showed a statistically significant higher conversion rate (10.5%) compared to Variant B (8.2%) with 95% confidence.' })`)
     - `startDate?: string` (`@ApiPropertyOptional({ example: '2023-02-01' })`)
     - `endDate?: string` (`@ApiPropertyOptional({ example: '2023-02-15' })`)
   - **Requirement Mapping:** REQ-ARP-004.

##### 6.3.2.7. `actionable-insight.dto.ts` (`ActionableInsightDto`)
   - **Purpose:** Defines structure for actionable insights.
   - **Properties:**
     - `insightId: string` (`@ApiProperty({ example: 'insight-uuid-456' })`)
     - `title: string` (`@ApiProperty({ example: 'Campaign "Summer Splash" ROAS declining' })`)
     - `description: string` (`@ApiProperty({ example: 'The ROAS for "Summer Splash" campaign has dropped by 20% in the last 7 days compared to the previous period.' })`)
     - `recommendation?: string` (`@ApiPropertyOptional({ example: 'Review ad creatives and targeting for campaign "Summer Splash". Consider pausing underperforming ad sets.' })`)
     - `relatedEntityType?: 'campaign' | 'adSet' | 'ad' | 'product' | 'audienceSegment'` (`@ApiPropertyOptional({ example: 'campaign' })`)
     - `relatedEntityId?: string` (`@ApiPropertyOptional({ example: 'c1c4d9d6-4b19-4c98-9a7e-09f8e7d6c5b3' })`)
     - `severity?: 'high' | 'medium' | 'low' | 'info'` (`@ApiPropertyOptional({ example: 'medium' })`)
     - `insightType?: string` (`@ApiPropertyOptional({ example: 'PerformanceTrend', description: 'Type of insight, e.g., Anomaly, Trend, Opportunity' })`)
     - `supportingData?: any` (`@ApiPropertyOptional({ description: 'Data points supporting the insight, e.g., { previousRoas: 5.0, currentRoas: 4.0 }' })`)
   - **Requirement Mapping:** REQ-ARP-008.

##### 6.3.2.8. `data-ingestion-status.dto.ts` (`DataIngestionStatusDto`)
   - **Purpose:** Defines structure for data ingestion status.
   - **Properties:**
     - `dataSource: string` (`@ApiProperty({ example: 'Google Ads Performance Data' })`)
     - `lastSuccessfulSync?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-03-15T10:30:00Z' })`)
     - `status: 'Healthy' | 'Syncing' | 'Delayed' | 'Error' | 'PendingInitialSync'` (`@ApiProperty({ example: 'Healthy' })`)
     - `processedRecordsLastSync?: number` (`@ApiPropertyOptional({ example: 150234 })`)
     - `averageLatencyMsLastSync?: number` (`@ApiPropertyOptional({ example: 300000, description: 'Average end-to-end latency in milliseconds for data to become available in reports from last sync completion' })`)
     - `nextScheduledSync?: string` (`@IsISO8601() @IsOptional() @ApiPropertyOptional({ example: '2023-03-16T02:00:00Z' })`)
     - `details?: string` (`@ApiPropertyOptional({ description: 'Additional details, especially in case of errors.', example: 'API rate limit hit, retrying.' })`)
   - **Requirement Mapping:** REQ-ARP-005 (NFR, but API provides status).

##### 6.3.2.9. `PaginatedResponse.dto.ts` (Generic Paginated Response DTO)
   - **Purpose:** A generic DTO for paginated API responses.
   - **Class:** `PaginatedResponseDto<T>`
     - `data: T[]` (`@ApiProperty({ isArray: true })`)
     - `totalCount: number` (`@ApiProperty({ description: 'Total number of items available' })`)
     - `page: number` (`@ApiProperty({ description: 'Current page number' })`)
     - `limit: number` (`@ApiProperty({ description: 'Number of items per page' })`)
     - `totalPages: number` (`@ApiProperty({ description: 'Total number of pages' })`)
   - **Note:** This DTO should be created in a common location if not already present.

### 6.4. Interfaces (`src/modules/analytics-reporting/api/v1/interfaces/`)

#### 6.4.1. `analytics-data-provider.interface.ts` (`IAnalyticsDataProvider`)
   - **Purpose:** Defines a contract for fetching processed campaign performance data, aggregated data, and A/B test results from data stores.
   - **Token:** `'IAnalyticsDataProvider'`
   - **Methods:**
     - `getCampaignPerformanceData(merchantId: string, query: PerformanceReportQueryDto): Promise<{ data: (CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto)[], totalCount: number }>`
       - Logic: Fetches detailed performance data based on query (dimensions, granularity determine the DTO type). Implements drill-down logic. Accesses data stored as per REQ-ARP-007 (e.g., DynamoDB).
     - `getAggregatedPerformanceData(merchantId: string, query: PerformanceReportQueryDto): Promise<AggregatedPerformanceDto>`
       - Logic: Fetches and aggregates performance data across specified dimensions.
     - `getABTestResults(merchantId: string, query: ABTestReportQueryDto): Promise<ABTestResultDto>`
       - Logic: Fetches A/B test results, including variant performance and possibly pre-calculated significance data.
     - `getRawDataForDashboardWidget(merchantId: string, widgetConfig: WidgetConfigDto): Promise<any>`
       - Logic: Fetches data specific to a dashboard widget configuration.
     - `getMerchantDashboardConfig(merchantId: string, dashboardId: string): Promise<CustomDashboardConfigDto | null>`
     - `saveMerchantDashboardConfig(merchantId: string, dashboardId: string, config: CustomDashboardConfigDto): Promise<CustomDashboardConfigDto>`
     - `listMerchantDashboards(merchantId: string): Promise<{id: string, name: string}[]>`
     - `getDataIngestionStatus(merchantId: string): Promise<DataIngestionStatusDto[]>`
       - Logic: Fetches status of various data ingestion pipelines relevant to analytics. REQ-ARP-005.
   - **Requirement Mapping:** REQ-ARP-007, REQ-ARP-003, REQ-ARP-005.
   - **Note:** Concrete implementation (e.g., `AnalyticsDataProviderDynamoDBService`) would handle interaction with DynamoDB using `DYNAMODB_ANALYTICS_TABLE_NAME` and `DYNAMODB_ABTEST_RESULTS_TABLE_NAME` from config.

#### 6.4.2. `core-platform-data.interface.ts` (`ICorePlatformDataProvider`)
   - **Purpose:** Defines a contract for fetching attributed order and sales data from the `[PlatformName]` core e-commerce platform.
   - **Token:** `'ICorePlatformDataProvider'`
   - **Methods:**
     - `getAttributedOrderData(merchantId: string, dateRange: { startDate: string, endDate: string }, attributionParams?: { campaignIds?: string[], adSetIds?: string[], adIds?: string[] }): Promise<{ orderId: string, orderValue: number, conversionTime: string, items: {productId: string, quantity: number, price: number}[] }[]>`
       - Logic: Makes HTTP calls to `CORE_PLATFORM_API_URL` using `CORE_PLATFORM_API_KEY` to fetch order data necessary for ROAS/CPA.
   - **Requirement Mapping:** REQ-CPSI-007.
   - **Note:** Concrete implementation (e.g., `CorePlatformDataProviderHttpService`) would use an HTTP client like `@nestjs/axios`.

### 6.5. Services (`src/modules/analytics-reporting/api/v1/services/`)

#### 6.5.1. `performance-metric-calculator.v1.service.ts` (`PerformanceMetricCalculatorV1Service`)
   - **Purpose:** Calculates key derived metrics like ROAS and CPA.
   - **Decorator:** `@Injectable()`
   - **Constructor:**
     - `constructor(@Inject('ICorePlatformDataProvider') private readonly corePlatformDataProvider: ICorePlatformDataProvider)`
   - **Methods:**
     - `public calculateRoas(spend: number, revenue: number): number`
       - Logic: `if (spend === 0) return 0; return parseFloat((revenue / spend).toFixed(2));` Handle division by zero.
     - `public calculateCpa(spend: number, conversions: number): number`
       - Logic: `if (conversions === 0) return 0; return parseFloat((spend / conversions).toFixed(2));` Handle division by zero.
     - `public calculateConversionRate(conversions: number, clicks: number): number`
       - Logic: `if (clicks === 0) return 0; return parseFloat(((conversions / clicks) * 100).toFixed(2));`
     - `public async enrichPerformanceDataWithDerivedMetrics<T extends { spend: number; clicks: number; conversions: number; campaignId?: string; adSetId?: string; adId?: string }>(performanceEntries: T[], merchantId: string, dateRange: { startDate: string, endDate: string }): Promise<(T & { roas?: number; cpa?: number; conversionRate?: number })[]>`
       - Logic:
         - For each entry, fetch relevant attributed sales data from `corePlatformDataProvider.getAttributedOrderData()` based on `merchantId`, `dateRange`, and attribution parameters (e.g., `campaignId` from entry).
         - Sum up `orderValue` to get `revenue` for that entry.
         - Calculate `roas`, `cpa`, `conversionRate` using the methods above.
         - Return enriched entries.
   - **Requirement Mapping:** REQ-CMO-007, REQ-ARP-001, REQ-CPSI-007.

#### 6.5.2. `analytics-reporting.v1.service.ts` (`AnalyticsReportingV1Service`)
   - **Purpose:** Orchestrates fetching, processing, and formatting data for all analytics reports, dashboards, and insights.
   - **Decorator:** `@Injectable()`
   - **Constructor:**
     - `constructor(@Inject('IAnalyticsDataProvider') private readonly dataProvider: IAnalyticsDataProvider, private readonly metricCalculator: PerformanceMetricCalculatorV1Service, private readonly configService: ConfigService)`
   - **Methods:**
     - `public async getPerformanceReport(merchantId: string, query: PerformanceReportQueryDto): Promise<{ data: any[], totalCount: number, metadata?: { metricsDocumentationUrl?: string } }>`
       - Logic:
         - Validate `merchantId`.
         - Call `dataProvider.getCampaignPerformanceData(merchantId, query)` to get raw/partially aggregated data.
         - If query requests ROAS/CPA/ConversionRate, and data needs enrichment (e.g., at campaign level), call `metricCalculator.enrichPerformanceDataWithDerivedMetrics` with appropriate date range from query and the fetched data.
         - Handles drill-down logic for REQ-ARP-001 by adjusting query to `dataProvider`.
         - If query implies aggregated (cross-network) view REQ-ARP-002:
           - Fetch data potentially from multiple sources or already aggregated by `dataProvider`.
           - Standardize metrics. Add `metricsDocumentationUrl` to response metadata.
         - Apply pagination, sorting from `query` to the final dataset.
         - Return data in the expected DTO structure along with `totalCount` and `metadata`.
     - `public async getABTestReport(merchantId: string, query: ABTestReportQueryDto): Promise<ABTestResultDto>`
       - Logic:
         - Validate `merchantId`, `query.testId`.
         - Call `dataProvider.getABTestResults(merchantId, query)`.
         - If significance isn't pre-calculated by dataProvider, this service might perform/trigger statistical significance calculation (e.g., chi-squared test for conversion rates, t-test for continuous metrics) using a helper or library. (REQ-ARP-004)
         - Format results into `ABTestResultDto`.
     - `public async getCustomDashboardData(merchantId: string, dashboardId: string): Promise<any[]>` // Return type should be more specific, e.g., `WidgetDataDto[]`
       - Logic:
         - Fetch dashboard configuration using `dataProvider.getMerchantDashboardConfig(merchantId, dashboardId)`.
         - If no config, throw `NotFoundException`.
         - For each widget in the config:
           - Construct specific queries based on `widget.metrics`, `widget.dimensions`, `widget.filters`.
           - Call `dataProvider.getRawDataForDashboardWidget` or `getPerformanceReport` with tailored queries.
           - Enrich data with derived metrics if needed via `metricCalculator`.
           - Format data for the specific `widget.widgetType`.
         - Return an array of widget data. (REQ-ARP-003)
     - `public async saveCustomDashboardConfig(merchantId: string, dashboardId: string | undefined, config: CustomDashboardConfigDto): Promise<CustomDashboardConfigDto>`
       - Logic:
         - Validate `merchantId`, `config`.
         - If `dashboardId` is not provided (new dashboard), generate one using `uuidv4()`.
         - Call `dataProvider.saveMerchantDashboardConfig(merchantId, dashboardId, config)`. (REQ-ARP-003)
     - `public async listCustomDashboards(merchantId: string): Promise<{id: string, name: string}[]>`
       - Logic: Call `dataProvider.listMerchantDashboards(merchantId)`. (REQ-ARP-003)
     - `public async generateExportableReport(merchantId: string, query: ReportExportQueryDto): Promise<{ data: Buffer, fileName: string, contentType: string }>`
       - Logic:
         - Based on `query.reportType` and `query.filters`, fetch data (similar to `getPerformanceReport` or `getABTestReport`).
         - If `query.format === 'csv'`: Convert data to CSV format (use a library like `papaparse` or custom logic). Set `contentType` to `'text/csv'`.
         - If `query.format === 'pdf'`: Convert data to PDF (use a library like `pdfmake` or `puppeteer` for rendering HTML to PDF). Set `contentType` to `'application/pdf'`.
         - Generate `fileName` (e.g., `report-${query.reportType}-${new Date().toISOString()}.${query.format}`).
         - Return buffer, filename, and content type. (REQ-ARP-003)
     - `public async getActionableInsights(merchantId: string, context?: any): Promise<ActionableInsightDto[]>`
       - Logic:
         - Fetch relevant performance data (e.g., trends, anomalies, comparisons for campaigns, ad sets, ads).
         - Apply business rules or (future) ML models to identify insights (e.g., "Campaign X ROAS dropped by 30% last week", "Ad Creative Y has significantly higher CTR"). This might involve comparing current period data with a previous period or benchmarks.
         - Format into `ActionableInsightDto[]`. (REQ-ARP-008)
     - `public async getDataIngestionStatus(merchantId: string): Promise<DataIngestionStatusDto[]>`
       - Logic: Call `dataProvider.getDataIngestionStatus(merchantId)`. (REQ-ARP-005 - NFR, reporting status)
   - **Requirement Mapping:** Covers all REQ-ARP and REQ-CMO-007, REQ-CPSI-007.

### 6.6. Controllers (`src/modules/analytics-reporting/api/v1/controllers/`)

General decorators for all controllers: `@ApiTags('Analytics Reporting V1')`, `@Controller('analytics/v1')` (or a more specific base path if this is a sub-module within a larger API gateway setup), `@UseGuards(JwtAuthGuard)`.
All merchant-specific endpoints will expect `x-merchant-id: string` in headers, which should be validated (e.g., ensure it's a UUID or matches the authenticated user's merchant context).

#### 6.6.1. `performance.v1.controller.ts` (`PerformanceV1Controller`)
   - **Base Path:** `analytics/v1/performance`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /reports` (`getPerformanceReport`):
       - `@ApiOperation({ summary: 'Get detailed or aggregated performance reports with drill-down capabilities.' })`
       - `@ApiOkResponse({ description: 'Performance data retrieved successfully.', type: PaginatedResponseDto<CampaignPerformanceDto> })` // Type example, will vary
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Query() query: PerformanceReportQueryDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<PaginatedResponseDto<CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto | AggregatedPerformanceDto>>`
       - Logic: Calls `analyticsService.getPerformanceReport(merchantId, query)`.
       - Requirement Mapping: REQ-CMO-007, REQ-ARP-001, REQ-ARP-002.
     - `GET /ingestion-status` (`getDataIngestionStatus`):
       - `@ApiOperation({ summary: 'Get status of analytics data ingestion pipelines.' })`
       - `@ApiOkResponse({ description: 'Data ingestion statuses retrieved.', type: [DataIngestionStatusDto] })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<DataIngestionStatusDto[]>`
       - Logic: Calls `analyticsService.getDataIngestionStatus(merchantId)`.
       - Requirement Mapping: REQ-ARP-005.

#### 6.6.2. `abtest.v1.controller.ts` (`ABTestV1Controller`)
   - **Base Path:** `analytics/v1/abtests`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /results` (`getABTestResults`):  // Changed from `/` to `/results` for clarity and consistency
       - `@ApiOperation({ summary: 'Get A/B test results analysis.' })`
       - `@ApiOkResponse({ description: 'A/B test results retrieved.', type: ABTestResultDto })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Query() query: ABTestReportQueryDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<ABTestResultDto>`
       - Logic: Calls `analyticsService.getABTestReport(merchantId, query)`.
       - Requirement Mapping: REQ-ARP-004.

#### 6.6.3. `dashboard.v1.controller.ts` (`DashboardV1Controller`)
   - **Base Path:** `analytics/v1/dashboards`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`listDashboards`):
       - `@ApiOperation({ summary: 'List all custom dashboards for the merchant.' })`
       - `@ApiOkResponse({ description: 'List of dashboards retrieved.', type: [Object] })` // Define a simple DashboardListItemDto if needed { id: string, name: string }
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<{id: string, name: string}[]>`
       - Logic: Calls `analyticsService.listCustomDashboards(merchantId)`.
     - `POST /` (`createDashboardConfig`):
       - `@ApiOperation({ summary: 'Create a new custom dashboard configuration.' })`
       - `@ApiCreatedResponse({ description: 'Dashboard configuration created.', type: CustomDashboardConfigDto })` // Should return the created dashboard config
       - `@ApiBody({ type: CustomDashboardConfigDto })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Body() configDto: CustomDashboardConfigDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.saveCustomDashboardConfig(merchantId, undefined, configDto)`.
     - `GET /:dashboardId` (`getDashboardConfig`):
       - `@ApiOperation({ summary: 'Get a specific custom dashboard configuration.' })`
       - `@ApiOkResponse({ description: 'Dashboard configuration retrieved.', type: CustomDashboardConfigDto })`
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.getCustomDashboardConfig(merchantId, dashboardId)`.
     - `PUT /:dashboardId` (`updateDashboardConfig`):
       - `@ApiOperation({ summary: 'Update an existing custom dashboard configuration.' })`
       - `@ApiOkResponse({ description: 'Dashboard configuration updated.', type: CustomDashboardConfigDto })`
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })`
       - `@ApiBody({ type: CustomDashboardConfigDto })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Body() configDto: CustomDashboardConfigDto`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<CustomDashboardConfigDto>`
       - Logic: Calls `analyticsService.saveCustomDashboardConfig(merchantId, dashboardId, configDto)`.
     - `GET /:dashboardId/data` (`getDashboardData`):
       - `@ApiOperation({ summary: 'Get data for a specific custom dashboard.' })`
       - `@ApiOkResponse({ description: 'Dashboard data retrieved.', type: [Object] })` // Define WidgetDataDto[] or similar specific type
       - `@ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Param('dashboardId', ParseUUIDPipe) dashboardId: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<any[]>` // Should be `WidgetDataDto[]`
       - Logic: Calls `analyticsService.getCustomDashboardData(merchantId, dashboardId)`.
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.6.4. `report-export.v1.controller.ts` (`ReportExportV1Controller`)
   - **Base Path:** `analytics/v1/report-exports`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`exportReport`):
       - `@ApiOperation({ summary: 'Generate and export a report in CSV or PDF format.' })`
       - `@ApiResponse({ status: 200, description: 'Report file stream. Content-Type will be text/csv or application/pdf.' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Query() query: ReportExportQueryDto`, `@Res({ passthrough: true }) res: Response`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<StreamableFile>`
       - Logic:
         - Calls `const result = await analyticsService.generateExportableReport(merchantId, query);`
         - Sets response headers: `res.set({ 'Content-Type': result.contentType, 'Content-Disposition': \`attachment; filename="${result.fileName}"\`, });`
         - Returns `new StreamableFile(result.data)`.
   - **Requirement Mapping:** REQ-ARP-003.

#### 6.6.5. `insights.v1.controller.ts` (`InsightsV1Controller`)
   - **Base Path:** `analytics/v1/insights`
   - **Constructor:** `constructor(private readonly analyticsService: AnalyticsReportingV1Service)`
   - **Endpoints:**
     - `GET /` (`getActionableInsights`):
       - `@ApiOperation({ summary: 'Get actionable insights based on performance data.' })`
       - `@ApiOkResponse({ description: 'Actionable insights retrieved.', type: [ActionableInsightDto] })`
       - `@ApiQuery({ name: 'context', type: String, required: false, description: 'Optional JSON string for context, e.g., {"campaignId": "uuid"}' })`
       - `@ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })`
       - Parameters: `@Query('context') context?: string`, `@Headers('x-merchant-id') merchantId: string`
       - Return: `Promise<ActionableInsightDto[]>`
       - Logic:
         typescript
         let parsedContext: any;
         if (context) {
           try {
             parsedContext = JSON.parse(context);
           } catch (error) {
             throw new BadRequestException('Invalid context JSON format.');
           }
         }
         return this.analyticsService.getActionableInsights(merchantId, parsedContext);
         
   - **Requirement Mapping:** REQ-ARP-008.

## 7. Data Storage Considerations (Conceptual for this API)

-   **Campaign Performance Logs & A/B Test Results (REQ-ARP-007):** Stored in Amazon DynamoDB. The `IAnalyticsDataProvider` implementation will be responsible for querying this data. Table names (`DYNAMODB_ANALYTICS_TABLE_NAME`, `DYNAMODB_ABTEST_RESULTS_TABLE_NAME`) will be sourced from `ConfigService`.
    -   Schema design for DynamoDB tables should support efficient querying by `merchantId`, date ranges, `campaignId`, `adSetId`, `adId`, `testId`, `variantId`. Use Global Secondary Indexes (GSIs) appropriately.
    -   Consider sort keys for time-series data (e.g., `timestamp` or `date#entityId`).
-   **Custom Dashboard Configurations:** Could be stored in DynamoDB (e.g., as JSON documents per merchant/dashboard) or PostgreSQL, managed via `IAnalyticsDataProvider`.
-   **Order Data (for ROAS/CPA):** Fetched from `[PlatformName]` core platform via `ICorePlatformDataProvider` as per REQ-CPSI-007. Not stored directly in this microservice's primary datastore unless cached or temporarily processed for a specific report generation.

## 8. Data Ingestion NFR (REQ-ARP-005)

-   While this API repository primarily serves data, the `AnalyticsReportingV1Service` and `PerformanceV1Controller` will expose an endpoint (`/performance/ingestion-status`) to report on the status, latency, and throughput of backend data ingestion pipelines as per REQ-ARP-005.
-   The actual ingestion pipelines (e.g., Lambda functions, Kinesis streams processing ad network data and core platform orders, populating DynamoDB) are outside the scope of this API repository but are critical dependencies for the data it serves. The `IAnalyticsDataProvider` implementation will fetch status from a source where this information is maintained (e.g., a dedicated status table in DynamoDB or metrics from CloudWatch).

## 9. Security Considerations

-   All endpoints (except potentially Swagger docs if hosted without auth in dev) are protected by `JwtAuthGuard`.
-   Merchant-specific data access is enforced by requiring `x-merchant-id` header and using it in all service and data provider calls to scope data. The `JwtAuthGuard` or a subsequent authorization layer should verify that the JWT's `merchantId` claim matches the `x-merchant-id` header.
-   Input validation using `ClassValidationPipe` prevents common injection flaws at the DTO level.
-   Standard NestJS security practices (e.g., helmet, csurf if applicable for any form submissions not typical for APIs) should be considered for the overall application.
-   Sensitive configuration values (API keys, JWT secret) are managed via `ConfigModule` (environment variables or a secure store in production).

## 10. Error Handling

-   `HttpExceptionFilter` provides global, standardized JSON error responses.
-   Services should throw appropriate `HttpException` (e.g., `NotFoundException`, `BadRequestException`, `ForbiddenException`, `InternalServerErrorException`) for business logic errors or data access issues.
-   Specific error codes or messages can be defined for common failure scenarios (e.g., `ERR_DASHBOARD_NOT_FOUND`, `ERR_INVALID_DATE_RANGE`).

## 11. Future Considerations / Extensibility
-   **Report Scheduling (FeatureToggle: `enableReportScheduling`):**
    -   If enabled, new DTOs for scheduling parameters (frequency, recipients, reportQuery).
    -   New controller endpoints (`POST /scheduled-reports`, `GET /scheduled-reports`, `DELETE /scheduled-reports/:scheduleId`).
    -   Service logic to store schedules (e.g., in PostgreSQL or DynamoDB) and integrate with a job scheduler (e.g., cron, AWS EventBridge Scheduler) to trigger `analyticsService.generateExportableReport` and then email/notify the report.
-   **Advanced Insight Generation (FeatureToggle: `enableAdvancedInsightGeneration`):**
    -   `AnalyticsReportingV1Service.getActionableInsights` could integrate with more sophisticated analytics engines or ML models. This might require new data provider interfaces or service dependencies.
-   **Versioning:** The current module is `V1`. Future API versions can be introduced as new NestJS modules (e.g., `api-v2.module.ts`) allowing parallel existence and deprecation strategies.
-   **Real-time data streams (REQ-ARP-005):** If near real-time data display is required on dashboards, WebSocket integration might be considered, potentially through a separate controller or gateway setup. The current design focuses on RESTful polling.
