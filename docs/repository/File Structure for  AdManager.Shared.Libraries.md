# Specification

# 1. Files

- **Path:** package.json  
**Description:** Root package.json for the AdManager.Shared.Libraries monorepo. Manages workspaces, development dependencies, and scripts for building and testing all shared packages.  
**Template:** TypeScript Library Monorepo Root Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Monorepo
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Monorepo Setup
    - Shared Dependency Management
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the monorepo structure and manage shared development tools for all libraries.  
**Logic Description:** This file will use NPM/Yarn/PNPM workspaces to manage sub-packages. It will include scripts for bootstrapping, building all packages, running tests across all packages, and linting. Dev dependencies like TypeScript, Jest, ESLint, Prettier, and Lerna/Nx (if used) will be listed here.  
**Documentation:**
    
    - **Summary:** Root configuration for the shared libraries monorepo, defining workspaces and global development scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.base.json  
**Description:** Base TypeScript configuration file for the AdManager.Shared.Libraries monorepo. Provides common compiler options inherited by all shared packages.  
**Template:** TypeScript Base Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig.base  
**Type:** Configuration  
**Relative Path:** tsconfig.base.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared TypeScript Compiler Configuration
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To ensure consistent TypeScript compilation settings across all shared libraries.  
**Logic Description:** This file will define common compilerOptions such as target, module, strict, esModuleInterop, declaration, sourceMap, and base URL. Specific packages can extend this and override options if necessary.  
**Documentation:**
    
    - **Summary:** Base tsconfig.json providing shared TypeScript compiler options for all packages within the monorepo.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/logger/package.json  
**Description:** NPM package definition for the @admanager/logger shared library. Specifies dependencies (e.g., a logging framework like pino or winston), scripts, and publishing configuration for the common logging library.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/logger/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Logger Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/logger NPM package.  
**Logic Description:** Specifies package name as @admanager/logger, version, main entry point (dist/index.js), types entry point (dist/index.d.ts), peer dependencies if any, and scripts for building this specific package.  
**Documentation:**
    
    - **Summary:** Package configuration for the shared logging library.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/logger/tsconfig.json  
**Description:** TypeScript configuration for the @admanager/logger package, extending the base tsconfig.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/logger/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Logger TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the logger library.  
**Logic Description:** Extends the root tsconfig.base.json. Specifies 'outDir' to 'dist' and 'rootDir' to 'src'. Includes 'src/**/*' and excludes 'node_modules', 'dist'. Defines references to other shared packages if needed (e.g., @admanager/types).  
**Documentation:**
    
    - **Summary:** TypeScript compiler options specific to the @admanager/logger package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/logger/src/index.ts  
**Description:** Barrel file for the @admanager/logger package. Exports all public interfaces, classes, enums, and types from this library.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 2  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/logger/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Logger Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To provide a single entry point for consumers of the logger library.  
**Logic Description:** Exports ILogger, LoggerService, LogLevel, and LoggerConfig from their respective files.  
**Documentation:**
    
    - **Summary:** Exports the public API of the @admanager/logger library.
    
**Namespace:** AdManager.Shared.Logger  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/logger/src/logger.interface.ts  
**Description:** Defines the contract (ILogger) for logger services used across Ad Manager microservices. Ensures consistent logging capabilities and facilitates dependency inversion.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** logger.interface  
**Type:** Interface  
**Relative Path:** packages/logger/src/logger.interface.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DependencyInversion
    - InterfaceSegregation
    
**Members:**
    
    
**Methods:**
    
    - **Name:** debug  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** info  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** warn  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    - **Name:** error  
**Parameters:**
    
    - message: string
    - trace?: string | Error
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:**   
    
**Implemented Features:**
    
    - Standardized Logging Contract
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent logging interface for all microservices, abstracting specific logger implementations.  
**Logic Description:** This interface will define methods for different log levels (e.g., info, warn, error, debug). Each method will accept a message and an optional metadata object for structured logging.  
**Documentation:**
    
    - **Summary:** Specifies the ILogger interface with methods for various log levels (debug, info, warn, error) and context/metadata passing.
    
**Namespace:** AdManager.Shared.Logger  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/logger/src/enums/log-level.enum.ts  
**Description:** Defines standard log levels for the logging framework.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** log-level.enum  
**Type:** Enum  
**Relative Path:** packages/logger/src/enums/log-level.enum.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Enumeration
    
**Members:**
    
    - **Name:** ERROR  
**Type:** string  
**Attributes:**   
    - **Name:** WARN  
**Type:** string  
**Attributes:**   
    - **Name:** INFO  
**Type:** string  
**Attributes:**   
    - **Name:** DEBUG  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Log Levels
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent set of log levels across the application.  
**Logic Description:** Defines an enum `LogLevel` with values like ERROR, WARN, INFO, DEBUG.  
**Documentation:**
    
    - **Summary:** Enumeration of supported log levels.
    
