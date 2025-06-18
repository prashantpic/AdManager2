import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from './config/config.module'; // Renamed to avoid conflict if NestJS's own ConfigModule is used directly elsewhere
import { DataGovernanceApiModule } from './modules/data-governance/api/v1/data-governance-api.module';

@Module({
  imports: [NestConfigModule, DataGovernanceApiModule],
})
export class AppModule {}