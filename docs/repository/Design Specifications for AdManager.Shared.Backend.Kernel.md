# Software Design Specification: AdManager.Shared.Backend.Kernel

## 1. Introduction

This document outlines the software design specifications for the `AdManager.Shared.Backend.Kernel` repository. This shared kernel serves as a foundational library for all backend microservices within the Ad Manager Platform. It aims to provide common utilities, core functionalities, and standardized patterns to promote consistency, code reusability, and maintainability across the platform.

**Repository Purpose:** To centralize cross-cutting concerns such as logging, configuration management, error handling, common DTOs, validation utilities, and clients for shared infrastructure components.

**Target Audience:** Backend developers working on Ad Manager microservices.

**Technology Stack:**
*   **Language:** TypeScript 5.3.3
*   **Framework:** NestJS 10.3.8
*   **Node.js Version:** 20.14.0
*   **Testing Framework:** Jest 29.7.0
*   **Key Libraries:**
    *   `class-validator`
    *   `class-transformer`
    *   `winston` (or similar, e.g., NestJS default logger enhanced)
    *   `@aws-sdk/client-secrets-manager`
    *   `@aws-sdk/client-ssm`
    *   `@nestjs/cache-manager` (for caching abstraction)

## 2. Overall Design Principles

*   **Modularity:** Each concern (logging, config, etc.) will be encapsulated in its own NestJS module.
*   **Abstraction:** Interfaces will define contracts for services, allowing for flexible implementations and easier testing.
*   **Dependency Injection:** NestJS DI will be leveraged for managing dependencies.
*   **Reusability:** Components are designed to be generic and usable by any backend microservice.
*   **Configuration-Driven:** Services will rely on the `IConfigService` for externalized configuration.
*   **Testability:** Components will be designed with unit and integration testing in mind.

## 3. File Specifications

### 3.1. Configuration Files

#### 3.1.1. `libs/backend-kernel/package.json`

*   **Type:** Configuration
*   **Purpose:** Defines the shared kernel as an NPM package, managing its dependencies, scripts, and metadata.
*   **Specifications:**
    *   `name`: `@admanager/backend-kernel`
    *   `version`: `0.1.0` (or follow semantic versioning)
    *   `description`: "Shared backend kernel for the Ad Manager Platform, providing common utilities, services, and DTOs."
    *   `main`: `dist/index.js`
    *   `types`: `dist/index.d.ts`
    *   `private`: `true` (if not published to a public registry) or `false` (if published to a private NPM registry accessible by other services)
    *   `scripts`:
        *   `build`: `nest build` (or `rimraf dist && tsc -p tsconfig.build.json` if not using NestJS CLI directly for library builds)
        *   `format`: `prettier --write \"src/**/*.ts\" \"test/**/*.ts\"`
        *   `lint`: `eslint \"{src,apps,libs,test}/**/*.ts\" --fix`
        *   `test`: `jest`
        *   `test:watch`: `jest --watch`
        *   `test:cov`: `jest --coverage`
        *   `prepublishOnly`: `npm run build` (if publishing)
    *   `dependencies`:
        *   `class-validator`: (latest compatible version)
        *   `class-transformer`: (latest compatible version)
        *   `winston`: (latest compatible version, for WinstonLoggerService)
        *   `@aws-sdk/client-secrets-manager`: (latest v3 compatible version)
        *   `@aws-sdk/client-ssm`: (latest v3 compatible version)
        *   `@nestjs/common`: (version compatible with microservices)
        *   `@nestjs/core`: (version compatible with microservices)
        *   `@nestjs/config`: (for potential internal config module usage, or if it provides base types)
        *   `@nestjs/cache-manager`: (for caching module)
        *   `cache-manager-redis-store`: (if Redis is chosen for caching, or similar for other stores)
        *   `reflect-metadata`: (latest compatible version)
        *   `rxjs`: (latest compatible version)
    *   `devDependencies`:
        *   `@types/jest`: (latest compatible version)
        *   `@types/node`: (latest compatible version)
        *   `@typescript-eslint/eslint-plugin`: (latest compatible version)
        *   `@typescript-eslint/parser`: (latest compatible version)
        *   `eslint`: (latest compatible version)
        *   `eslint-config-prettier`: (latest compatible version)
        *   `eslint-plugin-prettier`: (latest compatible version)
        *   `jest`: (latest compatible version, e.g., 29.7.0)
        *   `prettier`: (latest compatible version)
        *   `rimraf`: (for cleaning dist)
        *   `ts-jest`: (latest compatible version)
        *   `typescript`: (latest compatible version, e.g., 5.3.3)
    *   `jest`: Standard Jest configuration (e.g., `moduleFileExtensions`, `rootDir`, `testRegex`, `transform`, `coverageDirectory`).

#### 3.1.2. `libs/backend-kernel/tsconfig.json`

