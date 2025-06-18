```typescript
import { Maybe } from '@common/types/maybe.type';

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
  clear?(): Promise<void>;

  /**
   * Wraps a function call with caching. If the key exists in cache, return cached value.
   * Otherwise, execute the function, store its result in cache, and return the result.
   * @param key The cache key.
   * @param fn The function to execute to get the value if not cached.
   * @param ttlSeconds Optional TTL for the new cache entry.
   */
  wrap?<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}
```