# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (including NestJS framework, class-validator, class-transformer, @nestjs/swagger), and scripts for running, building, and testing the application.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../package.json  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for development and build processes.  
**Logic Description:** Standard package.json file for a NestJS project. Include dependencies: @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata, rxjs, class-validator, class-transformer, @nestjs/swagger. Include devDependencies: @nestjs/cli, @nestjs/schematics, @types/express, @types/node, ts-loader, tsconfig-paths, typescript.  
**Documentation:**
    
    - **Summary:** Core project configuration file for Node.js package management.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the project, including target ECMAScript version, module system, output directory, and source map generation.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../tsconfig.json  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Rules
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler for the project.  
**Logic Description:** Standard tsconfig.json for a NestJS project. Ensure 'experimentalDecorators' and 'emitDecoratorMetadata' are true. Set 'module' to 'commonjs', 'target' to 'es2017' or newer. Configure 'baseUrl' and 'paths' for module resolution if needed. Set 'outDir' to './dist'.  
**Documentation:**
    
    - **Summary:** TypeScript compiler configuration.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file, specifying project structure, compiler options, and assets.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../nest-cli.json  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI Project Settings
    
**Requirement Ids:**
    
    
**Purpose:** Stores configuration specific to the NestJS CLI.  
**Logic Description:** Standard nest-cli.json. Set 'collection' to '@nestjs/schematics'. Define 'sourceRoot' as 'src'. May include 'compilerOptions' for overriding tsconfig settings for CLI operations.  
**Documentation:**
    
    - **Summary:** NestJS Command Line Interface configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/main.ts  
**Description:** The main entry point for the NestJS application. Initializes the Nest application instance, configures global pipes, interceptors, Swagger documentation, and starts the HTTP server.  
**Template:** NestJS Main Application File  
**Dependancy Level:** 4  
**Name:** main  
**Type:** Application  
**Relative Path:** main.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Bootstrap
    - Global Middleware Configuration
    - Swagger Setup
    
**Requirement Ids:**
    
    
**Purpose:** Bootstraps and starts the NestJS application for affiliate marketing APIs.  
**Logic Description:** Import NestFactory from @nestjs/core and AppModule. Create an application instance using NestFactory.create(AppModule). Enable global validation pipes (ValidationPipe from @nestjs/common). Setup Swagger documentation using SwaggerModule and DocumentBuilder. Listen on a configured port (e.g., from environment variables).  
**Documentation:**
    
    - **Summary:** Application entry point. Initializes and starts the NestJS server.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** The root module of the NestJS application. Imports all other feature modules, including the AffiliateMarketingV1Module. May configure global providers or modules.  
**Template:** NestJS Root Module  
**Dependancy Level:** 5  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Defines the root module, organizing and importing feature modules.  
**Logic Description:** Import Module from @nestjs/common and AffiliateMarketingV1Module. Decorate the class with @Module. In the 'imports' array, include AffiliateMarketingV1Module and any other global modules (e.g., ConfigModule for environment variables).  
**Documentation:**
    
    - **Summary:** Root module that ties together all parts of the application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/affiliate-marketing/api/v1/constants/affiliate.constants.ts  
**Description:** Defines constant values used across the affiliate marketing API module, such as default cookie durations, commission types, or status enums if not strongly typed elsewhere.  
**Template:** TypeScript Constants File  
**Dependancy Level:** 0  
**Name:** affiliate.constants  
**Type:** Constants  
**Relative Path:** modules/affiliate-marketing/api/v1/constants/affiliate.constants.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** DEFAULT_COOKIE_WINDOW_DAYS  
**Type:** number  
**Attributes:** export const  
    - **Name:** COMMISSION_TYPE_PERCENTAGE  
**Type:** string  
**Attributes:** export const  
    - **Name:** COMMISSION_TYPE_FLAT_FEE  
**Type:** string  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Constants
    
**Requirement Ids:**
    
    - REQ-AMP-004
    
**Purpose:** Provides centralized constant values for the affiliate marketing module.  
**Logic Description:** Define exported constants for values like default cookie duration (e.g., 30 days), commission type identifiers, payout status values, etc. This ensures consistency and avoids magic strings/numbers.  
**Documentation:**
    
    - **Summary:** Contains constant values specific to the affiliate marketing domain.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/affiliate-marketing/api/v1/decorators/roles.decorator.ts  
**Description:** Custom NestJS decorator for specifying roles allowed to access an endpoint, used in conjunction with a RolesGuard.  
**Template:** NestJS Custom Decorator  
**Dependancy Level:** 0  
**Name:** roles.decorator  
**Type:** Decorator  
**Relative Path:** modules/affiliate-marketing/api/v1/decorators/roles.decorator.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** ROLES_KEY  
**Type:** string  
**Attributes:** export const  
    
**Methods:**
    
    - **Name:** Roles  
**Parameters:**
    
    - ...roles: string[]
    
