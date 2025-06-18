import { Module } from '@nestjs/common';
import { AudienceManagementCoreModule } from './modules/audience-management/audience-management-core.module';
// import { ConfigModule } from '@nestjs/config'; // Example: if using @nestjs/config
// import { AuthModule } from './auth/auth.module'; // Example: if using a shared AuthModule for guards

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }), // Example: if using @nestjs/config
    // AuthModule, // Example: if using a shared AuthModule for guards
    AudienceManagementCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}