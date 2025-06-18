import { Module } from '@nestjs/common';
import { AudienceV1Controller } from './audience.v1.controller';
import { AudienceManagementCoreModule } from '../../audience-management-core.module';
// Import guards if they are local to this module or provided by a shared auth module
// import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'; // Assuming guards are in a shared auth module
// import { RolesGuard } from '../../../auth/guards/roles.guard'; // Assuming guards are in a shared auth module
// import { AuthModule } from '../../../auth/auth.module'; // Example if AuthModule provides guards

@Module({
  imports: [
    AudienceManagementCoreModule, 
    // AuthModule // Uncomment if JwtAuthGuard and RolesGuard are provided by a central AuthModule
  ],
  controllers: [AudienceV1Controller],
  // providers: [
  //   JwtAuthGuard, // Provide guards here if they are not globally available or part of an imported AuthModule
  //   RolesGuard,
  // ],
})
export class AudienceV1ApiModule {}