**Return Type:** CustomDecorator  
**Attributes:** export const  
    
**Implemented Features:**
    
    - Role-based Access Control Decorator
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-006
    
**Purpose:** Defines a @Roles() decorator to assign role-based metadata to route handlers.  
**Logic Description:** Import SetMetadata from @nestjs/common. Define a ROLES_KEY constant. Export a Roles decorator function that uses SetMetadata to attach an array of role strings to the ROLES_KEY.  
**Documentation:**
    
    - **Summary:** Custom decorator for specifying roles required for accessing specific API endpoints.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/affiliate-marketing/api/v1/decorators/user.decorator.ts  
**Description:** Custom NestJS decorator to extract the authenticated user object from the request, typically populated by an authentication guard.  
**Template:** NestJS Custom Decorator  
**Dependancy Level:** 0  
**Name:** user.decorator  
**Type:** Decorator  
**Relative Path:** modules/affiliate-marketing/api/v1/decorators/user.decorator.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** AuthUser  
**Parameters:**
    
    
**Return Type:** ParameterDecorator  
**Attributes:** export const  
    
**Implemented Features:**
    
    - Authenticated User Extraction
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-006
    
**Purpose:** Defines an @AuthUser() decorator to easily access the authenticated user in route handlers.  
**Logic Description:** Import createParamDecorator and ExecutionContext from @nestjs/common. Export an AuthUser decorator created using createParamDecorator. The factory function should extract the user object from the request (e.g., request.user).  
**Documentation:**
    
    - **Summary:** Custom decorator to conveniently retrieve the authenticated user object within controller methods.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/programs/create-program.dto.ts  
**Description:** Data Transfer Object for creating a new affiliate program. Includes properties like program name, description, commission structure details.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CreateProgramDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/programs/create-program.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** cookieWindowDays  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @ApiPropertyOptional()  
    - **Name:** commissionRules  
