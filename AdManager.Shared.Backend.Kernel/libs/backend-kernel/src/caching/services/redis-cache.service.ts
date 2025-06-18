import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Correct import for CACHE_MANAGER token
import { Cache } from 'cache-manager'; // Correct import for Cache type
import { ICacheService } from '../interfaces/cache.service.interface';
import { Maybe } from '../../common/types/maybe.type';

@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<Maybe<T>> {
    // Ensure that null is also a valid Maybe type from cache
    const value = await this.cacheManager.get<T>(key);
    return value === undefined ? undefined : value; // cache-manager get returns undefined if not found
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    // The `ttl` option in NestJS CacheModule and cache-manager v5+ is in milliseconds.
    const ttlMilliseconds = ttlSeconds !== undefined ? ttlSeconds * 1000 : undefined;
    if (ttlMilliseconds !== undefined) {
      await this.cacheManager.set(key, value, ttlMilliseconds);
    } else {
      await this.cacheManager.set(key, value); // Use default TTL from store config
    }
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    // `reset` is the method to clear the entire cache for `cache-manager`
    if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset();
    } else {
        // Log a warning or throw an error if clear is not supported by the store
        // Using console.warn as per SDS example, but a logger would be better in a real app
        console.warn('Cache store does not support clear operation or `reset` is not available.');
        // Potentially throw new Error('Clear operation not supported by cache store');
    }
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cachedValue = await this.get<T>(key);
    if (cachedValue !== null && cachedValue !== undefined) {
      return cachedValue;
    }

    const result = await fn();
    // Ensure result is not null or undefined if you want to avoid caching such values,
    // or handle it according to specific requirements. Here, we cache any resolved value.
    if (result !== undefined) { // Optional: only cache non-undefined results
        await this.set(key, result, ttlSeconds);
    }
    return result;
  }
}