*   **Type:** Configuration
*   **Purpose:** Configures TypeScript compilation settings for the shared kernel library.
*   **Specifications:**
    json
    {
      "compilerOptions": {
        "module": "commonjs",
        "declaration": true,
        "removeComments": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "target": "ES2021", // or newer compatible with Node.js 20.14.0
        "sourceMap": true,
        "outDir": "./dist",
        "baseUrl": "./",
        "incremental": true,
        "skipLibCheck": true,
        "strictNullChecks": true, // Recommended
        "noImplicitAny": true, // Recommended
        "strictBindCallApply": true, // Recommended
        "forceConsistentCasingInFileNames": true, // Recommended
        "noFallthroughCasesInSwitch": true, // Recommended
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "paths": { // If using path aliases within the kernel
          "@common/*": ["src/common/*"],
          "@logging/*": ["src/logging/*"],
          "@errors/*": ["src/errors/*"],
          "@dtos/*": ["src/dtos/*"],
          "@validation/*": ["src/validation/*"],
          "@config/*": ["src/config/*"],
          "@audit/*": ["src/audit/*"],
          "@caching/*": ["src/caching/*"],
          "@events/*": ["src/events/*"]
        }
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
    }
    
    *   Consider a `tsconfig.build.json` that extends this and potentially sets `declarationMap: true` for better IDE support in consuming projects.

#### 3.1.3. `libs/backend-kernel/nest-cli.json`

*   **Type:** Configuration
*   **Purpose:** Configures the NestJS CLI for building the shared kernel as a library.
*   **Specifications:**
    json
    {
      "$schema": "https://json.schemastore.org/nest-cli",
      "collection": "@nestjs/schematics",
      "sourceRoot": "src",
      "compilerOptions": {
        "deleteOutDir": true,
        "webpack": false, // Typically false for libraries, true for applications
        "tsConfigPath": "tsconfig.build.json" // Or tsconfig.json if no separate build config
      },
      "generateOptions": {
        "spec": true // Or false, based on testing strategy for the kernel
      },
      "projects": { // If this is part of a NestJS monorepo
        "backend-kernel": { // Name of the library project
          "type": "library",
          "root": "libs/backend-kernel",
          "entryFile": "index",
          "sourceRoot": "libs/backend-kernel/src",
          "compilerOptions": {
            "tsConfigPath": "libs/backend-kernel/tsconfig.lib.json" // Monorepo typically uses a lib-specific tsconfig
          }
        }
      }
    }
    
    *   Note: If not in a monorepo structure, the `projects` section might be omitted, and settings applied at the root level. The `entryFile` is crucial.

### 3.2. Core and Common Components

#### 3.2.1. `libs/backend-kernel/src/index.ts`

*   **Type:** ModuleEntry
*   **Purpose:** Serves as the public API of the shared kernel, re-exporting all necessary components.
*   **Specifications:**
    *   This file will contain `export * from 'path/to/module_or_file'` statements for every public-facing component.
    *   **Example Exports:**
        typescript
        // Core Module
        export * from './core.module';

        // Common
        export * from './common/interfaces/identifiable.interface';
        export * from './common/types/maybe.type';
        export * from './common/constants/http-status.constants';

        // Logging
        export * from './logging/interfaces/logger.service.interface';
        export * from './logging/services/winston-logger.service'; // If concrete class is needed directly
        export * from './logging/logging.module';
        export * from './logging/constants/logging.constants';

        // Errors
        export * from './errors/base.exception';
        export * from './errors/exceptions/validation.exception';
        export * from './errors/exceptions/resource-not-found.exception';
        // Add other custom exceptions here
        export * from './errors/filters/global-exception.filter';
        // export * from './errors/errors.module'; // If an ErrorsModule is created

        // DTOs
        export * from './dtos/pagination/pagination-query.dto';
        export * from './dtos/pagination/paged-response.dto';
        // Add other shared DTOs here

        // Validation
        export * from './validation/decorators/is-custom-uuid.decorator';
        // Add other custom decorators or validation utilities here
        // export * from './validation/validation.module'; // If a ValidationModule is created

        // Config
        export * from './config/interfaces/config.service.interface';
        export * from './config/services/aws-appconfig.service'; // If concrete class is needed
        export * from './config/config.module';
        export * from './config/constants/config.constants';

        // Audit
        export * from './audit/interfaces/audit-log.service.interface';
        export * from './audit/dtos/audit-entry.dto';
        export * from './audit/services/audit-log.service'; // If concrete class is needed
        export * from './audit/audit.module';

        // Caching
        export * from './caching/interfaces/cache.service.interface';
        export * from './caching/services/redis-cache.service'; // If concrete class is needed
        export * from './caching/caching.module';

        // Events
        export * from './events/interfaces/domain-event.interface';
        export * from './events/interfaces/integration-event.interface';
        

#### 3.2.2. `libs/backend-kernel/src/core.module.ts`

*   **Type:** Module
*   **Purpose:** Aggregates all shared NestJS modules from this kernel into a single importable and global module.
*   **Specifications:**
    typescript
    import { Global, Module } from '@nestjs/common';
    import { LoggingModule } from './logging/logging.module';
    import { ConfigModule as KernelConfigModule } from './config/config.module'; // Alias if needed
    import { ErrorsModule } from './errors/errors.module'; // Assuming an ErrorsModule is created
    import { ValidationModule } from './validation/validation.module'; // Assuming a ValidationModule
    import { CachingModule as KernelCachingModule } from './caching/caching.module'; // Alias
    import { AuditModule as KernelAuditModule } from './audit/audit.module'; // Alias

    @Global()
    @Module({
      imports: [
        KernelConfigModule, // Must be available globally early
        LoggingModule,
        ErrorsModule,
        ValidationModule,
        KernelCachingModule,
        KernelAuditModule,
      ],
      exports: [
        KernelConfigModule,
        LoggingModule,
        ErrorsModule,
        ValidationModule,
        KernelCachingModule,
        KernelAuditModule,
      ],
    })
    export class CoreModule {}
    
    *   The `ErrorsModule` would provide the `GlobalExceptionFilter`.
    *   The `ValidationModule` might provide common validation pipes or utilities if needed beyond decorators.

#### 3.2.3. `libs/backend-kernel/src/common/interfaces/identifiable.interface.ts`

*   **Type:** Interface
*   **Purpose:** Provides a common contract for entities or DTOs that require a unique identifier.
*   **Specifications:**
    typescript
    /**
     * @interface IIdentifiable
     * @description Represents an entity or object that has a unique identifier.
     * @template T - The type of the identifier, defaults to string.
     */
    export interface IIdentifiable<T extends string | number = string> {
      /**
       * @property id
       * @description The unique identifier of the object.
       */
      readonly id: T;
    }
    

#### 3.2.4. `libs/backend-kernel/src/common/types/maybe.type.ts`

*   **Type:** TypeDefinition
*   **Purpose:** Provides a utility type for expressing optionality in a more explicit way than `T | undefined`.
*   **Specifications:**
    typescript
    /**
     * @type Maybe<T>
     * @description Represents a value that could be of type T, or null, or undefined.
     * @template T - The underlying type of the value.
     */
    export type Maybe<T> = T | null | undefined;
    

#### 3.2.5. `libs/backend-kernel/src/common/constants/http-status.constants.ts`

*   **Type:** Constants
*   **Purpose:** Provides a centralized definition of common HTTP status codes.
*   **Specifications:**
    typescript
    /**
     * @enum HttpStatus
     * @description Collection of commonly used HTTP status codes.
     * Based on NestJS's HttpStatus for consistency if services also use it.
     */
    export const HTTP_STATUS = {
      // Informational
      CONTINUE: 100,
      SWITCHING_PROTOCOLS: 101,
      PROCESSING: 102,
      EARLY_HINTS: 103,

      // Success
      OK: 200,
      CREATED: 201,
      ACCEPTED: 202,
      NON_AUTHORITATIVE_INFORMATION: 203,
      NO_CONTENT: 204,
      RESET_CONTENT: 205,
      PARTIAL_CONTENT: 206,

      // Redirection
      MULTIPLE_CHOICES: 300,
      MOVED_PERMANENTLY: 301,
      FOUND: 302,
      SEE_OTHER: 303,
      NOT_MODIFIED: 304,
      TEMPORARY_REDIRECT: 307,
      PERMANENT_REDIRECT: 308,

      // Client Error
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTHENTICATION_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      REQUESTED_RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417,
      I_AM_A_TEAPOT: 418,
      UNPROCESSABLE_ENTITY: 422, // Often used for validation errors
      LOCKED: 423,
      FAILED_DEPENDENCY: 424,
      TOO_MANY_REQUESTS: 429,

      // Server Error
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
      HTTP_VERSION_NOT_SUPPORTED: 505,
    } as const;

    export type HttpStatusValue = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
    

### 3.3. Logging Module

#### 3.3.1. `libs/backend-kernel/src/logging/interfaces/logger.service.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines the contract for a standardized logging service.
*   **Specifications:**
    typescript
    export interface LogMeta {
      [key: string]: any;
      // Standard common fields can be defined here if needed
      // e.g., correlationId?: string;
      // e.g., tenantId?: string;
    }

    export interface ILoggerService {
      /**
       * Logs a standard informational message.
       * @param message - The main log message.
       * @param context - Optional context string (e.g., class name, method name).
       * @param meta - Optional additional metadata.
       */
      log(message: string, context?: string, meta?: LogMeta): void;

      /**
       * Logs an error message, optionally with a stack trace.
       * @param message - The error message or an Error object.
       * @param trace - Optional stack trace (if message is not an Error object).
       * @param context - Optional context string.
       * @param meta - Optional additional metadata.
       */
      error(message: string | Error, trace?: string, context?: string, meta?: LogMeta): void;

      /**
       * Logs a warning message.
       * @param message - The warning message.
       * @param context - Optional context string.
       * @param meta - Optional additional metadata.
       */
      warn(message: string, context?: string, meta?: LogMeta): void;

      /**
       * Logs a debug message, typically for development.
       * @param message - The debug message.
       * @param context - Optional context string.
       * @param meta - Optional additional metadata.
       */
      debug(message: string, context?: string, meta?: LogMeta): void;

      /**
       * Logs a verbose message, more detailed than debug.
       * @param message - The verbose message.
       * @param context - Optional context string.
       * @param meta - Optional additional metadata.
       */
      verbose(message: string, context?: string, meta?: LogMeta): void;
    }
    

#### 3.3.2. `libs/backend-kernel/src/logging/services/winston-logger.service.ts`

*   **Type:** Service (NestJS Provider)
*   **Purpose:** Winston-based implementation of `ILoggerService`, configured for structured JSON logging.
*   **Specifications:**
    typescript
    import { Injectable, Scope, Inject } from '@nestjs/common';
    import * as winston from 'winston';
    import { ILoggerService, LogMeta } from '../interfaces/logger.service.interface';
    import { IConfigService } from '../../config/interfaces/config.service.interface';
    import { CONFIG_SERVICE_TOKEN } from '../../config/constants/config.constants';

    @Injectable({ scope: Scope.TRANSIENT }) // Or Scope.DEFAULT if context is passed manually
    export class WinstonLoggerService implements ILoggerService {
      private readonly logger: winston.Logger;
      private serviceContext?: string; // For NestJS Logger compatibility

      constructor(
        @Inject(CONFIG_SERVICE_TOKEN) private readonly configService: IConfigService,
      ) {
        const logLevel = this.configService.get('LOG_LEVEL') || 'info';
        const serviceName = this.configService.get('SERVICE_NAME') || 'admanager-service';
        // Could also get environment (dev, staging, prod) from config

        this.logger = winston.createLogger({
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }), // Log the stack trace for Error objects
            winston.format.splat(),
            winston.format.json(), // Structured JSON logging
            // Add custom format to include serviceName, context, etc.
            winston.format.printf(info => {
              const { timestamp, level, message, context, stack, ...meta } = info;
              const logObject = {
                timestamp,
                level,
                message,
                serviceName,
                context: context || this.serviceContext,
                stack, // Will be present if an Error object was passed
                ...meta,
              };
              return JSON.stringify(logObject);
            })
          ),
          transports: [
            new winston.transports.Console({
              // Console transport for development and containerized environments (CloudWatch will pick up stdout)
              // In production, CloudWatch Logs agent or direct AWS SDK transport could be used
              // but stdout is standard for containers.
            }),
            // Potentially add other transports like File for local dev, or a CloudWatch transport
          ],
          defaultMeta: { service: serviceName }, // Default metadata
        });
      }

      // For NestJS Logger compatibility
      public setContext(context: string) {
        this.serviceContext = context;
      }

      log(message: string, context?: string, meta?: LogMeta): void {
        this.logger.info(message, { context: context || this.serviceContext, ...meta });
      }

      error(error: string | Error, trace?: string, context?: string, meta?: LogMeta): void {
        const message = error instanceof Error ? error.message : error;
        const stack = error instanceof Error ? error.stack : trace;
        this.logger.error(message, { context: context || this.serviceContext, stack, ...meta });
      }

      warn(message: string, context?: string, meta?: LogMeta): void {
        this.logger.warn(message, { context: context || this.serviceContext, ...meta });
      }

      debug(message: string, context?: string, meta?: LogMeta): void {
        this.logger.debug(message, { context: context || this.serviceContext, ...meta });
      }

      verbose(message: string, context?: string, meta?: LogMeta): void {
        this.logger.verbose(message, { context: context || this.serviceContext, ...meta });
      }
    }
    
    *   **Notes:**
        *   `LOG_LEVEL`, `SERVICE_NAME` should be fetched from `IConfigService`.
        *   The `printf` formatter should be carefully crafted to produce valid JSON if used; simpler to rely on `winston.format.json()` directly and pass context/meta. Consider a custom formatter that merges `this.serviceContext`, passed `context`, and `meta`.
        *   Error object handling (`format.errors({ stack: true })`) is important.
        *   `Scope.TRANSIENT` allows NestJS to inject a new instance for each class that depends on it, useful if context is set via `setContext`. If context is always passed in methods, `Scope.DEFAULT` is fine.

