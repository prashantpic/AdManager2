# AdManager.Shared.Libraries - Software Design Specification

## 1. Introduction

This document outlines the software design specification for the `AdManager.Shared.Libraries` repository. This repository is a monorepo containing several TypeScript packages designed to provide shared utilities, DTOs, interfaces, error handling mechanisms, logging, configuration management, and audit logging capabilities for Ad Manager microservices. The primary goal is to promote code reusability, consistency, and maintainability across the platform.

All packages will be published as private NPM packages under the `@admanager` scope.

**Technology Stack:**
*   **Language:** TypeScript 5.3.3
*   **Build/Test Environment:** Node.js 20.14.0
*   **Testing Framework:** Jest 29.7.0
*   **Monorepo Management:** NPM/Yarn/PNPM Workspaces (Assume NPM for specific commands if needed)
*   **Third-party Libraries:**
    *   `class-validator`: For DTO validation.
    *   `class-transformer`: For transforming plain objects to class instances and vice-versa.
    *   `lodash`: For common utility functions.
    *   `uuid`: For generating UUIDs.
    *   `pino` (or similar like `winston`): Suggested for structured logging in `LoggerService`.

## 2. Monorepo Root Configuration

### 2.1. `package.json` (Root)
*   **Purpose:** Manages workspaces, development dependencies, and scripts for building and testing all shared packages.
*   **Key configurations:**
    *   `"private": true`
    *   `"workspaces": ["packages/*"]`
    *   **Scripts:**
        *   `"bootstrap"`: Installs dependencies for all packages (e.g., `npm install` or `pnpm install`).
        *   `"build"`: Builds all packages (e.g., `npm run build -ws` or `pnpm -r build`).
        *   `"test"`: Runs tests for all packages (e.g., `npm run test -ws` or `pnpm -r test`).
        *   `"lint"`: Lints all packages (e.g., `npm run lint -ws` or `pnpm -r lint`).
        *   `"clean"`: Removes `dist` and `node_modules` from all packages.
    *   **Dev Dependencies:**
        *   `typescript`
        *   `jest`, `ts-jest`, `@types/jest`
        *   `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
        *   `prettier`
        *   `lerna` or `nx` (optional, for more advanced monorepo management, but workspaces can suffice for basic needs)
        *   `rimraf` (for clean script)

### 2.2. `tsconfig.base.json`
*   **Purpose:** Base TypeScript configuration providing common compiler options inherited by all shared packages.
*   **Key `compilerOptions`:**
    *   `"target": "ES2021"` (or newer compatible with Node.js 20)
    *   `"module": "CommonJS"`
    *   `"lib": ["ES2021", "DOM"]` (DOM might be needed for some utility types, can be adjusted)
    *   `"declaration": true`
    *   `"declarationMap": true`
    *   `"sourceMap": true`
    *   `"esModuleInterop": true`
    *   `"forceConsistentCasingInFileNames": true`
    *   `"strict": true`
    *   `"skipLibCheck": true`
    *   `"resolveJsonModule": true`
    *   `"baseUrl": "."`
    *   `"paths"`: To be configured for inter-package references if needed during local development, e.g.,
        json
        "paths": {
          "@admanager/*": ["packages/*/src"]
        }
        
    *   `"composite": true` (if using project references for faster incremental builds)

## 3. Package: `@admanager/logger`

Provides a standardized logging interface and implementation for consistent logging across microservices.

### 3.1. `packages/logger/package.json`
*   `"name": "@admanager/logger"`
*   `"version": "0.1.0"` (or initial version)
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:**
    *   `pino` (recommended for structured, performant logging) or `winston`
    *   `pino-pretty` (dev dependency, if using pino, for human-readable local logs)
*   **Peer Dependencies:** None initially.
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"`

### 3.2. `packages/logger/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`
*   Potentially `"references": [{"path": "../types"}]` if `LoggerConfig` uses enums from `@admanager/types`. (Adjust for relative path to base if using composite)

### 3.3. `packages/logger/tsconfig.build.json`
*   Extends `./tsconfig.json`.
*   Used specifically for building, may have slightly different settings if needed (e.g., no `noEmit` if tsconfig.json has it for checks).
*    Ensures `declaration` and `declarationMap` are true.

### 3.4. `packages/logger/src/index.ts` (Barrel File)
*   Exports: `ILogger`, `LoggerService`, `LogLevel`, `LoggerConfig`.

### 3.5. `packages/logger/src/logger.interface.ts`
typescript
import { LogLevel } from './enums/log-level.enum';

export interface LoggerMetadata {
  [key: string]: any;
  correlationId?: string;
  userId?: string;
  // Add other common contextual fields
}

export interface ILogger {
  debug(message: string, meta?: LoggerMetadata): void;
  info(message: string, meta?: LoggerMetadata): void;
  warn(message: string, meta?: LoggerMetadata): void;
  error(message: string, error?: Error | unknown, meta?: LoggerMetadata): void;
  setLogLevel(level: LogLevel): void;
  getLogLevel(): LogLevel;
}


### 3.6. `packages/logger/src/enums/log-level.enum.ts`
typescript
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace', // For more granular debugging, if pino/winston supports it
}


### 3.7. `packages/logger/src/logger.config.ts`
typescript
import { LogLevel } from './enums/log-level.enum';

export interface LoggerConfig {
  level: LogLevel;
  serviceName: string;
  isProduction: boolean;
  prettyPrint?: boolean; // For development
  // Add other pino/winston specific config options if needed
}

