import { Module } from '@nestjs/common';
import { ConfigModule as NestCoreConfigModule } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    NestCoreConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available application-wide
      load: [appConfig], // Loads custom configuration
      envFilePath: ['.env'], // Specify .env file if used directly by @nestjs/config
    }),
  ],
})
export class ConfigModule {}