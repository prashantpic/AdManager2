import { Injectable, Logger } from '@nestjs/common';
import { AuthClient } from './auth.client';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';

// Internal DTOs (as per SDS 3.10.3)
// These would typically live in a shared types/interfaces file or within the client's scope.
interface CoreAuthCredentialsDto {
  username?: string;
  password?: string;
  token?: string;
}

interface CoreAuthResponseDto {
  isAuthenticated: boolean;
  userId?: string;
  coreSessionToken?: string;
  roles?: string[];
  error?: string;
}

@Injectable()
export class AuthIntegrationService {
  private readonly logger = new Logger(AuthIntegrationService.name);

  constructor(private readonly authClient: AuthClient) {}

  async delegateAuthentication(
    request: AuthRequestDto,
  ): Promise<AuthResponseDto> {
    // Mask password for logging
    const loggedRequest = { ...request };
    if (loggedRequest.password) {
      loggedRequest.password = '********';
    }
    this.logger.log(
      `Delegating authentication request: ${JSON.stringify(loggedRequest)}`,
    );

    const coreAuthCredentials: CoreAuthCredentialsDto = {};
    if (request.username && request.password) {
      coreAuthCredentials.username = request.username;
      coreAuthCredentials.password = request.password;
    } else if (request.token) {
      coreAuthCredentials.token = request.token;
    } else {
      this.logger.warn('Auth request is missing credentials or token.');
      return {
        isAuthenticated: false,
        errorMessage: 'Invalid authentication request: missing credentials or token.',
      };
    }

    try {
      const coreResponse: CoreAuthResponseDto =
        await this.authClient.verifyCredentials(coreAuthCredentials);

      if (!coreResponse.isAuthenticated) {
        this.logger.warn(
          `Authentication failed for user: ${request.username || 'token-based'}. Reason: ${coreResponse.error}`,
        );
        return {
          isAuthenticated: false,
          errorMessage: coreResponse.error || 'Authentication failed at [PlatformName].',
        };
      }

      this.logger.log(
        `Authentication successful for user ID: ${coreResponse.userId}`,
      );
      return {
        isAuthenticated: true,
        userId: coreResponse.userId,
        sessionToken: coreResponse.coreSessionToken, // This is the [PlatformName] token
        // roles: coreResponse.roles, // If roles are part of the gRPC contract
      };
    } catch (error) {
      this.logger.error(
        `Error during authentication delegation: ${error.message}`,
        error.stack,
      );
      // Specific error handling and mapping to gRPC status would happen in controller
      throw error; // Rethrow for controller to handle gRPC status
    }
  }
}