#### 3.3.3. `libs/backend-kernel/src/logging/logging.module.ts`

*   **Type:** Module
*   **Purpose:** Encapsulates logging functionality and provides the `ILoggerService`.
*   **Specifications:**
    typescript
    import { Module, Global } from '@nestjs/common';
    import { ILoggerService } from './interfaces/logger.service.interface';
    import { WinstonLoggerService } from './services/winston-logger.service';
    import { ConfigModule as KernelConfigModule } from '../../config/config.module'; // Ensure config is available
    import { LOGGER_SERVICE_TOKEN } from './constants/logging.constants';

    @Global() // Making logger globally available without importing LoggingModule everywhere
    @Module({
      imports: [KernelConfigModule], // WinstonLoggerService depends on IConfigService
      providers: [
        {
          provide: LOGGER_SERVICE_TOKEN, // Or use ILoggerService directly as token if preferred
          useClass: WinstonLoggerService,
        },
        // For NestJS built-in Logger compatibility, you might also provide WinstonLoggerService itself
        // or a factory that creates a Logger instance for NestFactory.create
        WinstonLoggerService, // So it can be injected by its class name for setContext
      ],
      exports: [
        LOGGER_SERVICE_TOKEN,
        WinstonLoggerService, // Export the concrete class if setContext is used directly
      ],
    })
    export class LoggingModule {}
    

#### 3.3.4. `libs/backend-kernel/src/logging/constants/logging.constants.ts`

*   **Type:** Constants
*   **Purpose:** Provides unique symbols or strings for injecting logging-related services.
*   **Specifications:**
    typescript
    /**
     * @const LOGGER_SERVICE_TOKEN
     * @description Injection token for the ILoggerService.
     */
    export const LOGGER_SERVICE_TOKEN = Symbol('ILoggerService');
    // Or if using string tokens:
    // export const LOGGER_SERVICE_TOKEN = 'LoggerService';
    

### 3.4. Error Handling Module

*(Assuming an `ErrorsModule` to group filter and provide exceptions if needed)*

#### 3.4.1. `libs/backend-kernel/src/errors/base.exception.ts`

