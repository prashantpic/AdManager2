import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config'; // Renamed to avoid conflict if user names their custom config module 'ConfigModule'
import { AnalyticsReportingV1Module } from './modules/analytics-reporting/api/v1/api-v1.module';
import { AppConfigModule } from './config/config.module'; // Assuming the custom config module is named AppConfigModule or is defined in config.module.ts

@Module({
  imports: [
    AppConfigModule, // SDS specifies ConfigModule from ./config/config.module
    AnalyticsReportingV1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}