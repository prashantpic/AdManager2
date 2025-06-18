import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Defines the structure of the JWT payload after decoding.
 */
export interface JwtPayload {
  userId: string;
  merchantId: string;
  roles: string[];
  iat?: number; // Issued At timestamp
  exp?: number; // Expiration timestamp
  // Add any other claims expected in the JWT
}

/**
 * Passport strategy for validating JWTs.
 * This strategy extracts the JWT from the Authorization header (Bearer token),
 * verifies its signature using the secret key, and then calls the `validate`
 * method with the decoded payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // JWT expiration is handled by passport-jwt by default
      secretOrKey: configService.get<string>('JWT_SECRET'), // Fetch secret from ConfigService
    });
  }

  /**
   * Validates the decoded JWT payload.
   * This method is called by Passport after the token has been successfully verified.
   * The object returned by this method will be attached to the `Request` object as `req.user`.
   * @param payload The decoded JWT payload.
   * @returns The user object to be attached to `req.user`.
   * @throws UnauthorizedException if the payload is invalid or missing required fields.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Basic validation: ensure essential fields are present in the payload.
    // More complex validation (e.g., checking if user still exists or is active)
    // could be done here by querying a user service/database if necessary.
    if (!payload || !payload.userId || !payload.merchantId || !Array.isArray(payload.roles)) {
      throw new UnauthorizedException('Invalid or malformed JWT payload.');
    }

    // The returned object will be available as `req.user` in protected routes.
    return {
      userId: payload.userId,
      merchantId: payload.merchantId,
      roles: payload.roles,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}