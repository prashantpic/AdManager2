```typescript
import { Maybe } from '@common/types/maybe.type';

export interface IConfigService {
  /**
   * Gets a configuration value by key.
   * @param key The configuration key.
   * @returns The configuration value, or undefined if not found.
   */
  get<T = string>(key: string): Maybe<T>;
  
  /**
   * Gets a configuration value by key or throws an error if not found.
   * @param key The configuration key.
   * @param defaultValue Optional default value to return if key is not found (avoids throwing).
   * @returns The configuration value.
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
```