*   **Type:** Exception
*   **Purpose:** Standardized base for custom exceptions.
*   **Specifications:**
    typescript
    import { HttpException, HttpStatus } from '@nestjs/common';

    export interface IBasePlatformExceptionPayload {
      statusCode: number;
      message: string;
      errorCode: string;
      timestamp: string;
      path?: string; // Will be added by the filter
      details?: Record<string, any> | string[];
    }

    export class BasePlatformException extends HttpException {
      public readonly errorCode: string;
      public readonly details?: Record<string, any> | string[];

      constructor(
        message: string | Record<string, any>,
        status: HttpStatus | number,
        errorCode: string,
        details?: Record<string, any> | string[],
      ) {
        const responsePayload: Partial<IBasePlatformExceptionPayload> = {
            message: typeof message === 'string' ? message : (message as any)?.error || 'Error', // Basic extraction
            errorCode,
            details,
        };
        // If message is an object, it might be the primary response content for HttpException
        super(typeof message === 'string' ? responsePayload : message, status);
        this.errorCode = errorCode;
        this.details = details;
      }

      // Override to ensure our custom fields are part of the response
      // getResponse() method in HttpException can be complex, often better to format in a global filter.
      // For simplicity here, we assume the GlobalExceptionFilter will correctly format it.
    }
    

#### 3.4.2. `libs/backend-kernel/src/errors/exceptions/validation.exception.ts`

*   **Type:** Exception
*   **Purpose:** Custom exception for data validation failures.
*   **Specifications:**
    typescript
    import { HttpStatus } from '@nestjs/common';
    import { BasePlatformException } from '../base.exception';
    import { HTTP_STATUS } from '../../common/constants/http-status.constants';

    export const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';

    export class ValidationException extends BasePlatformException {
      public readonly validationErrors: Record<string, string[]> | string[];

      constructor(
        errors: Record<string, string[]> | string[],
        message: string = 'Input data validation failed',
      ) {
        super(
          message,
          HTTP_STATUS.UNPROCESSABLE_ENTITY, // Or BAD_REQUEST (400)
          VALIDATION_ERROR_CODE,
          // Pass errors as details for the BasePlatformException if desired,
          // or handle them separately in the GlobalExceptionFilter
          Array.isArray(errors) ? { general: errors } : errors,
        );
        this.validationErrors = errors;
      }
    }
    

#### 3.4.3. `libs/backend-kernel/src/errors/exceptions/resource-not-found.exception.ts`

*   **Type:** Exception
*   **Purpose:** Custom exception for when a requested resource is not found.
*   **Specifications:**
    typescript
    import { HttpStatus } from '@nestjs/common';
    import { BasePlatformException } from '../base.exception';
    import { HTTP_STATUS } from '../../common/constants/http-status.constants';

    export const RESOURCE_NOT_FOUND_CODE = 'RESOURCE_NOT_FOUND';

    export class ResourceNotFoundException extends BasePlatformException {
      constructor(
        resourceName: string,
        resourceId?: string | number,
        message?: string,
      ) {
        const defaultMessage = resourceId
          ? `${resourceName} with ID '${resourceId}' not found.`
          : `${resourceName} not found.`;
        super(
          message || defaultMessage,
          HTTP_STATUS.NOT_FOUND,
          RESOURCE_NOT_FOUND_CODE,
        );
      }
    }
    

#### 3.4.4. `libs/backend-kernel/src/errors/filters/global-exception.filter.ts`

*   **Type:** Filter (NestJS Exception Filter)
*   **Purpose:** Catches all unhandled exceptions and standardizes HTTP error responses.
*   **Specifications:**
    typescript
    import {
      ExceptionFilter,
      Catch,
      ArgumentsHost,
      HttpException,
      HttpStatus,
      Inject,
    } from '@nestjs/common';
    import { HttpAdapterHost } from '@nestjs/core'; // For Express/Fastify compatibility
    import { ILoggerService, LogMeta } from '../../logging/interfaces/logger.service.interface';
    import { BasePlatformException, IBasePlatformExceptionPayload } from '../base.exception';
    import { ValidationException, VALIDATION_ERROR_CODE } from '../exceptions/validation.exception';
    import { LOGGER_SERVICE_TOKEN } from '../../logging/constants/logging.constants';
    import { HTTP_STATUS } from '../../common/constants/http-status.constants';


    @Catch() // Catch all exceptions
    export class GlobalExceptionFilter implements ExceptionFilter {
      constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
      ) {}

      catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        // const response = ctx.getResponse<Response>(); // Not directly used with httpAdapter

        let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred.';
        let errorCode = 'INTERNAL_SERVER_ERROR';
        let details: Record<string, any> | string[] | undefined = undefined;
        let validationErrors: Record<string, string[]> | string[] | undefined = undefined;

        const logMeta: LogMeta = {
            path: request.url,
            method: request.method,
            // Potentially add user context if available from request (e.g., req.user)
        };

        if (exception instanceof BasePlatformException) {
          status = exception.getStatus();
          const responsePayload = exception.getResponse() as Partial<IBasePlatformExceptionPayload> | string;
          if (typeof responsePayload === 'string') {
            message = responsePayload;
          } else {
            message = responsePayload.message || message;
            // errorCode = responsePayload.errorCode || errorCode; // BasePlatformException sets this
            details = responsePayload.details;
          }
          errorCode = exception.errorCode; // Prefer this
          
          if (exception instanceof ValidationException) {
            validationErrors = exception.validationErrors;
            // The details from BasePlatformException might already contain this
            // but having a dedicated field in the final response is clearer.
          }
          this.logger.warn(`Handled Platform Exception: ${message}`, request.url, { ...logMeta, errorCode, status, details: exception.details, stack: exception.stack });

        } else if (exception instanceof HttpException) {
          status = exception.getStatus();
          const responsePayload = exception.getResponse();
          if (typeof responsePayload === 'string') {
            message = responsePayload;
          } else if (typeof responsePayload === 'object' && responsePayload !== null) {
            message = (responsePayload as any).message || message;
            // HttpException might have its own structure for 'error' or other fields
            errorCode = (responsePayload as any).error || 'HTTP_EXCEPTION';
            if ((responsePayload as any).validationErrors) { // Custom handling for class-validator via default pipe
                validationErrors = (responsePayload as any).validationErrors;
            } else if (Array.isArray((responsePayload as any).message) && status === HTTP_STATUS.BAD_REQUEST) {
                // class-validator default pipe might put errors in message array
                validationErrors = (responsePayload as any).message;
                message = "Validation failed"; // Override generic "Bad Request"
                errorCode = VALIDATION_ERROR_CODE;
            }
          }
          this.logger.warn(`Handled HTTP Exception: ${message}`, request.url, { ...logMeta, errorCode, status, stack: exception.stack });
        } else if (exception instanceof Error) {
          // For generic Error objects not caught by above
          message = exception.message;
          this.logger.error(exception, exception.stack, request.url, logMeta );
        }
         else {
          // For non-Error objects thrown (e.g., strings, numbers)
          message = 'An unknown error occurred.';
          this.logger.error(`Unhandled Unknown Exception: ${String(exception)}`, request.url, logMeta);
        }

        const errorResponse: IBasePlatformExceptionPayload & { validationErrors?: any } = {
          statusCode: status,
          message,
          errorCode,
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          details, // From BasePlatformException
        };

        if (validationErrors) {
          errorResponse.validationErrors = validationErrors;
        }
        
        // Clean up undefined details
        if (!errorResponse.details) delete errorResponse.details;


        httpAdapter.reply(ctx.getResponse(), errorResponse, status);
      }
    }
    

