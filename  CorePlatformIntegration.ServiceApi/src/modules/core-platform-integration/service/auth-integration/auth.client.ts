import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseCorePlatformClient } from '../common/clients/base-core-platform.client';
import { CorePlatformApiConfigInterface } from '../common/config/core-platform-api.config';

// Internal DTOs as per SDS 3.10.3
// These might be moved to a separate dtos/internal folder.
export interface CoreAuthCredentialsDto {
  username?: string;
  password?: string;
  token?: string;
  // Potentially other fields depending on [PlatformName] auth API
}

export interface CoreAuthResponseDto {
  isAuthenticated: boolean;
  userId?: string;
  coreSessionToken?: string;
  roles?: string[];
  error?: string;
  // Potentially other fields from [PlatformName] auth API response
}


@Injectable()
export class AuthClient extends BaseCorePlatformClient {
  private readonly authApiEndpoint: string;

  constructor(
    httpClient: HttpService,
    configService: ConfigService<CorePlatformApiConfigInterface>,
    logger: Logger,
  ) {
    super(httpClient, configService, logger);
    this.authApiEndpoint = this.configService.get('authApiEndpoint');
  }

  /**
   * Verifies user credentials against the [PlatformName] authentication API.
   * @param credentials - The user's credentials (e.g., username/password or token).
   * @returns A promise resolving to CoreAuthResponseDto indicating authentication status.
   */
  async verifyCredentials(credentials: CoreAuthCredentialsDto): Promise<CoreAuthResponseDto> {
    const endpoint = this.authApiEndpoint;
    this.logger.log(`Verifying credentials via endpoint: ${endpoint} for user: ${credentials.username || 'token-based'}`);
    
    // The `credentialsPayload` should match what the `[PlatformName]` auth API expects.
    // Assuming `credentials` DTO is already in the correct format for the POST body.
    const credentialsPayload = credentials; 

    // Assuming the [PlatformName] API returns a structure directly mappable to CoreAuthResponseDto.
    return super.post<CoreAuthResponseDto>(endpoint, credentialsPayload);
  }
}