import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { IThirdPartyConnectivityService, RegisteredApp } from '../../common/interfaces/ithird-party-connectivity.service';
import { RegisterAppDto } from '../dto/register-app.dto';
import { AppResponseDto, UpdateAppDto } from '../dto/app-response.dto'; // Assuming AppResponseDto and UpdateAppDto exist
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

/**
 * @class AppRegistryService
 * @description Service responsible for managing the registration and lifecycle of third-party applications.
 */
@Injectable()
export class AppRegistryService {
  private readonly logger = new Logger(AppRegistryService.name);

  constructor(
    @Inject('IThirdPartyConnectivityService')
    private readonly thirdPartyConnectivityService: IThirdPartyConnectivityService,
  ) {}

  /**
   * Registers a new third-party application.
   * @param registerAppDto DTO containing application registration details.
   * @param developerId The ID of the developer registering the app.
   * @returns AppResponseDto containing details of the registered app (excluding client_secret after initial display).
   */
  async registerNewApp(registerAppDto: RegisterAppDto, developerId: string): Promise<AppResponseDto & { clientSecret?: string }> {
    this.logger.log(`Registering new app "${registerAppDto.appName}" for developer ${developerId}`);

    // Basic validation (more specific validation should be in DTO)
    if (!registerAppDto.appName || !registerAppDto.redirectUris || registerAppDto.redirectUris.length === 0) {
      throw new HttpException('App name and at least one redirect URI are required.', HttpStatus.BAD_REQUEST);
    }

    const clientId = uuidv4();
    // Generate a secure client secret. This should be a strong, unguessable string.
    const clientSecret = crypto.randomBytes(32).toString('hex');

    // The ThirdPartyConnectivityService is responsible for securely storing the clientSecret (e.g., hashing it).
    // For this example, we pass it plaintext, assuming the service handles it.
    const appDataToPersist: Omit<RegisteredApp, 'id'> & { clientSecretPlain?: string, developerId: string } = {
      clientId,
      clientSecretHashed: await this.thirdPartyConnectivityService.hashClientSecret(clientSecret), // Assuming TPCS provides hashing
      name: registerAppDto.appName,
      redirectUris: registerAppDto.redirectUris,
      allowedScopes: registerAppDto.scopes || [], // Default to empty array if no scopes provided
      developerId: developerId,
      type: registerAppDto.appType || 'confidential', // Default to confidential
      logoUrl: registerAppDto.logoUrl,
      description: registerAppDto.description,
      homepageUrl: registerAppDto.homepageUrl,
      privacyPolicyUrl: registerAppDto.privacyPolicyUrl,
      termsOfServiceUrl: registerAppDto.termsOfServiceUrl,
    };
    
    const createdApp = await this.thirdPartyConnectivityService.createAppRegistration(appDataToPersist);

    if (!createdApp) {
        this.logger.error(`Failed to create app registration for developer ${developerId} with name ${registerAppDto.appName}`);
        throw new HttpException('Could not register application.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.logger.log(`Successfully registered app "${createdApp.name}" with client ID ${createdApp.clientId}`);
    
    // Return client_id and client_secret (client_secret only this one time)
    // AppResponseDto should not typically store client_secret.
    return {
      id: createdApp.clientId, // Map internal clientId to id for response
      clientId: createdApp.clientId,
      name: createdApp.name,
      redirectUris: createdApp.redirectUris,
      scopes: createdApp.allowedScopes,
      developerId: createdApp.developerId,
      clientSecret: clientSecret, // Return plain secret only on creation
      appType: createdApp.type,
      logoUrl: createdApp.logoUrl,
      description: createdApp.description,
      homepageUrl: createdApp.homepageUrl,
      privacyPolicyUrl: createdApp.privacyPolicyUrl,
      termsOfServiceUrl: createdApp.termsOfServiceUrl,
      createdAt: createdApp.createdAt,
      updatedAt: createdApp.updatedAt,
    };
  }

  /**
   * Retrieves details of a specific registered application.
   * @param appId The ID (clientId) of the application.
   * @param developerId The ID of the developer requesting the details (for authorization).
   * @returns AppResponseDto or null if not found or not authorized.
   */
  async getAppDetails(appId: string, developerId: string): Promise<AppResponseDto | null> {
    this.logger.debug(`Fetching app details for app ID: ${appId}, developer: ${developerId}`);
    const app = await this.thirdPartyConnectivityService.findAppByIdAndDeveloperId(appId, developerId);

    if (!app) {
      this.logger.warn(`App not found or developer ${developerId} not authorized for app ID: ${appId}`);
      return null;
    }

    return {
      id: app.clientId,
      clientId: app.clientId,
      name: app.name,
      redirectUris: app.redirectUris,
      scopes: app.allowedScopes,
      developerId: app.developerId,
      appType: app.type,
      logoUrl: app.logoUrl,
      description: app.description,
      homepageUrl: app.homepageUrl,
      privacyPolicyUrl: app.privacyPolicyUrl,
      termsOfServiceUrl: app.termsOfServiceUrl,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    };
  }

  /**
   * Updates details of a specific registered application.
   * @param appId The ID (clientId) of the application to update.
   * @param updateAppDto DTO containing fields to update.
   * @param developerId The ID of the developer performing the update.
   * @returns Updated AppResponseDto.
   */
  async updateAppDetails(appId: string, updateAppDto: UpdateAppDto, developerId: string): Promise<AppResponseDto> {
    this.logger.log(`Updating app ID: ${appId} for developer: ${developerId}`);
    const existingApp = await this.thirdPartyConnectivityService.findAppByIdAndDeveloperId(appId, developerId);

    if (!existingApp) {
      this.logger.warn(`App not found or developer ${developerId} not authorized to update app ID: ${appId}`);
      throw new HttpException('Application not found or access denied.', HttpStatus.NOT_FOUND);
    }

    // Prepare update data, only including fields present in updateAppDto
    const updateData: Partial<RegisteredApp> = {};
    if (updateAppDto.appName !== undefined) updateData.name = updateAppDto.appName;
    if (updateAppDto.redirectUris !== undefined) updateData.redirectUris = updateAppDto.redirectUris;
    if (updateAppDto.scopes !== undefined) updateData.allowedScopes = updateAppDto.scopes;
    if (updateAppDto.logoUrl !== undefined) updateData.logoUrl = updateAppDto.logoUrl;
    if (updateAppDto.description !== undefined) updateData.description = updateAppDto.description;
    if (updateAppDto.homepageUrl !== undefined) updateData.homepageUrl = updateAppDto.homepageUrl;
    if (updateAppDto.privacyPolicyUrl !== undefined) updateData.privacyPolicyUrl = updateAppDto.privacyPolicyUrl;
    if (updateAppDto.termsOfServiceUrl !== undefined) updateData.termsOfServiceUrl = updateAppDto.termsOfServiceUrl;
    if (updateAppDto.appType !== undefined) updateData.type = updateAppDto.appType;


    if (Object.keys(updateData).length === 0) {
        throw new HttpException('No update data provided.', HttpStatus.BAD_REQUEST);
    }
    
    const updatedApp = await this.thirdPartyConnectivityService.updateAppRegistration(appId, developerId, updateData);
    
    if (!updatedApp) {
        this.logger.error(`Failed to update app ID ${appId}`);
        throw new HttpException('Could not update application.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`Successfully updated app ID: ${appId}`);
    return {
      id: updatedApp.clientId,
      clientId: updatedApp.clientId,
      name: updatedApp.name,
      redirectUris: updatedApp.redirectUris,
      scopes: updatedApp.allowedScopes,
      developerId: updatedApp.developerId,
      appType: updatedApp.type,
      logoUrl: updatedApp.logoUrl,
      description: updatedApp.description,
      homepageUrl: updatedApp.homepageUrl,
      privacyPolicyUrl: updatedApp.privacyPolicyUrl,
      termsOfServiceUrl: updatedApp.termsOfServiceUrl,
      createdAt: updatedApp.createdAt,
      updatedAt: updatedApp.updatedAt,
    };
  }

  /**
   * Lists all applications registered by a specific developer.
   * @param developerId The ID of the developer.
   * @returns An array of AppResponseDto.
   */
  async listDeveloperApps(developerId: string): Promise<AppResponseDto[]> {
    this.logger.debug(`Listing apps for developer ID: ${developerId}`);
    const apps = await this.thirdPartyConnectivityService.findAppsByDeveloperId(developerId);

    return apps.map(app => ({
      id: app.clientId,
      clientId: app.clientId,
      name: app.name,
      redirectUris: app.redirectUris,
      scopes: app.allowedScopes,
      developerId: app.developerId,
      appType: app.type,
      logoUrl: app.logoUrl,
      description: app.description,
      homepageUrl: app.homepageUrl,
      privacyPolicyUrl: app.privacyPolicyUrl,
      termsOfServiceUrl: app.termsOfServiceUrl,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));
  }
}