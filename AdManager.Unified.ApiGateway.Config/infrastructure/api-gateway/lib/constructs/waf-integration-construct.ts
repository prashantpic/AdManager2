import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

export interface WafIntegrationConstructProps {
    /**
     * The scope of the WAF WebACL.
     * 'REGIONAL' for API Gateway, ALB.
     * 'CLOUDFRONT' for CloudFront distributions.
     */
    readonly scope: 'REGIONAL' | 'CLOUDFRONT';
    /**
     * Optional: Name for the WebACL.
     * @default AdManagerWebAcl-${region}-${scope}
     */
    readonly webAclName?: string;
    /**
     * Optional: Metric name for CloudWatch.
     * @default AdManagerWebAclMetric-${scope}
     */
    readonly metricName?: string;
}

export class WafIntegrationConstruct extends Construct {
  public readonly webAclArn: string;
  public readonly webAcl: wafv2.CfnWebACL;

  constructor(scope: Construct, id: string, props: WafIntegrationConstructProps) {
    super(scope, id);

    const stack = cdk.Stack.of(this);
    const aclName = props.webAclName || `AdManagerWebAcl-${stack.region}-${props.scope}`;
    const cwMetricName = props.metricName || `AdManagerWebAclMetric-${props.scope}`;


    this.webAcl = new wafv2.CfnWebACL(this, 'AdManagerWebAclResource', {
      name: aclName,
      scope: props.scope,
      defaultAction: { allow: {} }, // Default to allow, block with specific rules
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: cwMetricName,
        sampledRequestsEnabled: true, // Enable for better visibility and debugging
      },
      description: 'WebACL for AdManager API Gateway protection',
      rules: [
        // Rule Priority 0 is highest
        // Example: Rate-based rule to mitigate DDoS and brute-force attacks
        {
            name: 'RateLimitRule',
            priority: 1, // High priority
            action: {
                block: {}, // Block requests exceeding the limit
                // count: {} // Alternatively, count requests to test the rule
            },
            statement: {
                rateBasedStatement: {
                    limit: 2000, // Max requests per 5-minute period per IP. Adjust as per expected traffic.
                    aggregateKeyType: 'IP', // Rate limit based on source IP address
                    // scopeDownStatement: {} // Optionally, apply this rule only to specific parts of requests
                },
            },
            visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: `${cwMetricName}-RateLimit`,
            },
        },
        // AWS Managed Rule: Common Rule Set (CRS) - protects against common attack patterns
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 10,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
              // Example: Excluding a specific rule from the group
              // excludedRules: [{ name: 'SizeRestrictions_BODY' }],
            },
          },
          overrideAction: { none: {} }, // Use actions defined within the rule group
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${cwMetricName}-CommonRules`,
          },
        },
        // AWS Managed Rule: Known Bad Inputs - blocks requests with patterns known to be malicious
        {
          name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
          priority: 20,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet',
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${cwMetricName}-BadInputs`,
          },
        },
        // AWS Managed Rule: Amazon IP Reputation List - blocks IPs with poor reputation
        {
          name: 'AWS-AWSManagedRulesAmazonIpReputationList',
          priority: 30,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesAmazonIpReputationList',
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${cwMetricName}-IPReputation`,
          },
        },
        // AWS Managed Rule: SQL Injection
        {
          name: 'AWS-AWSManagedRulesSQLiRuleSet',
          priority: 40,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesSQLiRuleSet',
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${cwMetricName}-SQLi`,
          },
        },
        // Add more managed or custom rules as needed, e.g., for XSS, specific bot control, geo-blocking.
      ],
      // tags: [{ key: 'service', value: 'AdManagerApiGateway' }] // Optional tagging
    });
    this.webAclArn = this.webAcl.attrArn;
  }
}