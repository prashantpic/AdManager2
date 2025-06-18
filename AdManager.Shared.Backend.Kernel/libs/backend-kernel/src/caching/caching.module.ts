import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
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
        const ttlInSeconds = configService.getNumber('REDIS_DEFAULT_TTL_SECONDS', 300); // Default TTL in seconds

        // For cache-manager-redis-store
        // cache-manager v5+ expects TTL in milliseconds.
        const redisStoreOptions: any = {
          socket: {
            host: host,
            port: port,
          },
          ttl: ttlInSeconds * 1000, // Convert seconds to milliseconds
          // Add other Redis options like password if needed from configService
          // e.g. password: configService.get('REDIS_PASSWORD')
        };
        
        // The way to instantiate redisStore might vary slightly based on its version.
        // For cache-manager-redis-store v2 or v3 (used with cache-manager v4), structure might be:
        // { store: redisStore, host: host, port: port, ttl: ttlInSeconds }
        // For cache-manager-redis-store compatible with cache-manager v5+, it's often a factory:
        // { store: await redisStore(redisStoreOptions) } or simply an options object.
        // The SDS implies passing options directly.
        // Assuming cache-manager-redis-store ^5.x.x which is usually compatible with cache-manager ^5.x.x
        // and @nestjs/cache-manager ^2.x.x (which uses cache-manager ^5.x.x)
        return {
          store: redisStore,
          // Options passed directly to the store when 'store' is a function/constructor
          // Check documentation for the specific version of cache-manager-redis-store
          host: host,
          port: port,
          ttl: ttlInSeconds * 1000,
        };
      },
      isGlobal: true, // Makes NestCacheModule's CACHE_MANAGER available globally
    }),
  ],
  providers: [
    {
      provide: ICacheService,
      useClass: RedisCacheService,
    },
  ],
  exports: [ICacheService],
})
export class CachingModule {}