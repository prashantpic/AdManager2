# Specification

# 1. Files

- **Path:** libs/backend-kernel/package.json  
**Description:** NPM package definition file for the AdManager.Shared.Backend.Kernel. Specifies dependencies, scripts, and package metadata.  
**Template:** NPM Package Definition  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Package Management
    - Dependency Declaration
    
**Requirement Ids:**
    
    - REQ-SUD-007
    
**Purpose:** Defines the shared kernel as an NPM package, managing its dependencies like class-validator, class-transformer, winston, and aws-sdk.  
**Logic Description:** Configure 'name' as '@admanager/backend-kernel'. Set 'version' to '0.1.0'. Specify 'main' as 'dist/index.js' and 'types' as 'dist/index.d.ts'. Include 'scripts' for 'build' (e.g., 'nest build'), 'prepublishOnly' (e.g., 'npm run build'). List 'dependencies' such as 'class-validator', 'class-transformer', 'winston', '@aws-sdk/client-secrets-manager', '@aws-sdk/client-ssm', 'reflect-metadata', 'rxjs'. List 'devDependencies' like '@nestjs/common', '@nestjs/core', 'typescript'.  
**Documentation:**
    
    - **Summary:** Standard NPM package.json for managing the shared kernel library.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** libs/backend-kernel/tsconfig.json  
**Description:** TypeScript compiler configuration for the shared kernel library. Defines build options, paths, and target ECMAScript version.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    - REQ-SUD-007
    
**Purpose:** Configures TypeScript compilation settings for the shared kernel, ensuring compatibility and proper output for a NestJS library.  
**Logic Description:** Extend a base tsconfig if available. Set 'compilerOptions.module' to 'commonjs', 'compilerOptions.declaration' to true, 'compilerOptions.removeComments' to true, 'compilerOptions.emitDecoratorMetadata' to true, 'compilerOptions.experimentalDecorators' to true, 'compilerOptions.allowSyntheticDefaultImports' to true, 'compilerOptions.target' to 'es2021' or newer, 'compilerOptions.sourceMap' to true, 'compilerOptions.outDir' to './dist', 'compilerOptions.baseUrl' to './', 'compilerOptions.incremental' to true. Include 'src/**/*'. Exclude 'node_modules', 'dist'.  
**Documentation:**
    
    - **Summary:** Standard tsconfig.json for a TypeScript library project, tailored for NestJS.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** libs/backend-kernel/nest-cli.json  
**Description:** NestJS CLI configuration file for the shared kernel library. Specifies project type, root, and compiler options for NestJS builds.  
**Template:** NestJS CLI Configuration  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../nest-cli.json  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS Library Build Configuration
    
**Requirement Ids:**
    
    - REQ-SUD-007
    
**Purpose:** Configures the NestJS CLI for building the shared kernel as a library, specifying source root and compiler options.  
**Logic Description:** Set '$schema' to 'https://json.schemastore.org/nest-cli'. Define 'collection' as '@nestjs/schematics'. Set 'sourceRoot' to 'src'. Configure 'compilerOptions.deleteOutDir' to true. Specify 'generateOptions.spec' as false or true based on project policy. Set 'entryFile' to 'index'. If this is a monorepo library, ensure appropriate project name is used.  
**Documentation:**
    
    - **Summary:** NestJS CLI configuration file, typically used to define how the library is built and managed by the Nest CLI.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** libs/backend-kernel/src/index.ts  
**Description:** Main entry point for the AdManager.Shared.Backend.Kernel library. Exports all public modules, services, interfaces, DTOs, and utilities.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 4  
**Name:** index  
**Type:** ModuleEntry  
**Relative Path:** index.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Library Public API Export
    
**Requirement Ids:**
    
    - REQ-SUD-007
    - 4.1
    
**Purpose:** Serves as the public interface of the shared kernel, exporting all necessary components for consumption by other microservices.  
**Logic Description:** Re-export all public symbols from sub-modules and directories. For example: export * from './core.module'; export * from './logging/interfaces/logger.service.interface'; export * from './config/interfaces/config.service.interface'; export * from './errors/base.exception'; export * from './dtos/pagination.dto'; etc. Ensure all intended public parts of the kernel are accessible through this file.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all public functionalities of the shared backend kernel.
    
**Namespace:** AdManager.Shared.Backend.Kernel  
**Metadata:**
    
    - **Category:** Core
    
- **Path:** libs/backend-kernel/src/core.module.ts  
**Description:** The main NestJS module for the shared kernel. It imports and exports other functional modules provided by this kernel, such as LoggingModule, ConfigModule, etc.  
**Template:** TypeScript NestJS Module  
**Dependancy Level:** 3  
**Name:** CoreModule  
**Type:** Module  
**Relative Path:** core.module.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ModulePattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Module Aggregation
    