**Type:** CreateCommissionRuleDto[]  
**Attributes:** @ValidateNested({ each: true }) @Type(() => CreateCommissionRuleDto) @ApiProperty({ type: () => [CreateCommissionRuleDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Program Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-003
    
**Purpose:** Defines the expected request payload for creating an affiliate program.  
**Logic Description:** Define class properties with appropriate validation decorators (class-validator) and Swagger decorators (@ApiProperty). Include fields for program name, description, terms, default cookie window, and initial commission rules.  
**Documentation:**
    
    - **Summary:** Request DTO for creating affiliate programs. Specifies required and optional fields with validation rules.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Programs  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/programs/update-program.dto.ts  
**Description:** Data Transfer Object for updating an existing affiliate program. Fields are typically optional.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** UpdateProgramDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/programs/update-program.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** cookieWindowDays  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @ApiPropertyOptional()  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** @IsBoolean() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Program Update Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Defines the expected request payload for updating an affiliate program.  
**Logic Description:** Define class properties, all optional, with validation decorators (class-validator) and Swagger decorators (@ApiPropertyOptional). Fields mirror CreateProgramDto but are optional.  
**Documentation:**
    
    - **Summary:** Request DTO for updating affiliate programs. All fields are optional.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Programs  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/programs/program.response.dto.ts  
**Description:** Data Transfer Object for representing an affiliate program in API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** ProgramResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/programs/program.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** name  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** cookieWindowDays  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** @ApiProperty()  
    - **Name:** commissionStructure  
**Type:** CommissionStructureResponseDto  
**Attributes:** @ApiProperty({ type: () => CommissionStructureResponseDto })  
    - **Name:** trackingLinkBaseUrl  
**Type:** string  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Program Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Defines the structure of an affiliate program when returned by the API.  
**Logic Description:** Define class properties with Swagger decorators (@ApiProperty). Include all relevant program details such as ID, name, status, commission info, etc. Use nested DTOs for complex parts like commission structure.  
**Documentation:**
    
    - **Summary:** Response DTO representing an affiliate program.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Programs  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/applications/approve-affiliate.dto.ts  
**Description:** Data Transfer Object for a merchant to approve an affiliate application.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** ApproveAffiliateDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/applications/approve-affiliate.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** customTrackingCode  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Approval Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-002
    
**Purpose:** Defines the request payload for approving an affiliate application.  
**Logic Description:** May include fields for assigning a specific tracking code or notes upon approval. Use validation decorators.  
**Documentation:**
    
    - **Summary:** Request DTO for approving an affiliate's application.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Applications  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/applications/application.response.dto.ts  
**Description:** Data Transfer Object for representing an affiliate application in API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** ApplicationResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/applications/application.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** applicationId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateEmail  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** programId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** programName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** submittedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Application Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-002
    
**Purpose:** Defines the structure of an affiliate application details when returned by the API.  
**Logic Description:** Include fields like application ID, applicant details, program applied for, status, and submission date. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO representing an affiliate application.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Applications  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/commissions/create-commission-rule.dto.ts  
**Description:** Data Transfer Object for defining a commission rule within an affiliate program.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CreateCommissionRuleDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/commissions/create-commission-rule.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** type  
**Type:** string  
**Attributes:** @IsString() @IsIn(['percentage', 'flat_fee']) @ApiProperty({ enum: ['percentage', 'flat_fee'] })  
    - **Name:** value  
**Type:** number  
**Attributes:** @IsNumber() @Min(0) @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Commission Rule Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-003
    
**Purpose:** Defines the request payload for creating a new commission rule.  
**Logic Description:** Properties for commission type (percentage, flat fee), value, and conditions (e.g., specific products, tiers - though tiers might be more complex). Use validation and Swagger decorators.  
**Documentation:**
    
    - **Summary:** Request DTO for setting up commission rules for affiliate programs.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Commissions  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/commissions/commission-structure.response.dto.ts  
**Description:** Data Transfer Object for representing the overall commission structure of a program.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CommissionStructureResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/commissions/commission-structure.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** defaultRule  
**Type:** CommissionRuleResponseDto  
**Attributes:** @ApiProperty({ type: () => CommissionRuleResponseDto })  
    - **Name:** specificRules  
**Type:** CommissionRuleResponseDto[]  
**Attributes:** @ApiPropertyOptional({ type: () => [CommissionRuleResponseDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Commission Structure Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-003
    
**Purpose:** Defines how the commission structure of a program is returned by the API.  
**Logic Description:** Includes default commission rules and any specific/overriding rules. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO describing the commission rules for an affiliate program.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Commissions  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/commissions/commission-rule.response.dto.ts  
**Description:** Data Transfer Object for representing a single commission rule.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CommissionRuleResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/commissions/commission-rule.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** type  
**Type:** string  
**Attributes:** @ApiProperty({ enum: ['percentage', 'flat_fee'] })  
    - **Name:** value  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Commission Rule Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-003
    
**Purpose:** Defines how a single commission rule is returned by the API.  
**Logic Description:** Details of a specific commission rule, including its type, value, and applicability. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for a single commission rule.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Commissions  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/payouts/process-payouts.dto.ts  
**Description:** Data Transfer Object for initiating or marking affiliate payouts.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** ProcessPayoutsDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/payouts/process-payouts.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional({ description: 'Process payouts for specific affiliates; if empty, processes all eligible.'})  
    - **Name:** paymentDate  
**Type:** Date  
**Attributes:** @IsDateString() @ApiProperty()  
    - **Name:** notes  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Payout Processing Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-005
    
**Purpose:** Defines the request payload for processing affiliate payouts.  
**Logic Description:** May include affiliate IDs to process, payout period, or batch identifiers. Use validation and Swagger decorators.  
**Documentation:**
    
    - **Summary:** Request DTO to initiate the payout process for selected or all eligible affiliates.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Payouts  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/payouts/payout.response.dto.ts  
**Description:** Data Transfer Object for representing an affiliate payout in API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** PayoutResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/payouts/payout.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** payoutId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** amount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** currency  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** paymentDate  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** periodStartDate  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** periodEndDate  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Payout Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-005
    
**Purpose:** Defines the structure of an affiliate payout record when returned by the API.  
**Logic Description:** Includes payout ID, affiliate details, amount, date, status. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for an affiliate payout record.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Payouts  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/dashboard/dashboard-metrics.response.dto.ts  
**Description:** Data Transfer Object for merchant affiliate dashboard metrics.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** DashboardMetricsResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/dashboard/dashboard-metrics.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** totalAffiliates  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** activeAffiliates  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** totalConversions  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** totalSalesVolume  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** totalCommissionsPaid  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** topPerformingAffiliates  
**Type:** TopAffiliatePerformanceDto[]  
**Attributes:** @ApiProperty({ type: () => [TopAffiliatePerformanceDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Merchant Dashboard Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Defines the structure for data displayed on the merchant's affiliate dashboard.  
**Logic Description:** Contains aggregated metrics like total affiliates, conversions, sales volume, commissions paid, and top performers. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for the merchant affiliate program dashboard.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Dashboard  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/merchant/dashboard/top-affiliate-performance.dto.ts  
**Description:** Data Transfer Object for representing a top performing affiliate in dashboard.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** TopAffiliatePerformanceDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/merchant/dashboard/top-affiliate-performance.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** conversions  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** salesVolume  
**Type:** number  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Top Affiliate Performance Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Defines the structure for individual top affiliate performance data.  
**Logic Description:** Contains affiliate ID, name, number of conversions, and sales volume. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Nested DTO for top performing affiliate details.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Merchant.Dashboard  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/affiliate/portal/affiliate-performance.response.dto.ts  
**Description:** Data Transfer Object for affiliate's own performance metrics in their portal.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** AffiliatePerformanceResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/affiliate/portal/affiliate-performance.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** clicks  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** conversions  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** conversionRate  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** earnedCommissions  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** pendingCommissions  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** paidCommissions  
**Type:** number  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Portal Performance Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-006
    
**Purpose:** Defines the structure of performance data for an affiliate in their portal.  
**Logic Description:** Includes clicks, conversions, earnings (pending, paid). Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for affiliate's performance metrics.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Affiliate.Portal  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/affiliate/portal/tracking-link.response.dto.ts  
**Description:** Data Transfer Object for representing an affiliate's tracking link.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** TrackingLinkResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/affiliate/portal/tracking-link.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** programName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** trackingUrl  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** couponCode  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Tracking Link Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-006
    
**Purpose:** Defines the structure for returning tracking links to affiliates.  
**Logic Description:** Includes program name and the unique tracking URL, potentially an associated coupon code. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for affiliate tracking links.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Affiliate.Portal  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/affiliate/portal/payout-history.response.dto.ts  
**Description:** Data Transfer Object for an affiliate's payout history.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** PayoutHistoryResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/affiliate/portal/payout-history.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** payouts  
**Type:** PayoutResponseDto[]  
**Attributes:** @ApiProperty({ type: () => [PayoutResponseDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Payout History Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-006
    
**Purpose:** Defines the structure for an affiliate's list of past and pending payouts.  
**Logic Description:** Contains a list of PayoutResponseDto. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO representing an affiliate's payout history.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Affiliate.Portal  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/public/registration/affiliate-registration.request.dto.ts  
**Description:** Data Transfer Object for affiliate self-registration.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** AffiliateRegistrationRequestDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/public/registration/affiliate-registration.request.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** programId  
**Type:** string  
**Attributes:** @IsUUID('4') @IsNotEmpty() @ApiProperty()  
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** email  
**Type:** string  
**Attributes:** @IsEmail() @IsNotEmpty() @ApiProperty()  
    - **Name:** websiteUrl  
**Type:** string  
**Attributes:** @IsUrl() @IsOptional() @ApiPropertyOptional()  
    - **Name:** promotionalMethods  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** password  
**Type:** string  
**Attributes:** @IsString() @MinLength(8) @IsNotEmpty() @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Registration Request Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-002
    
**Purpose:** Defines the payload for an affiliate applying to a program.  
**Logic Description:** Fields for name, email, password, website, promotional methods, and the program ID they are applying to. Use validation and Swagger decorators.  
**Documentation:**
    
    - **Summary:** Request DTO for new affiliates registering for a program.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Public.Registration  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/conversions/track-conversion.dto.ts  
**Description:** Data Transfer Object for reporting/tracking an affiliate conversion.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** TrackConversionDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/conversions/track-conversion.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** trackingCodeOrCoupon  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** orderId  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** orderAmount  
**Type:** number  
**Attributes:** @IsNumber() @Min(0) @ApiProperty()  
    - **Name:** currency  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @Length(3,3) @ApiProperty()  
    - **Name:** conversionTimestamp  
**Type:** Date  
**Attributes:** @IsDateString() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Conversion Tracking Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-004
    
**Purpose:** Defines the payload for reporting a conversion attributed to an affiliate.  
**Logic Description:** Fields for affiliate tracking identifier (link ID, coupon code), order details (ID, amount, currency), timestamp. Use validation and Swagger decorators.  
**Documentation:**
    
    - **Summary:** Request DTO for tracking an affiliate conversion event.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Conversions  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/dto/conversions/conversion.response.dto.ts  
**Description:** Data Transfer Object representing a tracked affiliate conversion.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** ConversionResponseDto  
**Type:** DTO  
**Relative Path:** modules/affiliate-marketing/api/v1/dto/conversions/conversion.response.dto.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** conversionId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** affiliateId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** programId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** orderId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** commissionAmount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Affiliate Conversion Response Data Contract
    
**Requirement Ids:**
    
    - REQ-AMP-004
    
**Purpose:** Defines the structure of a tracked conversion when returned by the API.  
**Logic Description:** Details of the conversion, including attributed affiliate, program, order, and calculated commission. Use Swagger decorators.  
**Documentation:**
    
    - **Summary:** Response DTO for a tracked affiliate conversion.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Dto.Conversions  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/affiliate-marketing/api/v1/guards/jwt-auth.guard.ts  
**Description:** NestJS guard for protecting routes, ensuring the request has a valid JWT. Extends AuthGuard('jwt').  
**Template:** NestJS Guard  
**Dependancy Level:** 1  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** modules/affiliate-marketing/api/v1/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - JWT Authentication
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-006
    
**Purpose:** Enforces JWT-based authentication for protected API endpoints.  
**Logic Description:** Import Injectable, ExecutionContext from @nestjs/common and AuthGuard from @nestjs/passport. Extend AuthGuard('jwt'). The canActivate method will be inherited. Additional logic can be added if needed (e.g., checking token blacklist).  
**Documentation:**
    
    - **Summary:** Authentication guard that validates JWT tokens present in request headers.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/affiliate-marketing/api/v1/guards/roles.guard.ts  
**Description:** NestJS guard for checking if the authenticated user has the required roles specified by the @Roles() decorator.  
**Template:** NestJS Guard  
**Dependancy Level:** 2  
**Name:** RolesGuard  
**Type:** Guard  
**Relative Path:** modules/affiliate-marketing/api/v1/guards/roles.guard.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** reflector  
**Type:** Reflector  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - reflector: Reflector
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - Role-based Authorization
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-006
    
**Purpose:** Enforces role-based access control for API endpoints.  
**Logic Description:** Import Injectable, CanActivate, ExecutionContext from @nestjs/common and Reflector from @nestjs/core. Inject Reflector in the constructor. In canActivate, get required roles from metadata (using ROLES_KEY and reflector). Get the user object from the request. Check if user's roles match any of the required roles.  
**Documentation:**
    
    - **Summary:** Authorization guard that checks if the current user possesses the necessary roles for an operation.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/affiliate-marketing/api/v1/services/affiliate-marketing.service.ts  
**Description:** Service class containing the core business logic for affiliate marketing features. Interacts with data persistence layers and implements the functionalities required by the controllers.  
**Template:** NestJS Service  
**Dependancy Level:** 3  
**Name:** AffiliateMarketingService  
**Type:** Service  
**Relative Path:** modules/affiliate-marketing/api/v1/services/affiliate-marketing.service.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    - DomainService
    
**Members:**
    
    - **Name:** affiliateProgramRepository  
**Type:** IAffiliateProgramRepository  
**Attributes:** private readonly  
    - **Name:** affiliateRepository  
**Type:** IAffiliateRepository  
**Attributes:** private readonly  
    - **Name:** conversionRepository  
**Type:** IConversionRepository  
**Attributes:** private readonly  
    - **Name:** payoutRepository  
**Type:** IPayoutRepository  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** createProgram  
**Parameters:**
    
    - merchantId: string
    - createProgramDto: CreateProgramDto
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** public async  
    - **Name:** getProgramById  
**Parameters:**
    
    - merchantId: string
    - programId: string
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** public async  
    - **Name:** updateProgram  
**Parameters:**
    
    - merchantId: string
    - programId: string
    - updateProgramDto: UpdateProgramDto
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** public async  
    - **Name:** listProgramsForMerchant  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<ProgramResponseDto[]>  
**Attributes:** public async  
    - **Name:** registerAffiliate  
**Parameters:**
    
    - registrationDto: AffiliateRegistrationRequestDto
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** getPendingApplications  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<ApplicationResponseDto[]>  
**Attributes:** public async  
    - **Name:** approveAffiliateApplication  
**Parameters:**
    
    - merchantId: string
    - applicationId: string
    - approvalDto: ApproveAffiliateDto
    
**Return Type:** Promise<AffiliateResponseDto>  
**Attributes:** public async  
    - **Name:** rejectAffiliateApplication  
**Parameters:**
    
    - merchantId: string
    - applicationId: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** configureCommission  
**Parameters:**
    
    - merchantId: string
    - programId: string
    - commissionRuleDto: CreateCommissionRuleDto
    
**Return Type:** Promise<CommissionRuleResponseDto>  
**Attributes:** public async  
    - **Name:** getCommissionStructure  
**Parameters:**
    
    - merchantId: string
    - programId: string
    
**Return Type:** Promise<CommissionStructureResponseDto>  
**Attributes:** public async  
    - **Name:** trackConversion  
**Parameters:**
    
    - trackConversionDto: TrackConversionDto
    
**Return Type:** Promise<ConversionResponseDto>  
**Attributes:** public async  
    - **Name:** calculateAffiliatePayouts  
**Parameters:**
    
    - merchantId: string
    - periodEndDate: Date
    
**Return Type:** Promise<PayoutResponseDto[]>  
**Attributes:** public async  
    - **Name:** processAffiliatePayouts  
**Parameters:**
    
    - merchantId: string
    - processPayoutsDto: ProcessPayoutsDto
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** getMerchantDashboardMetrics  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<DashboardMetricsResponseDto>  
**Attributes:** public async  
    - **Name:** getAffiliatePerformance  
**Parameters:**
    
    - affiliateId: string
    
**Return Type:** Promise<AffiliatePerformanceResponseDto>  
**Attributes:** public async  
    - **Name:** getAffiliateTrackingLinks  
**Parameters:**
    
    - affiliateId: string
    
**Return Type:** Promise<TrackingLinkResponseDto[]>  
**Attributes:** public async  
    - **Name:** getAffiliatePayoutHistory  
**Parameters:**
    
    - affiliateId: string
    
**Return Type:** Promise<PayoutHistoryResponseDto>  
**Attributes:** public async  
    - **Name:** generateTrackingLinkForAffiliate  
**Parameters:**
    
    - merchantId: string
    - programId: string
    - affiliateId: string
    
**Return Type:** Promise<string>  
**Attributes:** public async  
    - **Name:** generateCouponForAffiliate  
**Parameters:**
    
    - merchantId: string
    - programId: string
    - affiliateId: string
    
**Return Type:** Promise<string>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Affiliate Program Management
    - Affiliate Lifecycle Management
    - Commission Configuration
    - Conversion Tracking
    - Payout Management
    - Dashboard & Portal Data Provisioning
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-003
    - REQ-AMP-004
    - REQ-AMP-005
    - REQ-AMP-006
    
**Purpose:** Encapsulates all business logic related to affiliate marketing functionalities.  
**Logic Description:** Implements methods for CRUD operations on programs and affiliates, handles application workflows, commission calculations, conversion attribution (considering cookie window and last-click by default), payout generation, and data aggregation for dashboards. Depends on injected repository interfaces for data persistence (actual repositories are external). Manages generation of unique tracking links and coupons.  
**Documentation:**
    
    - **Summary:** Core service for managing affiliate marketing operations. It orchestrates data flow and business rule enforcement.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-programs.merchant.controller.ts  
**Description:** NestJS controller for merchant-facing operations related to affiliate programs (CRUD).  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateProgramsMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-programs.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createProgram  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Body() createDto: CreateProgramDto
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Create new affiliate program' }) @ApiResponse({ status: 201, type: ProgramResponseDto })  
    - **Name:** getPrograms  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    
**Return Type:** Promise<ProgramResponseDto[]>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'List merchant affiliate programs' })  
    - **Name:** getProgramById  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('programId', ParseUUIDPipe) programId: string
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** @Get(':programId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get affiliate program by ID' })  
    - **Name:** updateProgram  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('programId', ParseUUIDPipe) programId: string
    - @Body() updateDto: UpdateProgramDto
    
**Return Type:** Promise<ProgramResponseDto>  
**Attributes:** @Put(':programId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Update affiliate program' })  
    - **Name:** deleteProgram  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('programId', ParseUUIDPipe) programId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':programId') @HttpCode(204) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Delete affiliate program' })  
    
**Implemented Features:**
    
    - Affiliate Program CRUD for Merchants
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Exposes API endpoints for merchants to manage their affiliate programs.  
**Logic Description:** Inject AffiliateMarketingService. Define GET, POST, PUT, DELETE endpoints for programs. Apply JwtAuthGuard and RolesGuard. Use DTOs for request/response. Map requests to service methods. Use @AuthUser() decorator to get merchantId. Add Swagger decorators for API documentation.  
**Documentation:**
    
    - **Summary:** Controller for managing affiliate programs from the merchant's perspective.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-applications.merchant.controller.ts  
**Description:** NestJS controller for merchants to manage affiliate applications (view, approve, reject).  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateApplicationsMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-applications.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getPendingApplications  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Query('programId') programId?: string
    
**Return Type:** Promise<ApplicationResponseDto[]>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'List pending affiliate applications' })  
    - **Name:** approveApplication  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('applicationId', ParseUUIDPipe) applicationId: string
    - @Body() approvalDto: ApproveAffiliateDto
    
**Return Type:** Promise<AffiliateResponseDto>  
**Attributes:** @Post(':applicationId/approve') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Approve an affiliate application' })  
    - **Name:** rejectApplication  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('applicationId', ParseUUIDPipe) applicationId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Post(':applicationId/reject') @HttpCode(204) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Reject an affiliate application' })  
    
**Implemented Features:**
    
    - Affiliate Application Management for Merchants
    
**Requirement Ids:**
    
    - REQ-AMP-002
    
**Purpose:** Exposes API endpoints for merchants to review and process affiliate applications.  
**Logic Description:** Inject AffiliateMarketingService. Define endpoints to list pending applications, approve, and reject applications. Secure with guards. Use DTOs. Delegate to service methods. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for merchant actions on affiliate applications.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-management.merchant.controller.ts  
**Description:** NestJS controller for merchant-facing operations related to managing approved affiliates (view, generate links/coupons).  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateManagementMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-management.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** listAffiliates  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Query('programId') programId?: string
    
**Return Type:** Promise<AffiliateResponseDto[]>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'List approved affiliates for a program or all programs' })  
    - **Name:** getAffiliateDetails  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('affiliateId', ParseUUIDPipe) affiliateId: string
    
**Return Type:** Promise<AffiliateResponseDto>  
**Attributes:** @Get(':affiliateId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get details of a specific affiliate' })  
    - **Name:** generateTrackingLink  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('affiliateId', ParseUUIDPipe) affiliateId: string
    - @Query('programId', ParseUUIDPipe) programId: string
    
**Return Type:** Promise<{ trackingLink: string }>  
**Attributes:** @Post(':affiliateId/tracking-link') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Generate a tracking link for an affiliate and program' })  
    - **Name:** generateCouponCode  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('affiliateId', ParseUUIDPipe) affiliateId: string
    - @Query('programId', ParseUUIDPipe) programId: string
    
**Return Type:** Promise<{ couponCode: string }>  
**Attributes:** @Post(':affiliateId/coupon-code') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Generate a coupon code for an affiliate and program' })  
    
**Implemented Features:**
    
    - Affiliate Listing
    - Tracking Link/Coupon Generation by Merchant
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Exposes API endpoints for merchants to manage their approved affiliates.  
**Logic Description:** Inject AffiliateMarketingService. Define endpoints to list affiliates, view details, and generate tracking links/coupons. Apply guards and use DTOs. Delegate to service methods. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for managing approved affiliates and their assets by merchants.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-commissions.merchant.controller.ts  
**Description:** NestJS controller for merchants to configure commission structures for affiliate programs.  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateCommissionsMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-commissions.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** setProgramCommission  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('programId', ParseUUIDPipe) programId: string
    - @Body() commissionRuleDto: CreateCommissionRuleDto
    
**Return Type:** Promise<CommissionRuleResponseDto>  
**Attributes:** @Post('programs/:programId/commissions') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Set/update commission rule for a program' })  
    - **Name:** getProgramCommissionStructure  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Param('programId', ParseUUIDPipe) programId: string
    
**Return Type:** Promise<CommissionStructureResponseDto>  
**Attributes:** @Get('programs/:programId/commissions') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get commission structure for a program' })  
    
**Implemented Features:**
    
    - Commission Configuration for Merchants
    
**Requirement Ids:**
    
    - REQ-AMP-003
    
**Purpose:** Exposes API endpoints for merchants to define and view commission rules.  
**Logic Description:** Inject AffiliateMarketingService. Define endpoints for setting and getting commission rules per program. Secure with guards. Use DTOs. Delegate to service methods. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for managing commission structures for affiliate programs.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-payouts.merchant.controller.ts  
**Description:** NestJS controller for merchants to manage affiliate payouts.  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliatePayoutsMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-payouts.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getPendingPayouts  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Query('programId') programId?: string
    
**Return Type:** Promise<PayoutResponseDto[]>  
**Attributes:** @Get('pending') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'List pending affiliate payouts' })  
    - **Name:** processPayouts  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Body() processPayoutsDto: ProcessPayoutsDto
    
