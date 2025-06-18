import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Assumes ROLES_KEY is exported from roles.decorator.ts

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles specified, access granted
    }
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles || !Array.isArray(user.roles)) {
        return false; // User object or roles array is missing
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}