**Requirement Ids:**
    
    - REQ-SUD-007
    - 4.1
    
**Purpose:** Aggregates all shared NestJS modules from this kernel into a single importable module for easy integration into microservices.  
**Logic Description:** Decorate the class with @Global() and @Module(). In the 'imports' array, include other modules like LoggingModule, ConfigModule, ErrorsModule, ValidationModule, CachingModule, AuditModule. In the 'exports' array, re-export these same modules and any specific providers that should be directly injectable by consuming services if not already exported by their respective modules.  
**Documentation:**
    
    - **Summary:** Central NestJS module for the backend kernel, providing a consolidated entry point for shared functionalities.
    
**Namespace:** AdManager.Shared.Backend.Kernel  
**Metadata:**
    
    - **Category:** Core
    
- **Path:** libs/backend-kernel/src/common/interfaces/identifiable.interface.ts  
**Description:** Defines a simple interface for objects that have a unique identifier.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IIdentifiable  
**Type:** Interface  
**Relative Path:** common/interfaces/identifiable.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string | number  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Type Definition
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a common contract for entities or DTOs that require a unique identifier.  
**Logic Description:** Define an interface `IIdentifiable<T extends string | number = string>` with a single property `id: T`.  
**Documentation:**
    
    - **Summary:** Interface for objects possessing a unique identifier.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Common  
**Metadata:**
    
    - **Category:** Common
    
- **Path:** libs/backend-kernel/src/common/types/maybe.type.ts  
**Description:** Defines a 'Maybe' type, representing a value that might be null or undefined.  
**Template:** TypeScript Type  
**Dependancy Level:** 0  
**Name:** Maybe  
**Type:** TypeDefinition  
**Relative Path:** common/types/maybe.type.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Type Definition
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a utility type for expressing optionality in a more explicit way.  
**Logic Description:** Define a type alias: `export type Maybe<T> = T | null | undefined;`.  
**Documentation:**
    
    - **Summary:** Type alias for a value that can be T, null, or undefined.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Common  
**Metadata:**
    
    - **Category:** Common
    
- **Path:** libs/backend-kernel/src/common/constants/http-status.constants.ts  
**Description:** Defines common HTTP status codes as constants for consistent use.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** HttpStatusConstants  
**Type:** Constants  
**Relative Path:** common/constants/http-status.constants.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** OK  
**Type:** number  
**Attributes:** public|static|readonly  
    - **Name:** CREATED  
**Type:** number  
**Attributes:** public|static|readonly  
    - **Name:** BAD_REQUEST  
**Type:** number  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Constants
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a centralized definition of HTTP status codes to avoid magic numbers.  
**Logic Description:** Define an enum or a const object for HTTP status codes. For example: `export const HTTP_STATUS = { OK: 200, CREATED: 201, BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404, INTERNAL_SERVER_ERROR: 500 } as const;`.  
**Documentation:**
    
    - **Summary:** Collection of commonly used HTTP status codes.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Common  
**Metadata:**
    
    - **Category:** Common
    
- **Path:** libs/backend-kernel/src/logging/interfaces/logger.service.interface.ts  
**Description:** Defines the contract for a standardized logging service within the Ad Manager platform.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** ILoggerService  
**Type:** Interface  
**Relative Path:** logging/interfaces/logger.service.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** log  
**Parameters:**
    
    - message: string
    - context?: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** error  
**Parameters:**
    
    - message: string | Error
    - trace?: string
    - context?: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** warn  
**Parameters:**
    
    - message: string
    - context?: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** debug  
**Parameters:**
    
    - message: string
    - context?: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** verbose  
**Parameters:**
    
    - message: string
    - context?: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    
**Implemented Features:**
    
    - Logging Abstraction
    
**Requirement Ids:**
    
    - REQ-POA-002
    - 4.1
    
**Purpose:** Provides a consistent logging interface for all backend services, abstracting the underlying logging implementation.  
**Logic Description:** Define the ILoggerService interface with methods for different log levels (log, error, warn, debug, verbose). Each method should accept a message, an optional context string, and optional metadata object.  
**Documentation:**
    
    - **Summary:** Interface for a logging service, defining standard methods for various log severities.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Logging  
**Metadata:**
    
    - **Category:** Logging
    
