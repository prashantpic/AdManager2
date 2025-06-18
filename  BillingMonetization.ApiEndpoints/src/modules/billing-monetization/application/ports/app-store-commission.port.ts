// Placeholder interface for AppSaleData.
// This would be defined based on the actual data structure from the App Store system.
export interface AppSaleData {
  appId: string;
  appName: string;
  saleTimestamp: Date;
  saleAmount: number;
  currency: string;
  transactionId: string; // Unique ID for the sale transaction
  merchantIdIncurringSale?: string; // If commission is based on specific merchant sales via an app
  // Other relevant fields like product sold, quantity, customer info (if anonymized/relevant)
}

export interface AppStoreCommissionQueryOptions {
    startDate: Date;
    endDate: Date;
    appIds?: string[]; // Optional filter by specific app IDs
    // Other potential filters
}

export interface IAppStoreCommissionPort {
  /**
   * Fetches app sales data from the [PlatformName] App Store system for a given period.
   * This data is used to calculate the commissions earned by [PlatformName].
   * @param options - Options for querying sales data, including date range and optional filters.
   * @returns A promise that resolves to an array of AppSaleData objects.
   */
  getAppSalesDataForPeriod(
    options: AppStoreCommissionQueryOptions,
  ): Promise<AppSaleData[]>;

  // Potentially other methods related to app store data, e.g.,
  // getAppDetails(appId: string): Promise<AppDetail>;
}

export const IAppStoreCommissionPort = Symbol('IAppStoreCommissionPort');