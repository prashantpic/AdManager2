import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A guard that uses the Passport JWT strategy to protect routes.
 * It automatically invokes the 'jwt' strategy defined in `JwtStrategy`.
 * If authentication is successful, the route handler is invoked.
 * If authentication fails (e.g., invalid token, no token), an `UnauthorizedException` is thrown.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // The base AuthGuard class handles the core logic.
  // We can override handleRequest for custom error handling or user manipulation if needed,
  // but for standard JWT authentication, this is often sufficient.
  //
  // Example override (optional):
  // handleRequest(err, user, info, context, status) {
  //   if (err || !user) {
  //     // You can throw a custom error or log additional info here
  //     throw err || new UnauthorizedException('Custom message: Could not authenticate with token.');
  //   }
  //   return user; // This user object will be available as `request.user`
  // }
}