**Return Type:** Promise<void>  
**Attributes:** @Post('process') @HttpCode(202) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Process (mark as paid or initiate) affiliate payouts' })  
    - **Name:** getPayoutHistory  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    - @Query('affiliateId') affiliateId?: string
    
**Return Type:** Promise<PayoutResponseDto[]>  
**Attributes:** @Get('history') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation({ summary: 'Get payout history for affiliates' })  
    
**Implemented Features:**
    
    - Affiliate Payout Management for Merchants
    
**Requirement Ids:**
    
    - REQ-AMP-005
    
**Purpose:** Exposes API endpoints for merchants to view pending payouts and initiate/record payout processing.  
**Logic Description:** Inject AffiliateMarketingService. Define endpoints for listing pending payouts, triggering payout processing, and viewing payout history. Secure with guards. Use DTOs. Delegate to service. Add Swagger.  
**Documentation:**
    
    - **Summary:** Controller for handling affiliate payout operations by merchants.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-dashboard.merchant.controller.ts  
**Description:** NestJS controller to provide data for the merchant's affiliate program dashboard.  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateDashboardMerchantController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/merchant/affiliate-dashboard.merchant.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getDashboardMetrics  
**Parameters:**
    
    - @AuthUser() user: AuthenticatedUser
    
