import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * @interface AuthenticatedUserWithRoles
 * Defines the expected structure of the user object attached to the request,
 * specifically requiring a `roles` array.
 */
interface AuthenticatedUserWithRoles {
  roles: string[];
  // Other user properties like id, merchantId, affiliateId, etc.
  [key: string]: any;
}

/**
 * @class RolesGuard
 * An authorization guard that checks if the current user possesses the
 * necessary roles to access a specific route.
 * It retrieves the roles required for the route from metadata set by the `@Roles()` decorator
 * and compares them against the roles assigned to the authenticated user.
 *
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Constructs the RolesGuard.
   * @param {Reflector} reflector - The Reflector instance for accessing route metadata.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user is authorized to activate the route.
   *
   * @param {ExecutionContext} context - The current execution context.
   * @returns {boolean} `true` if the user has one of the required roles, `false` otherwise.
   *                    Returns `true` if no roles are defined for the route.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified for the endpoint, access is granted.
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUserWithRoles;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      // If user is not authenticated or roles are not properly set, deny access.
      return false;
    }

    // Check if the user has at least one of the required roles.
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}