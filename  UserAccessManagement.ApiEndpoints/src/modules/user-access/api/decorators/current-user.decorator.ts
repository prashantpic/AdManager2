import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';

// Define an interface for the request object after Passport authentication
// This helps with type safety when accessing `request.user`.
interface ExtendedRequest extends Request {
  user: IUser;
}

/**
 * Custom NestJS parameter decorator `@CurrentUser()` to extract the authenticated user object
 * from the request. This user object is typically populated by Passport authentication strategies
 * (e.g., `JwtStrategy`) after successful authentication.
 *
 * (Covers REQ-IAM-007 from SDS)
 *
 * @param data - Optional key of the IUser interface. If provided, extracts that specific property from the user object.
 *               If not provided, returns the entire user object.
 * @param ctx - The execution context of the request.
 *
 * @example
 * ```typescript
 * import { CurrentUser } from './current-user.decorator';
 * import { IUser } from '../interfaces/user.interface';
 *
 * @Controller('profile')
 * export class ProfileController {
 *   @Get()
 *   getProfile(@CurrentUser() user: IUser) {
 *     return user; // Returns the entire authenticated user object
 *   }
 *
 *   @Get('email')
 *   getEmail(@CurrentUser('email') userEmail: string) {
 *     return userEmail; // Returns only the email property of the authenticated user
 *   }
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);