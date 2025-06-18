import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from '../interfaces/user.interface';
import { ROLES_KEY } from '../decorators/roles.decorator'; // Assuming ROLES_KEY is exported from roles.decorator.ts

// Define an extended request interface to include the user property
// This user property is typically populated by Passport after successful authentication (e.g., by JwtAuthGuard).
interface ExtendedRequest extends Request {
  user?: IUser; // User can be undefined if JwtAuthGuard hasn't run or failed silently (though it usually throws)
}

/**
 * A guard that checks if the current user has any of the specified roles.
 * It retrieves roles metadata (set by the @Roles() decorator) from the route handler
 * and compares it against the roles of the authenticated user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles required to access the route/handler.
    // This looks for metadata set by the @Roles() decorator on the handler and then on the class.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are defined for the route, access is allowed by default (or denied if policy is strict).
    // For this implementation, if no @Roles decorator is used, the guard effectively passes.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user object from the request.
    // This assumes that an authentication guard (like JwtAuthGuard) has already run
    // and populated `request.user` with the authenticated user's details.
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const user = request.user;

    // If there's no user object on the request, or the user has no roles, access is denied.
    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException('You do not have the necessary roles to access this resource.');
    }

    // Check if the user's roles array includes at least one of the required roles.
    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));

    if (hasRequiredRole) {
      return true; // User has a required role, grant access.
    }

    // User does not have any of the required roles.
    throw new ForbiddenException('You do not have the necessary roles to access this resource.');
  }
}