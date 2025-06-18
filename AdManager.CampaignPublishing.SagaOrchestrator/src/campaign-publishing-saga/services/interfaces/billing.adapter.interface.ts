import { CheckCampaignBudgetCommand } from '../../messages/commands/check-campaign-budget.command';
import { ReleaseReservedBudgetCommand } from '../../messages/commands/release-reserved-budget.command';

/**
 * Interface defining the contract for interacting with the Billing.Service.
 * Abstracts the communication details for sending commands to the Billing.Service.
 */
export interface IBillingAdapter {
  /**
   * Sends a command to check the campaign budget.
   * @param command The CheckCampaignBudgetCommand payload.
   * @returns A promise that resolves when the command has been sent.
   */
  checkCampaignBudget(command: CheckCampaignBudgetCommand): Promise<void>;

  /**
   * Sends a command to release a previously reserved budget (compensation action).
   * @param command The ReleaseReservedBudgetCommand payload.
   * @returns A promise that resolves when the command has been sent.
   */
  releaseReservedBudget(command: ReleaseReservedBudgetCommand): Promise<void>;
}