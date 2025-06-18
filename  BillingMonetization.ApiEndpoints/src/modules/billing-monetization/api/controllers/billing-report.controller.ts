import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard'; // Assuming path
import { RolesGuard } from '../../../../auth/guards/roles.guard'; // Assuming path
import { Roles } from '../../../../auth/decorators/roles.decorator'; // Assuming path
import { User } from '../../../../auth/decorators/user.decorator'; // Assuming path
import { UserRole } from '../../../../auth/enums/user-role.enum'; // Assuming path
import { ReportQueryDto } from '../dto/report/report-query.dto';
import { TransactionFeeReportRO } from '../dto/report/transaction-fee-report.ro';
import { AppCommissionReportRO } from '../dto/report/app-commission-report.ro';
import { IBillingMonetizationService } from '../../application/interfaces/billing-monetization-service.interface';

@ApiTags('Billing Reports')
@ApiBearerAuth()
@Controller('/v1/billing/reports')
@UseGuards(JwtAuthGuard)
export class BillingReportController {
  constructor(
    @Inject('BillingMonetizationService')
    private readonly billingMonetizationService: IBillingMonetizationService,
  ) {}

  @Get('/transaction-fees/me')
  @ApiOperation({ summary: 'Get Transaction Fee Report (Merchant)', description: 'Retrieves a summary of transaction fees incurred by the authenticated merchant for a specified period.' })
  @ApiQuery({ name: 'startDate', type: Date, description: 'Start date for the report (ISO 8601 YYYY-MM-DD).' })
  @ApiQuery({ name: 'endDate', type: Date, description: 'End date for the report (ISO 8601 YYYY-MM-DD).' })
  @ApiQuery({ name: 'filters', required: false, type: 'object', description: 'Additional filters for the report.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved transaction fee report.', type: TransactionFeeReportRO })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid query parameters.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getTransactionFeeReport(
    @User('merchantId') merchantId: string,
    @Query() queryOptions: ReportQueryDto,
  ): Promise<TransactionFeeReportRO> {
    return this.billingMonetizationService.generateTransactionFeeReport(merchantId, queryOptions);
  }

  @Get('/app-commissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PlatformAdmin)
  @ApiOperation({ summary: 'Get App Commission Report (Platform Admin)', description: 'Retrieves a summary of App Store commissions earned. Restricted to Platform Administrator roles.' })
  @ApiQuery({ name: 'startDate', type: Date, description: 'Start date for the report (ISO 8601 YYYY-MM-DD).' })
  @ApiQuery({ name: 'endDate', type: Date, description: 'End date for the report (ISO 8601 YYYY-MM-DD).' })
  @ApiQuery({ name: 'filters', required: false, type: 'object', description: 'Additional filters for the report.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved app commission report.', type: AppCommissionReportRO })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid query parameters.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have the required role.' })
  async getAppCommissionReport(@Query() queryOptions: ReportQueryDto): Promise<AppCommissionReportRO> {
    return this.billingMonetizationService.generateAppCommissionReport(queryOptions);
  }
}