**Return Type:** Promise<DashboardMetricsResponseDto>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get metrics for merchant affiliate dashboard' })  
    
**Implemented Features:**
    
    - Merchant Affiliate Dashboard Data
    
**Requirement Ids:**
    
    - REQ-AMP-001
    
**Purpose:** Provides aggregated data and key metrics for the merchant's affiliate marketing dashboard.  
**Logic Description:** Inject AffiliateMarketingService. Define a GET endpoint to fetch dashboard data. Secure with guards. Delegate to service for data aggregation. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for serving data to the merchant affiliate dashboard.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Merchant  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/affiliate/affiliate-portal.controller.ts  
**Description:** NestJS controller for affiliate-facing operations within their portal (performance, links, payouts).  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliatePortalController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/affiliate/affiliate-portal.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getMyPerformance  
**Parameters:**
    
    - @AuthUser() affiliate: AuthenticatedAffiliateUser
    
**Return Type:** Promise<AffiliatePerformanceResponseDto>  
**Attributes:** @Get('performance') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('Affiliate') @ApiOperation({ summary: 'Get my affiliate performance metrics' })  
    - **Name:** getMyTrackingLinks  
**Parameters:**
    
    - @AuthUser() affiliate: AuthenticatedAffiliateUser
    
**Return Type:** Promise<TrackingLinkResponseDto[]>  
**Attributes:** @Get('tracking-links') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('Affiliate') @ApiOperation({ summary: 'Get my tracking links' })  
    - **Name:** getMyPayoutHistory  