#### 3.4.5. `libs/backend-kernel/src/errors/errors.module.ts` (Optional, but good practice)
*   **Type:** Module
*   **Purpose:** To provide error-related components, like the `GlobalExceptionFilter`.
*   **Specifications:**
    typescript
    import { Module } from '@nestjs/common';
    import { APP_FILTER } from '@nestjs/core';
    import { GlobalExceptionFilter } from './filters/global-exception.filter';
    import { LoggingModule } from '../logging/logging.module'; // Filter needs logger

    @Module({
      imports: [LoggingModule], // For GlobalExceptionFilter's logger dependency
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    })
    export class ErrorsModule {}
    

### 3.5. DTOs (Data Transfer Objects)

#### 3.5.1. `libs/backend-kernel/src/dtos/pagination/pagination-query.dto.ts`

*   **Type:** DTO
*   **Purpose:** Standard DTO for pagination and sorting query parameters.
*   **Specifications:**
    typescript
    import { Type } from 'class-transformer';
    import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

    export enum SortOrder {
      ASC = 'ASC',
      DESC = 'DESC',
    }

    export class PaginationQueryDto {
      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      page?: number = 1; // Default page

      @IsOptional()
      @Type(() => Number)
      @IsInt()
      @Min(1)
      @Max(100) // Max limit per page
      limit?: number = 10; // Default limit

      @IsOptional()
      @IsString()
      sortBy?: string;

      @IsOptional()
      @IsEnum(SortOrder)
      sortOrder?: SortOrder = SortOrder.DESC; // Default sort order
    }
    

#### 3.5.2. `libs/backend-kernel/src/dtos/pagination/paged-response.dto.ts`

*   **Type:** DTO
*   **Purpose:** Standard DTO for returning paginated list results.
*   **Specifications:**
    typescript
    import { ApiProperty } from '@nestjs/swagger'; // If using Swagger for API docs

    export class PagedResponseDto<T> {
      @ApiProperty({ isArray: true, description: 'The list of items for the current page.' })
      readonly data: T[];

      @ApiProperty({ type: Number, description: 'Total number of items across all pages.' })
      readonly total: number;

      @ApiProperty({ type: Number, description: 'Current page number.' })
      readonly page: number;

      @ApiProperty({ type: Number, description: 'Number of items per page.' })
      readonly limit: number;

      @ApiProperty({ type: Number, description: 'Total number of pages.' })
      readonly totalPages: number;

      @ApiProperty({ type: Boolean, description: 'Indicates if there is a next page.' })
      readonly hasNextPage: boolean;

      @ApiProperty({ type: Boolean, description: 'Indicates if there is a previous page.' })
      readonly hasPreviousPage: boolean;

      constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
        this.hasNextPage = page < this.totalPages;
        this.hasPreviousPage = page > 1;
      }
    }
    

### 3.6. Validation Module

#### 3.6.1. `libs/backend-kernel/src/validation/decorators/is-custom-uuid.decorator.ts`

