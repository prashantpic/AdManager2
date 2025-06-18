import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../interfaces/user.interface';

/**
 * Defines the expected structure of the JWT payload after decoding.
 * This should match the payload structure created during token generation.
 */
interface JwtPayload {
  sub: string; // Subject (typically the Ad Manager User ID)
  email: string;
  roles: string[];
  corePlatformUserId: string;
  merchantId?: string | null;
  // Add any other custom claims included in the JWT payload
  iat?: number; // Issued at (standard claim)
  exp?: number; // Expiration time (standard claim)
}

/**
 * Implements the Passport JWT strategy for validating Ad Manager access tokens.
 * This strategy is used by the `JwtAuthGuard`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    // Potentially inject UserAccessService here if fresh user data is needed on each request
    // private readonly userAccessService: UserAccessService,
  ) {
    super({
      // Specifies how the JWT should be extracted from the request.
      // Here, it's extracted from the 'Authorization' header as a Bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // If true, Passport will not fail an expired token. Set to false for security.
      ignoreExpiration: false,

      // The secret key used to sign and verify the JWTs.
      // This MUST match the secret used when signing the tokens.
      secretOrKey: configService.get<string>('JWT_SECRET'),

      // Optionally, you can pass the request object to the validate function
      // passReqToCallback: true,
    });
  }

  /**
   * This method is called by Passport after it has successfully decoded and verified the JWT.
   * The `payload` argument is the decoded JSON object from the token.
   * It should return the user object that will be attached to `request.user`.
   *
   * @param payload The decoded JWT payload.
   * @returns The user object to be attached to the request, or throws an UnauthorizedException.
   */
  async validate(payload: JwtPayload): Promise<IUser> {
    // Basic validation of the payload content.
    if (!payload || !payload.sub || !payload.email || !payload.roles || !payload.corePlatformUserId) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    // Option 1: Trust the payload (common for performance, if user data in token is sufficient and up-to-date enough).
    // The token's signature and expiration are already verified by Passport.
    const userFromPayload: IUser = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      corePlatformUserId: payload.corePlatformUserId,
      merchantId: payload.merchantId !== undefined ? payload.merchantId : null, // Handle undefined explicitly
      isActive: true, // Assume user is active if token is valid. Status can be re-verified if critical.
      // `createdAt` and `updatedAt` are typically not in JWT payload unless specifically added.
    };

    // Option 2: Fetch fresh user data from the database (more secure, ensures user still exists, is active, and roles are current).
    // This adds a database call for every authenticated request.
    //
    // Example (if UserAccessService is injected and has a findById method):
    // const user = await this.userAccessService.findUserByIdForAuth(payload.sub);
    // if (!user || !user.isActive) {
    //   throw new UnauthorizedException('User not found, inactive, or token revoked.');
    // }
    // return user; // Return the full IUser object from the database

    // For this implementation, we'll return the user details directly from the payload (Option 1).
    return userFromPayload;
  }
}