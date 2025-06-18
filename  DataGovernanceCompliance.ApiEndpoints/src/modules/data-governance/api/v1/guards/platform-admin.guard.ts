import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.roles && Array.isArray(user.roles) && user.roles.includes('PlatformAdministrator')) {
      return true;
    }
    
    throw new ForbiddenException('Access denied. User must be a Platform Administrator.');
  }
}