*   **Type:** Decorator
*   **Purpose:** Custom `class-validator` decorator for UUID validation.
*   **Specifications:**
    typescript
    import {
      registerDecorator,
      ValidationOptions,
      ValidatorConstraint,
      ValidatorConstraintInterface,
      ValidationArguments,
      isUUID,
    } from 'class-validator';

    @ValidatorConstraint({ async: false, name: 'isCustomUuid' })
    export class IsCustomUuidConstraint implements ValidatorConstraintInterface {
      validate(value: any, args: ValidationArguments) {
        if (typeof value !== 'string') {
          return false;
        }
        // Use class-validator's built-in isUUID or a more specific regex if needed
        // For example, to specify a UUID version: return isUUID(value, '4');
        return isUUID(value);
      }

      defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid UUID.`;
      }
    }

    export function IsCustomUuid(validationOptions?: ValidationOptions) {
      return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [],
          validator: IsCustomUuidConstraint,
        });
      };
    }
    

#### 3.6.2. `libs/backend-kernel/src/validation/validation.module.ts` (Optional)
*   **Type:** Module
*   **Purpose:** To group validation-related components, though often decorators are used directly.
*   **Specifications:**
    typescript
    import { Module } from '@nestjs/common';
    // No specific providers usually needed if only exporting decorators
    // Could provide a custom ValidationPipe if needed globally with specific options.

    @Module({
      providers: [], // Custom validation pipes or services could go here
      exports: [],
    })
    export class ValidationModule {}
    

### 3.7. Configuration Module

#### 3.7.1. `libs/backend-kernel/src/config/interfaces/config.service.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines the contract for a configuration service.
*   **Specifications:**
    typescript
    import { Maybe } from '../../common/types/maybe.type';

    export interface IConfigService {
      /**
       * Gets a configuration value by key.
       * @param key The configuration key.
       * @returns The configuration value as a string, or undefined if not found.
       */
      get<T = string>(key: string): Maybe<T>;
      
      /**
       * Gets a configuration value by key or throws an error if not found.
       * @param key The configuration key.
       * @param defaultValue Optional default value to return if key is not found (avoids throwing).
       * @returns The configuration value as a string.
       * @throws Error if key is not found and no defaultValue is provided.
       */
      getOrThrow<T = string>(key: string, defaultValue?: T): T;

      /**
       * Gets a configuration value by key, parsed as a number.
       * @param key The configuration key.
       * @returns The configuration value as a number, or undefined if not found or not a valid number.
       */
      getNumber(key: string): Maybe<number>;

      /**
       * Gets a configuration value by key, parsed as a number, or throws an error.
       * @param key The configuration key.
       * @param defaultValue Optional default value.
       * @returns The configuration value as a number.
       * @throws Error if key is not found / not a number and no defaultValue.
       */
      getNumberOrThrow(key: string, defaultValue?: number): number;

      /**
       * Gets a configuration value by key, parsed as a boolean.
       * Values like 'true', '1' are true. 'false', '0' are false.
       * @param key The configuration key.
       * @param defaultValue Optional default value if key is not found.
       * @returns The configuration value as a boolean.
       */
      getBoolean(key: string, defaultValue?: boolean): boolean;

      /**
       * Checks if the current environment is production.
       * Typically based on NODE_ENV.
       */
      isProduction(): boolean;

      /**
       * Checks if the current environment is development.
       */
      isDevelopment(): boolean;
      
      /**
       * Gets the current Node environment (e.g., 'development', 'production', 'test').
       */
      getNodeEnv(): string;
    }
    

#### 3.7.2. `libs/backend-kernel/src/config/services/aws-appconfig.service.ts` (renamed to `EnvironmentConfigService` for broader applicability if not strictly AWS AppConfig, or `AwsParameterStoreConfigService`)

*   **File Name (Revised):** `libs/backend-kernel/src/config/services/environment-config.service.ts` (if primarily .env based for kernel, with AWS as an extension) or `aws-parameter-store-config.service.ts` if focusing on AWS. The original description implies AWS SSM and Secrets Manager.
*   **Type:** Service (NestJS Provider)
*   **Purpose:** Provides configuration from environment variables, AWS SSM Parameter Store, and AWS Secrets Manager.
*   **Specifications for `AwsParameterStoreConfigService`:**
    typescript
    import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
    import {
      SSMClient,
      GetParametersByPathCommand,
      GetParameterCommand,
      Parameter,
    } from '@aws-sdk/client-ssm';
    import {
      SecretsManagerClient,
      GetSecretValueCommand,
    } from '@aws-sdk/client-secrets-manager';
    import { IConfigService } from '../interfaces/config.service.interface';
    import { Maybe } from '../../common/types/maybe.type';
    import { ILoggerService } from '../../logging/interfaces/logger.service.interface';
    import { LOGGER_SERVICE_TOKEN } from '../../logging/constants/logging.constants';

    @Injectable()
    export class AwsParameterStoreConfigService implements IConfigService, OnModuleInit {
      private readonly ssmClient: SSMClient;
      private readonly secretsManagerClient: SecretsManagerClient;
      private readonly config: Record<string, string> = {}; // In-memory cache
      private isInitialized = false;

      private readonly ssmPath: string;
      private readonly secretNames: string[]; // e.g., ['database/credentials', 'api/keys']

      constructor(
        // Directly inject ENV vars for AWS region and paths, or use NestJS ConfigService for this initial bootstrap
        @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
      ) {
        // These should ideally come from environment variables setup for the service
        const region = process.env.AWS_REGION || 'us-east-1';
        this.ssmPath = process.env.CONFIG_SSM_PATH || '/admanager/shared/';
        const secretNamesEnv = process.env.CONFIG_SECRET_NAMES;
        this.secretNames = secretNamesEnv ? secretNamesEnv.split(',') : [];

        this.ssmClient = new SSMClient({ region });
        this.secretsManagerClient = new SecretsManagerClient({ region });

        // Load process.env into config as a base layer
        for (const key in process.env) {
            if (Object.prototype.hasOwnProperty.call(process.env, key)) {
                this.config[key] = process.env[key] as string;
            }
        }
      }

      async onModuleInit(): Promise<void> {
        await this.loadConfigFromSsm();
        await this.loadSecrets();
        this.isInitialized = true;
        this.logger.log('Configuration loaded from AWS Parameter Store and Secrets Manager.', AwsParameterStoreConfigService.name);
      }

      private async loadConfigFromSsm(): Promise<void> {
        try {
          let nextToken: string | undefined;
          do {
            const command = new GetParametersByPathCommand({
              Path: this.ssmPath,
              Recursive: true,
              WithDecryption: true,
              NextToken: nextToken,
            });
            const output = await this.ssmClient.send(command);
            if (output.Parameters) {
              output.Parameters.forEach((param: Parameter) => {
                if (param.Name && param.Value) {
                  // Convert /admanager/shared/DB_HOST to DB_HOST
                  const key = param.Name.replace(this.ssmPath, '').toUpperCase();
                  this.config[key] = param.Value;
                }
              });
            }
            nextToken = output.NextToken;
          } while (nextToken);
        } catch (error) {
          this.logger.error('Failed to load config from SSM Parameter Store', error instanceof Error ? error.stack : String(error), AwsParameterStoreConfigService.name);
          // Decide if this should be a fatal error
        }
      }

      private async loadSecrets(): Promise<void> {
        for (const secretName of this.secretNames) {
          try {
            const command = new GetSecretValueCommand({ SecretId: secretName });
            const output = await this.secretsManagerClient.send(command);
            if (output.SecretString) {
              const secretValues = JSON.parse(output.SecretString);
              for (const key in secretValues) {
                // Store them, perhaps prefixed or as-is, depending on naming conventions
                this.config[key.toUpperCase()] = secretValues[key];
              }
            }
          } catch (error) {
            this.logger.error(`Failed to load secret: ${secretName}`, error instanceof Error ? error.stack : String(error), AwsParameterStoreConfigService.name);
          }
        }
      }

      private ensureInitialized(): void {
          if(!this.isInitialized) {
              // This is a fallback, ideally onModuleInit completes before first use.
              // Or throw an error if config is critical before load.
              this.logger.warn('ConfigService accessed before full initialization.', AwsParameterStoreConfigService.name);
          }
      }
      
      get<T = string>(key: string): Maybe<T> {
        this.ensureInitialized();
        const value = this.config[key.toUpperCase()];
        return value as unknown as Maybe<T>; // Basic cast, more robust type handling could be added
      }

      getOrThrow<T = string>(key: string, defaultValue?: T): T {
        this.ensureInitialized();
        const value = this.config[key.toUpperCase()];
        if (value === undefined) {
          if (defaultValue !== undefined) {
            return defaultValue;
          }
          throw new Error(`Configuration key "${key}" not found and no default value provided.`);
        }
        return value as unknown as T;
      }

      getNumber(key: string): Maybe<number> {
        this.ensureInitialized();
        const value = this.config[key.toUpperCase()];
        if (value === undefined) return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      }

      getNumberOrThrow(key: string, defaultValue?: number): number {
        this.ensureInitialized();
        const value = this.config[key.toUpperCase()];
        if (value === undefined) {
            if (defaultValue !== undefined) return defaultValue;
            throw new Error(`Configuration key "${key}" for number not found and no default value.`);
        }
        const num = parseFloat(value);
        if (isNaN(num)) {
            if (defaultValue !== undefined) return defaultValue;
            throw new Error(`Configuration key "${key}" is not a valid number: ${value}`);
        }
        return num;
      }

      getBoolean(key: string, defaultValue: boolean = false): boolean {
        this.ensureInitialized();
        const value = this.config[key.toUpperCase()];
        if (value === undefined) return defaultValue;
        return value === 'true' || value === '1';
      }

      isProduction(): boolean {
        return this.getNodeEnv() === 'production';
      }
    
      isDevelopment(): boolean {
        return this.getNodeEnv() === 'development';
      }
    
      getNodeEnv(): string {
        return this.getOrThrow<string>('NODE_ENV', 'development');
      }
    }
    

#### 3.7.3. `libs/backend-kernel/src/config/config.module.ts`

*   **Type:** Module
*   **Purpose:** Encapsulates configuration functionality.
*   **Specifications:**
    typescript
    import { Module, Global } from '@nestjs/common';
    import { IConfigService } from './interfaces/config.service.interface';
    // Choose the appropriate implementation:
    import { AwsParameterStoreConfigService } from './services/aws-parameter-store-config.service';
    // import { EnvironmentConfigService } from './services/environment-config.service';
    import { CONFIG_SERVICE_TOKEN } from './constants/config.constants';
    import { LoggingModule } from '../logging/logging.module'; // Config service needs logger

    @Global() // Config service should be globally available
    @Module({
      imports: [LoggingModule], // AwsParameterStoreConfigService needs ILoggerService
      providers: [
        {
          provide: CONFIG_SERVICE_TOKEN, // Or use IConfigService directly
          useClass: AwsParameterStoreConfigService, // Or EnvironmentConfigService
        },
      ],
      exports: [CONFIG_SERVICE_TOKEN], // Or IConfigService
    })
    export class ConfigModule {}
    

#### 3.7.4. `libs/backend-kernel/src/config/constants/config.constants.ts`

*   **Type:** Constants
*   **Purpose:** Provides injection tokens for configuration services.
*   **Specifications:**
    typescript
    /**
     * @const CONFIG_SERVICE_TOKEN
     * @description Injection token for the IConfigService.
     */
    export const CONFIG_SERVICE_TOKEN = Symbol('IConfigService');
    

### 3.8. Audit Module

#### 3.8.1. `libs/backend-kernel/src/audit/interfaces/audit-log.service.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines the contract for an audit logging service.
*   **Specifications:**
    typescript
    import { AuditEntryDto } from '../dtos/audit-entry.dto';

    export interface IAuditLogService {
      /**
       * Logs an audit entry.
       * @param entry - The audit entry data transfer object.
       * @returns Promise resolving when the log action is complete.
       */
      logAction(entry: AuditEntryDto): Promise<void>;
    }
    

#### 3.8.2. `libs/backend-kernel/src/audit/dtos/audit-entry.dto.ts`

*   **Type:** DTO
*   **Purpose:** Defines the structure for an audit log entry.
*   **Specifications:**
    typescript
    import { IsString, IsDate, IsEnum, IsOptional, IsObject, ValidateNested } from 'class-validator';
    import { Type } from 'class-transformer';

    export enum AuditActionStatus {
      SUCCESS = 'SUCCESS',
      FAILURE = 'FAILURE',
    }

    export enum AuditActorType {
        USER = 'USER',
        SYSTEM = 'SYSTEM',
        API_KEY = 'API_KEY', // For third-party app interactions
    }

    export class AuditEntryDto {
      @IsDate()
      @Type(() => Date)
      timestamp: Date = new Date();

      @IsString()
      userId?: string; // ID of the user performing the action, if applicable

      @IsEnum(AuditActorType)
      actorType: AuditActorType = AuditActorType.SYSTEM;

      @IsString()
      actorId: string; // e.g. userId, systemProcessName, apiKeyId

      @IsString()
      action: string; // e.g., 'CAMPAIGN_CREATE', 'USER_LOGIN_FAILURE'

      @IsOptional()
      @IsString()
      targetResource?: string; // e.g., 'Campaign', 'User'

      @IsOptional()
      @IsString()
      targetResourceId?: string; // e.g., campaign ID, user ID

      @IsEnum(AuditActionStatus)
      status: AuditActionStatus;

      @IsOptional()
      @IsObject()
      details?: Record<string, any>; // Any additional context

      @IsOptional()
      @IsString()
      ipAddress?: string;

      @IsString()
      serviceName: string; // Name of the microservice generating the audit log

      @IsOptional()
      @IsString()
      correlationId?: string; // To trace related actions across services
    }
    

#### 3.8.3. `libs/backend-kernel/src/audit/services/audit-log.service.ts`

*   **Type:** Service (NestJS Provider)
*   **Purpose:** Basic implementation for audit logging. In a production system, this might send events to a dedicated audit microservice or an SQS queue leading to a durable store.
*   **Specifications:**
    typescript
    import { Injectable, Inject } from '@nestjs/common';
    import { IAuditLogService } from '../interfaces/audit-log.service.interface';
    import { AuditEntryDto } from '../dtos/audit-entry.dto';
    import { ILoggerService } from '../../logging/interfaces/logger.service.interface';
    import { LOGGER_SERVICE_TOKEN } from '../../logging/constants/logging.constants';
    import { IConfigService } from '../../config/interfaces/config.service.interface';
    import { CONFIG_SERVICE_TOKEN } from '../../config/constants/config.constants';

    @Injectable()
    export class AuditLogService implements IAuditLogService {
      private readonly serviceName: string;

      constructor(
        @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
        @Inject(CONFIG_SERVICE_TOKEN) private readonly configService: IConfigService,
      ) {
        this.serviceName = this.configService.get('SERVICE_NAME') || 'unknown-service';
      }

      async logAction(entry: Omit<AuditEntryDto, 'serviceName' | 'timestamp'>): Promise<void> {
        const auditEntry: AuditEntryDto = {
            ...entry,
            timestamp: new Date(),
            serviceName: this.serviceName,
        };
        
        // For the shared kernel, we log it using the standard logger with a specific context or level.
        // In a real system, this might push to SQS, Kinesis, or a dedicated audit database.
        this.logger.log(
            `AUDIT: [${auditEntry.actorType}:${auditEntry.actorId}] ${auditEntry.action} on ${auditEntry.targetResource || 'N/A'}:${auditEntry.targetResourceId || 'N/A'} - ${auditEntry.status}`,
            'AuditLogService', // context for the logger
            auditEntry // Pass the full entry as metadata
        );
        // No actual async operation here for this basic kernel version
        return Promise.resolve();
      }
    }
    

#### 3.8.4. `libs/backend-kernel/src/audit/audit.module.ts`

*   **Type:** Module
*   **Purpose:** Encapsulates audit logging functionality.
*   **Specifications:**
    typescript
    import { Module, Global } from '@nestjs/common';
    import { IAuditLogService } from './interfaces/audit-log.service.interface';
    import { AuditLogService } from './services/audit-log.service';
    import { LoggingModule } from '../logging/logging.module';
    import { ConfigModule as KernelConfigModule } from '../config/config.module';

    @Global() // Audit service is often needed globally
    @Module({
      imports: [LoggingModule, KernelConfigModule], // AuditLogService depends on Logger and Config
      providers: [
        {
          provide: IAuditLogService, // Can define AUDIT_LOG_SERVICE_TOKEN if preferred
          useClass: AuditLogService,
        },
      ],
      exports: [IAuditLogService],
    })
    export class AuditModule {}
    

### 3.9. Caching Module

#### 3.9.1. `libs/backend-kernel/src/caching/interfaces/cache.service.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines the contract for a caching service.
*   **Specifications:**
    typescript
    import { Maybe } from '../../common/types/maybe.type';

    export interface ICacheService {
      /**
       * Retrieves an item from the cache.
       * @param key The cache key.
       * @returns A promise that resolves to the cached item or undefined/null if not found.
       */
      get<T>(key: string): Promise<Maybe<T>>;

      /**
       * Stores an item in the cache.
       * @param key The cache key.
       * @param value The value to store.
       * @param ttlSeconds Optional time-to-live in seconds. If not provided, uses default TTL.
       * @returns A promise that resolves when the item is stored.
       */
      set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

      /**
       * Deletes an item from the cache.
       * @param key The cache key.
       * @returns A promise that resolves when the item is deleted.
       */
      delete(key: string): Promise<void>;

      /**
       * Clears all items from the cache (use with caution).
       * @returns A promise that resolves when the cache is cleared.
       */
      clear?(): Promise<void>; // Optional, as not all cache stores might support it easily

      /**
       * Wraps a function call with caching. If the key exists in cache, return cached value.
       * Otherwise, execute the function, store its result in cache, and return the result.
       * @param key The cache key.
       * @param fn The function to execute to get the value if not cached.
       * @param ttlSeconds Optional TTL for the new cache entry.
       */
      wrap?<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
    }
    

#### 3.9.2. `libs/backend-kernel/src/caching/services/redis-cache.service.ts`

*   **Type:** Service (NestJS Provider)
*   **Purpose:** Implements `ICacheService` using Redis via `@nestjs/cache-manager`.
*   **Specifications:**
    typescript
    import { Injectable, Inject } from '@nestjs/common';
    import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'; // from @nestjs/cache-manager
    import { ICacheService } from '../interfaces/cache.service.interface';
    import { Maybe } from '../../common/types/maybe.type';

    @Injectable()
    export class RedisCacheService implements ICacheService {
      constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

      async get<T>(key: string): Promise<Maybe<T>> {
        return this.cacheManager.get<T>(key);
      }

      async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        // ttl in @nestjs/cache-manager is in milliseconds if not specified differently by store
        // The 'ttl' option in NestJS Cache is in seconds. Check the store adapter.
        // For 'cache-manager' v5, ttl is milliseconds. For older, it might be seconds.
        // Assuming ttlSeconds is what we want for consistency.
        // If cacheManager.set takes ttl in ms:
        const ttlMilliseconds = ttlSeconds ? ttlSeconds * 1000 : undefined;
        await this.cacheManager.set(key, value, ttlMilliseconds);
      }

      async delete(key: string): Promise<void> {
        await this.cacheManager.del(key);
      }

      async clear(): Promise<void> {
        // `reset` is the method to clear the entire cache for `cache-manager`
        if (typeof this.cacheManager.reset === 'function') {
            await this.cacheManager.reset();
        } else {
            // Log a warning or throw an error if clear is not supported by the store
            console.warn('Cache store does not support clear operation or `reset` is not available.');
        }
      }

      async wrap<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
        const cachedValue = await this.get<T>(key);
        if (cachedValue !== null && cachedValue !== undefined) {
          return cachedValue;
        }

        const result = await fn();
        await this.set(key, result, ttlSeconds);
        return result;
      }
    }
    
    *   **Note:** The TTL unit for `cacheManager.set` depends on the version of `cache-manager` and the specific store adapter. The `@nestjs/cache-manager` v5 (which uses `cache-manager` v5) expects TTL in milliseconds. Ensure this is handled correctly.

