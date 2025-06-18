import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants/product-catalog.constants';

/**
 * Custom roles-based authorization guard for Product Catalog API endpoints.
 * Checks if the authenticated user has the required roles to access a specific endpoint,
 * based on the @Roles decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles specified, access is allowed
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      // Deny access if user or roles are missing
      throw new ForbiddenException('Insufficient permissions: User roles not found.');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenException(`Insufficient permissions: Requires one of ${requiredRoles.join(', ')}.`);
    }

    return true;
  }
}