export const DEFAULT_LOGGER_CONFIG: Omit<LoggerConfig, 'serviceName'> = {
  level: LogLevel.INFO,
  isProduction: process.env.NODE_ENV === 'production',
  prettyPrint: process.env.NODE_ENV !== 'production',
};


### 3.8. `packages/logger/src/logger.service.ts`
*   **Implementation Details:**
    *   Uses `pino` as the underlying logger.
    *   Constructor accepts `LoggerConfig`.
    *   Initializes `pino` with options derived from `LoggerConfig`:
        *   `level`: from config.
        *   `name`: `serviceName` from config.
        *   `timestamp`: `pino.stdTimeFunctions.isoTime`.
        *   `formatters`: to include `pid`, `hostname`.
        *   `transport` (for production): Consider a transport for structured JSON logging to CloudWatch or other log aggregation service.
        *   `transport` (for development, if `prettyPrint` is true): Use `pino-pretty`.
    *   `ILogger` methods will map to `pino` methods.
    *   The `error` method should handle an optional `Error` object, logging its stack trace and message.
    *   Merge provided `meta` with common contextual information (e.g., `serviceName`).
    *   `setLogLevel` and `getLogLevel` methods to dynamically change/retrieve log level.

typescript
import pino, { Logger as PinoLogger, Level,destination } from 'pino';
import { ILogger, LoggerMetadata } from './logger.interface';
import { LoggerConfig, DEFAULT_LOGGER_CONFIG } from './logger.config';
import { LogLevel } from './enums/log-level.enum';

export class LoggerService implements ILogger {
  private pinoLogger: PinoLogger;
  private currentLevel: LogLevel;
  private readonly serviceName: string;

  constructor(config: Partial<LoggerConfig> & { serviceName: string }) {
    const fullConfig: LoggerConfig = {
      ...DEFAULT_LOGGER_CONFIG,
      ...config,
    };
    this.serviceName = fullConfig.serviceName;
    this.currentLevel = fullConfig.level;

    const pinoOptions: pino.LoggerOptions = {
      level: this.currentLevel,
      name: this.serviceName,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => {
          return { level: label };
        },
        bindings: (bindings) => {
          return {
            pid: bindings.pid,
            hostname: bindings.hostname,
            service: this.serviceName,
          };
        },
      },
    };

    if (fullConfig.isProduction) {
      // In production, log as JSON to stdout, which can be collected by CloudWatch, etc.
      // Consider transports for specific services if needed (e.g., pino-datadog-logger)
      this.pinoLogger = pino(pinoOptions);
    } else {
      pinoOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname,service', // service is already in the message prefix
        },
      };
      this.pinoLogger = pino(pinoOptions);
    }
  }

  private formatMeta(meta?: LoggerMetadata): Record<string, any> {
    return meta ? { ...meta } : {};
  }

  debug(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.debug(this.formatMeta(meta), message);
  }

  info(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.info(this.formatMeta(meta), message);
  }

  warn(message: string, meta?: LoggerMetadata): void {
    this.pinoLogger.warn(this.formatMeta(meta), message);
  }

  error(message: string, error?: Error | unknown, meta?: LoggerMetadata): void {
    const logObject: Record<string, any> = this.formatMeta(meta);
    if (error instanceof Error) {
      logObject.err = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
        logObject.err = error;
    }
    this.pinoLogger.error(logObject, message);
  }
  
  setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
    this.pinoLogger.level = level;
  }

  getLogLevel(): LogLevel {
    return this.currentLevel;
  }
}


## 4. Package: `@admanager/errors`

Provides a standardized framework for error handling, including custom base error classes and HTTP-specific errors.

### 4.1. `packages/errors/package.json`
*   `"name": "@admanager/errors"`
*   `"version": "0.1.0"`
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:** None initially, unless `ErrorCodes` or DTOs from `@admanager/types` are directly imported.
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"`

### 4.2. `packages/errors/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`
*   Potentially `"references": [{"path": "../types"}]` if ErrorCodes or ErrorResponseDto uses types from there.

### 4.3. `packages/errors/tsconfig.build.json`
*   Extends `./tsconfig.json`.

### 4.4. `packages/errors/src/index.ts` (Barrel File)
*   Exports: `CustomBaseError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError` (new), `UnprocessableEntityError` (new), `InternalServerError`, `ErrorCodes`, `IErrorResponse`.

### 4.5. `packages/errors/src/base.error.ts`
typescript
export abstract class CustomBaseError extends Error {
  public readonly code: string | number;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;
  public readonly isOperational: boolean; // Indicates if this is a known, operational error

