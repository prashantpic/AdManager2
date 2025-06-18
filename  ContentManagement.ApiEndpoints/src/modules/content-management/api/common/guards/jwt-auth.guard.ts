import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * @file jwt-auth.guard.ts
 * @description NestJS guard for protecting routes using JWT authentication.
 * @Purpose Ensures that API endpoints are accessed only by authenticated users with valid JWTs.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines if the current request is authorized.
   * This method is called by NestJS before a route handler.
   * It relies on the 'jwt' strategy defined in `JwtStrategy`.
   * @param context The execution context of the current request.
   * @returns A boolean indicating if the request is authorized, or a Promise/Observable resolving to a boolean.
   * @throws UnauthorizedException if authentication fails.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed
    // For example, checking for specific conditions before calling super.canActivate()
    return super.canActivate(context);
  }

  /**
   * Handles the result of the authentication attempt.
   * This method is called by Passport after the strategy's `validate` method.
   * @param err An error object if authentication failed.
   * @param user The user object returned by the strategy's `validate` method if authentication succeeded.
   * @param info Additional information or error details from the strategy.
   * @param context The execution context.
   * @param status The HTTP status code.
   * @returns The user object if authentication is successful.
   * @throws UnauthorizedException if `err` is present or `user` is falsy.
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any {
    if (err || !user) {
      // Log the error or info for debugging if necessary
      // console.error('JWT Auth Error:', err, 'Info:', info?.message);
      throw err || new UnauthorizedException(info?.message || 'User is not authorized.');
    }
    return user; // This user object will be available in req.user
  }
}