**Namespace:** AdManager.Shared.Logger  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/logger/src/logger.config.ts  
**Description:** Defines the configuration interface (LoggerConfig) and potentially default configurations for the logger service.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** logger.config  
**Type:** Interface  
**Relative Path:** packages/logger/src/logger.config.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** level  
**Type:** LogLevel  
**Attributes:** readonly  
    - **Name:** serviceName  
**Type:** string  
**Attributes:** readonly  
    - **Name:** isProduction  
**Type:** boolean  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Logger Configuration Definition
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To define the structure for logger configurations.  
**Logic Description:** Declares an interface `LoggerConfig` with properties like `level` (of type LogLevel), `format` (e.g., 'json', 'text'), `serviceName`, etc. May include a function to get default configuration.  
**Documentation:**
    
    - **Summary:** Interface for logger configuration options.
    
**Namespace:** AdManager.Shared.Logger  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/logger/src/logger.service.ts  
**Description:** Provides a concrete implementation of the ILogger interface. This service can be configured to use different logging libraries (e.g., Winston, Pino) or a simple console logger for development. It handles log formatting and output.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** logger.service  
**Type:** Service  
**Relative Path:** packages/logger/src/logger.service.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Singleton
    
**Members:**
    
    - **Name:** config  
**Type:** LoggerConfig  
**Attributes:** private|readonly  
    - **Name:** underlyingLogger  
**Type:** any  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - config: LoggerConfig
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** debug  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** info  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** warn  
**Parameters:**
    
    - message: string
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** error  
**Parameters:**
    
    - message: string
    - trace?: string | Error
    - meta?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Centralized Logging Implementation
    - Log Formatting
    - Configurable Log Levels
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To offer a ready-to-use, configurable logging service for microservices.  
**Logic Description:** Implements `ILogger`. The constructor accepts `LoggerConfig`. Internally, it might initialize a logging library like Pino or Winston based on the config. Methods will format messages including service name and timestamp, then delegate to the underlying logger.  
**Documentation:**
    
    - **Summary:** Concrete implementation of ILogger. Provides methods for logging at various levels with structured metadata.
    
**Namespace:** AdManager.Shared.Logger  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/errors/package.json  
**Description:** NPM package definition for the @admanager/errors shared library. Contains custom error classes and utilities for standardized error handling.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/errors/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Error Framework Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/errors NPM package.  
**Logic Description:** Specifies package name @admanager/errors, version, main/types entry points, and any dependencies (e.g., on @admanager/types if error codes are shared).  
**Documentation:**
    
    - **Summary:** Package configuration for the shared error handling framework.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/errors/tsconfig.json  
**Description:** TypeScript configuration for the @admanager/errors package.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/errors/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Error Framework TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the errors library.  
**Logic Description:** Extends tsconfig.base.json. Defines outDir, rootDir, and potentially project references to @admanager/types.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options specific to the @admanager/errors package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/errors/src/index.ts  
**Description:** Barrel file for the @admanager/errors package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 2  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/errors/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Error Framework Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To provide a single entry point for the errors library.  
**Logic Description:** Exports CustomBaseError, specific HTTP error classes (BadRequestError, etc.), ErrorCodes, and IErrorResponse.  
**Documentation:**
    
    - **Summary:** Exports the public API of the @admanager/errors library.
    
**Namespace:** AdManager.Shared.Errors  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/errors/src/base.error.ts  
**Description:** Defines a custom base error class (CustomBaseError) from which all application-specific errors should inherit. Includes common properties like error code, status code, and context.  
**Template:** TypeScript Class  
**Dependancy Level:** 0  
**Name:** base.error  
**Type:** Class  
**Relative Path:** packages/errors/src/base.error.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** message  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** code  
**Type:** string | number  
**Attributes:** public|readonly  
    - **Name:** statusCode  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** context  
**Type:** Record<string, any> | undefined  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - message: string
    - statusCode: number
    - code: string | number
    - context?: Record<string, any>
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Standardized Base Error Class
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent base for all custom errors within the Ad Manager platform.  
**Logic Description:** Class `CustomBaseError` extends the native `Error` class. Its constructor will accept message, an optional error code, an HTTP status code, and optional context. This allows for structured error handling.  
**Documentation:**
    
    - **Summary:** Base error class for creating custom, structured application errors. Includes properties for message, error code, HTTP status, and additional context.
    