- **Path:** libs/backend-kernel/src/logging/services/winston-logger.service.ts  
**Description:** Winston-based implementation of the ILoggerService interface. Configures Winston for structured JSON logging compatible with CloudWatch.  
**Template:** TypeScript NestJS Provider  
**Dependancy Level:** 1  
**Name:** WinstonLoggerService  
**Type:** Service  
**Relative Path:** logging/services/winston-logger.service.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - AdapterPattern
    - DependencyInjection
    
**Members:**
    
    - **Name:** logger  
**Type:** winston.Logger  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - configService: IConfigService
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Winston Logging Implementation
    - Structured JSON Logging
    
**Requirement Ids:**
    
    - REQ-POA-002
    - REQ-SUD-007
    
**Purpose:** Provides a concrete logging service using Winston, configured for structured JSON output suitable for CloudWatch.  
**Logic Description:** Implement the ILoggerService interface. Initialize a Winston logger instance in the constructor. Configure Winston transports (e.g., Console) with JSON format, timestamp, and log level handling. Log levels should be configurable via IConfigService. Ensure error objects are properly serialized. Implement each method of ILoggerService by calling the corresponding Winston logger method.  
**Documentation:**
    
    - **Summary:** A NestJS injectable service that implements the ILoggerService using the Winston library.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Logging  
**Metadata:**
    
    - **Category:** Logging
    
- **Path:** libs/backend-kernel/src/logging/logging.module.ts  
**Description:** NestJS module for the logging framework. Provides and exports the configured logger service.  
**Template:** TypeScript NestJS Module  
**Dependancy Level:** 2  
**Name:** LoggingModule  
**Type:** Module  
**Relative Path:** logging/logging.module.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ModulePattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Logging Service Provision
    
**Requirement Ids:**
    
    - REQ-POA-002
    
**Purpose:** Encapsulates logging functionality as a NestJS module, making the logger service available for dependency injection.  
**Logic Description:** Decorate with @Module(). Import ConfigModule if logger configuration depends on it. In 'providers', provide ILoggerService using the WinstonLoggerService class. In 'exports', export ILoggerService so it can be injected by other modules/services.  
**Documentation:**
    
    - **Summary:** NestJS module that configures and exports the shared logging service.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Logging  
**Metadata:**
    
    - **Category:** Logging
    
- **Path:** libs/backend-kernel/src/logging/constants/logging.constants.ts  
**Description:** Defines constants related to logging, such as injection tokens.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** LoggingConstants  
**Type:** Constants  
**Relative Path:** logging/constants/logging.constants.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** LOGGER_SERVICE_TOKEN  
**Type:** symbol  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Constants
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides unique symbols or strings for injecting logging-related services.  
**Logic Description:** Define `export const LOGGER_SERVICE_TOKEN = Symbol('ILoggerService');` or a string token like `export const LOGGER_SERVICE = 'LOGGER_SERVICE';`.  
**Documentation:**
    
    - **Summary:** Constants for the logging module, primarily for dependency injection tokens.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Logging  
**Metadata:**
    
    - **Category:** Logging
    
- **Path:** libs/backend-kernel/src/errors/base.exception.ts  
**Description:** Base class for all custom exceptions in the Ad Manager platform. Extends NestJS HttpException.  
**Template:** TypeScript Class  
**Dependancy Level:** 0  
**Name:** BasePlatformException  
**Type:** Exception  
**Relative Path:** errors/base.exception.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** errorCode  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** details  
**Type:** Record<string, any> | undefined  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - message: string | Record<string, any>
    - status: number
    - errorCode: string
    - details?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Custom Exception Base
    
**Requirement Ids:**
    
    - 4.1
    - REQ-SUD-007
    
**Purpose:** Provides a standardized base for custom exceptions, incorporating an error code and optional details.  
**Logic Description:** Extend `HttpException` from '@nestjs/common'. The constructor should accept a message (string or object), HTTP status, a custom `errorCode` string, and an optional `details` object. Store `errorCode` and `details` as public readonly properties. The response body should include these fields.  
**Documentation:**
    
    - **Summary:** A base exception class for creating standardized custom exceptions across the platform.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Errors  
**Metadata:**
    
    - **Category:** Errors
    
- **Path:** libs/backend-kernel/src/errors/exceptions/validation.exception.ts  
**Description:** Custom exception for handling data validation failures. Extends BasePlatformException.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** ValidationException  
**Type:** Exception  
**Relative Path:** errors/exceptions/validation.exception.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** validationErrors  
**Type:** Record<string, string[]> | string[]  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - errors: Record<string, string[]> | string[]
    - message?: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Specific Validation Error Handling
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Represents errors that occur due to invalid input data, typically from class-validator.  
**Logic Description:** Extend `BasePlatformException`. The constructor accepts validation errors (potentially an array of `ValidationError` from class-validator or a custom format) and an optional message. Set an appropriate HTTP status (e.g., 400 Bad Request) and a specific `errorCode` (e.g., 'VALIDATION_ERROR'). Store the validation errors in the `validationErrors` property and include them in the exception response.  
**Documentation:**
    
    - **Summary:** Custom exception for validation errors, typically carrying detailed field-specific error messages.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Errors.Exceptions  
