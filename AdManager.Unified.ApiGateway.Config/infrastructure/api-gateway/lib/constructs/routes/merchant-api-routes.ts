import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface MerchantApiRoutesProps {
  readonly api: apigateway.RestApi;
  readonly authorizer: apigateway.IAuthorizer;
  // Define integrations for each backend service the merchant API interacts with
  readonly campaignServiceIntegration: apigateway.Integration;
  readonly productCatalogServiceIntegration: apigateway.Integration;
  readonly analyticsServiceIntegration: apigateway.Integration;
  // Example for a potential promotions service integration
  // readonly promotionsServiceIntegration: apigateway.Integration;
}

export class MerchantApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: MerchantApiRoutesProps) {
    super(scope, id);

    const commonMethodOptions: apigateway.MethodOptions = {
        authorizer: props.authorizer,
        // Example: If API Key is required for these routes
        // apiKeyRequired: true,
    };

    // --- Base path for all merchant APIs ---
    // Example: /merchant/v1
    const merchantApiRoot = props.api.root.addResource('merchant').addResource('v1');

    // --- Campaign Management Endpoints ---
    // Corresponds to REPO-CAMP-001 for campaign, ad set, ad, A/B test management
    const campaignsRoot = merchantApiRoot.addResource('campaigns');

    // GET /merchant/v1/campaigns
    campaignsRoot.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
    // POST /merchant/v1/campaigns
    campaignsRoot.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);

    const campaignById = campaignsRoot.addResource('{campaignId}');
    // GET /merchant/v1/campaigns/{campaignId}
    campaignById.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
    // PUT /merchant/v1/campaigns/{campaignId}
    campaignById.addMethod('PUT', props.campaignServiceIntegration, commonMethodOptions);
    // DELETE /merchant/v1/campaigns/{campaignId}
    // campaignById.addMethod('DELETE', props.campaignServiceIntegration, commonMethodOptions); // Uncomment if applicable

    // TODO: Add routes for Ad Sets within a campaign
    // const adSets = campaignById.addResource('adsets');
    // adSets.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
    // adSets.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);
    // const adSetById = adSets.addResource('{adSetId}');
    // adSetById.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
    // adSetById.addMethod('PUT', props.campaignServiceIntegration, commonMethodOptions);

    // TODO: Add routes for Ads within an Ad Set
    // const ads = adSetById.addResource('ads');
    // ...

    // TODO: Add routes for A/B Tests within a campaign
    // const abTests = campaignById.addResource('abtests');
    // ...

    // --- Product Catalog Management Endpoints ---
    // Corresponds to [ID_ProductCatalog_ApiEndpoints] in a hypothetical detailed spec
    const productCatalogsRoot = merchantApiRoot.addResource('product-catalogs');

    // GET /merchant/v1/product-catalogs
    productCatalogsRoot.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);
    // POST /merchant/v1/product-catalogs
    productCatalogsRoot.addMethod('POST', props.productCatalogServiceIntegration, commonMethodOptions);

    const catalogById = productCatalogsRoot.addResource('{catalogId}');
    // GET /merchant/v1/product-catalogs/{catalogId}
    catalogById.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);
    // PUT /merchant/v1/product-catalogs/{catalogId}
    // catalogById.addMethod('PUT', props.productCatalogServiceIntegration, commonMethodOptions); // Uncomment if applicable
    // DELETE /merchant/v1/product-catalogs/{catalogId}
    // catalogById.addMethod('DELETE', props.productCatalogServiceIntegration, commonMethodOptions); // Uncomment if applicable

    // TODO: Add routes for products within a catalog
    // const productsInCatalog = catalogById.addResource('products');
    // productsInCatalog.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);
    // ...

    // --- Analytics & Reporting Endpoints ---
    // Corresponds to [ID_Analytics_ApiEndpoints] in a hypothetical detailed spec
    const analyticsRoot = merchantApiRoot.addResource('analytics');

    // GET /merchant/v1/analytics/performance
    analyticsRoot.addResource('performance').addMethod('GET', props.analyticsServiceIntegration, commonMethodOptions);
    // GET /merchant/v1/analytics/audience-insights
    // analyticsRoot.addResource('audience-insights').addMethod('GET', props.analyticsServiceIntegration, commonMethodOptions); // Example

    // --- Promotions & Offers ---
    // (Map to Promotions_ApiEndpoints if defined)
    // const promotionsRoot = merchantApiRoot.addResource('promotions');
    // promotionsRoot.addMethod('GET', props.promotionsServiceIntegration, commonMethodOptions); // Example
    // ...

    // Add more routes for other merchant-facing features as needed (e.g., A/B testing results, billing info view, etc.)
  }
}