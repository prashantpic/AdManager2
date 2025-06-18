import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  environment: string;
  jwtSecret: string;
  apiPrefix: string;
  apiVersion: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKeyPleaseChange', // Note: Should be from a secure vault in production
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',
  }),
);