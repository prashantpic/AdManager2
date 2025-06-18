import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformAdminModule } from './modules/platform-admin/platform-admin.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      load: [configuration], // Loads custom configuration
    }),
    PlatformAdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}