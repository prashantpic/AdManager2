import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import { ProductIntegrationService } from './product-integration/product-integration.service';
import { AuthIntegrationService } from './auth-integration/auth-integration.service';
import { CustomerDataIntegrationService } from './customer-data-integration/customer-data-integration.service';
import { OrderDataIntegrationService } from './order-data-integration/order-data-integration.service';
import { DirectOrderIntegrationService } from './direct-order-integration/direct-order-integration.service';

// DTOs for gRPC methods (assuming these are generated from .proto or manually created)
import { ProductSyncRequestDto } from './product-integration/dtos/product-sync-request.dto';
import { ProductSyncResponseDto } from './product-integration/dtos/product-sync-response.dto';
import { AuthRequestDto } from './auth-integration/dtos/auth-request.dto';
import { AuthResponseDto } from './auth-integration/dtos/auth-response.dto';
import { CustomerEligibilityRequestDto } from './customer-data-integration/dtos/customer-eligibility-request.dto';
import { CustomerEligibilityResponseDto } from './customer-data-integration/dtos/customer-eligibility-response.dto';
import { OrderDataRequestDto } from './order-data-integration/dtos/order-data-request.dto';
import { OrderDataResponseDto } from './order-data-integration/dtos/order-data-response.dto';
import { DirectOrderLinkRequestDto } from './direct-order-integration/dtos/direct-order-link-request.dto';
import { DirectOrderLinkResponseDto } from './direct-order-integration/dtos/direct-order-link-response.dto';
import { ProductConflictResolutionRequestDto } from './product-integration/dtos/product-conflict-resolution-request.dto';
import { ProductConflictResolutionResponseDto } from './product-integration/dtos/product-conflict-resolution-response.dto';
import { EmptyRequestDto } from './common/dtos/empty-request.dto';
import { ApiStatusResponseDto } from './common/dtos/api-status-response.dto';

// Assuming custom exceptions are defined here, e.g.
// import { CorePlatformNotFoundException, CorePlatformBadRequestException, CorePlatformServiceUnavailableException } from '../../common/exceptions/core-platform-integration.exceptions';
// For now, we'll catch generic Error and specific known error messages if needed for mapping.

const GRPC_SERVICE_NAME = 'CorePlatformIntegration';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Apply validation globally to controller methods
export class CorePlatformIntegrationGrpcController {
  constructor(
    private readonly productIntegrationService: ProductIntegrationService,
    private readonly authIntegrationService: AuthIntegrationService,
    private readonly customerDataIntegrationService: CustomerDataIntegrationService,
    private readonly orderDataIntegrationService: OrderDataIntegrationService,
    private readonly directOrderIntegrationService: DirectOrderIntegrationService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(CorePlatformIntegrationGrpcController.name);
  }

