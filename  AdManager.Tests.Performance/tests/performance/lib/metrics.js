import { Trend, Rate, Counter, Gauge } from 'k6/metrics';

// Trend metrics (measure duration, typically in milliseconds)
export const campaignCreationTime = new Trend('campaign_creation_time', true); // true means add `avg`, `min`, `med`, `max`, `p(90)`, `p(95)`
export const productSearchLatency = new Trend('product_search_latency', true);
export const landingPageTTFB = new Trend('landing_page_ttfb', true); // Time To First Byte for landing pages
export const analyticsProcessingTime = new Trend('analytics_processing_time', true); // Hypothetical backend processing time if measurable via API
export const catalogLargeListResponseTime = new Trend('catalog_large_list_response_time', true); // For REQ-PC-010

// Additional Trend metrics for critical_api_endpoints_load.js
export const dashboardLoadTime = new Trend('dashboard_load_time', true);
export const viewCampaignListTime = new Trend('view_campaign_list_time', true);
export const updateUserSettingTime = new Trend('update_user_setting_time', true);


// Rate metrics (measure frequency of events, e.g., error rate)
export const impressionApiErrorRate = new Rate('impression_api_error_rate'); // Tracks the rate of failed impression API calls

// Example Counter metric (tracks total count of occurrences)
// export const totalCampaignsCreated = new Counter('total_campaigns_created');

// Example Gauge metric (tracks a value that can go up or down, e.g., active VUs - though k6 has built-in for this)
// export const activeConnections = new Gauge('active_connections');

// Note: Standard k6 metrics like http_req_duration, http_req_failed, vus, iterations etc. are automatically collected.
// Custom metrics are used for business-specific or operation-specific measurements that provide more granular insights.