#### 3.9.3. `libs/backend-kernel/src/caching/caching.module.ts`

*   **Type:** Module
*   **Purpose:** Configures and provides the caching service.
*   **Specifications:**
    typescript
    import { Module, Global } from '@nestjs/common';
    import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
    import * as redisStore from 'cache-manager-redis-store'; // Or specific redis store
    import { ICacheService } from './interfaces/cache.service.interface';
    import { RedisCacheService } from './services/redis-cache.service';
    import { ConfigModule as KernelConfigModule } from '../config/config.module';
    import { IConfigService } from '../config/interfaces/config.service.interface';
    import { CONFIG_SERVICE_TOKEN } from '../config/constants/config.constants';

    @Global() // Caching service often useful globally
    @Module({
      imports: [
        KernelConfigModule, // Needed for CacheModule.registerAsync
        NestCacheModule.registerAsync({
          imports: [KernelConfigModule],
          inject: [CONFIG_SERVICE_TOKEN],
          useFactory: async (configService: IConfigService) => {
            const host = configService.getOrThrow<string>('REDIS_HOST', 'localhost');
            const port = configService.getNumberOrThrow('REDIS_PORT', 6379);
            const ttl = configService.getNumber('REDIS_DEFAULT_TTL_SECONDS', 300); // Default TTL in seconds

            // For cache-manager-redis-store
            // Check the exact options required by the version of cache-manager-redis-store you are using
            return {
              store: redisStore, // or await redisStore({socket: { host, port}}) for cache-manager v5+
              host: host,       // May not be needed if using redisStore factory above
              port: port,       // May not be needed
              ttl: ttl * 1000, // Convert seconds to milliseconds for cache-manager v5+
              // Add other Redis options like password if needed from configService
            };
          },
          isGlobal: true, // Makes NestCacheModule's CACHE_MANAGER available globally
        }),
      ],
      providers: [
        {
          provide: ICacheService, // Can define CACHE_SERVICE_TOKEN if preferred
          useClass: RedisCacheService,
        },
      ],
      exports: [ICacheService],
    })
    export class CachingModule {}
    

