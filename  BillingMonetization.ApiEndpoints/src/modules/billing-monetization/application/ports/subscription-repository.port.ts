// Assuming SubscriptionModel is defined in the domain layer, e.g.,
// import { SubscriptionModel } from '../../domain/subscription.model';
// For now, using a placeholder interface:
export interface SubscriptionModel {
  id: string;
  merchantId: string;
  planId: string;
  status: string; // e.g., 'active', 'canceled', 'past_due'
  billingCycle: 'monthly' | 'annual';
  startDate: Date;
  endDate?: Date | null;
  nextBillingDate: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  paymentGatewayCustomerId?: string;
  // other relevant fields
  createdAt: Date;
  updatedAt: Date;
  version?: number;
}


export interface ISubscriptionRepositoryPort {
  findById(id: string): Promise<SubscriptionModel | null>;
  findByMerchantId(merchantId: string): Promise<SubscriptionModel | null>; // Assuming one active subscription per merchant for simplicity
  // findActiveByMerchantId(merchantId: string): Promise<SubscriptionModel | null>; // More specific
  save(subscription: Omit<SubscriptionModel, 'id' | 'createdAt' | 'updatedAt' | 'version'> | SubscriptionModel): Promise<SubscriptionModel>;
  update(
    id: string,
    subscriptionUpdate: Partial<Omit<SubscriptionModel, 'id' | 'merchantId' | 'createdAt' | 'updatedAt' | 'version'>> & { version?: number }
  ): Promise<SubscriptionModel | null>;
  // Add other methods as needed, e.g., list subscriptions with filters
}

export const ISubscriptionRepositoryPort = Symbol('ISubscriptionRepositoryPort');