  private handleError(error: any, methodName: string): RpcException {
    this.logger.error(`Error in ${methodName}: ${error.message}`, error.stack);
    // Based on SDS Section 6 for mapping
    // Assuming custom exceptions like CorePlatformNotFoundException exist and extend Error
    // And have a 'name' property identifying them.
    if (error.name === 'CorePlatformNotFoundException') {
      return new RpcException({ code: status.NOT_FOUND, message: error.message || 'Resource not found.' });
    }
    if (error.name === 'CorePlatformBadRequestException' || error.constructor?.name === 'ValidationException') { // class-validator might throw this
      return new RpcException({ code: status.INVALID_ARGUMENT, message: error.message || 'Invalid argument provided.' });
    }
    if (error.name === 'CorePlatformServiceUnavailableException') {
      return new RpcException({ code: status.UNAVAILABLE, message: error.message || '[PlatformName] API is unavailable.' });
    }
    if (error.name === 'CorePlatformUnauthorizedException') {
      return new RpcException({ code: status.UNAUTHENTICATED, message: error.message || 'Authentication failed or unauthorized.' });
    }
     if (error.name === 'CorePlatformConflictException') {
      return new RpcException({ code: status.ALREADY_EXISTS, message: error.message || 'Conflict detected.' });
    }
    // For RpcException already, rethrow
    if (error instanceof RpcException) {
        return error;
    }
    // Default internal error
    return new RpcException({ code: status.INTERNAL, message: `An internal error occurred in ${methodName}.` });
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'SynchronizeProduct')
  async synchronizeProduct(data: ProductSyncRequestDto): Promise<ProductSyncResponseDto> {
    this.logger.log(`Received SynchronizeProduct request: ${JSON.stringify(data)}`);
    try {
      const response = await this.productIntegrationService.synchronizeProducts(data);
      this.logger.log(`Responding to SynchronizeProduct: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'SynchronizeProduct');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'ResolveProductConflict')
  async resolveProductConflict(data: ProductConflictResolutionRequestDto): Promise<ProductConflictResolutionResponseDto> {
    this.logger.log(`Received ResolveProductConflict request: ${JSON.stringify(data)}`);
    try {
      const response = await this.productIntegrationService.resolveConflict(data);
      this.logger.log(`Responding to ResolveProductConflict: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'ResolveProductConflict');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'DelegateAuthentication')
  async delegateAuthentication(data: AuthRequestDto): Promise<AuthResponseDto> {
    this.logger.log(`Received DelegateAuthentication request for user: ${data.username}`); // Mask password if present in DTO
    try {
      const response = await this.authIntegrationService.delegateAuthentication(data);
      this.logger.log(`Responding to DelegateAuthentication for user ${data.username}: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'DelegateAuthentication');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'GetCustomerEligibility')
  async getCustomerEligibility(data: CustomerEligibilityRequestDto): Promise<CustomerEligibilityResponseDto> {
    this.logger.log(`Received GetCustomerEligibility request: ${JSON.stringify(data)}`);
    try {
      const response = await this.customerDataIntegrationService.getCustomerEligibility(data);
      this.logger.log(`Responding to GetCustomerEligibility: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'GetCustomerEligibility');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'GetOrderData')
  async getOrderData(data: OrderDataRequestDto): Promise<OrderDataResponseDto> {
    this.logger.log(`Received GetOrderData request: ${JSON.stringify(data)}`);
    try {
      const response = await this.orderDataIntegrationService.getOrderData(data);
      this.logger.log(`Responding to GetOrderData: ${JSON.stringify(response.orders?.length)} orders found.`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'GetOrderData');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'GenerateDirectOrderLink')
  async generateDirectOrderLink(data: DirectOrderLinkRequestDto): Promise<DirectOrderLinkResponseDto> {
    this.logger.log(`Received GenerateDirectOrderLink request: ${JSON.stringify(data)}`);
    try {
      const response = await this.directOrderIntegrationService.generateDirectOrderLink(data);
      this.logger.log(`Responding to GenerateDirectOrderLink: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'GenerateDirectOrderLink');
    }
  }

  @GrpcMethod(GRPC_SERVICE_NAME, 'GetCorePlatformApiStatus')
  async getCorePlatformApiStatus(data: EmptyRequestDto): Promise<ApiStatusResponseDto> {
    this.logger.log(`Received GetCorePlatformApiStatus request: ${JSON.stringify(data)}`);
    try {
      // This method would ideally ping the actual core platform API endpoints
      // For now, returning a placeholder. In a real implementation, this would involve
      // calling a method on each client or a dedicated health check service for the external platform.
      // Example: await this.productIntegrationService.checkPlatformStatus();
      this.logger.log('GetCorePlatformApiStatus: Currently returning placeholder status.');
      // Simulate checking different services - this is conceptual
      // In a real scenario, this would involve calling methods on clients or services
      // to check connectivity or a cached status.
      // For this example, let's assume ProductClient might have a ping method.
      // const productClientAvailable = await this.productIntegrationService.isProductApiAvailable();
      
      // For now, a generic successful response if no specific check logic is defined in services/clients yet.
      // This part would be more elaborate based on how API status is determined.
      // For the SDS, it mentions "iterate through clients to ping their respective core platform API endpoints"
      // This logic should be in the service layer ideally, not controller.
      // Let's assume a service method handles this:
      // const statusResponse = await this.someAggregatedStatusService.getOverallStatus();

      // Placeholder as per SDS example which is simple:
      return {
        is_available: true,
        message: '[PlatformName] API is responsive (Simulated Check).',
        // checkedApi: '[PlatformName] General Endpoint' // this was in file structure, but proto has boolean and string
      };
    } catch (error) {
      throw this.handleError(error, 'GetCorePlatformApiStatus');
    }
  }
}