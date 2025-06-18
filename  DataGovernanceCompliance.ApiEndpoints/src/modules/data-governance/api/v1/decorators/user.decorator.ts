import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string; // Typically user ID from JWT `sub` claim
  username?: string; // Optional username
  roles: string[];
  [key: string]: any; // Allow for other properties populated by JWT strategy
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthenticatedUser;
  },
);