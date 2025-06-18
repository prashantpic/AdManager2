import { OfferEligibilityDto } from '../dto/common/offer-eligibility.dto';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Interfaces
 */

/**
 * Interface for the Core Platform Service.
 * Defines the contract for interacting with the Core Platform Service,
 * primarily for customer eligibility verification.
 * @REQ_CPSI_004
 */
export interface ICorePlatformService {
  /**
   * Verifies customer eligibility against the Core Platform Service.
   * Sends a request to check if a given customer for a specific merchant
   * meets the defined eligibility criteria.
   *
   * @param merchantId - The UUID of the merchant.
   * @param customerId - The UUID of the customer.
   * @param eligibility - The eligibility criteria DTO.
   * @returns A promise that resolves to `true` if the customer is eligible, `false` otherwise.
   */
  verifyCustomerEligibility(
    merchantId: string,
    customerId: string,
    eligibility: OfferEligibilityDto,
  ): Promise<boolean>;
}