**Metadata:**
    
    - **Category:** Errors
    
- **Path:** libs/backend-kernel/src/errors/exceptions/resource-not-found.exception.ts  
**Description:** Custom exception for indicating a requested resource was not found. Extends BasePlatformException.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** ResourceNotFoundException  
**Type:** Exception  
**Relative Path:** errors/exceptions/resource-not-found.exception.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - resourceName: string
    - resourceId?: string | number
    - message?: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Specific Not Found Error Handling
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Represents errors when a specific resource cannot be located.  
**Logic Description:** Extend `BasePlatformException`. The constructor accepts the name of the resource and an optional identifier. Set HTTP status to 404 Not Found and `errorCode` to 'RESOURCE_NOT_FOUND'. Construct a user-friendly message like '`resourceName` with ID `resourceId` not found.'  
**Documentation:**
    
    - **Summary:** Custom exception to be thrown when a requested resource is not found.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Errors.Exceptions  
**Metadata:**
    
    - **Category:** Errors
    
- **Path:** libs/backend-kernel/src/errors/filters/global-exception.filter.ts  
**Description:** Global NestJS exception filter to catch all unhandled exceptions and standardize error responses.  
**Template:** TypeScript NestJS Filter  
**Dependancy Level:** 2  
**Name:** GlobalExceptionFilter  
**Type:** Filter  
**Relative Path:** errors/filters/global-exception.filter.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ExceptionFilterPattern
    
**Members:**
    
    - **Name:** logger  
**Type:** ILoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - logger: ILoggerService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** catch  
**Parameters:**
    
    - exception: unknown
    - host: ArgumentsHost
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Standardized Error Responses
    - Unhandled Exception Logging
    
**Requirement Ids:**
    
    - REQ-POA-002
    - 4.1
    
**Purpose:** Ensures all HTTP error responses from the application have a consistent structure and logs unhandled exceptions.  
**Logic Description:** Implement `ExceptionFilter` from '@nestjs/common'. Inject ILoggerService. In the `catch` method, determine if the exception is an instance of `BasePlatformException` or `HttpException`. If so, use its status and response. Otherwise, treat as an unhandled 500 error. Log the error with details. Construct a standardized JSON error response (e.g., including statusCode, message, errorCode, timestamp, path, details/validationErrors if available). Send the response using `response.status(status).json(errorResponse)`. Handle different types of exceptions appropriately.  
**Documentation:**
    
    - **Summary:** A global exception filter that intercepts exceptions and formats them into a standard HTTP response structure.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Errors.Filters  
**Metadata:**
    
    - **Category:** Errors
    
- **Path:** libs/backend-kernel/src/dtos/pagination/pagination-query.dto.ts  
**Description:** Data Transfer Object for common pagination query parameters (e.g., page, limit, sortBy, sortOrder).  
**Template:** TypeScript DTO  
**Dependancy Level:** 0  
**Name:** PaginationQueryDto  
**Type:** DTO  
**Relative Path:** dtos/pagination/pagination-query.dto.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    - **Name:** sortBy  
**Type:** string  
**Attributes:** public  
    - **Name:** sortOrder  
**Type:** 'ASC' | 'DESC'  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Pagination Input
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a standard DTO for services to accept pagination and sorting parameters in API requests.  
**Logic Description:** Define properties: `page` (optional, number, use `@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Type(() => Number)`), `limit` (optional, number, use `@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)`, `@Type(() => Number)`), `sortBy` (optional, string, use `@IsOptional()`, `@IsString()`), `sortOrder` (optional, enum ['ASC', 'DESC'], use `@IsOptional()`, `@IsEnum(['ASC', 'DESC'])`). Add default values in service logic if not provided.  
**Documentation:**
    
    - **Summary:** DTO representing common query parameters for paginated list requests.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Dtos.Pagination  
**Metadata:**
    
    - **Category:** DTOs
    
- **Path:** libs/backend-kernel/src/dtos/pagination/paged-response.dto.ts  
**Description:** Generic Data Transfer Object for returning paginated list results.  
**Template:** TypeScript DTO  
**Dependancy Level:** 1  
**Name:** PagedResponseDto  
**Type:** DTO  
**Relative Path:** dtos/pagination/paged-response.dto.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** public  
    - **Name:** total  
