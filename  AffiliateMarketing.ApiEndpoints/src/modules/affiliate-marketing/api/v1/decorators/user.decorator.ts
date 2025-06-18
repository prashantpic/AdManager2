```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface representing the payload of an authenticated user.
 * This structure is expected to be populated by an authentication guard (e.g., JwtAuthGuard).
 * Namespace: AdManager.AffiliateMarketing.Api.V1.Decorators
 */
export interface AuthUserPayload {
  /** The unique identifier of the user (e.g., from Core Platform User Service). */
  userId: string; // Or number, adjust based on your core user ID type

  /** The unique identifier of the merchant associated with the user, if applicable. */
  merchantId?: string;

  /** The unique identifier of the affiliate associated with the user, if applicable. */
  affiliateId?: string;

  /** An array of roles assigned to the user (e.g., 'MerchantAdmin', 'Affiliate'). */
  roles: string[];

  /** Optional: User's email address. */
  email?: string;

  /** Optional: Username. */
  username?: string;

  // Add any other relevant claims from the JWT payload
}

/**
 * Custom parameter decorator to extract the authenticated user object from the request.
 * The user object is typically populated by an authentication guard like `JwtAuthGuard`.
 *
 * @param {unknown} data - Optional data passed to the decorator (not used in this implementation).
 * @param {ExecutionContext} ctx - The execution context of the current request.
 * @returns {AuthUserPayload} The authenticated user object, or undefined if not available.
 *
 * REQ-AMP-001, REQ-AMP-002, REQ-AMP-006
 *
 * @example
 * ```typescript
 * import { AuthUser, AuthUserPayload } from './user.decorator';
 * import { JwtAuthGuard } from '../guards/jwt-auth.guard';
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 *
 * @Controller('profile')
 * @UseGuards(JwtAuthGuard)
 * export class ProfileController {
 *   @Get()
 *   getProfile(@AuthUser() user: AuthUserPayload) {
 *     console.log(user.userId, user.roles);
 *     // ...
 *   }
 * }
 * ```
 */
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUserPayload;
  },
);
```