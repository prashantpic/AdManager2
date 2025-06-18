export interface IConfigClient {
  get<T = any>(key: string): T | undefined;
  getOrThrow<T = any>(key: string, defaultValue?: T): T;
  isProduction(): boolean;
  isDevelopment(): boolean;
  isTest(): boolean;
  // Add other useful methods like getInt, getBool, etc.
}