import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IThirdPartyConnectivityService, RegisteredApp, AuthenticatedUser, AuthorizationCodeData, RefreshTokenData } from '../../common/interfaces/ithird-party-connectivity.service';
import { TokenResponseDto } from '../dto/token-response.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class OAuth2Strategy
 * @description Provides the server-side logic for the OAuth 2.0 authorization framework.
 * This class is not a traditional Passport strategy for validating incoming tokens,
 * but rather a service used by the OAuthController to implement OAuth 2.0 server flows
 * like issuing authorization codes and access tokens.
 */
@Injectable()
export class OAuth2Strategy {
  private readonly logger = new Logger(OAuth2Strategy.name);

  constructor(
    @Inject('IThirdPartyConnectivityService')
    private readonly thirdPartyConnectivityService: IThirdPartyConnectivityService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates client credentials.
   * @param clientId The client ID.
   * @param clientSecret The client secret (optional for public clients).
   * @returns The registered application if valid, otherwise null.
   */
  async validateClient(clientId: string, clientSecret?: string): Promise<RegisteredApp | null> {
    this.logger.debug(`Validating client: ${clientId}`);
    const client = await this.thirdPartyConnectivityService.findClientById(clientId);

    if (!client) {
      this.logger.warn(`Client not found: ${clientId}`);
      return null;
    }

    // For public clients, clientSecret might not be required or present.
    // For confidential clients, clientSecret must match.
    // The ThirdPartyConnectivityService is assumed to handle secret verification if client.clientSecret is hashed.
    if (client.type === 'confidential') {
      if (!clientSecret || !(await this.thirdPartyConnectivityService.verifyClientSecret(clientId, clientSecret))) {
         this.logger.warn(`Invalid client secret for client: ${clientId}`);
         return null;
      }
    }
    return client;
  }

  /**
   * Issues an authorization code.
   * @param client The registered application.
   * @param user The authenticated resource owner (merchant).
   * @param redirectURI The redirect URI provided by the client.
   * @param scopes The requested scopes.
   * @param codeChallenge The PKCE code challenge.
   * @param codeChallengeMethod The PKCE code challenge method.
   * @returns The generated authorization code.
   */
  async issueAuthorizationCode(
    client: RegisteredApp,
    user: AuthenticatedUser,
    redirectURI: string,
    scopes: string[],
    codeChallenge?: string,
    codeChallengeMethod?: string,
  ): Promise<string> {
    const code = uuidv4(); // Generate a unique authorization code
    const ttl = this.configService.get<number>('OAUTH_AUTHORIZATION_CODE_TTL_SECONDS', 600);

    this.logger.log(`Issuing authorization code for client ${client.id}, user ${user.id}`);
    await this.thirdPartyConnectivityService.saveAuthorizationCode(
      code,
      client.id,
      redirectURI,
      user.id,
      scopes,
      codeChallenge,
      codeChallengeMethod,
      ttl,
    );
    return code;
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param client The registered application (or its ID and secret for authentication).
   * @param code The authorization code.
   * @param redirectURI The redirect URI.
   * @param codeVerifier The PKCE code verifier.
   * @returns A TokenResponseDto containing the access token and other details.
   */
  async exchangeCodeForToken(
    client: RegisteredApp, // Client already authenticated by controller
    authCode: string,
    redirectURI: string,
    codeVerifier?: string,
  ): Promise<TokenResponseDto> {
    this.logger.log(`Exchanging authorization code for token. Client: ${client.id}`);
    const codeData = await this.thirdPartyConnectivityService.findAuthorizationCode(authCode);

    if (!codeData || codeData.clientId !== client.id || codeData.redirectUri !== redirectURI) {
      this.logger.warn(`Invalid authorization code or mismatch for client ${client.id}. Code: ${authCode}`);
      throw new HttpException('Invalid authorization code or redirect URI.', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > new Date(codeData.expiresAt)) {
        this.logger.warn(`Authorization code expired for client ${client.id}. Code: ${authCode}`);
        await this.thirdPartyConnectivityService.deleteAuthorizationCode(authCode);
        throw new HttpException('Authorization code expired.', HttpStatus.BAD_REQUEST);
    }

    // PKCE Verification
    if (codeData.codeChallenge && codeData.codeChallengeMethod) {
      if (!codeVerifier) {
        this.logger.warn(`PKCE code_verifier missing for client ${client.id}. Code: ${authCode}`);
        throw new HttpException('Code verifier required.', HttpStatus.BAD_REQUEST);
      }
      let challengeVerified = false;
      if (codeData.codeChallengeMethod === 'S256') {
        const hashedVerifier = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
        challengeVerified = hashedVerifier === codeData.codeChallenge;
      } else if (codeData.codeChallengeMethod === 'plain') {
        challengeVerified = codeVerifier === codeData.codeChallenge;
      }

      if (!challengeVerified) {
        this.logger.warn(`PKCE verification failed for client ${client.id}. Code: ${authCode}`);
        throw new HttpException('Invalid code verifier.', HttpStatus.BAD_REQUEST);
      }
    } else if (codeVerifier) {
        // Code verifier was provided, but no challenge was stored. This might be an attack.
        this.logger.warn(`Code verifier provided but no challenge stored for client ${client.id}. Code: ${authCode}`);
        throw new HttpException('Invalid request: code_verifier provided without prior code_challenge.', HttpStatus.BAD_REQUEST);
    }


    await this.thirdPartyConnectivityService.deleteAuthorizationCode(authCode); // Code is single-use

    return this.generateTokens(client, codeData.userId, codeData.scopes);
  }

  /**
   * Exchanges a refresh token for a new access token.
   * @param client The registered application.
   * @param refreshTokenValue The refresh token.
   * @returns A TokenResponseDto containing the new access token.
   */
  async exchangeRefreshTokenForToken(
    client: RegisteredApp, // Client already authenticated by controller
    refreshTokenValue: string,
  ): Promise<TokenResponseDto> {
    this.logger.log(`Exchanging refresh token for new access token. Client: ${client.id}`);
    const refreshTokenData = await this.thirdPartyConnectivityService.findRefreshToken(refreshTokenValue);

    if (!refreshTokenData || refreshTokenData.clientId !== client.id) {
      this.logger.warn(`Invalid or mismatched refresh token for client ${client.id}`);
      // Optional: Invalidate token family if reuse detected
      throw new HttpException('Invalid refresh token.', HttpStatus.BAD_REQUEST);
    }
    
    if (new Date() > new Date(refreshTokenData.expiresAt)) {
        this.logger.warn(`Refresh token expired for client ${client.id}`);
        await this.thirdPartyConnectivityService.deleteRefreshToken(refreshTokenValue);
        throw new HttpException('Refresh token expired.', HttpStatus.BAD_REQUEST);
    }

    // Optional: Refresh token rotation (issue a new refresh token, invalidate old one)
    // For simplicity, we are not rotating refresh tokens here but it's a good practice.
    // If rotating:
    // await this.thirdPartyConnectivityService.deleteRefreshToken(refreshTokenValue);
    // const newRefreshToken = await this.generateAndSaveRefreshToken(client, refreshTokenData.userId, refreshTokenData.scopes);
    // return this.generateTokens(client, refreshTokenData.userId, refreshTokenData.scopes, newRefreshToken);

    return this.generateTokens(client, refreshTokenData.userId, refreshTokenData.scopes, refreshTokenValue, false); // Do not generate new refresh token
  }

  /**
   * Generates access and optionally refresh tokens.
   * @param client RegisteredApp
   * @param userId User ID (merchant)
   * @param scopes Scopes
   * @param existingRefreshToken Optional: if refresh token is not being rotated
   * @param issueNewRefreshToken Optional: defaults to true
   * @returns TokenResponseDto
   */
  private async generateTokens(
    client: RegisteredApp,
    userId: string,
    scopes: string[],
    existingRefreshToken?: string,
    issueNewRefreshToken: boolean = true,
  ): Promise<TokenResponseDto> {
    const accessTokenTtl = this.configService.get<number>('OAUTH_ACCESS_TOKEN_TTL_SECONDS', 3600);
    const issuerUrl = this.configService.get<string>('OAUTH_ISSUER_URL', 'http://localhost:3000/api');

    const accessTokenPayload = {
      iss: issuerUrl,
      sub: userId, // Subject (resource owner ID)
      aud: client.id, // Audience (client ID)
      client_id: client.id,
      scope: scopes.join(' '),
      // exp and iat will be set by jwtService.sign
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${accessTokenTtl}s`,
        // algorithm: this.configService.get('JWT_ALGORITHM', 'HS256'), // if using asymmetric, specify here
    });

    let refreshTokenToReturn: string | undefined;

    if (issueNewRefreshToken) {
        refreshTokenToReturn = uuidv4();
        const refreshTokenTtl = this.configService.get<number>('OAUTH_REFRESH_TOKEN_TTL_SECONDS', 86400 * 30);
        await this.thirdPartyConnectivityService.saveRefreshToken(
            refreshTokenToReturn,
            client.id,
            userId,
            scopes,
            refreshTokenTtl,
        );
    } else {
        refreshTokenToReturn = existingRefreshToken;
    }


    this.logger.log(`Generated tokens for client ${client.id}, user ${userId}`);
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: accessTokenTtl,
      refresh_token: refreshTokenToReturn,
      scope: scopes.join(' '),
    };
  }
}

// Placeholder for necessary DTOs/interfaces if not imported from elsewhere
// In a real scenario, these would be in their respective files.

// export interface RegisteredApp {
//   id: string; // client_id
//   clientSecret?: string; // Hashed, for confidential clients
//   name: string;
//   redirectUris: string[];
//   allowedScopes: string[];
//   type: 'confidential' | 'public';
// }

// export interface AuthenticatedUser {
//   id: string; // merchantId or platform userId
//   username: string;
//   // other relevant user details
// }

// export interface AuthorizationCodeData {
//   code: string;
//   clientId: string;
//   redirectUri: string;
//   userId: string;
//   scopes: string[];
//   expiresAt: Date;
//   codeChallenge?: string;
//   codeChallengeMethod?: 'S256' | 'plain';
// }

// export interface RefreshTokenData {
//   token: string;
//   clientId: string;
//   userId: string;
//   scopes: string[];
//   expiresAt: Date;
// }