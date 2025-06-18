import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZAPIER_WEBHOOK_SECRET_CONFIG_KEY } from '../zapier.constants';

@Injectable()
export class ZapierConfig {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves the Zapier webhook secret.
   * This secret is used to validate incoming webhooks from Zapier.
   * It should be configured per merchant or globally depending on security model.
   * For this example, we assume a global secret for simplicity, but per-merchant is more secure.
   *
   * @param merchantId - Optional: The ID of the merchant if secrets are per-merchant.
   * @returns The Zapier webhook secret.
   * @throws Error if the secret is not configured.
   */
  getWebhookSecret(merchantId?: string): string {
    // Example: For a global secret
    const secret = this.configService.get<string>(ZAPIER_WEBHOOK_SECRET_CONFIG_KEY);
    // Example: For per-merchant secret, the key might be `ZAPIER_WEBHOOK_SECRET_${merchantId}`
    // const secret = this.configService.get<string>(`ZAPIER_WEBHOOK_SECRET_${merchantId}`);

    if (!secret) {
      this.configService.get<string>(`ZAPIER_WEBHOOK_SECRET_${merchantId}`);
      throw new Error(`Zapier webhook secret ('${ZAPIER_WEBHOOK_SECRET_CONFIG_KEY}') is not configured.`);
    }
    return secret;
  }

  // Add other Zapier-related configurations if needed
  // e.g., default Zapier API base URL, specific app identifiers
}