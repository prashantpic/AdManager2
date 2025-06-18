import { Controller, Get, Post, Body, Query, Req, Res, HttpCode, HttpStatus, Logger, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service';
import { TokenRequestDto } from '../dto/token-request.dto';
import { TokenResponseDto } from '../dto/token-response.dto';
import { AuthorizeQueryDto } from '../dto/authorize-query.dto'; // Assuming this DTO exists
import { ConfigService } from '@nestjs/config';

/**
 * Controller for handling OAuth 2.0 authorization and token endpoints.
 * @remarks
 * Implements the `/authorize` and `/token` endpoints as per OAuth 2.0 specification.
 */
@ApiTags('Auth')
@Controller('auth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oauthService: OAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initiates the OAuth 2.0 authorization flow.
   * Validates client, authenticates user (merchant), obtains consent, and issues an authorization code.
   * @param query - The authorization request query parameters.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  @Get('authorize')
  @ApiOperation({ 
    summary: 'OAuth 2.0 Authorization Endpoint',
    description: 'Initiates the OAuth 2.0 authorization flow. This endpoint is typically accessed via browser redirection.'
  })
  @ApiQuery({ name: 'response_type', required: true, example: 'code', description: 'Must be "code".' })
  @ApiQuery({ name: 'client_id', required: true, description: 'The client identifier.' })
  @ApiQuery({ name: 'redirect_uri', required: true, description: 'The client\'s redirect URI.' })
  @ApiQuery({ name: 'scope', required: false, description: 'Space-delimited list of scopes.' })
  @ApiQuery({ name: 'state', required: false, description: 'An opaque value used by the client to maintain state.' })
  @ApiQuery({ name: 'code_challenge', required: false, description: 'PKCE code challenge.' })
  @ApiQuery({ name: 'code_challenge_method', required: false, enum: ['S256', 'plain'], description: 'PKCE code challenge method.' })
  @ApiResponse({ status: 302, description: 'Redirects to client redirect_uri with code and state, or to login/consent page.' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  async authorize(
    @Query() query: AuthorizeQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Received authorization request for client_id: ${query.client_id}`);
    try {
      // 1. Validate AuthorizeQueryDto (partially done by ValidationPipe)
      // Additional validation for response_type can be done here if not covered by DTO
      if (query.response_type !== 'code') {
        this.logger.warn('Invalid response_type in /authorize request');
        // As per RFC 6749, if redirect_uri is invalid/missing, error should not be redirected.
        // For other errors, redirect with error params if redirect_uri is valid.
        // Assuming basic validation is done and redirect_uri is trustworthy enough after initial client validation.
        return res.redirect(`${query.redirect_uri}?error=invalid_request&error_description=response_type_must_be_code${query.state ? `&state=${query.state}` : ''}`);
      }

      // 2. Validate client_id and redirect_uri
      const client = await this.oauthService.validateClientAndRedirectUri(query.client_id, query.redirect_uri);
      if (!client) {
        this.logger.warn(`Invalid client_id or redirect_uri for client_id: ${query.client_id}`);
        // Do not redirect if client/redirect_uri is invalid. Render an error page or return a direct error.
        res.status(HttpStatus.BAD_REQUEST).send('Invalid client_id or redirect_uri.');
        return;
      }
      
      // 3. Authenticate user (merchant)
      // This part is highly dependent on the platform's main authentication system.
      // For this example, we assume a user might be in session or needs redirection.
      // const user = req.user; // If using something like Passport session
      const user = (req as any).user; // Placeholder for user object from session or token
      
      if (!user) {
        this.logger.log(`User not authenticated. Redirecting to login for client_id: ${query.client_id}.`);
        // Store query params in session to retrieve after login
        (req.session as any).oauthAuthorizeQuery = query;
        const loginUrl = this.configService.get<string>('PLATFORM_LOGIN_URL') || '/default/login/path';
        // Append a returnTo URL so the login page knows where to send the user back
        const serviceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        return res.redirect(`${loginUrl}?returnTo=${encodeURIComponent(serviceUrl)}`);
      }

      // 4. Obtain merchant consent (if not already granted or if scopes changed)
      // This might involve redirecting to a consent screen.
      // For simplicity, let's assume consent is implicitly granted or handled by a separate UI.
      // The consent screen would typically show client.appName and query.scope.
      const consentGranted = await this.oauthService.checkUserConsent(user, client, query.scope?.split(' ') || []);
      if (!consentGranted) {
          this.logger.log(`Consent not granted or required. Redirecting to consent page for user ${user.id} and client ${client.id}`);
          (req.session as any).oauthAuthorizeQuery = query;
          (req.session as any).oauthClientInfo = client; // Pass client info to consent page
          const consentUrl = this.configService.get<string>('PLATFORM_CONSENT_URL') || '/default/consent/path';
          const serviceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
          return res.redirect(`${consentUrl}?client_id=${client.id}&scope=${query.scope}&returnTo=${encodeURIComponent(serviceUrl)}`);
      }

      // 5. Issue authorization code
      const authorizationCode = await this.oauthService.issueAuthorizationCode(
        client,
        user,
        query.redirect_uri,
        query.scope?.split(' ') || [],
        { codeChallenge: query.code_challenge, codeChallengeMethod: query.code_challenge_method },
        query.state
      );

      // 6. Redirect to client's redirect_uri
      const redirectUrl = new URL(query.redirect_uri);
      redirectUrl.searchParams.append('code', authorizationCode.code);
      if (query.state) {
        redirectUrl.searchParams.append('state', query.state);
      }
      this.logger.log(`Successfully issued authorization code. Redirecting to: ${redirectUrl.toString()}`);
      return res.redirect(redirectUrl.toString());

    } catch (error) {
      this.logger.error('Error during /authorize flow:', error);
      // Handle errors: redirect to redirect_uri with error codes if possible and safe
      const stateParam = query.state ? `&state=${query.state}` : '';
      if (query.redirect_uri) {
        // Check if error is an OAuth specific error with a code
        if (error.oauthError) {
             return res.redirect(`${query.redirect_uri}?error=${error.oauthError}&error_description=${encodeURIComponent(error.message)}${stateParam}`);
        }
        return res.redirect(`${query.redirect_uri}?error=server_error&error_description=An_unexpected_error_occurred${stateParam}`);
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An unexpected error occurred during authorization.');
    }
  }

  /**
   * Exchanges an authorization code or refresh token for an access token.
   * @param tokenRequestDto - The token request payload.
   * @param req - The Express request object, used for client authentication (e.g., Basic Auth).
   * @returns The token response.
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'OAuth 2.0 Token Endpoint',
    description: 'Exchanges an authorization code or refresh token for an access token. Client authentication is required.'
  })
  @ApiBody({ type: TokenRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: TokenResponseDto, description: 'Access token issued successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid token request (e.g., invalid grant type, missing parameters).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Client authentication failed or invalid grant.' })
  async token(
    @Body() tokenRequestDto: TokenRequestDto,
    @Req() req: Request,
  ): Promise<TokenResponseDto> {
    this.logger.log(`Received token request with grant_type: ${tokenRequestDto.grant_type}`);

    // Client Authentication (Basic Auth or client_id/client_secret in body)
    // The oauthService should handle this logic.
    // Extract client_id from Authorization header (Basic Auth) or body
    let clientId: string | undefined = tokenRequestDto.client_id;
    let clientSecret: string | undefined = tokenRequestDto.client_secret;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const MOCK_CLIENT_ID = 'mock_client_id_from_basic_auth'; // Simulate extraction
      const MOCK_CLIENT_SECRET = 'mock_client_secret_from_basic_auth'; // Simulate extraction
      // const [id, secret] = Buffer.from(authHeader.substring(6), 'base64').toString().split(':');
      // clientId = id;
      // clientSecret = secret;
      // For demonstration, using placeholders if Basic Auth is preferred
      if (!tokenRequestDto.client_id && !tokenRequestDto.client_secret) {
          this.logger.debug('Attempting client authentication via Basic Auth header.');
          // Logic to parse Basic Auth would go here, then pass to oauthService.
          // For now, we assume tokenRequestDto carries credentials if not Basic Auth.
      }
    }
    
    // The oauthService should validate the client based on provided credentials
    // and the grant type.

    try {
      switch (tokenRequestDto.grant_type) {
        case 'authorization_code':
          if (!tokenRequestDto.code || !tokenRequestDto.redirect_uri) {
            throw new BadRequestException('Missing code or redirect_uri for authorization_code grant.');
          }
          return this.oauthService.exchangeCodeForToken(
            tokenRequestDto.code,
            tokenRequestDto.redirect_uri,
            clientId, // client_id might be from body or basic auth
            clientSecret, // client_secret might be from body or basic auth
            tokenRequestDto.code_verifier,
          );
        case 'refresh_token':
          if (!tokenRequestDto.refresh_token) {
            throw new BadRequestException('Missing refresh_token for refresh_token grant.');
          }
          return this.oauthService.exchangeRefreshTokenForToken(
            tokenRequestDto.refresh_token,
            clientId, // client_id might be from body or basic auth
            clientSecret, // client_secret might be from body or basic auth
            tokenRequestDto.scope
          );
        // case 'client_credentials': // Example for M2M
        //   return this.oauthService.issueClientCredentialsToken(
        //     clientId,
        //     clientSecret,
        //     tokenRequestDto.scope
        //   );
        default:
          this.logger.warn(`Unsupported grant_type: ${tokenRequestDto.grant_type}`);
          throw new BadRequestException('Unsupported grant_type.');
      }
    } catch (error) {
      this.logger.error(`Error during /token flow for grant_type ${tokenRequestDto.grant_type}:`, error.message);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      // Map to OAuth specific errors if possible, e.g. invalid_grant, invalid_client
      // For now, rethrow as a generic bad request or unauthorized based on assumed error type
      throw new BadRequestException(error.message || 'Token generation failed.');
    }
  }
}