  constructor(
    message: string,
    statusCode: number,
    code: string | number,
    isOperational: boolean = true,
    context?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;

    // This line is important for proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


### 4.6. `packages/errors/src/http.errors.ts`
*   Define classes for common HTTP errors, all extending `CustomBaseError`.
    *   `BadRequestError (statusCode: 400, defaultCode: ErrorCodes.BAD_REQUEST)`
    *   `UnauthorizedError (statusCode: 401, defaultCode: ErrorCodes.UNAUTHENTICATED)`
    *   `ForbiddenError (statusCode: 403, defaultCode: ErrorCodes.PERMISSION_DENIED)`
    *   `NotFoundError (statusCode: 404, defaultCode: ErrorCodes.RESOURCE_NOT_FOUND)`
    *   `ConflictError (statusCode: 409, defaultCode: ErrorCodes.RESOURCE_CONFLICT)`
    *   `UnprocessableEntityError (statusCode: 422, defaultCode: ErrorCodes.VALIDATION_ERROR)` (often used for semantic validation errors)
    *   `InternalServerError (statusCode: 500, defaultCode: ErrorCodes.INTERNAL_SERVER_ERROR, isOperational: false)`
*   Each constructor should call `super` with the appropriate `statusCode` and `defaultCode`. They can accept an optional `message` to override the default, an optional specific `code`, and optional `context`.

Example:
typescript
import { CustomBaseError } from './base.error';
import { ErrorCodes } from './error.codes'; // Assume ErrorCodes.BAD_REQUEST etc. are defined

export class BadRequestError extends CustomBaseError {
  constructor(message: string = 'Bad Request', code: string | number = ErrorCodes.BAD_REQUEST, context?: Record<string, any>) {
    super(message, 400, code, true, context);
  }
}

export class UnauthorizedError extends CustomBaseError {
  constructor(message: string = 'Unauthorized', code: string | number = ErrorCodes.UNAUTHENTICATED, context?: Record<string, any>) {
    super(message, 401, code, true, context);
  }
}

// ... other HTTP error classes (NotFoundError, ForbiddenError, etc.)

export class NotFoundError extends CustomBaseError {
  constructor(message: string = 'Resource Not Found', code: string | number = ErrorCodes.RESOURCE_NOT_FOUND, context?: Record<string, any>) {
    super(message, 404, code, true, context);
  }
}

export class ForbiddenError extends CustomBaseError {
    constructor(message: string = 'Forbidden', code: string | number = ErrorCodes.PERMISSION_DENIED, context?: Record<string, any>) {
        super(message, 403, code, true, context);
    }
}

export class ConflictError extends CustomBaseError {
    constructor(message: string = 'Resource Conflict', code: string | number = ErrorCodes.RESOURCE_CONFLICT, context?: Record<string, any>) {
        super(message, 409, code, true, context);
    }
}

export class UnprocessableEntityError extends CustomBaseError {
    constructor(message: string = 'Unprocessable Entity', code: string | number = ErrorCodes.VALIDATION_ERROR, context?: Record<string, any> | any[]) {
        super(message, 422, code, true, Array.isArray(context) ? { details: context } : context);
    }
}


export class InternalServerError extends CustomBaseError {
  constructor(message: string = 'Internal Server Error', code: string | number = ErrorCodes.INTERNAL_SERVER_ERROR, context?: Record<string, any>) {
    // InternalServerErrors are often not operational from the client's perspective
    super(message, 500, code, false, context); 
  }
}


### 4.7. `packages/errors/src/error.codes.ts`
typescript
export enum ErrorCodes {
  // General HTTP
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR', // Generic validation
  INVALID_INPUT_FORMAT = 'INVALID_INPUT_FORMAT',

  // Domain Specific (Examples)
  CAMPAIGN_BUDGET_EXCEEDED = 'CAMPAIGN_BUDGET_EXCEEDED',
  AD_NETWORK_API_ERROR = 'AD_NETWORK_API_ERROR',
  PRODUCT_CATALOG_SYNC_FAILED = 'PRODUCT_CATALOG_SYNC_FAILED',

  // Configuration
  CONFIG_VALUE_MISSING = 'CONFIG_VALUE_MISSING',
  
  // Add more as needed
}


### 4.8. `packages/errors/src/error-response.dto.ts`
typescript
export interface IErrorResponse {
  readonly statusCode: number;
  readonly message: string;
  readonly code?: string | number; // Application-specific error code
  readonly timestamp: string; // ISO 8601
  readonly path?: string; // Request path
  readonly details?: Record<string, any> | any[]; // For validation errors or more context
  readonly correlationId?: string;
}


## 5. Package: `@admanager/types`

Contains shared DTOs, enums, interfaces, event schemas, and constants.

### 5.1. `packages/types/package.json`
*   `"name": "@admanager/types"`
*   `"version": "0.1.0"`
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:**
    *   `class-validator` (if DTOs here directly use validation decorators)
    *   `class-transformer` (if DTOs here use transformation decorators)
    *   `uuid` (for types related to UUIDs if not just `string`)
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"` (if there are testable type guards or simple logic)

### 5.2. `packages/types/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`

### 5.3. `packages/types/tsconfig.build.json`
*   Extends `./tsconfig.json`.

### 5.4. `packages/types/src/index.ts` (Barrel File)
*   Exports all from `dtos/index.ts`, `enums/index.ts`, `interfaces/index.ts`, `events/index.ts`, `constants/index.ts`.

### 5.5. DTOs (`packages/types/src/dtos/`)

#### 5.5.1. `packages/types/src/dtos/index.ts` (Barrel File)
*   Exports: `PaginationRequestDto`, `PaginatedResponseDto`, `UserDto`, `UserProfileDto` (if different), `CampaignDto`, `AdSetDto`, `AdDto`, `ApiResponseDto`, etc.

#### 5.5.2. `packages/types/src/dtos/pagination.dto.ts`
typescript
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Example max limit
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export interface IPaginatedMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  readonly items: T[];
  readonly meta: IPaginatedMeta;

  constructor(items: T[], totalItems: number, page: number, limit: number) {
    this.items = items;
    this.meta = {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
}


#### 5.5.3. `packages/types/src/dtos/user.dto.ts`
typescript
import { IsEmail, IsNotEmpty, IsString, IsUUID, IsArray, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum'; // Assuming UserRole is in this package

export class UserDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
  
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  // Add other relevant fields like merchantId, isActive, etc.
  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}

// Potentially a UserProfileDto if it differs significantly or for specific use cases
export class UserProfileDto extends UserDto {
  // Additional profile-specific fields
}


#### 5.5.4. `packages/types/src/dtos/campaign.dto.ts`
typescript
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, IsNumber, Min, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus } from '../enums/campaign-status.enum'; // Assuming enum is here
// Define other enums like AdNetwork, BudgetType if they are shared

export enum AdNetwork {
  GOOGLE = 'GOOGLE',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  SNAPCHAT = 'SNAPCHAT',
}

export enum BudgetType {
  DAILY = 'DAILY',
  LIFETIME = 'LIFETIME',
}

export class CampaignDto {
  @IsUUID()
  @IsOptional() // Optional on create, present on read
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
  
  @IsOptional()
  @IsArray()
  @IsEnum(AdNetwork, { each: true })
  targetAdNetworks?: AdNetwork[];

  // Add other common campaign fields
}

export class AdSetDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  campaignId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @IsNumber()
  @Min(0)
  budgetAmount: number;
  
  // Add other common AdSet fields like targeting criteria, bidding strategy
}

export class AdCreativeDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEnum(AdNetwork) // Or specific network creative types
    type: string; // e.g., 'IMAGE', 'VIDEO', 'TEXT'