**Parameters:**
    
    - @AuthUser() affiliate: AuthenticatedAffiliateUser
    
**Return Type:** Promise<PayoutHistoryResponseDto>  
**Attributes:** @Get('payouts') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('Affiliate') @ApiOperation({ summary: 'Get my payout history' })  
    
**Implemented Features:**
    
    - Affiliate Portal Data Access
    
**Requirement Ids:**
    
    - REQ-AMP-006
    
**Purpose:** Exposes API endpoints for affiliates to access their specific data (performance, links, payout history).  
**Logic Description:** Inject AffiliateMarketingService. Define GET endpoints for performance, links, and payouts. Secure with JwtAuthGuard and a specific 'Affiliate' role guard. Use @AuthUser() to get authenticated affiliate's ID. Delegate to service. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller serving data to the affiliate portal.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Affiliate  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/public/affiliate-registration.public.controller.ts  
**Description:** Publicly accessible NestJS controller for affiliate self-registration/application.  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateRegistrationPublicController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/public/affiliate-registration.public.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** register  
**Parameters:**
    
    - @Body() registrationDto: AffiliateRegistrationRequestDto
    
**Return Type:** Promise<void>  
**Attributes:** @Post('register') @HttpCode(202) @ApiOperation({ summary: 'Submit affiliate program application' })  
    
