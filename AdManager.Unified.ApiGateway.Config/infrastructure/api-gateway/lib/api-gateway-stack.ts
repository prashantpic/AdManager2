```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2'; // For CfnWebACLAssociation

import { GatewayConfig } from './config/gateway-settings';
import { ILambdaAuthorizerProps } from './interfaces/lambda-authorizer-props';
import { JwtLambdaAuthorizerConstruct } from './constructs/authorizers/jwt-lambda-authorizer-construct';
import { WafIntegrationConstruct } from './constructs/waf-integration-construct';
import { MerchantApiRoutes } from './constructs/routes/merchant-api-routes';
// Import other route constructs as they are defined
// import { AdminApiRoutes } from './constructs/routes/admin-api-routes';
// import { AffiliateApiRoutes } from './constructs/routes/affiliate-api-routes';
// import { ThirdPartyAppApiRoutes } from './constructs/routes/third-party-app-api-routes';
import { OpenApiDefinitionsConstruct } from './constructs/openapi-definitions-construct';

export interface ApiGatewayStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly gatewayConfig: GatewayConfig;
  readonly authorizerConfig: ILambdaAuthorizerProps;
  // Add props for backend service URLs/ARNs or SSM parameter names
  readonly campaignServiceEndpoint: string; // Example: URL of CampaignService
  readonly productCatalogServiceEndpoint: string; // Example
  readonly adminServiceEndpoint: string; // Example
  readonly affiliateServiceEndpoint: string; // Example
  readonly thirdPartyAppServiceEndpoint: string; // Example
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    // 1. Define OpenAPI specifications (optional, but good for request validation and docs)
    // As per SDS, this construct is instantiated. Its direct use in RestApi (e.g. SpecRestApi) is conditional.
    // The current design uses `new apigateway.RestApi`, not `SpecRestApi`.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openApiConstruct = new OpenApiDefinitionsConstruct(this, 'OpenApiDefs');

    // 2. Create the REST API instance
    this.api = new apigateway.RestApi(this, `AdManagerApi-${props.stage}`, {
      restApiName: `AdManager-API-${props.stage}`,
      description: `API Gateway for Ad Manager Platform (${props.stage})`,
      deployOptions: {
        stageName: props.stage,
        throttlingRateLimit: props.gatewayConfig.defaultRateLimit,
        throttlingBurstLimit: props.gatewayConfig.defaultBurstLimit,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
        // tracingEnabled: true, // Optional: for AWS X-Ray, enable if needed
      },
      defaultCorsPreflightOptions: props.gatewayConfig.defaultCorsOptions,
      // For request validation using OpenAPI - this would require models and validators to be explicitly defined here
      // if not using SpecRestApi. The OpenApiDefinitionsConstruct can provide the schemas.
      // Example:
      // const generalValidator = new apigateway.RequestValidator(this, 'GeneralValidator', {
      //   restApi: this.api,
      //   requestValidatorName: `${props.stage}-GeneralBodyAndParamValidator`,
      //   validateRequestBody: true,
      //   validateRequestParameters: true,
      // });
      // Models would be defined like:
      // const errorModel = this.api.addModel('ErrorModel', { schema: { type: apigateway.JsonSchemaType.OBJECT, ... } });
      // If SpecRestApi were used, the OpenAPI definition would drive this:
      // apiDefinition: openApiConstruct.getRootApiSpecForSpecRestApi(), // Example usage for SpecRestApi
    });

    // 3. Setup JWT Lambda Authorizer
    const jwtAuthorizerConstruct = new JwtLambdaAuthorizerConstruct(this, 'JwtAuthorizer', props.authorizerConfig);
    const authorizer = jwtAuthorizerConstruct.authorizer;


    // 4. Define Routes by instantiating route constructs
    // Example for Merchant Routes
    new MerchantApiRoutes(this, 'MerchantRoutes', {
        api: this.api,
        authorizer: authorizer,
        campaignServiceIntegration: new apigateway.HttpIntegration(props.campaignServiceEndpoint),
        productCatalogServiceIntegration: new apigateway.HttpIntegration(props.productCatalogServiceEndpoint),
        // As per SDS for ApiGatewayStack (4.2.4), only campaign and product catalog integrations are shown for MerchantApiRoutes.
        // The MerchantApiRoutes construct (SDS 4.3.1) itself might expect an analyticsServiceIntegration.
        // If analytics service is distinct and required, `analyticsServiceEndpoint` should be added to ApiGatewayStackProps
        // and `analyticsServiceIntegration: new apigateway.HttpIntegration(props.analyticsServiceEndpoint)` passed here.
        // For strict adherence to SDS 4.2.4 for this file, only explicitly mentioned integrations are created here.
    });

    // TODO: Instantiate AdminApiRoutes, AffiliateApiRoutes, ThirdPartyAppApiRoutes similarly.
    // Ensure their respective props interfaces are defined and backend endpoints are passed.
    // Example for AdminApiRoutes (assuming AdminApiRoutesProps and relevant integrations):
    // const adminServiceIntegration = new apigateway.HttpIntegration(props.adminServiceEndpoint);
    // new AdminApiRoutes(this, 'AdminRoutes', {
    //   api: this.api,
    //   authorizer: authorizer, // or a different authorizer if admin routes require distinct auth logic
    //   userManagementIntegration: adminServiceIntegration, // Example property name in AdminApiRoutesProps
    //   platformSettingsIntegration: adminServiceIntegration, // Example
    // });

    // Example for AffiliateApiRoutes (assuming AffiliateApiRoutesProps and relevant integrations):
    // const affiliateServiceIntegration = new apigateway.HttpIntegration(props.affiliateServiceEndpoint);
    // new AffiliateApiRoutes(this, 'AffiliateRoutes', {
    //  api: this.api,
    //  authorizer: authorizer,
    //  dashboardIntegration: affiliateServiceIntegration, // Example property name in AffiliateApiRoutesProps
    //  payoutsIntegration: affiliateServiceIntegration, // Example
    // });

    // Example for ThirdPartyAppApiRoutes (assuming ThirdPartyAppApiRoutesProps and relevant integrations):
    // const thirdPartyAppServiceIntegration = new apigateway.HttpIntegration(props.thirdPartyAppServiceEndpoint);
    // new ThirdPartyAppApiRoutes(this, 'ThirdPartyAppRoutes', {
    //   api: this.api,
    //   authorizer: authorizer, // Consider if a different auth (e.g. OAuth specific) is needed or handled by this JWT authorizer
    //   dataReportingIntegration: thirdPartyAppServiceIntegration, // Example property name
    // });


    // 5. Setup AWS WAF Integration
    const wafConstruct = new WafIntegrationConstruct(this, 'WafProtection', {
      scope: 'REGIONAL', // For API Gateway
    });

    // Associate WAF with the API Gateway Stage
    // The deploymentStage property is available on RestApi after it's initialized with deployOptions.
    if (this.api.deploymentStage) {
        new wafv2.CfnWebACLAssociation(this, 'WafAssociation', {
            resourceArn: this.api.deploymentStage.stageArn,
            webAclArn: wafConstruct.webAclArn,
        });
    } else {
        // This case should ideally not happen if deployOptions.stageName is set,
        // as CDK creates the deployment and stage.
        cdk.Annotations.of(this).addWarning(
            `Deployment stage for API ${this.api.restApiName} (ID: ${this.api.restApiId}) not found directly after creation. ` +
            `WAF ACL association to stage ARN might be impacted. Please verify deployment.`
        );
    }


    // 6. Setup Custom Domain (if configured)
    if (props.gatewayConfig.customDomain) {
      const domainConfig = props.gatewayConfig.customDomain;

      if (!domainConfig.certificateArn || !domainConfig.hostedZoneId) {
        throw new Error('Certificate ARN and Hosted Zone ID are required for custom domain setup.');
      }

      const certificate = acm.Certificate.fromCertificateArn(this, 'ApiCertificate', domainConfig.certificateArn);

      const apiDomainName = new apigateway.DomainName(this, 'ApiCustomDomain', {
        domainName: domainConfig.domainName,
        certificate: certificate,
        endpointType: apigateway.EndpointType.REGIONAL,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2, // Recommended for production
      });

      // Ensure deploymentStage is available before creating BasePathMapping
      if (this.api.deploymentStage) {
        new apigateway.BasePathMapping(this, 'ApiBasePathMapping', {
          domainName: apiDomainName,
          restApi: this.api,
          basePath: domainConfig.basePath || '', // e.g., 'v1' or empty for root mapping
          stage: this.api.deploymentStage,
        });
      } else {
         cdk.Annotations.of(this).addWarning(
            `Deployment stage for API ${this.api.restApiName} not found. BasePathMapping skipped for custom domain ${domainConfig.domainName}.`
        );
      }

      // Optional: Create Route 53 Alias record
      // Infer zoneName and recordName based on the SDS example logic (4.2.4)
      let inferredHostedZoneName = domainConfig.domainName; // Default for apex domains or if no dot found
      const firstDotIndex = domainConfig.domainName.indexOf('.');
      if (firstDotIndex > -1 && domainConfig.domainName.length > firstDotIndex + 1) {
          // If domainName is "api.example.com", inferredHostedZoneName becomes "example.com"
          // If domainName is "example.com", this part is skipped, remains "example.com"
          inferredHostedZoneName = domainConfig.domainName.substring(firstDotIndex + 1);
      }

      // If domainName is "api.example.com", inferredRecordName becomes "api"
      // If domainName is "example.com", inferredRecordName becomes "example"
      const inferredRecordName = domainConfig.domainName.split('.')[0];

      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'ApiHostedZone', {
        hostedZoneId: domainConfig.hostedZoneId,
        zoneName: inferredHostedZoneName, // This zoneName must correctly match the zone for the provided hostedZoneId
      });

      // The recordName for ARecord needs to be the part of domainConfig.domainName NOT in hostedZone.zoneName.
      // The SDS's `domainConfig.domainName.split('.')[0]` (inferredRecordName) is used here as per SDS example.
      // This assumes a simple structure like 'subdomain.zone.com' where zone is 'zone.com' and record is 'subdomain'.
      // For an apex domain (e.g., domainConfig.domainName = "example.com", hostedZone.zoneName = "example.com"),
      // inferredRecordName would be "example", which is incorrect for an ARecord's recordName (should be empty).
      // However, sticking to SDS specified inference. Careful configuration of domainName and hostedZoneId context is crucial.
      new route53.ARecord(this, 'ApiAliasRecord', {
        zone: hostedZone,
        recordName: inferredRecordName,
        target: route53.RecordTarget.fromAlias(new route53targets.ApiGatewayDomain(apiDomainName)),
      });

      new cdk.CfnOutput(this, 'CustomApiEndpoint', {
          value: `https://${apiDomainName.domainName}/${domainConfig.basePath || ''}`,
          description: 'Custom API Gateway Endpoint URL',
      });
    }

    // 7. Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway Endpoint URL',
    });

    new cdk.CfnOutput(this, 'ApiId', {
        value: this.api.restApiId,
        description: 'API Gateway ID',
    });

    if (this.api.deploymentStage) {
        new cdk.CfnOutput(this, 'ApiStageName', {
            value: this.api.deploymentStage.stageName,
            description: 'API Gateway Deployment Stage Name',
        });
    }
  }
}
```