    @IsString()
    @IsNotEmpty()
    contentUrlOrText: string; // Could be URL to asset or ad copy

    // Add other common creative fields
}


export class AdDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsNotEmpty()
  adSetId: string;
  
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsUUID()
  @IsNotEmpty()
  adCreativeId: string;

  @IsOptional()
  @IsString()
  destinationUrl?: string;

  @IsEnum(CampaignStatus) // Or a more specific AdStatus enum
  status: CampaignStatus;
  
  // Add other common Ad fields
}


#### 5.5.5. `packages/types/src/dtos/generic-response.dto.ts`
typescript
export class ApiResponseDto<T> {
  public readonly success: boolean;
  public readonly message?: string;
  public readonly data?: T;
  public readonly correlationId?: string;


  constructor(success: boolean, data?: T, message?: string, correlationId?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.correlationId = correlationId;
  }

  static success<T>(data: T, message?: string, correlationId?: string): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, correlationId);
  }

  static error<T = null>(message: string, correlationId?: string, data?: T): ApiResponseDto<T | null > {
    return new ApiResponseDto(false, data ?? null, message, correlationId);
  }
}


### 5.6. Enums (`packages/types/src/enums/`)

#### 5.6.1. `packages/types/src/enums/index.ts` (Barrel File)
*   Exports: `CampaignStatus`, `UserRole`, `AdNetwork`, `BudgetType` (from campaign.dto.ts or move to separate file), etc.

#### 5.6.2. `packages/types/src/enums/campaign-status.enum.ts`
typescript
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
}


#### 5.6.3. `packages/types/src/enums/user-role.enum.ts`
typescript
export enum UserRole {
  MERCHANT_ADMIN = 'MERCHANT_ADMIN',
  CAMPAIGN_MANAGER = 'CAMPAIGN_MANAGER',
  PLATFORM_ADMINISTRATOR = 'PLATFORM_ADMINISTRATOR',
  AFFILIATE = 'AFFILIATE', // If affiliate portal users are managed
  // Add other roles as defined by REQ-IAM-001
}

**(Note: Other enums like `AdNetwork`, `BudgetType` are defined in `campaign.dto.ts` for collocation but can be moved to separate files here if preferred.)**

### 5.7. Interfaces (`packages/types/src/interfaces/`)

#### 5.7.1. `packages/types/src/interfaces/index.ts` (Barrel File)
*   Exports: `IIdentifiable`, `ITimestamped`, etc.

#### 5.7.2. `packages/types/src/interfaces/common.interfaces.ts`
typescript
export interface IIdentifiable<TID = string> { // Allow string or number for ID
  readonly id: TID;
}

export interface ITimestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ISoftDeletable {
  readonly deletedAt?: Date | null;
}


### 5.8. Event Schemas (`packages/types/src/events/`)

#### 5.8.1. `packages/types/src/events/index.ts` (Barrel File)
*   Exports: `IBaseEvent`, `CampaignCreatedEventPayload`, `CampaignCreatedEvent`, `ProductUpdatedEventPayload`, `ProductUpdatedEvent` (example), etc.

#### 5.8.2. `packages/types/src/events/event.schema.base.ts`
typescript
import { v4 as uuidv4 } from 'uuid';

export interface IBaseEventPayload {
    // Base payload can be empty or have common fields
}

export interface IBaseEvent<P extends IBaseEventPayload = IBaseEventPayload> {
  readonly eventId: string; // UUID
  readonly eventType: string; // e.g., 'CAMPAIGN_CREATED', 'USER_REGISTERED'
  readonly eventVersion: string; // e.g., '1.0', '1.1'
  readonly timestamp: string; // ISO 8601 format
  readonly sourceService: string; // Name of the microservice that published the event
  readonly correlationId?: string; // For tracing requests across services
  readonly userId?: string; // User who initiated the action, if applicable
  readonly merchantId?: string; // Merchant context, if applicable
  readonly payload: P;
}

// Optional: A base class to help create events
export abstract class BaseEvent<P extends IBaseEventPayload> implements IBaseEvent<P> {
    readonly eventId: string;
    abstract readonly eventType: string; // To be defined by concrete classes
    readonly eventVersion: string;
    readonly timestamp: string;
    readonly sourceService: string;
    readonly correlationId?: string;
    readonly userId?: string;
    readonly merchantId?: string;
    readonly payload: P;

    constructor(
        sourceService: string,
        payload: P,
        options?: {
            eventVersion?: string;
            correlationId?: string;
            userId?: string;
            merchantId?: string;
        }
    ) {
        this.eventId = uuidv4();
        this.eventVersion = options?.eventVersion || '1.0';
        this.timestamp = new Date().toISOString();
        this.sourceService = sourceService;
        this.payload = payload;
        this.correlationId = options?.correlationId;
        this.userId = options?.userId;
        this.merchantId = options?.merchantId;
    }
}