**Type:** number  
**Attributes:** public  
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    - **Name:** totalPages  
**Type:** number  
**Attributes:** public  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - data: T[]
    - total: number
    - page: number
    - limit: number
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Standardized Paginated Output
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a standard DTO for services to return lists of items along with pagination metadata.  
**Logic Description:** Define a generic class `PagedResponseDto<T>`. Properties: `data: T[]`, `total: number` (total items), `page: number`, `limit: number`, `totalPages: number`. The constructor should calculate `totalPages = Math.ceil(total / limit)`. Use validation decorators if these DTOs are ever used as input, but primarily they are output.  
**Documentation:**
    
    - **Summary:** Generic DTO for representing a paginated response, including data and pagination metadata.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Dtos.Pagination  
**Metadata:**
    
    - **Category:** DTOs
    
- **Path:** libs/backend-kernel/src/validation/decorators/is-custom-uuid.decorator.ts  
**Description:** Custom class-validator decorator to validate if a string is a valid UUID, potentially with custom message options.  
**Template:** TypeScript Decorator  
**Dependancy Level:** 0  
**Name:** IsCustomUuid  
**Type:** Decorator  
**Relative Path:** validation/decorators/is-custom-uuid.decorator.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - DecoratorPattern
    
**Members:**
    
    
**Methods:**
    
    - **Name:** IsCustomUuid  
**Parameters:**
    
    - validationOptions?: ValidationOptions
    
**Return Type:** PropertyDecorator  
**Attributes:** export function  
    
**Implemented Features:**
    
    - Custom Validation Logic
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a reusable custom validation decorator for UUID formats, enhancing class-validator capabilities.  
**Logic Description:** Import `registerDecorator`, `ValidationOptions`, `ValidatorConstraint`, `ValidatorConstraintInterface`, `ValidationArguments` from 'class-validator'. Create a class `IsCustomUuidConstraint` implementing `ValidatorConstraintInterface`. In its `validate` method, check if the value is a valid UUID string (e.g., using a regex or `isUUID` from class-validator itself but with custom logic/message). In the `defaultMessage` method, return a custom error message. The exported `IsCustomUuid` function uses `registerDecorator` to apply this constraint.  
**Documentation:**
    
    - **Summary:** A custom class-validator decorator for validating UUID strings.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Validation.Decorators  
**Metadata:**
    
    - **Category:** Validation
    
- **Path:** libs/backend-kernel/src/config/interfaces/config.service.interface.ts  
**Description:** Defines the contract for a configuration service, responsible for fetching application configuration values.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IConfigService  
**Type:** Interface  
**Relative Path:** config/interfaces/config.service.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** get  
**Parameters:**
    
    - key: string
    
**Return Type:** string | undefined  
**Attributes:**   
    - **Name:** getOrThrow  
**Parameters:**
    
    - key: string
    
**Return Type:** string  
**Attributes:**   
    - **Name:** getNumber  
**Parameters:**
    
    - key: string
    
**Return Type:** number | undefined  
**Attributes:**   
    - **Name:** getNumberOrThrow  
**Parameters:**
    
    - key: string
    
**Return Type:** number  
**Attributes:**   
    - **Name:** getBoolean  
**Parameters:**
    
    - key: string
    
**Return Type:** boolean  
**Attributes:**   
    
**Implemented Features:**
    
    - Configuration Abstraction
    
**Requirement Ids:**
    
    - REQ-POA-009
    - 4.1
    
**Purpose:** Provides a standardized way for services to access configuration parameters, abstracting the source (e.g., env vars, AWS Parameter Store).  
**Logic Description:** Define the IConfigService interface with methods to retrieve configuration values by key, e.g., `get(key: string): Maybe<string>`, `getNumber(key: string): Maybe<number>`, `getBoolean(key: string): boolean`, `getOrThrow(key: string, defaultValue?: string): string`. Consider methods for typed retrieval.  
**Documentation:**
    
    - **Summary:** Interface for a configuration service that provides access to application settings.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Config  
**Metadata:**
    
    - **Category:** Config
    
- **Path:** libs/backend-kernel/src/config/services/aws-appconfig.service.ts  
**Description:** Implementation of IConfigService using AWS AppConfig, AWS Secrets Manager and AWS Systems Manager Parameter Store.  
**Template:** TypeScript NestJS Provider  
**Dependancy Level:** 1  
**Name:** AwsAppConfigService  
**Type:** Service  
**Relative Path:** config/services/aws-appconfig.service.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - AdapterPattern
    - DependencyInjection
    
