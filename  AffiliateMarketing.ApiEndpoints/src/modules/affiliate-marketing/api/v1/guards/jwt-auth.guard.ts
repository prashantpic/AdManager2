import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * A guard that extends the `AuthGuard` for JWT strategy.
 * It relies on a Passport JWT strategy being configured and registered,
 * typically named 'jwt' (the default).
 * The actual JWT strategy implementation (e.g., JwtStrategy class verifying the token)
 * is expected to be defined elsewhere, possibly in a shared auth module or
 * within the application's core setup. This guard simply invokes that strategy.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed
    // For example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  // You can override handleRequest here if you want to customize
  // how the user object is returned or how errors are handled.
  // handleRequest(err, user, info, context, status) {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}