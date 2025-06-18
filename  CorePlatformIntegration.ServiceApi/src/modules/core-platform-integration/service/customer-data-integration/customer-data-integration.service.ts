import { Injectable, Logger } from '@nestjs/common';
import { CustomerClient } from './customer.client';
import { CustomerEligibilityRequestDto } from './dtos/customer-eligibility-request.dto';
import { CustomerEligibilityResponseDto } from './dtos/customer-eligibility-response.dto';

// Internal DTO (as per SDS 3.11.3)
// This would typically live in a shared types/interfaces file or within the client's scope.
interface CoreCustomerAttributesDto {
  [key: string]: any; // Flexible structure as per SDS
  // Example known attributes:
  // isNewCustomer?: boolean;
  // segment?: string;
  // totalSpend?: number;
}

@Injectable()
export class CustomerDataIntegrationService {
  private readonly logger = new Logger(CustomerDataIntegrationService.name);

  constructor(private readonly customerClient: CustomerClient) {}

  async getCustomerEligibility(
    request: CustomerEligibilityRequestDto,
  ): Promise<CustomerEligibilityResponseDto> {
    this.logger.log(
      `Fetching customer eligibility for customerId: ${request.customerId}, promotionId: ${request.promotionId}`,
    );
    this.logger.debug(`Eligibility criteria: ${JSON.stringify(request.eligibilityCriteria)}`);


    if (!request.eligibilityCriteria || typeof request.eligibilityCriteria !== 'object' || Object.keys(request.eligibilityCriteria).length === 0) {
        this.logger.warn(`Invalid or empty eligibilityCriteria for customerId: ${request.customerId}`);
        // Depending on strictness, could throw error or return not eligible
        return {
            customerId: request.customerId,
            promotionId: request.promotionId,
            isEligible: false,
            // reason: "Invalid or empty eligibility criteria provided." // Optional field
        };
    }

    // Determine which customer attributes are needed from request.eligibilityCriteria
    // For a flexible criteria object, this means fetching all attributes listed as keys in the criteria.
    const requiredAttributes: string[] = Object.keys(request.eligibilityCriteria);

    if (requiredAttributes.length === 0) {
        this.logger.log(`No specific attributes requested via eligibilityCriteria for customerId: ${request.customerId}. Assuming eligibility check might be general or criteria misformed.`);
        // Defaulting to not eligible if criteria are present but list no attributes; or this service could fetch a default set.
        // For now, if criteria object exists but is empty, it's ambiguous.
        // Let's assume an empty criteria object means "no specific criteria to check from core platform", potentially always eligible or always ineligible based on policy.
        // For this example, let's say if criteria were provided but empty, it's a misconfiguration.
         return {
            customerId: request.customerId,
            promotionId: request.promotionId,
            isEligible: false, // Or true, depending on business rule for empty criteria
            // reason: "Eligibility criteria object was empty."
        };
    }


    try {
      const customerAttributes: CoreCustomerAttributesDto =
        await this.customerClient.fetchCustomerAttributes(
          request.customerId,
          requiredAttributes,
        );
      
      this.logger.debug(`Fetched attributes for customer ${request.customerId}: ${JSON.stringify(customerAttributes)}`);

      // Apply the eligibility logic based on fetched attributes and request.eligibilityCriteria
      // This logic can be complex and depends on the structure of eligibilityCriteria.
      // Example: criteria = {"isNewCustomer": true, "segment": "VIP"}
      let isEligible = true;
      for (const key of requiredAttributes) {
        if (customerAttributes[key] !== request.eligibilityCriteria[key]) {
          isEligible = false;
          this.logger.log(`Eligibility check failed for customer ${request.customerId} on attribute '${key}'. Expected: ${request.eligibilityCriteria[key]}, Got: ${customerAttributes[key]}`);
          break;
        }
      }

      // Ensure data handling complies with REQ-CPSI-008 (logging, security are handled by base client and controller layers)
      this.logger.log(
        `Customer ${request.customerId} eligibility for promotion ${request.promotionId}: ${isEligible}`,
      );

      return {
        customerId: request.customerId,
        promotionId: request.promotionId,
        isEligible,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching customer eligibility for customerId ${request.customerId}: ${error.message}`,
        error.stack,
      );
      // If error is specific like "Customer Not Found", map to isEligible: false
      // Otherwise, rethrow for controller
      // For simplicity, rethrowing all. Controller should map.
      throw error;
    }
  }
}