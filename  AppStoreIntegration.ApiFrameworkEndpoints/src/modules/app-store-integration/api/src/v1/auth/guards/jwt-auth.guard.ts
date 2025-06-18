import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * @class JwtAuthGuard
 * @description A NestJS guard that protects routes by verifying JWT access tokens.
 * It uses the 'jwt' strategy configured with Passport (JwtStrategy).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines if the current request can activate the route.
   * It first calls the superclass's canActivate to perform JWT validation.
   * If validation fails (e.g., no token, invalid token), it throws an UnauthorizedException.
   * @param context The execution context of the current request.
   * @returns A boolean or Promise<boolean> or Observable<boolean> indicating if the route can be activated.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  /**
   * Handles the result of the authentication attempt.
   * If an error occurs or no user is found, it throws an UnauthorizedException.
   * @param err An error object if authentication failed.
   * @param user The authenticated user object if successful.
   * @param info Additional information or error details from the strategy.
   * @param context The execution context.
   * @param status The HTTP status code.
   * @returns The authenticated user object.
   * @throws UnauthorizedException if authentication fails.
   */
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      // You can customize the error message or type based on 'info'
      const message = (info && info.message) ? info.message : 'Unauthorized';
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw err || new UnauthorizedException(message);
    }
    return user;
  }
}