#### 5.8.3. `packages/types/src/events/campaign-events.ts` (Example for specific events)
typescript
import { IBaseEvent, IBaseEventPayload, BaseEvent } from './event.schema.base';
import { CampaignDto } from '../dtos/campaign.dto'; // Assuming CampaignDto is appropriate

// --- Campaign Created Event ---
export const CAMPAIGN_CREATED_EVENT_TYPE = 'AdManager.Campaign.Created';

export interface CampaignCreatedEventPayload extends IBaseEventPayload {
  campaign: CampaignDto; // Or just essential fields like campaignId, merchantId, name
}

export class CampaignCreatedEvent extends BaseEvent<CampaignCreatedEventPayload> {
  public readonly eventType = CAMPAIGN_CREATED_EVENT_TYPE;

  constructor(
    sourceService: string,
    payload: CampaignCreatedEventPayload,
    options?: ConstructorParameters<typeof BaseEvent>[2]
  ) {
    super(sourceService, payload, options);
  }
}


// --- Campaign Status Updated Event ---
export const CAMPAIGN_STATUS_UPDATED_EVENT_TYPE = 'AdManager.Campaign.StatusUpdated';

export interface CampaignStatusUpdatedEventPayload extends IBaseEventPayload {
  campaignId: string;
  merchantId: string;
  oldStatus: string; // Use CampaignStatus enum
  newStatus: string; // Use CampaignStatus enum
  updatedBy?: string; // userId
}

export class CampaignStatusUpdatedEvent extends BaseEvent<CampaignStatusUpdatedEventPayload> {
  public readonly eventType = CAMPAIGN_STATUS_UPDATED_EVENT_TYPE;
    constructor(
    sourceService: string,
    payload: CampaignStatusUpdatedEventPayload,
    options?: ConstructorParameters<typeof BaseEvent>[2]
  ) {
    super(sourceService, payload, options);
  }
}

// Add other campaign-related events (e.g., CampaignUpdatedEvent, CampaignDeletedEvent)


### 5.9. Constants (`packages/types/src/constants/`)

#### 5.9.1. `packages/types/src/constants/index.ts` (Barrel File)
*   Exports: `EventTopics`, `QueueNames` (if defined), etc.

#### 5.9.2. `packages/types/src/constants/event-topics.constants.ts`
typescript
export const EventTopics = {
  CAMPAIGN_EVENTS: 'admanager-campaign-events-topic', // For general campaign lifecycle events
  PRODUCT_CATALOG_EVENTS: 'admanager-product-catalog-events-topic',
  USER_EVENTS: 'admanager-user-events-topic',
  BILLING_EVENTS: 'admanager-billing-events-topic',
  // Add more topics as needed
} as const; // 'as const' for stricter typing

export type EventTopic = typeof EventTopics[keyof typeof EventTopics];


#### 5.9.3. `packages/types/src/constants/queue-names.constants.ts`
typescript
export const QueueNames = {
  AUDIT_LOG_QUEUE: 'admanager-audit-log-queue',
  PERFORMANCE_DATA_INGESTION_QUEUE: 'admanager-performance-data-ingestion-queue',
  NOTIFICATION_DISPATCH_QUEUE: 'admanager-notification-dispatch-queue',
  // Add more queue names as needed
} as const;

export type QueueName = typeof QueueNames[keyof typeof QueueNames];


## 6. Package: `@admanager/validation`

Contains shared validation utilities, custom `class-validator` decorators.

### 6.1. `packages/validation/package.json`
*   `"name": "@admanager/validation"`
*   `"version": "0.1.0"`
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:**
    *   `class-validator`
    *   `class-transformer`
*   **Peer Dependencies:**
    *   `@admanager/types` (if decorators validate against enums/types from there)
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"`

### 6.2. `packages/validation/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`
*   `"references": [{"path": "../types"}]` (if needed)

### 6.3. `packages/validation/tsconfig.build.json`
*   Extends `./tsconfig.json`.

### 6.4. `packages/validation/src/index.ts` (Barrel File)
*   Exports: `IsValidEnum`, `validateObjectPayload` (renamed from `validateObject` for clarity), any other custom decorators or utils.

### 6.5. `packages/validation/src/decorators/is-valid-enum.decorator.ts`
typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidEnumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [enumObject] = args.constraints;
    if (typeof value === 'undefined' || value === null) {
      return true; // Let @IsOptional or @IsNotEmpty handle this
    }
    return Object.values(enumObject).includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [enumObject] = args.constraints;
    const enumValues = Object.values(enumObject).join(', ');
    return `${args.property} must be one of the following values: ${enumValues}`;
  }
}

export function IsValidEnum(enumObject: object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObject],
      validator: IsValidEnumConstraint,
    });
  };
}


### 6.6. `packages/validation/src/utils/validation.utils.ts`
typescript
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';

/**
 * Validates a plain object against a DTO class.
 * Throws an array of ValidationError if validation fails.
 * @param dtoClass The DTO class to validate against.
 * @param plainObject The plain object to validate.
 * @param validatorOptions Optional class-validator options.
 * @returns The validated and transformed DTO instance.
 */
