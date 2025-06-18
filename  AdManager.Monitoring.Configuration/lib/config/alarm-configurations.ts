import * as cdk from 'aws-cdk-lib';

/**
 * API Gateway Alarm Configurations
 */
export const API_GATEWAY_5XX_ERROR_THRESHOLD_PERCENTAGE: number = 5; // Example: 5% error rate
export const API_GATEWAY_LATENCY_P99_THRESHOLD_MS: number = 2000; // Example: 2000 ms
export const API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD: number = 10; // Example: alert if fewer than 10 requests in period

/**
 * Lambda Alarm Configurations
 */
export const LAMBDA_ERROR_RATE_THRESHOLD_PERCENTAGE: number = 1; // Example: 1% error rate
export const LAMBDA_THROTTLE_THRESHOLD_COUNT: number = 5; // Example: 5 throttles in period
export const LAMBDA_DURATION_P95_THRESHOLD_MS: number = 5000; // Example: 5000 ms

/**
 * RDS Alarm Configurations
 */
export const RDS_CPU_UTILIZATION_THRESHOLD_PERCENTAGE: number = 80; // Example: 80%
export const RDS_DB_CONNECTIONS_THRESHOLD_COUNT: number = 100; // Example: 100 connections
export const RDS_FREE_STORAGE_THRESHOLD_GB: number = 10; // Example: 10 GB

/**
 * DynamoDB Alarm Configurations
 */
export const DYNAMODB_THROTTLE_EVENTS_THRESHOLD_COUNT: number = 50; // Example: 50 throttle events

/**
 * Custom Metrics Alarm Configurations
 */
export const ORDER_PROCESSING_FAILURE_THRESHOLD: number = 5; // Example: 5 failures

/**
 * Common Alarm Configurations
 */
export const DEFAULT_EVALUATION_PERIODS: number = 3; // Example: 3 evaluation periods
export const CRITICAL_ALARM_PERIOD_SECONDS: cdk.Duration = cdk.Duration.seconds(300); // 5 minutes
export const WARNING_ALARM_PERIOD_SECONDS: cdk.Duration = cdk.Duration.seconds(600); // 10 minutes
export const INFO_ALARM_PERIOD_SECONDS: cdk.Duration = cdk.Duration.seconds(900); // 15 minutes (example)