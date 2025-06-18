import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user object is attached by a previous auth guard

    if (user && user.roles && Array.isArray(user.roles) && user.roles.includes('PlatformAdministrator')) {
      return true;
    }
    throw new ForbiddenException('Access denied. Platform Administrator role required.');
  }
}