**Members:**
    
    - **Name:** ssmClient  
**Type:** SSMClient  
**Attributes:** private|readonly  
    - **Name:** secretsManagerClient  
**Type:** SecretsManagerClient  
**Attributes:** private|readonly  
    - **Name:** cachedConfig  
**Type:** Record<string, string>  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** loadConfiguration  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** private  
    
**Implemented Features:**
    
    - AWS Configuration Management
    - Secrets Management
    
**Requirement Ids:**
    
    - REQ-POA-009
    - REQ-SUD-007
    
**Purpose:** Provides a concrete configuration service that fetches settings from AWS Systems Manager Parameter Store and secrets from AWS Secrets Manager. Should also consider AWS AppConfig for dynamic configurations.  
**Logic Description:** Implement IConfigService. Initialize AWS SDK clients for SSM and Secrets Manager in the constructor. Implement methods to fetch parameters from Parameter Store (potentially by path) and secrets from Secrets Manager. Cache fetched configurations for a short duration to reduce AWS API calls. Handle cases where keys are not found gracefully (return undefined or throw, as per interface contract). Add a method to preload essential configurations on startup. Consider prefixing keys for different environments or services.  
**Documentation:**
    
    - **Summary:** A NestJS injectable service that implements IConfigService using AWS SSM Parameter Store and AWS Secrets Manager.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Config  
**Metadata:**
    
    - **Category:** Config
    
- **Path:** libs/backend-kernel/src/config/config.module.ts  
**Description:** NestJS module for the configuration framework. Provides and exports the configured config service.  
**Template:** TypeScript NestJS Module  
**Dependancy Level:** 2  
**Name:** ConfigModule  
**Type:** Module  
**Relative Path:** config/config.module.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ModulePattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Configuration Service Provision
    
**Requirement Ids:**
    
    - REQ-POA-009
    
**Purpose:** Encapsulates configuration functionality, making the config service available for dependency injection across the platform.  
**Logic Description:** Decorate with @Module(). In 'providers', provide IConfigService using the AwsAppConfigService class. In 'exports', export IConfigService.  
**Documentation:**
    
    - **Summary:** NestJS module that configures and exports the shared configuration service.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Config  
**Metadata:**
    
    - **Category:** Config
    
- **Path:** libs/backend-kernel/src/config/constants/config.constants.ts  
**Description:** Defines constants related to configuration, such as injection tokens.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** ConfigConstants  
**Type:** Constants  
**Relative Path:** config/constants/config.constants.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CONFIG_SERVICE_TOKEN  
**Type:** symbol  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Constants
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides unique symbols or strings for injecting configuration-related services.  
**Logic Description:** Define `export const CONFIG_SERVICE_TOKEN = Symbol('IConfigService');`.  
**Documentation:**
    
    - **Summary:** Constants for the configuration module, primarily for dependency injection tokens.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Config  
**Metadata:**
    
    - **Category:** Config
    
- **Path:** libs/backend-kernel/src/audit/interfaces/audit-log.service.interface.ts  
**Description:** Defines the contract for an audit logging service.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IAuditLogService  
**Type:** Interface  
**Relative Path:** audit/interfaces/audit-log.service.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** logAction  
**Parameters:**
    
    - entry: AuditEntryDto
    
**Return Type:** Promise<void>  
**Attributes:**   
    
**Implemented Features:**
    
    - Audit Logging Abstraction
    
**Requirement Ids:**
    
    - 4.1
    - Cross-Cutting Concerns Layer
    
**Purpose:** Provides a standardized interface for recording audit trail entries.  
**Logic Description:** Define the IAuditLogService interface with a method `logAction(entry: AuditEntryDto): Promise<void>;`. AuditEntryDto should contain fields like userId, action, targetResource, timestamp, details.  
**Documentation:**
    
    - **Summary:** Interface for a service responsible for logging audit trail events.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Audit  
**Metadata:**
    
    - **Category:** Audit
    
- **Path:** libs/backend-kernel/src/audit/dtos/audit-entry.dto.ts  
**Description:** Data Transfer Object for an audit log entry.  
**Template:** TypeScript DTO  
**Dependancy Level:** 0  
**Name:** AuditEntryDto  
**Type:** DTO  
**Relative Path:** audit/dtos/audit-entry.dto.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public  
    - **Name:** userId  
**Type:** string  
**Attributes:** public  
    - **Name:** actorType  
**Type:** string  
**Attributes:** public  
    - **Name:** action  