### 3.10. Events Module (Interfaces for Domain/Integration Events)

#### 3.10.1. `libs/backend-kernel/src/events/interfaces/domain-event.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines a common structure for domain events.
*   **Specifications:**
    typescript
    export interface IDomainEvent<TPayload = any> {
      /**
       * The unique identifier of the aggregate root that this event pertains to.
       */
      readonly aggregateId: string | number;

      /**
       * The date and time when the event occurred.
       */
      readonly dateTimeOccurred: Date;

      /**
       * The name of the event, unique within the bounded context.
       * e.g., 'CampaignCreatedEvent', 'ProductPriceChangedEvent'
       */
      readonly eventName: string;
      
      /**
       * The version of this event schema.
       */
      readonly eventVersion: number;

      /**
       * The payload of the event, containing event-specific data.
       */
      readonly payload: TPayload;

      /**
       * Optional: Correlation ID to link related events.
       */
      readonly correlationId?: string;

      /**
       * Optional: Causation ID, ID of the command or event that caused this event.
       */
      readonly causationId?: string;
    }
    

#### 3.10.2. `libs/backend-kernel/src/events/interfaces/integration-event.interface.ts`

*   **Type:** Interface
*   **Purpose:** Defines a common structure for integration events used for inter-service communication.
*   **Specifications:**
    typescript
    export interface IIntegrationEvent<TPayload = any> {
      /**
       * A unique identifier for this specific event instance.
       */
      readonly eventId: string; // e.g., a UUID

      /**
       * The name of the event, globally unique or namespaced.
       * e.g., 'admanager.campaign.v1.created', 'platform.user.v1.updated'
       */
      readonly eventName: string;

      /**
       * The version of this event schema.
       */
      readonly eventVersion: number;

      /**
       * The date and time when the event occurred, in UTC.
       */
      readonly occurredOn: Date;

      /**
       * The payload of the event, containing event-specific data.
       */
      readonly payload: TPayload;
      
      /**
       * ID for tracing requests across multiple services.
       */
      readonly correlationId?: string;

      /**
       * Name of the service that published this event.
       */
      readonly sourceService: string;

      /**
       * Optional: User ID of the user who initiated the action leading to this event.
       */
      readonly userId?: string; 
    }
    

## 4. Common Utilities (Placeholder for future expansion)

This section can be expanded later to include general-purpose utility functions (e.g., string manipulation, date utilities, etc.) if they are deemed necessary for the shared kernel and not specific to any particular domain module within the kernel.

## 5. Testing Strategy

*   **Unit Tests:** Each service, DTO (validation), decorator, and utility function within the kernel will have comprehensive unit tests using Jest. Dependencies will be mocked.
*   **Focus:**
    *   Correctness of logic in services.
    *   Validation rules in DTOs.
    *   Functionality of custom decorators.
    *   Error handling and exception throwing.
    *   Configuration service value retrieval.
    *   Logger output formatting (basic checks).
*   **Test Coverage:** Aim for high test coverage (e.g., >80-90%) for all components in the shared kernel.

## 6. Documentation Strategy

*   **JSDoc/TSDoc:** All public classes, interfaces, methods, properties, and types will be documented using JSDoc/TSDoc conventions.
*   **README.md:** The root of the `libs/backend-kernel` directory will contain a `README.md` file explaining the purpose of the kernel, how to install it (if published as a package), how to use its core modules/services, and contribution guidelines if applicable.
*   **Generated Documentation:** Consider using tools like TypeDoc to generate HTML documentation from TSDoc comments for easier browsing.

This SDS provides a comprehensive blueprint for developing the `AdManager.Shared.Backend.Kernel`. It details the structure, purpose, and specifications for each component, ensuring consistency and reusability across the Ad Manager Platform's backend microservices.