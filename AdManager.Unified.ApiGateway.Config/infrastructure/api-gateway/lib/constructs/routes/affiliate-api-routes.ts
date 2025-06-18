import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface AffiliateApiRoutesProps {
  readonly api: apigateway.RestApi;
  readonly authorizer: apigateway.IAuthorizer;
  // Define integrations for each backend service the affiliate API interacts with
  readonly affiliateDashboardServiceIntegration: apigateway.Integration;
  readonly affiliateLinkServiceIntegration: apigateway.Integration;
  readonly affiliatePayoutServiceIntegration: apigateway.Integration;
  // ... add other integrations as needed
}

export class AffiliateApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: AffiliateApiRoutesProps) {
    super(scope, id);

    const commonMethodOptions: apigateway.MethodOptions = {
        authorizer: props.authorizer,
    };

    // --- Base path for all affiliate APIs ---
    // Example: /affiliate/v1
    const affiliateApiRoot = props.api.root.addResource('affiliate').addResource('v1');

    // --- Affiliate Dashboard Endpoints ---
    // Example: /affiliate/v1/dashboard
    const dashboardRoot = affiliateApiRoot.addResource('dashboard');
    // dashboardRoot.addMethod('GET', props.affiliateDashboardServiceIntegration, commonMethodOptions);

    // --- Affiliate Link Management Endpoints ---
    // Example: /affiliate/v1/links
    const linksRoot = affiliateApiRoot.addResource('links');
    // linksRoot.addMethod('GET', props.affiliateLinkServiceIntegration, commonMethodOptions);
    // linksRoot.addMethod('POST', props.affiliateLinkServiceIntegration, commonMethodOptions); // To generate new links

    // --- Affiliate Payout Endpoints ---
    // Example: /affiliate/v1/payouts
    const payoutsRoot = affiliateApiRoot.addResource('payouts');
    // payoutsRoot.addMethod('GET', props.affiliatePayoutServiceIntegration, commonMethodOptions); // List payout history
    // payoutsRoot.addResource('request').addMethod('POST', props.affiliatePayoutServiceIntegration, commonMethodOptions); // Request a payout

    // --- Other Affiliate Routes ---
    // Add more routes for other affiliate-facing functionalities such as:
    // - Performance reports (clicks, conversions)
    // - Profile management
    // - Access to promotional materials

    // Placeholder for actual route definitions.
    // The structure would be similar to MerchantApiRoutes, defining resources and methods
    // specific to affiliate functionalities.
    new apigateway.MockIntegration(); // Replace with actual integrations and routes.
    if (dashboardRoot && linksRoot && payoutsRoot) { // to avoid unused variable warning
        console.log('Affiliate routes construct created. Define actual routes and integrations.');
    }
  }
}