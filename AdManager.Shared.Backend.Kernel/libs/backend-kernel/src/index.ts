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
// export * from './errors/errors.module'; // ErrorsModule is typically part of CoreModule and provided globally

// DTOs
export * from './dtos/pagination/pagination-query.dto';
export * from './dtos/pagination/paged-response.dto';
// Add other shared DTOs here

// Validation
export * from './validation/decorators/is-custom-uuid.decorator';
// Add other custom decorators or validation utilities here
// export * from './validation/validation.module'; // ValidationModule is typically part of CoreModule

// Config
export * from './config/interfaces/config.service.interface';
export * from './config/services/aws-parameter-store-config.service'; // If concrete class is needed (Name revised from aws-appconfig.service)
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