**Namespace:** AdManager.Shared.Errors  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/errors/src/http.errors.ts  
**Description:** Defines specific HTTP error classes (e.g., BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError, InternalServerError) that extend CustomBaseError. Each class will have a pre-defined HTTP status code.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** http.errors  
**Type:** Class  
**Relative Path:** packages/errors/src/http.errors.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized HTTP Error Classes
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a set of standard HTTP-related error classes for consistent error responses.  
**Logic Description:** Defines classes like `NotFoundError` (extends `CustomBaseError`, sets statusCode to 404), `BadRequestError` (statusCode 400), `UnauthorizedError` (statusCode 401), `ForbiddenError` (statusCode 403), `InternalServerError` (statusCode 500). Constructors may take a message and optional context or specific error code.  
**Documentation:**
    
    - **Summary:** Collection of specific error classes for common HTTP status codes, inheriting from CustomBaseError.
    
**Namespace:** AdManager.Shared.Errors  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/errors/src/error.codes.ts  
**Description:** Defines an enumeration or a constant object (ErrorCodes) for application-specific error codes. This helps in identifying errors programmatically.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** error.codes  
**Type:** Enum  
**Relative Path:** packages/errors/src/error.codes.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Enumeration
    
**Members:**
    
    - **Name:** VALIDATION_ERROR  
**Type:** string  
**Attributes:**   
    - **Name:** RESOURCE_NOT_FOUND  
**Type:** string  
**Attributes:**   
    - **Name:** UNAUTHENTICATED  
**Type:** string  
**Attributes:**   
    - **Name:** PERMISSION_DENIED  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Error Codes
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a centralized repository of unique error codes for the application.  
**Logic Description:** Defines an enum or a const object `ErrorCodes` mapping descriptive names (e.g., `VALIDATION_FAILED`, `ENTITY_NOT_FOUND`) to unique string or numeric codes.  
**Documentation:**
    
    - **Summary:** Enumeration of application-specific error codes for standardized error identification.
    
**Namespace:** AdManager.Shared.Errors  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/errors/src/error-response.dto.ts  
**Description:** Defines the DTO (IErrorResponse or ErrorResponseDto) for standardized error responses sent by APIs.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** error-response.dto  
**Type:** DTO  
**Relative Path:** packages/errors/src/error-response.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** statusCode  
**Type:** number  
**Attributes:** readonly  
    - **Name:** message  
**Type:** string  
**Attributes:** readonly  
    - **Name:** code  
**Type:** string | number | undefined  
**Attributes:** readonly  
    - **Name:** timestamp  
**Type:** string  
**Attributes:** readonly  
    - **Name:** path  
**Type:** string | undefined  
**Attributes:** readonly  
    - **Name:** details  
**Type:** Record<string, any> | any[] | undefined  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized API Error Response Structure
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To ensure all API error responses follow a consistent format.  
**Logic Description:** Defines an interface `IErrorResponse` with fields like `statusCode`, `message`, `errorCode` (optional, from ErrorCodes), `timestamp`, `path` (request path), and `details` (optional, for validation errors or more context).  
**Documentation:**
    
    - **Summary:** Defines the standard structure for error responses from APIs, including status code, message, and optional error code or details.
    
**Namespace:** AdManager.Shared.Errors  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/package.json  
**Description:** NPM package definition for @admanager/types, containing shared DTOs, enums, interfaces, and event schemas.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/types/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Types Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/types NPM package.  
**Logic Description:** Specifies package name @admanager/types, version, main/types entry points. May have dependencies like class-validator if DTOs use decorators directly.  
**Documentation:**
    
    - **Summary:** Package configuration for shared data types, DTOs, enums, and interfaces.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/types/tsconfig.json  
**Description:** TypeScript configuration for the @admanager/types package.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/types/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Types TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the types library.  
**Logic Description:** Extends tsconfig.base.json. Defines outDir, rootDir.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options specific to the @admanager/types package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/types/src/index.ts  
**Description:** Barrel file for the @admanager/types package, exporting all shared DTOs, enums, interfaces, event schemas, and constants.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 2  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/types/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Types Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To provide a single, convenient entry point for all shared types.  
**Logic Description:** Exports all entities from subdirectories like dtos, enums, interfaces, events, and constants.  
**Documentation:**
    
    - **Summary:** Exports all public DTOs, enums, interfaces, event schemas, and constants from the @admanager/types library.
    
**Namespace:** AdManager.Shared.Types  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/types/src/dtos/index.ts  
**Description:** Barrel file for all DTOs within the @admanager/types package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index.dtos  
**Type:** Module  
**Relative Path:** packages/types/src/dtos/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - DTOs Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To re-export all DTOs for easier consumption.  
**Logic Description:** Exports PaginationDto, PaginatedResponseDto, UserDto, CampaignDto, ApiResponseDto, etc.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all Data Transfer Objects.
    
**Namespace:** AdManager.Shared.Types.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/src/dtos/pagination.dto.ts  
**Description:** Defines DTOs for pagination requests (PaginationDto) and responses (PaginatedResponseDto).  
**Template:** TypeScript Class  
**Dependancy Level:** 0  
**Name:** pagination.dto  
**Type:** DTO  
**Relative Path:** packages/types/src/dtos/pagination.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    - **Name:** totalItems  
**Type:** number  
**Attributes:** public  
    - **Name:** totalPages  
