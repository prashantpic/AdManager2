/**
 * Email Notification Endpoints
 */
export const CRITICAL_ALERTS_EMAIL_ENDPOINT: string = "critical-alerts@example.com";
export const WARNING_ALERTS_EMAIL_ENDPOINT: string = "warning-alerts@example.com";
export const INFO_ALERTS_EMAIL_ENDPOINT: string = "info-alerts@example.com";

/**
 * PagerDuty Integration ARN
 * This could be an SNS Topic ARN or a Lambda Function ARN.
 * Example: "arn:aws:sns:us-east-1:123456789012:PagerDutyIntegrationTopic"
 * Example: "arn:aws:lambda:us-east-1:123456789012:function:PagerDutyIntegrationLambda"
 */
export const PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN: string | undefined = undefined; // "arn:aws:sns:us-east-1:123456789012:MyPagerDutySNSTopic";

/**
 * OpsGenie Integration Lambda ARN
 * Example: "arn:aws:lambda:us-east-1:123456789012:function:OpsGenieIntegrationLambda"
 */
export const OPSGENIE_INTEGRATION_LAMBDA_ARN: string | undefined = undefined;