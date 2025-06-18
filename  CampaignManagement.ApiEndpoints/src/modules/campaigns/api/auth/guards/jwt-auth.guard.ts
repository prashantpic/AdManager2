import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * A guard that protects routes by verifying a JWT token present in the request.
 * It leverages the 'jwt' strategy defined in JwtStrategy.
 * If the token is valid, the request is allowed to proceed, and `req.user` will be populated.
 * If the token is invalid or missing, an UnauthorizedException is thrown.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Determines if the current request is authorized based on JWT validation.
   * This method is part of the NestJS Guard interface.
   * @param context The execution context of the current request.
   * @returns A boolean, Promise<boolean>, or Observable<boolean> indicating if access is granted.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed before calling super.canActivate
    // For example, to handle specific error messages or bypass auth for certain conditions
    // based on the context.
    return super.canActivate(context);
  }

  // You can override handleRequest if you need to customize the error thrown
  // or the user object returned upon successful authentication.
  // handleRequest(err, user, info, context, status) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('Custom message if needed');
  //   }
  //   return user;
  // }
}