export async function validateObjectPayload<T extends object>(
  dtoClass: ClassConstructor<T>,
  plainObject: object,
  validatorOptions?: ValidatorOptions,
): Promise<T> {
  const instance = plainToInstance(dtoClass, plainObject);
  const errors = await validate(instance, { 
    whitelist: true, // Remove properties not in DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    ...validatorOptions 
  });

  if (errors.length > 0) {
    // Consider throwing a specific custom error (e.g., from @admanager/errors)
    // For now, just re-throwing the array to be handled by NestJS exception filter or consumer
    throw errors; 
  }
  return instance;
}


## 7. Package: `@admanager/config-client`

Provides a client for accessing application configuration.

### 7.1. `packages/config-client/package.json`
*   `"name": "@admanager/config-client"`
*   `"version": "0.1.0"`
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:**
    *   `@aws-sdk/client-ssm` (if integrating with AWS Systems Manager Parameter Store)
    *   `@aws-sdk/client-secrets-manager` (if integrating with AWS Secrets Manager)
    *   `dotenv` (optional, for loading .env files in local development)
*   **Peer Dependencies:**
    *   `@admanager/types` (if `AppConfig` or other types are referenced)
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"`

### 7.2. `packages/config-client/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`
*   `"references": [{"path": "../types"}]` (if needed)

### 7.3. `packages/config-client/tsconfig.build.json`
*   Extends `./tsconfig.json`.

### 7.4. `packages/config-client/src/index.ts` (Barrel File)
*   Exports: `IConfigClient`, `ConfigClientService`, `AppConfig` (from `config.types.ts`), `ConfigSources`, `ConfigClientOptions`.

### 7.5. `packages/config-client/src/config.client.interface.ts`
typescript
export interface IConfigClient {
  get<T = any>(key: string): T | undefined;
  getOrThrow<T = any>(key: string, defaultValue?: T): T;
  isProduction(): boolean;
  isDevelopment(): boolean;
  isTest(): boolean;
  // Add other useful methods like getInt, getBool, etc.
}


### 7.6. `packages/config-client/src/config.types.ts`
typescript
// This should define the overall structure of configuration expected by applications
// It can be composed of smaller, more specific config interfaces.
import { LogLevel } from '@admanager/logger'; // Example dependency

export interface DatabaseConfig {
  url: string;
  // other db params
}

export interface AwsConfig {
  region: string;
  accessKeyId?: string; // Optional if using IAM roles
  secretAccessKey?: string; // Optional if using IAM roles
}

export interface SqsConfig {
    auditLogQueueUrl: string;
    // other queues
}

export interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  SERVICE_NAME: string;
  
  LOG_LEVEL: LogLevel;

  DATABASE_CONFIG: DatabaseConfig;
  AWS_CONFIG: AwsConfig;
  SQS_CONFIG?: SqsConfig; // Optional depending on service

  // Example for a specific service's needs
  AD_NETWORK_API_KEY_GOOGLE?: string;
  AD_NETWORK_TIMEOUT_MS?: number;

  // Configuration for AWS Parameter Store / Secrets Manager paths
  AWS_SSM_PATH_PREFIX?: string;
  AWS_SECRETS_MANAGER_PREFIX?: string;
}

export enum ConfigSources {
    ENVIRONMENT = 'ENVIRONMENT',
    AWS_SSM = 'AWS_SSM',
    AWS_SECRETS_MANAGER = 'AWS_SECRETS_MANAGER',
    // FILE = 'FILE' // For local .env files perhaps
}

export interface ConfigClientOptions {
    sourcesPriority?: ConfigSources[]; // Order in which to look for config
    ssmPathPrefix?: string;
    secretsManagerPrefix?: string;
    // schema?: Joi.ObjectSchema<AppConfig>; // Optional: Joi schema for validation
}


### 7.7. `packages/config-client/src/config.client.service.ts`
*   **Implementation Details:**
    *   Implements `IConfigClient`.
    *   Constructor accepts `ConfigClientOptions`.
    *   On instantiation, it should:
        1.  Load configuration from environment variables (highest priority by default).
        2.  (Optional, based on options) Attempt to load from AWS Systems Manager Parameter Store.
        3.  (Optional, based on options) Attempt to load from AWS Secrets Manager.
        4.  Cache the loaded configuration.
        5.  (Optional) Validate the loaded configuration against a predefined schema (e.g., using Joi or by checking against `AppConfig` types).
    *   `get<T>` retrieves a value, performing type coercion if possible/sensible (e.g., for numbers, booleans).
    *   `getOrThrow<T>` throws a specific error (e.g., `ConfigValueError` from `@admanager/errors`) if the key is not found and no defaultValue is provided.
    *   Helper methods like `isProduction()`, `isDevelopment()` based on `NODE_ENV`.

typescript
// Simplified example focusing on environment variables. AWS integration is more complex.
import { IConfigClient } from './config.client.interface';
import { AppConfig, ConfigClientOptions, ConfigSources } from './config.types'; // Assuming AppConfig is defined
import { InternalServerError } from '@admanager/errors'; // Or a specific ConfigError

export class ConfigClientService implements IConfigClient {
  private readonly config: Partial<AppConfig> = {}; // Store all loaded config

  constructor(options?: ConfigClientOptions) {
    // For simplicity, this example only loads from process.env
    // A real implementation would handle options.sourcesPriority, AWS SSM, Secrets Manager
    this.loadFromEnv();
    // Potentially validate this.config against a schema or AppConfig definition
  }

  private loadFromEnv(): void {
    // Example: Manually map relevant env vars or use a library like 'dotenv' and 'envalid'
    this.config.NODE_ENV = (process.env.NODE_ENV as AppConfig['NODE_ENV']) || 'development';
    this.config.PORT = parseInt(process.env.PORT || '3000', 10);
    this.config.SERVICE_NAME = process.env.SERVICE_NAME || 'unknown-service';
    this.config.LOG_LEVEL = (process.env.LOG_LEVEL as AppConfig['LOG_LEVEL']) || 'info' as any;
    // ... load other known config variables
    // This should ideally be more structured, perhaps looping through keys of AppConfig
  }

