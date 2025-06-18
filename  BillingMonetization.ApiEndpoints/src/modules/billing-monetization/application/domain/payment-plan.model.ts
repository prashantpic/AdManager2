/**
 * Domain model representing a subscription payment plan.
 * Encapsulates the details of a payment plan offered to merchants.
 * This is primarily a value object or read-only entity.
 */
export class PaymentPlanModel {
  public readonly id: string;
  public readonly name: string;
  public readonly monthlyPrice: number; // Price in smallest currency unit (e.g., cents)
  public readonly annualPrice: number; // Price in smallest currency unit (e.g., cents)
  public readonly features: string[];
  public readonly transactionFeeRate?: number; // E.g., 0.02 for 2%
  public readonly usageLimits: Record<string, any>; // e.g., { campaigns: 10, users: 1 }

  constructor(
    id: string,
    name: string,
    monthlyPrice: number,
    annualPrice: number,
    features: string[],
    usageLimits: Record<string, any>,
    transactionFeeRate?: number,
  ) {
    this.id = id;
    this.name = name;
    this.monthlyPrice = monthlyPrice;
    this.annualPrice = annualPrice;
    this.features = features;
    this.usageLimits = usageLimits;
    this.transactionFeeRate = transactionFeeRate;
  }
}