**Type:** number  
**Attributes:** public  
    - **Name:** data  
**Type:** T[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Pagination DTOs
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide consistent structures for handling paginated data in API requests and responses.  
**Logic Description:** Defines `PaginationRequestDto` with `page`, `limit`, `sortBy`, `sortOrder`. Defines `PaginatedResponseDto<T>` with `items: T[]`, `totalItems`, `currentPage`, `totalPages`, `limit`.  
**Documentation:**
    
    - **Summary:** Contains DTOs for pagination parameters (page, limit) and paginated API responses (items, total, etc.).
    
**Namespace:** AdManager.Shared.Types.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/src/dtos/user.dto.ts  
**Description:** Defines shared DTOs related to users, such as UserDto for general user information or UserProfileDto.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** user.dto  
**Type:** DTO  
**Relative Path:** packages/types/src/dtos/user.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** email  
**Type:** string  
**Attributes:** public  
    - **Name:** roles  
**Type:** UserRole[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Data Transfer Objects
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide standardized structures for transferring user-related data between services.  
**Logic Description:** Defines `UserDto` with fields like `id`, `email`, `firstName`, `lastName`, `roles` (array of `UserRole` enum). Uses `class-validator` decorators if validation is defined here.  
**Documentation:**
    
    - **Summary:** Data Transfer Objects for user-related information, potentially including UserDto and UserProfileDto.
    
**Namespace:** AdManager.Shared.Types.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/src/dtos/campaign.dto.ts  
**Description:** Defines shared DTOs for campaign-related entities like Campaign, AdSet, Ad.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** campaign.dto  
**Type:** DTO  
**Relative Path:** packages/types/src/dtos/campaign.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** status  
**Type:** CampaignStatus  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Data Transfer Objects
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To standardize data structures for campaign entities across services.  
**Logic Description:** Defines `CampaignDto`, `AdSetDto`, `AdDto` with relevant properties. These DTOs can include validation decorators from `class-validator`.  
**Documentation:**
    
    - **Summary:** DTOs for representing Campaign, AdSet, and Ad entities in API communications.
    
**Namespace:** AdManager.Shared.Types.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/src/dtos/generic-response.dto.ts  
**Description:** Defines a generic API response DTO (ApiResponseDto) for consistent success responses.  
**Template:** TypeScript Class  
**Dependancy Level:** 0  
**Name:** generic-response.dto  
**Type:** DTO  
**Relative Path:** packages/types/src/dtos/generic-response.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** success  
**Type:** boolean  
**Attributes:** public  
    - **Name:** message  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** data  
**Type:** T | null  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Success API Response
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent structure for successful API responses.  
**Logic Description:** Defines `ApiResponseDto<T>` with fields `success: boolean`, `message?: string`, `data?: T`.  
**Documentation:**
    
    - **Summary:** A generic wrapper for successful API responses, including a success flag, optional message, and data payload.
    
**Namespace:** AdManager.Shared.Types.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/types/src/enums/index.ts  
**Description:** Barrel file for all enums within the @admanager/types package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index.enums  
**Type:** Module  
**Relative Path:** packages/types/src/enums/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Enums Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To re-export all shared enums.  
**Logic Description:** Exports CampaignStatus, UserRole, etc.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all shared enumerations.
    
**Namespace:** AdManager.Shared.Types.Enums  
**Metadata:**
    
    - **Category:** Enum
    
- **Path:** packages/types/src/enums/campaign-status.enum.ts  
**Description:** Defines the CampaignStatus enum for campaign lifecycle states.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** campaign-status.enum  
**Type:** Enum  
**Relative Path:** packages/types/src/enums/campaign-status.enum.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Enumeration
    
**Members:**
    
    - **Name:** DRAFT  
**Type:** string  
**Attributes:**   
    - **Name:** ACTIVE  
**Type:** string  
**Attributes:**   
    - **Name:** PAUSED  
**Type:** string  
**Attributes:**   
    - **Name:** COMPLETED  
**Type:** string  
**Attributes:**   
    - **Name:** ARCHIVED  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Status Enum
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a standardized set of statuses for advertising campaigns.  
**Logic Description:** Defines an enum `CampaignStatus` with values like DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED.  
**Documentation:**
    
    - **Summary:** Enumeration of possible statuses for an advertising campaign.
    
**Namespace:** AdManager.Shared.Types.Enums  
**Metadata:**
    
    - **Category:** Enum
    
- **Path:** packages/types/src/enums/user-role.enum.ts  
**Description:** Defines the UserRole enum for user roles within the Ad Manager system.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** user-role.enum  
**Type:** Enum  
**Relative Path:** packages/types/src/enums/user-role.enum.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Enumeration
    
**Members:**
    
    - **Name:** MERCHANT_ADMIN  
**Type:** string  
**Attributes:**   
    - **Name:** CAMPAIGN_MANAGER  
**Type:** string  
**Attributes:**   
    - **Name:** PLATFORM_ADMINISTRATOR  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Role Enum
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a standardized set of user roles for access control.  
**Logic Description:** Defines an enum `UserRole` with values like MERCHANT_ADMIN, CAMPAIGN_MANAGER, PLATFORM_ADMINISTRATOR.  
**Documentation:**
    
    - **Summary:** Enumeration of user roles within the Ad Manager platform.
    
**Namespace:** AdManager.Shared.Types.Enums  
**Metadata:**
    
    - **Category:** Enum
    
- **Path:** packages/types/src/interfaces/index.ts  
**Description:** Barrel file for all common interfaces within the @admanager/types package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index.interfaces  
**Type:** Module  
**Relative Path:** packages/types/src/interfaces/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Interfaces Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To re-export all shared interfaces.  
**Logic Description:** Exports IServiceResponse, IPaginatedItems, etc.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all shared interfaces.
    
**Namespace:** AdManager.Shared.Types.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** packages/types/src/interfaces/common.interfaces.ts  
**Description:** Defines common, generic interfaces like `Identifiable` (has an ID) or `Timestamped` (createdAt, updatedAt).  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** common.interfaces  
**Type:** Interface  
**Relative Path:** packages/types/src/interfaces/common.interfaces.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string | number  
**Attributes:** readonly  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** readonly  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Common Entity Interfaces
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide reusable base interfaces for common entity properties.  
**Logic Description:** Defines interfaces like `IIdentifiable { id: string | number; }` and `ITimestamped { createdAt: Date; updatedAt: Date; }`.  
**Documentation:**
    
    - **Summary:** Shared interfaces for common properties like ID and timestamps.
    
**Namespace:** AdManager.Shared.Types.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** packages/types/src/events/index.ts  
**Description:** Barrel file for all event schemas within the @admanager/types package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index.events  
**Type:** Module  
**Relative Path:** packages/types/src/events/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Schemas Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To re-export all shared event schemas.  
**Logic Description:** Exports BaseEvent, CampaignCreatedEvent, ProductUpdatedEvent etc.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all shared event schemas for SQS/SNS messages.
    
**Namespace:** AdManager.Shared.Types.Events  
**Metadata:**
    
    - **Category:** EventSchema
    
- **Path:** packages/types/src/events/event.schema.base.ts  
**Description:** Defines a base interface or class for all domain events, including common fields like eventId, eventType, timestamp, source.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** event.schema.base  
**Type:** Interface  
**Relative Path:** packages/types/src/events/event.schema.base.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** eventId  
**Type:** string  
**Attributes:** readonly  
    - **Name:** eventType  
**Type:** string  
**Attributes:** readonly  
    - **Name:** eventVersion  
**Type:** string  
**Attributes:** readonly  
    - **Name:** timestamp  
**Type:** string  
**Attributes:** readonly  
    - **Name:** sourceService  
**Type:** string  
**Attributes:** readonly  
    - **Name:** correlationId  
**Type:** string | undefined  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Base Domain Event Schema
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent structure for all domain events published via SQS/SNS.  
**Logic Description:** Defines an interface `IBaseEvent` with properties like `eventId` (UUID), `eventType` (string), `timestamp` (ISO string), `source` (service name), `version` (e.g., '1.0'), and `payload` (generic type T).  
**Documentation:**
    
    - **Summary:** Base schema for all domain events, including event ID, type, timestamp, and source.
    
**Namespace:** AdManager.Shared.Types.Events  
**Metadata:**
    
    - **Category:** EventSchema
    
- **Path:** packages/types/src/events/campaign-created.event.ts  
**Description:** Defines the schema for a 'CampaignCreated' event, including its specific payload structure.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** campaign-created.event  
**Type:** Interface  
**Relative Path:** packages/types/src/events/campaign-created.event.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** payload  
**Type:** { campaignId: string; merchantId: string; name: string; }  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - CampaignCreated Event Schema
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To define the contract for events indicating a new campaign has been created.  
**Logic Description:** Defines `ICampaignCreatedEvent extends IBaseEvent` with a specific `payload` type containing campaign details like `campaignId`, `merchantId`, `name`.  
**Documentation:**
    
    - **Summary:** Schema for the CampaignCreated domain event, detailing its payload structure.
    
**Namespace:** AdManager.Shared.Types.Events  
**Metadata:**
    
    - **Category:** EventSchema
    
- **Path:** packages/types/src/constants/index.ts  
**Description:** Barrel file for all constants within the @admanager/types package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index.constants  
**Type:** Module  
**Relative Path:** packages/types/src/constants/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Constants Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To re-export all shared constants.  
**Logic Description:** Exports EventTopics, QueueNames, etc.  
**Documentation:**
    
    - **Summary:** Aggregates and exports all shared constants.
    
**Namespace:** AdManager.Shared.Types.Constants  
**Metadata:**
    
    - **Category:** Constant
    
- **Path:** packages/types/src/constants/event-topics.constants.ts  
**Description:** Defines constants for SNS topic names used for event-driven communication.  
**Template:** TypeScript Constant  
**Dependancy Level:** 0  
**Name:** event-topics.constants  
**Type:** Constant  
**Relative Path:** packages/types/src/constants/event-topics.constants.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CAMPAIGN_EVENTS_TOPIC  
**Type:** string  
**Attributes:** export|const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - SNS Topic Name Constants
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a centralized definition of SNS topic names.  
**Logic Description:** Exports string constants for various SNS topic names, e.g., `export const CAMPAIGN_EVENTS_TOPIC = 'admanager-campaign-events';`.  
**Documentation:**
    
    - **Summary:** Constants representing SNS topic names for domain events.
    
**Namespace:** AdManager.Shared.Types.Constants  
**Metadata:**
    
    - **Category:** Constant
    
- **Path:** packages/validation/package.json  
**Description:** NPM package definition for @admanager/validation, containing shared validation utilities and custom decorators.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/validation/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Validation Utilities Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/validation NPM package.  
**Logic Description:** Specifies package name, version, entry points. Dependencies include class-validator, class-transformer, and potentially @admanager/types.  
**Documentation:**
    
    - **Summary:** Package configuration for shared validation utilities and custom decorators.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/validation/tsconfig.json  
**Description:** TypeScript configuration for the @admanager/validation package.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/validation/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Validation Utilities TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the validation library.  
**Logic Description:** Extends tsconfig.base.json. Defines outDir, rootDir, and references to @admanager/types if DTOs from there are used/extended.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options specific to the @admanager/validation package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/validation/src/index.ts  
**Description:** Barrel file for the @admanager/validation package.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/validation/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Validation Utilities Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To provide a single entry point for validation utilities.  
**Logic Description:** Exports custom decorators and utility functions from this package.  
**Documentation:**
    
    - **Summary:** Exports public validation utilities and custom decorators.
    
**Namespace:** AdManager.Shared.Validation  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/validation/src/decorators/is-valid-enum.decorator.ts  
**Description:** Custom class-validator decorator to validate if a property value is a valid member of a given enum.  
**Template:** TypeScript Custom Decorator  
**Dependancy Level:** 0  
**Name:** is-valid-enum.decorator  
**Type:** Decorator  
**Relative Path:** packages/validation/src/decorators/is-valid-enum.decorator.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Decorator
    
**Members:**
    
    
**Methods:**
    
    - **Name:** IsValidEnum  
**Parameters:**
    
    - enumObject: object
    - validationOptions?: ValidationOptions
    
**Return Type:** PropertyDecorator  
**Attributes:** export  
    
**Implemented Features:**
    
    - Custom Enum Validator
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a reusable decorator for validating enum values in DTOs.  
**Logic Description:** Uses `registerDecorator` from `class-validator`. The decorator takes an enum object as an argument and checks if the decorated property's value exists in the enum.  
**Documentation:**
    
    - **Summary:** A custom validation decorator ensuring a property's value is a valid key of a specified enum object.
    
**Namespace:** AdManager.Shared.Validation.Decorators  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/validation/src/utils/validation.utils.ts  
**Description:** Contains utility functions related to validation, e.g., a helper to programmatically validate an object using class-validator and class-transformer.  
**Template:** TypeScript Utility Module  
**Dependancy Level:** 1  
**Name:** validation.utils  
**Type:** Utility  
**Relative Path:** packages/validation/src/utils/validation.utils.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** validateObject  
**Parameters:**
    
    - object: object
    - validatorOptions?: ValidatorOptions
    
**Return Type:** Promise<ValidationError[]>  
**Attributes:** export|async  
    
**Implemented Features:**
    
    - Programmatic Validation Helper
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide helper functions for performing validation tasks outside of NestJS pipes if needed.  
**Logic Description:** The `validateObject` function would use `validate` from `class-validator` to check an object against its validation decorators and return an array of `ValidationError`s.  
**Documentation:**
    
    - **Summary:** Utility functions for validation, such as programmatically validating an object against class-validator decorators.
    
**Namespace:** AdManager.Shared.Validation.Utils  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/config-client/package.json  
**Description:** NPM package definition for @admanager/config-client.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/config-client/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Config Client Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/config-client NPM package.  
**Logic Description:** Specifies package name, version, entry points. Dependencies might include AWS SDK if it interacts with Parameter Store/Secrets Manager.  
**Documentation:**
    
    - **Summary:** Package configuration for the shared configuration client library.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/config-client/tsconfig.json  
**Description:** TypeScript configuration for @admanager/config-client.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/config-client/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Config Client TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the config client library.  
**Logic Description:** Extends tsconfig.base.json. Defines outDir, rootDir.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options for the @admanager/config-client package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/config-client/src/index.ts  
**Description:** Barrel file for @admanager/config-client.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 1  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/config-client/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Config Client Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** Single entry point for the config client library.  
**Logic Description:** Exports IConfigClient, ConfigClientService, AppConfig interface.  
**Documentation:**
    
    - **Summary:** Exports public interfaces and classes for the configuration client library.
    
**Namespace:** AdManager.Shared.ConfigClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/config-client/src/config.client.interface.ts  
**Description:** Defines the IConfigClient interface for accessing application configuration.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** config.client.interface  
**Type:** Interface  
**Relative Path:** packages/config-client/src/config.client.interface.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** get  
**Parameters:**
    
    - key: string
    
**Return Type:** T | undefined  
**Attributes:** <T>  
    - **Name:** getOrThrow  
**Parameters:**
    
    - key: string
    
**Return Type:** T  
**Attributes:** <T>  
    
**Implemented Features:**
    
    - Configuration Client Contract
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent way for services to retrieve configuration values.  
**Logic Description:** Interface `IConfigClient` with methods like `get<T>(key: string): T | undefined` and `getOrThrow<T>(key: string): T`.  
**Documentation:**
    
    - **Summary:** Interface for a configuration client, providing methods to retrieve configuration values by key.
    
**Namespace:** AdManager.Shared.ConfigClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/config-client/src/config.client.service.ts  
**Description:** Concrete implementation of IConfigClient, potentially loading configuration from environment variables or integrating with AWS Parameter Store/Secrets Manager.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** config.client.service  
**Type:** Service  
**Relative Path:** packages/config-client/src/config.client.service.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** configCache  
**Type:** Record<string, any>  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - options?: ConfigClientOptions
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** get  
**Parameters:**
    
    - key: string
    
**Return Type:** T | undefined  
**Attributes:** public|<T>  
    - **Name:** getOrThrow  
**Parameters:**
    
    - key: string
    
**Return Type:** T  
**Attributes:** public|<T>  
    
**Implemented Features:**
    
    - Configuration Loading
    - Configuration Caching (optional)
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a service for accessing typed configuration values.  
**Logic Description:** Implements `IConfigClient`. Could load all environment variables on startup, validate them against a schema (e.g., defined in `env.config.ts`), and provide typed access. For AWS integration, it would use the AWS SDK.  
**Documentation:**
    
    - **Summary:** Service implementing IConfigClient to provide access to application configuration, potentially from environment variables or a configuration service.
    
**Namespace:** AdManager.Shared.ConfigClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/config-client/src/config.types.ts  
**Description:** Defines TypeScript interfaces for the expected structure of application configuration (e.g., AppConfig).  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** config.types  
**Type:** Interface  
**Relative Path:** packages/config-client/src/config.types.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** NODE_ENV  
**Type:** 'development' | 'production' | 'test'  
**Attributes:**   
    - **Name:** PORT  
**Type:** number  
**Attributes:**   
    - **Name:** DATABASE_URL  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Application Configuration Schema
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide strong typing for application configuration, improving maintainability and reducing runtime errors.  
**Logic Description:** Defines an interface `AppConfig` that outlines all expected configuration variables and their types, e.g., `DATABASE_URL: string`, `LOG_LEVEL: LogLevel`, etc.  
**Documentation:**
    
    - **Summary:** Type definitions for the application's configuration structure.
    
**Namespace:** AdManager.Shared.ConfigClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/audit-client/package.json  
**Description:** NPM package definition for @admanager/audit-client.  
**Template:** TypeScript Library Sub-Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** packages/audit-client/package.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Client Package Definition
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To define the @admanager/audit-client NPM package.  
**Logic Description:** Specifies package name, version, entry points. Dependencies might include @admanager/types for AuditLogEntryDto and AWS SDK if sending to SQS.  
**Documentation:**
    
    - **Summary:** Package configuration for the shared audit logging client.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/audit-client/tsconfig.json  
**Description:** TypeScript configuration for @admanager/audit-client.  
**Template:** TypeScript Sub-Package Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** packages/audit-client/tsconfig.json  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Client TypeScript Configuration
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** To configure TypeScript compilation for the audit client library.  
**Logic Description:** Extends tsconfig.base.json. Defines outDir, rootDir, and references @admanager/types.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options for the @admanager/audit-client package.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** packages/audit-client/src/index.ts  
**Description:** Barrel file for @admanager/audit-client.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 2  
**Name:** index  
**Type:** Module  
**Relative Path:** packages/audit-client/src/index.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Client Public API Export
    
**Requirement Ids:**
    
    - 4.1 (modular aspect)
    
**Purpose:** Single entry point for the audit client library.  
**Logic Description:** Exports IAuditClient, AuditClientService, AuditLogEntryDto, AuditAction.  
**Documentation:**
    
    - **Summary:** Exports public interfaces, classes, DTOs, and enums for the audit client library.
    
**Namespace:** AdManager.Shared.AuditClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/audit-client/src/audit.client.interface.ts  
**Description:** Defines the IAuditClient interface for sending audit log entries.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** audit.client.interface  
**Type:** Interface  
**Relative Path:** packages/audit-client/src/audit.client.interface.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** log  
**Parameters:**
    
    - entry: AuditLogEntryDto
    
**Return Type:** Promise<void>  
**Attributes:**   
    
**Implemented Features:**
    
    - Audit Client Contract
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a consistent way for services to submit audit log entries.  
**Logic Description:** Interface `IAuditClient` with a method `log(entry: AuditLogEntryDto): Promise<void>`.  
**Documentation:**
    
    - **Summary:** Interface for an audit client, providing a method to log audit entries.
    
**Namespace:** AdManager.Shared.AuditClient  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** packages/audit-client/src/dtos/audit-log.dto.ts  
**Description:** Defines the DTO (AuditLogEntryDto) for audit log entries.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** audit-log.dto  
**Type:** DTO  
**Relative Path:** packages/audit-client/src/dtos/audit-log.dto.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public  
    - **Name:** userId  
**Type:** string | undefined  
**Attributes:** public  
    - **Name:** action  
**Type:** AuditAction | string  
**Attributes:** public  
    - **Name:** resourceType  
**Type:** string | undefined  
**Attributes:** public  
    - **Name:** resourceId  
**Type:** string | undefined  
**Attributes:** public  
    - **Name:** details  
**Type:** Record<string, any> | undefined  
**Attributes:** public  
    - **Name:** status  
**Type:** 'SUCCESS' | 'FAILURE'  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Log Entry Structure
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To standardize the structure of data sent to the audit logging system.  
**Logic Description:** Defines `AuditLogEntryDto` with fields like `timestamp`, `userId` (actor), `action` (from `AuditAction` enum or string), `resourceType`, `resourceId`, `details` (JSON object for context), `status` ('SUCCESS'/'FAILURE'). Uses `class-validator` for basic validation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a single audit log entry. Includes details like timestamp, user, action, and resource.
    
**Namespace:** AdManager.Shared.AuditClient.Dtos  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** packages/audit-client/src/enums/audit-action.enum.ts  
**Description:** Defines the AuditAction enum for common types of audited actions.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** audit-action.enum  
**Type:** Enum  
**Relative Path:** packages/audit-client/src/enums/audit-action.enum.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    - Enumeration
    
**Members:**
    
    - **Name:** CREATE_CAMPAIGN  
**Type:** string  
**Attributes:**   
    - **Name:** UPDATE_USER_ROLE  
**Type:** string  
**Attributes:**   
    - **Name:** LOGIN_SUCCESS  
**Type:** string  
**Attributes:**   
    - **Name:** LOGIN_FAILURE  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit Action Types
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a standardized set of actions for audit logging.  
**Logic Description:** Defines an enum `AuditAction` with values representing various auditable system events.  
**Documentation:**
    
    - **Summary:** Enumeration of standard actions that can be recorded in audit logs.
    
**Namespace:** AdManager.Shared.AuditClient.Enums  
**Metadata:**
    
    - **Category:** Enum
    
- **Path:** packages/audit-client/src/audit.client.service.ts  
**Description:** Concrete implementation of IAuditClient. This service would typically send audit log entries to a message queue (e.g., SQS) or directly to a logging service/database.  
**Template:** TypeScript Class  
**Dependancy Level:** 1  
**Name:** audit.client.service  
**Type:** Service  
**Relative Path:** packages/audit-client/src/audit.client.service.ts  
**Repository Id:** REPO-SHAREDLIB-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** queueUrl  
**Type:** string | undefined  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - options?: AuditClientOptions
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** log  
**Parameters:**
    
    - entry: AuditLogEntryDto
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Audit Log Submission
    
**Requirement Ids:**
    
    - 3.2.7 (shared code aspect)
    
**Purpose:** To provide a reliable way for services to record audit trails.  
**Logic Description:** Implements `IAuditClient`. The `log` method would serialize the `AuditLogEntryDto` and send it to a pre-configured SQS queue or an HTTP endpoint of an audit service. It should handle potential send failures gracefully.  
**Documentation:**
    
    - **Summary:** Service implementing IAuditClient to send audit log entries to a configured sink, such as a message queue or a dedicated audit service.
    
**Namespace:** AdManager.Shared.AuditClient  
**Metadata:**
    
    - **Category:** Utility
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDetailedAuditLogging
  - useJsonLoggerFormatByDefault
  
- **Database Configs:**
  
  


---