**Type:** string  
**Attributes:** public  
    - **Name:** targetResource  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** targetResourceId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** 'SUCCESS' | 'FAILURE'  
**Attributes:** public  
    - **Name:** details  
**Type:** Record<string, any>  
**Attributes:** public|optional  
    - **Name:** ipAddress  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** serviceName  
**Type:** string  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Audit Data
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Defines the structure for data captured in an audit log entry.  
**Logic Description:** Define properties like `timestamp: Date`, `userId: string`, `actorType: string` (e.g. 'USER', 'SYSTEM'), `action: string`, `targetResource?: string`, `targetResourceId?: string`, `status: 'SUCCESS' | 'FAILURE'`, `details?: Record<string, any>`, `ipAddress?: string`, `serviceName: string`. Use class-validator decorators for basic validation.  
**Documentation:**
    
    - **Summary:** DTO representing the structure of an audit log entry.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Audit.Dtos  
**Metadata:**
    
    - **Category:** Audit
    
- **Path:** libs/backend-kernel/src/audit/services/audit-log.service.ts  
**Description:** Provides a basic implementation of IAuditLogService, potentially logging to console or a configured logger for development/testing. Production might use a more robust solution.  
**Template:** TypeScript NestJS Provider  
**Dependancy Level:** 2  
**Name:** AuditLogService  
**Type:** Service  
**Relative Path:** audit/services/audit-log.service.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** logger  
**Type:** ILoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - logger: ILoggerService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** logAction  
**Parameters:**
    
    - entry: AuditEntryDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Audit Logging Implementation
    
**Requirement Ids:**
    
    - REQ-POA-002
    - Cross-Cutting Concerns Layer
    
**Purpose:** A concrete implementation for audit logging. This kernel version might log via the standard ILoggerService. A dedicated microservice might handle audit logs in production.  
**Logic Description:** Implement `IAuditLogService`. Inject `ILoggerService`. The `logAction` method will format the `AuditEntryDto` and log it using the injected logger, perhaps at a specific 'audit' log level or with specific metadata tags. For a shared kernel, this might just be a pass-through to the configured logger or an abstract class to be implemented by consuming services.  
**Documentation:**
    
    - **Summary:** Service implementation for audit logging, typically using the shared logger.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Audit  
**Metadata:**
    
    - **Category:** Audit
    
- **Path:** libs/backend-kernel/src/audit/audit.module.ts  
**Description:** NestJS module for the audit logging framework.  
**Template:** TypeScript NestJS Module  
**Dependancy Level:** 3  
**Name:** AuditModule  
**Type:** Module  
**Relative Path:** audit/audit.module.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ModulePattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Logging Service Provision
    
**Requirement Ids:**
    
    - Cross-Cutting Concerns Layer
    
**Purpose:** Encapsulates audit logging functionality, making the audit service available for dependency injection.  
**Logic Description:** Decorate with @Module(). Import `LoggingModule`. In 'providers', provide `IAuditLogService` using the `AuditLogService` class. In 'exports', export `IAuditLogService`.  
**Documentation:**
    
    - **Summary:** NestJS module that configures and exports the shared audit logging service.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Audit  
**Metadata:**
    
    - **Category:** Audit
    
- **Path:** libs/backend-kernel/src/caching/interfaces/cache.service.interface.ts  
**Description:** Defines the contract for a caching service.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** ICacheService  
**Type:** Interface  
**Relative Path:** caching/interfaces/cache.service.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** get  
**Parameters:**
    
    - key: string
    
**Return Type:** Promise<T | undefined>  
**Attributes:** <T>  
    - **Name:** set  
**Parameters:**
    
    - key: string
    - value: T
    - ttlSeconds?: number
    
**Return Type:** Promise<void>  
**Attributes:** <T>  
    - **Name:** delete  
**Parameters:**
    
    - key: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** clear  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:**   
    
**Implemented Features:**
    
    - Caching Abstraction
    
**Requirement Ids:**
    
    - 4.1
    - Cross-Cutting Concerns Layer
    
**Purpose:** Provides a standardized interface for interacting with a cache store.  
**Logic Description:** Define the ICacheService interface with generic methods `get<T>(key: string): Promise<Maybe<T>>`, `set<T>(key: string, value: T, ttl?: number): Promise<void>`, `del(key: string): Promise<void>`, and potentially `clear(): Promise<void>`.  
**Documentation:**
    
    - **Summary:** Interface for a caching service, defining standard methods for cache operations.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Caching  
**Metadata:**
    
    - **Category:** Caching
    