**Implemented Features:**
    
    - Public Affiliate Registration
    
**Requirement Ids:**
    
    - REQ-AMP-002
    
**Purpose:** Exposes a public API endpoint for potential affiliates to apply to programs.  
**Logic Description:** Inject AffiliateMarketingService. Define a POST endpoint for registration. This endpoint should be public (no auth guard). Validate DTO. Delegate to service for application processing. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for handling new affiliate registrations/applications.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers.Public  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/controllers/affiliate-conversions.controller.ts  
**Description:** NestJS controller for tracking affiliate conversions, possibly via webhook or direct call.  
**Template:** NestJS Controller  
**Dependancy Level:** 4  
**Name:** AffiliateConversionsController  
**Type:** Controller  
**Relative Path:** modules/affiliate-marketing/api/v1/controllers/affiliate-conversions.controller.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** affiliateMarketingService  
**Type:** AffiliateMarketingService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - affiliateMarketingService: AffiliateMarketingService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** trackConversion  
**Parameters:**
    
    - @Body() trackConversionDto: TrackConversionDto
    
**Return Type:** Promise<ConversionResponseDto>  
**Attributes:** @Post() @HttpCode(201) @ApiOperation({ summary: 'Track an affiliate conversion' }) @ApiResponse({ status: 201, type: ConversionResponseDto})  
    
