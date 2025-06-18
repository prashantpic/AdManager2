import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom JWT authentication guard for Product Catalog API endpoints.
 * Extends NestJS AuthGuard('jwt').
 * Relies on a JwtStrategy (assumed to be configured globally or in a shared auth module)
 * to validate the JWT extracted from the Authorization header.
 * If validation is successful, it attaches the user payload (e.g., req.user = payload) to the request object.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}