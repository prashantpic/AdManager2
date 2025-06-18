import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserAccessModule } from './modules/user-access/api/user-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Optional: load .env files
      // ignoreEnvFile: process.env.NODE_ENV === 'production', // Optional: ignore .env in production
    }),
    UserAccessModule,
    // Potentially other global modules like a HealthCheckModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}