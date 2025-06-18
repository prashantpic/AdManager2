export interface CustomerPii {
  email?: string;
  phone?: string;
  // ... other identifiable fields
  [key: string]: any;
}

export interface ICorePlatformDataService {
  // Retrieves a list of customer PII based on a segment defined in the core platform
  getCustomerPiiBySegment(
    segmentId: string,
    merchantId: string,
  ): Promise<CustomerPii[]>;

  // Hashes specified PII fields in a list of customer data
  // Returns the list with specified fields hashed
  hashCustomerPiiBatch(
    customerData: CustomerPii[],
    fieldsToHash: Array<keyof CustomerPii | string>, // Allow string for dynamic keys
  ): Promise<Array<{ [key: string]: any }>>; // Returns data with specified fields hashed
}