  // In a real scenario, you'd fetch from AWS SSM/Secrets Manager here based on options
  // private async loadFromAwsSsm(prefix: string): Promise<void> { /* ... */ }
  // private async loadFromAwsSecretsManager(prefix: string): Promise<void> { /* ... */ }


  get<T = any>(key: keyof AppConfig | string): T | undefined {
    return this.config[key as keyof AppConfig] as T | undefined;
  }

  getOrThrow<T = any>(key: keyof AppConfig | string, defaultValue?: T): T {
    const value = this.get<T>(key);
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new InternalServerError(`Configuration error: Missing required key "${String(key)}"`, 'CONFIG_VALUE_MISSING');
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}


## 8. Package: `@admanager/audit-client`

Provides a client for sending audit log entries.

### 8.1. `packages/audit-client/package.json`
*   `"name": "@admanager/audit-client"`
*   `"version": "0.1.0"`
*   `"main": "dist/index.js"`
*   `"types": "dist/index.d.ts"`
*   **Dependencies:**
    *   `@aws-sdk/client-sqs` (if sending to SQS)
    *   `uuid`
*   **Peer Dependencies:**
    *   `@admanager/types` (for `AuditLogEntryDto`, `AuditAction` if they are defined there initially or if this package uses them)
    *   `@admanager/logger` (for internal logging of the audit client itself)
*   **Scripts:**
    *   `"build": "rimraf dist && tsc -p tsconfig.build.json"`
    *   `"test": "jest"`

### 8.2. `packages/audit-client/tsconfig.json`
*   Extends `../../../tsconfig.base.json`.
*   `"compilerOptions": { "outDir": "./dist", "rootDir": "./src" }`
*   `"include": ["src/**/*"]`
*   `"exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]`
*   `"references": [{"path": "../types"}, {"path": "../logger"}]` (if needed)

### 8.3. `packages/audit-client/tsconfig.build.json`
*   Extends `./tsconfig.json`.

### 8.4. `packages/audit-client/src/index.ts` (Barrel File)
*   Exports: `IAuditClient`, `AuditClientService`, `AuditLogEntryDto`, `AuditAction`.

### 8.5. `packages/audit-client/src/audit.client.interface.ts`
typescript
import { AuditLogEntryDto } from './dtos/audit-log.dto';

export interface IAuditClient {
  log(entry: Omit<AuditLogEntryDto, 'timestamp' | 'id'>): Promise<void>; // id and timestamp can be auto-generated
}


### 8.6. `packages/audit-client/src/dtos/audit-log.dto.ts`
typescript
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AuditAction, AuditStatus } from '../enums/audit-action.enum'; // Define AuditStatus here too

export class AuditLogEntryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string; // Auto-generated UUID

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  timestamp: Date; // Auto-generated timestamp

  @IsOptional()
  @IsString()
  userId?: string; // ID of the user performing the action

  @IsNotEmpty()
  @IsString() // Can be an enum value or a custom string
  action: AuditAction | string;

  @IsOptional()
  @IsString()
  actorType?: string; // e.g., 'USER', 'SYSTEM'

  @IsOptional()
  @IsString()
  resourceType?: string; // e.g., 'CAMPAIGN', 'USER_ROLE'

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsNotEmpty()
  @IsEnum(AuditStatus)
  status: AuditStatus;

  @IsOptional()
  @IsString()
  sourceIp?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  serviceName?: string; // Name of the service emitting the audit log

  @IsOptional()
  @IsObject()
  details?: Record<string, any>; // Any additional contextual information

  @IsOptional()
  @IsString()
  correlationId?: string;
}


### 8.7. `packages/audit-client/src/enums/audit-action.enum.ts`
typescript
export enum AuditAction {
  // User Management
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_PASSWORD_RESET_REQUEST = 'USER_PASSWORD_RESET_REQUEST',
  USER_PASSWORD_CHANGED = 'USER_PASSWORD_CHANGED',
  USER_ROLE_ASSIGNED = 'USER_ROLE_ASSIGNED',
  USER_ROLE_REMOVED = 'USER_ROLE_REMOVED',
  USER_CREATED = 'USER_CREATED', // Admin creating user
  USER_UPDATED = 'USER_UPDATED', // Admin updating user
  USER_DELETED = 'USER_DELETED', // Admin deleting user
  
  // Campaign Management
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',
  CAMPAIGN_UPDATED = 'CAMPAIGN_UPDATED',
  CAMPAIGN_DELETED = 'CAMPAIGN_DELETED',
  CAMPAIGN_STATUS_CHANGED = 'CAMPAIGN_STATUS_CHANGED',
  AD_SET_CREATED = 'AD_SET_CREATED',
  // ... other campaign actions

  // Product Catalog
  PRODUCT_CATALOG_CREATED = 'PRODUCT_CATALOG_CREATED',
  PRODUCT_CATALOG_UPDATED = 'PRODUCT_CATALOG_UPDATED',
  PRODUCT_CATALOG_DELETED = 'PRODUCT_CATALOG_DELETED',
  PRODUCT_CATALOG_SYNC_STARTED = 'PRODUCT_CATALOG_SYNC_STARTED',
  PRODUCT_CATALOG_SYNC_COMPLETED = 'PRODUCT_CATALOG_SYNC_COMPLETED',
  PRODUCT_CATALOG_SYNC_FAILED = 'PRODUCT_CATALOG_SYNC_FAILED',

