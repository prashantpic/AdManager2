import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator `@Roles(...roles: string[])` to attach role metadata to route handlers or controllers.
 * This metadata is then used by the `RolesGuard` to perform role-based access control (RBAC).
 *
 * (Covers REQ-IAM-002 from SDS)
 *
 * @param roles - A list of role names that are allowed to access the decorated resource.
 * @example
 * ```typescript
 * import { Roles } from './roles.decorator';
 * import { MERCHANT_ADMIN_ROLE } from '../constants/roles.constants';
 *
 * @Controller('admin')
 * export class AdminController {
 *   @Get()
 *   @Roles(MERCHANT_ADMIN_ROLE) // Only users with 'MerchantAdmin' role can access this
 *   getAdminResource() {
 *     // ...
 *   }
 * }
 * ```
 */
export const ROLES_KEY = 'roles'; // Exporting the key for consistency, though not strictly required by RolesGuard as written in SDS.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);