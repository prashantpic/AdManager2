```typescript
import { SetMetadata, CustomDecorator } from '@nestjs/common';

/**
 * Key used to store roles metadata.
 * Namespace: AdManager.AffiliateMarketing.Api.V1.Decorators
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to assign role-based metadata to route handlers.
 * Used in conjunction with RolesGuard to perform role-based access control.
 *
 * @param {...string[]} roles - An array of role strings required to access the endpoint.
 * @returns {CustomDecorator} A custom decorator function.
 *
 * REQ-AMP-001, REQ-AMP-002, REQ-AMP-006
 *
 * @example
 * ```typescript
 * import { Roles } from './roles.decorator';
 * import { RolesGuard } from '../guards/roles.guard';
 * import { JwtAuthGuard } from '../guards/jwt-auth.guard';
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 *
 * @Controller('admin')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class AdminController {
 *   @Get('data')
 *   @Roles('Admin', 'SuperUser')
 *   getAdminData() {
 *     // ...
 *   }
 * }
 * ```
 */
export const Roles = (...roles: string[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
```