  // Security
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_DELETED = 'API_KEY_DELETED',
  SECURITY_POLICY_UPDATED = 'SECURITY_POLICY_UPDATED',
  PERMISSION_DENIED_ACCESS_ATTEMPT = 'PERMISSION_DENIED_ACCESS_ATTEMPT',

  // System & Configuration
  SYSTEM_CONFIG_UPDATED = 'SYSTEM_CONFIG_UPDATED',
  FEATURE_FLAG_TOGGLED = 'FEATURE_FLAG_TOGGLED',
  MAINTENANCE_MODE_ACTIVATED = 'MAINTENANCE_MODE_ACTIVATED',
  MAINTENANCE_MODE_DEACTIVATED = 'MAINTENANCE_MODE_DEACTIVATED',
  
  // Billing & Subscription
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILURE = 'PAYMENT_FAILURE',

  // Data Governance
  DSR_REQUEST_RECEIVED = 'DSR_REQUEST_RECEIVED',
  DSR_REQUEST_PROCESSED = 'DSR_REQUEST_PROCESSED', // e.g., data access, erasure
  CONSENT_GIVEN = 'CONSENT_GIVEN',
  CONSENT_WITHDRAWN = 'CONSENT_WITHDRAWN',
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_DELETED_BY_RETENTION = 'DATA_DELETED_BY_RETENTION',

  // Generic
  RESOURCE_CREATED = 'RESOURCE_CREATED',
  RESOURCE_UPDATED = 'RESOURCE_UPDATED',
  RESOURCE_DELETED = 'RESOURCE_DELETED',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING', // For actions that might be async
}


### 8.8. `packages/audit-client/src/audit.client.service.ts`
*   **Implementation Details:**
    *   Implements `IAuditClient`.
    *   Constructor accepts `AuditClientOptions` (e.g., SQS queue URL, AWS region, potentially a `serviceName` to inject into logs).
    *   Uses `SQSClient` and `SendMessageCommand` from `@aws-sdk/client-sqs` to send audit messages.
    *   The `log` method:
        1.  Creates a full `AuditLogEntryDto` instance, generating `id` (using `uuidv4()`) and `timestamp`.
        2.  Serializes the DTO to a JSON string.
        3.  Sends the JSON string as the `MessageBody` to the configured SQS queue.
        4.  Includes `MessageGroupId` if it's a FIFO queue (e.g., based on `merchantId` or `userId` for ordering).
        5.  Handles potential errors during SQS send (e.g., logging them using `@admanager/logger` but not letting it break the main flow, perhaps with a retry or dead-letter strategy for audit messages themselves if critical).

typescript
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { v4 as uuidv4 } from 'uuid';
import { IAuditClient } from './audit.client.interface';
import { AuditLogEntryDto } from './dtos/audit-log.dto';
import { ILogger, LoggerService } from '@admanager/logger'; // Assuming logger is available

export interface AuditClientOptions {
  sqsQueueUrl: string;
  awsRegion: string;
  serviceName: string; // The name of the service using this audit client
  logger?: ILogger; // Optional logger instance
}

export class AuditClientService implements IAuditClient {
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;
  private readonly serviceName: string;
  private readonly logger: ILogger;

  constructor(options: AuditClientOptions) {
    this.queueUrl = options.sqsQueueUrl;
    this.serviceName = options.serviceName;
    this.sqsClient = new SQSClient({ region: options.awsRegion });
    this.logger = options.logger || new LoggerService({ serviceName: '@admanager/audit-client-internal' }); // Default logger
  }

  async log(entryData: Omit<AuditLogEntryDto, 'timestamp' | 'id' | 'serviceName'>): Promise<void> {
    const auditEntry: AuditLogEntryDto = {
      id: uuidv4(),
      timestamp: new Date(),
      serviceName: this.serviceName, // Service emitting the log
      ...entryData,
    };

    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(auditEntry),
      // Consider MessageGroupId if using a FIFO queue, e.g., auditEntry.userId || auditEntry.resourceId || 'default'
      // MessageDeduplicationId also if FIFO and content-based deduplication is desired.
    };

    try {
      await this.sqsClient.send(new SendMessageCommand(params));
      this.logger.debug('Audit log entry sent successfully', { eventId: auditEntry.id, action: auditEntry.action });
    } catch (error) {
      this.logger.error('Failed to send audit log entry to SQS', error, { auditEntry });
      // Depending on criticality, you might implement a fallback or retry,
      // but be careful not to block the primary operation.
      // For now, we log the error.
    }
  }
}


## 9. Testing Strategy
*   Each package MUST have comprehensive unit tests using Jest.
*   Focus on testing public interfaces, utility functions, DTO validation logic (if any within DTOs), and service logic.
*   Mock dependencies (like SQS client in `AuditClientService` or Pino in `LoggerService`) for focused unit tests.
*   Aim for high test coverage.

## 10. Build and Publishing
*   Each package (`@admanager/logger`, `@admanager/errors`, etc.) will be built into its `dist` folder.
*   The root `package.json` build script will orchestrate building all packages.
*   These packages will be published to a private NPM registry (e.g., AWS CodeArtifact, GitHub Packages, or a self-hosted registry).
*   Versioning should follow Semantic Versioning (SemVer). Lerna or similar tools can help manage versioning and publishing in a monorepo.

This SDS provides a foundation for developing the shared libraries. Specific DTOs, enums, event schemas, and constants within `@admanager/types` will expand as the domain model of the Ad Manager platform becomes more detailed and other services define their contracts.