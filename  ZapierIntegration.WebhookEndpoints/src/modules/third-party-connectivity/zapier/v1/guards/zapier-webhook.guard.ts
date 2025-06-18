import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ZapierConfig } from '../config/zapier.config';
import { ZAPIER_SIGNATURE_HEADER } from '../zapier.constants';
import * as crypto from 'crypto';

@Injectable()
export class ZapierWebhookGuard implements CanActivate {
  private readonly logger = new Logger(ZapierWebhookGuard.name);

  constructor(private readonly zapierConfig: ZapierConfig) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const merchantId = request.params.merchantId; // Assuming merchantId is part of the path for per-merchant secrets

    try {
      // Option 1: Simple Shared Secret (less secure, primarily for internal/trusted Zapier setups)
      // const providedSecret = request.headers['x-zapier-secret'] as string; // Example header
      // const expectedSecret = this.zapierConfig.getWebhookSecret(merchantId);
      // if (providedSecret === expectedSecret) {
      //   return true;
      // }

      // Option 2: HMAC Signature Validation (more secure, if Zapier supports this pattern)
      // This usually involves Zapier sending a signature and the raw request body.
      // You'd then compute the HMAC of the body using your shared secret and compare.
      const zapierSignature = request.headers[ZAPIER_SIGNATURE_HEADER.toLowerCase()] as string;
      const rawBody = (request as any).rawBody; // Requires rawBodyParser middleware or similar setup in main.ts (e.g., NestFactory.create(AppModule, { rawBody: true }))

      if (!zapierSignature || !rawBody) {
        this.logger.warn(`Missing Zapier signature or raw body for merchant: ${merchantId}`);
        throw new UnauthorizedException('Missing Zapier signature or request body.');
      }

      const expectedSecret = this.zapierConfig.getWebhookSecret(merchantId);
      const hmac = crypto.createHmac('sha256', expectedSecret);
      const computedSignature = hmac.update(rawBody).digest('hex');

      // Ensure Buffer.from is used for timingSafeEqual for security
      const sigBuffer = Buffer.from(zapierSignature);
      const computedSigBuffer = Buffer.from(computedSignature);

      if (sigBuffer.length === computedSigBuffer.length && crypto.timingSafeEqual(sigBuffer, computedSigBuffer)) {
        this.logger.log(`Zapier webhook validated successfully for merchant: ${merchantId}`);
        return true;
      }

      this.logger.warn(`Invalid Zapier signature for merchant: ${merchantId}. Provided: ${zapierSignature}, Computed: ${computedSignature}`);
      throw new UnauthorizedException('Invalid Zapier signature.');

    } catch (error) {
      this.logger.error(`Zapier webhook authentication failed for merchant ${merchantId}: ${error.message}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Zapier webhook authentication failed.');
    }
  }
}
// Note: The `rawBody` part needs careful setup with NestJS. 
// It might require a custom body parser or middleware to preserve the raw request body for signature verification.
// Or, ensure NestJS is started with `NestFactory.create(AppModule, { rawBody: true });`
// A simpler approach if Zapier only supports a static token in the header would be to just compare that token. The HMAC approach is more robust.
// The guard should ideally differentiate between global secrets and per-merchant secrets if applicable.
// The current implementation assumes `merchantId` is available in `request.params` and `getWebhookSecret` can use it.