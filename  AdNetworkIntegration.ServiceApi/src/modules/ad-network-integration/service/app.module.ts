import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdNetworkIntegrationModule } from './ad-network-integration.module';
import adNetworkConfiguration from '../config/ad-network.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      load: [adNetworkConfiguration], // Loads custom configuration
      // Add validation schema if needed using Joi or class-validator
      // For example, using Joi:
      // validationSchema: Joi.object({ ... }) 
    }),
    AdNetworkIntegrationModule,
  ],
  providers: [Logger], // Provide Logger globally or per module as needed
})
export class AppModule {}