**Implemented Features:**
    
    - Affiliate Conversion Tracking Endpoint
    
**Requirement Ids:**
    
    - REQ-AMP-004
    
**Purpose:** Exposes an API endpoint (potentially a webhook) to record conversions attributed to affiliates.  
**Logic Description:** Inject AffiliateMarketingService. Define a POST endpoint to receive conversion data. This might require some form of authentication (e.g., API key for internal system calls) or be open if relying on signed payloads. Validate DTO. Delegate to service. Add Swagger decorators.  
**Documentation:**
    
    - **Summary:** Controller for logging affiliate-driven conversions.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/affiliate-marketing/api/v1/affiliate-marketing.v1.module.ts  
**Description:** NestJS module definition for version 1 of the Affiliate Marketing API. Imports controllers, providers (services), and other necessary modules.  
**Template:** NestJS Module  
**Dependancy Level:** 5  
**Name:** AffiliateMarketingV1Module  
**Type:** Module  
**Relative Path:** modules/affiliate-marketing/api/v1/affiliate-marketing.v1.module.ts  
**Repository Id:** REPO-AFFILIATE-006  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Organization for Affiliate Marketing API v1
    
**Requirement Ids:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-003
    - REQ-AMP-004
    - REQ-AMP-005
    - REQ-AMP-006
    
**Purpose:** Organizes all components of the v1 Affiliate Marketing API.  
**Logic Description:** Import Module from @nestjs/common. Import all controllers defined for affiliate marketing (merchant, affiliate, public, conversions). Import AffiliateMarketingService. Declare controllers in the 'controllers' array and AffiliateMarketingService in the 'providers' array. May import PassportModule for auth.  
**Documentation:**
    
    - **Summary:** Main module for version 1 of the Affiliate Marketing API, encapsulating its controllers and services.
    
**Namespace:** AdManager.AffiliateMarketing.Api.V1  
**Metadata:**
    
    - **Category:** Application
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAffiliateReferralBonus
  - enableTieredCommissions
  - enableAffiliatePerformanceBonuses
  
- **Database Configs:**
  
  - AFFILIATE_DB_CONNECTION_STRING_PLACEHOLDER
  - CORE_PLATFORM_USER_SERVICE_URL
  - CORE_PLATFORM_ORDER_SERVICE_URL
  


---

