import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

/**
 * Sets up Swagger (OpenAPI) documentation for the RESTful API endpoints.
 * @param app The NestJS application instance.
 */
export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', '/api');
  const appVersion = configService.get<string>('APP_VERSION', 'v1'); // Assuming APP_VERSION is in config or package.json
  const oauthIssuerUrl = configService.get<string>('OAUTH_ISSUER_URL', 'http://localhost:3000/api');


  // Define scopes (example) - these should align with what your OAuth server and resource servers expect
  const availableScopes = {
    'openid': 'Access basic user information',
    'profile': 'Access user profile information',
    'email': 'Access user email address',
    'offline_access': 'Enable refresh tokens for offline access',
    'app:manage': 'Manage application registrations', // Example for developer portal APIs
    'webhooks:manage': 'Manage webhook subscriptions for the app',
    'sample:read': 'Read sample resources',
    'sample:write': 'Write sample resources',
    // Add scopes for actual Ad Manager resources
    // 'campaigns:read': 'Read campaign data',
    // 'campaigns:write': 'Write campaign data',
    // 'products:read': 'Read product data',
  };

  const builder = new DocumentBuilder()
    .setTitle('Ad Manager - App Store Integration API')
    .setDescription('API framework for third-party application integration with the Ad Manager platform. Provides OAuth 2.0, app registration, webhook management, and data exchange endpoints.')
    .setVersion(appVersion)
    .addTag('Auth', 'OAuth 2.0 Authorization Framework (Authorization Server Endpoints)')
    .addTag('AppRegistry', 'Third-Party Application Registration & Management (For Developers)')
    .addTag('Webhooks', 'Webhook Subscription Management (For Authenticated Apps)')
    .addTag('DataExchangeREST', 'RESTful Data Access (Sample Resources)')
    // Add more tags as new resource controllers are added
    // .addTag('CampaignsREST', 'RESTful Campaign Data Access')
    // .addTag('ProductsREST', 'RESTful Product Data Access')

    // OAuth 2.0 Authorization Code Flow for third-party apps to get tokens
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: `${oauthIssuerUrl}/${appVersion}/auth/authorize`, // Full URL
            tokenUrl: `${oauthIssuerUrl}/${appVersion}/auth/token`, // Full URL
            scopes: availableScopes,
          },
        },
      },
      'oauth2_auth_code', // Security scheme name for @ApiOAuth2 decorator
    )
    // JWT Bearer Token for authenticated requests to resource servers (DataExchange, Webhooks)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Bearer token',
        in: 'header',
      },
      'jwt_bearer_token', // Security scheme name for @ApiBearerAuth decorator
    )
    .setContact('Ad Manager API Team', 'https://[ActualPlatformDomain].sa', 'api-support@[ActualPlatformDomain].sa')
    .setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
    .setTermsOfService('https://[ActualPlatformDomain].sa/terms-of-service');
    
    // Add server URL based on environment if needed
    // .addServer(configService.get<string>('API_BASE_URL', 'http://localhost:3000'))


  const document = SwaggerModule.createDocument(app, builder.build());

  const swaggerUiPath = `${apiPrefix}/${appVersion}/docs`;
  SwaggerModule.setup(swaggerUiPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization data on browser refresh
      docExpansion: 'list', // 'none', 'list', 'full'
      filter: true,
      showRequestDuration: true,
      // OAuth2 client configuration for "Authorize" button in Swagger UI
      // These are example values; the client app making requests to /authorize would have its own client_id.
      // For Swagger UI itself to test the flow, you might need a pre-registered "Swagger UI" client.
      // oauth2RedirectUrl: `${window.location.origin}/swagger-ui-redirect.html`, // Default
      // defaultModelsExpandDepth: -1, // Hides schemas by default
    },
    customSiteTitle: 'Ad Manager AppStore API Docs',
  });
  
  // Log the path to Swagger UI
  const logger = app.get(Logger);
  logger.log(`Swagger API documentation available at ${swaggerUiPath}`, 'SwaggerSetup');
}