- **Path:** libs/backend-kernel/src/caching/services/redis-cache.service.ts  
**Description:** Implementation of ICacheService using Redis, likely via a library like ioredis or NestJS's caching module.  
**Template:** TypeScript NestJS Provider  
**Dependancy Level:** 2  
**Name:** RedisCacheService  
**Type:** Service  
**Relative Path:** caching/services/redis-cache.service.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - AdapterPattern
    - DependencyInjection
    
**Members:**
    
    - **Name:** cacheManager  
**Type:** Cache  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - @Inject(CACHE_MANAGER) cacheManager: Cache
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Redis Caching Implementation
    
**Requirement Ids:**
    
    - Cross-Cutting Concerns Layer
    
**Purpose:** Provides a concrete caching service using Redis, leveraging NestJS's built-in caching abstraction if suitable.  
**Logic Description:** Implement `ICacheService`. Inject `CACHE_MANAGER` from `@nestjs/cache-manager` (if using NestJS caching module configured with Redis). Implement `get`, `set`, `del` methods by calling the corresponding methods on the `cacheManager`. Handle serialization/deserialization if necessary (though NestJS cache manager often handles this).  
**Documentation:**
    
    - **Summary:** A NestJS injectable service that implements ICacheService using Redis via NestJS CacheManager.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Caching  
**Metadata:**
    
    - **Category:** Caching
    
- **Path:** libs/backend-kernel/src/caching/caching.module.ts  
**Description:** NestJS module for the caching framework.  
**Template:** TypeScript NestJS Module  
**Dependancy Level:** 3  
**Name:** CachingModule  
**Type:** Module  
**Relative Path:** caching/caching.module.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    - ModulePattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Caching Service Provision
    
**Requirement Ids:**
    
    - Cross-Cutting Concerns Layer
    
**Purpose:** Encapsulates caching functionality, making the cache service available for dependency injection.  
**Logic Description:** Decorate with @Module(). Import `CacheModule` from `@nestjs/cache-manager` and configure it for Redis using `registerAsync` and `ConfigModule` to fetch Redis connection details. Provide `ICacheService` using `RedisCacheService`. Export `ICacheService` and potentially `CacheModule` itself if direct access to `CACHE_MANAGER` is desired.  
**Documentation:**
    
    - **Summary:** NestJS module that configures and exports the shared caching service.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Caching  
**Metadata:**
    
    - **Category:** Caching
    
- **Path:** libs/backend-kernel/src/events/interfaces/domain-event.interface.ts  
**Description:** Interface defining the structure of a domain event.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IDomainEvent  
**Type:** Interface  
**Relative Path:** events/interfaces/domain-event.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dateTimeOccurred  
**Type:** Date  
**Attributes:** readonly  
    - **Name:** aggregateId  
**Type:** string | number  
**Attributes:** readonly  
    - **Name:** eventName  
**Type:** string  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Domain Event Contract
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a common structure for all domain events within the system, ensuring consistency.  
**Logic Description:** Define an interface `IDomainEvent` with properties like `dateTimeOccurred: Date`, `aggregateId: string | number`, `eventName: string`, and potentially a generic payload property or methods to get event-specific data.  
**Documentation:**
    
    - **Summary:** Base interface for domain events, capturing common metadata.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Events  
**Metadata:**
    
    - **Category:** Events
    
- **Path:** libs/backend-kernel/src/events/interfaces/integration-event.interface.ts  
**Description:** Interface defining the structure of an integration event for cross-service communication.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IIntegrationEvent  
**Type:** Interface  
**Relative Path:** events/interfaces/integration-event.interface.ts  
**Repository Id:** REPO-SHARED-KERNEL-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** eventId  
**Type:** string  
**Attributes:** readonly  
    - **Name:** occurredOn  
**Type:** Date  
**Attributes:** readonly  
    - **Name:** eventName  
**Type:** string  
**Attributes:** readonly  
    - **Name:** correlationId  
**Type:** string  
**Attributes:** readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Integration Event Contract
    
**Requirement Ids:**
    
    - 4.1
    
**Purpose:** Provides a common structure for all integration events, used for asynchronous communication between microservices.  
**Logic Description:** Define an interface `IIntegrationEvent` with properties like `eventId: string` (unique event ID), `occurredOn: Date`, `eventName: string`, `version?: number`, `correlationId?: string`, and a generic `payload: T`.  
**Documentation:**
    
    - **Summary:** Base interface for integration events, used for inter-service communication.
    
**Namespace:** AdManager.Shared.Backend.Kernel.Events  
**Metadata:**
    
    - **Category:** Events
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedAuditLogging
  - useVerboseErrorResponsesInDev
  
- **Database Configs:**
  
  


---

