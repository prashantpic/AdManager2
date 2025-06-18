import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the application
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', // Load .env.test for tests, .env otherwise
      // Placeholder for loading custom config objects if needed
      // load: [() => ({ /* custom config objects if needed */ })],
      // Placeholder for validation logic using Joi or class-validator
      validate: (config: Record<string, any>) => {
        // Example validation (to be replaced with actual validation logic)
        // const requiredVars = ['ANALYTICS_API_PORT', 'JWT_SECRET'];
        // for (const key of requiredVars) {
        //   if (!config[key]) {
        //     throw new Error(`Missing environment variable: ${key}`);
        //   }
        // }
        // Add more specific validation using class-validator or Joi here
        return config;
      },
    }),
  ],
  exports: [NestConfigModule], // Export NestConfigModule if other modules need to import it directly
})
export class ConfigModule {}