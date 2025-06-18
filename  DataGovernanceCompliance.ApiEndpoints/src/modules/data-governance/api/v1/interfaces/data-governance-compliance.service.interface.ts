import { ManageConsentDto } from '../dtos/consent/manage-consent.dto';
import { ConsentRecordDto } from '../dtos/consent/consent-record.dto';
import { ConsentReportQueryDto } from '../dtos/consent/consent-report-query.dto';
import { PagedResponseDto } from '../dtos/common/paged-response.dto';
import { SubmitDsrDto } from '../dtos/dsr/submit-dsr.dto';
import { DsrRequestDto } from '../dtos/dsr/dsr-request.dto';
import { DsrActionDto } from '../dtos/dsr/dsr-action.dto';
import { DsrDataExportDto } from '../dtos/dsr/dsr-data-export.dto';
import { ConfigureRetentionPolicyDto } from '../dtos/data-retention/configure-retention-policy.dto';
import { RetentionPolicyDto } from '../dtos/data-retention/retention-policy.dto';
import { DataLifecycleActionDto } from '../dtos/data-retention/data-lifecycle-action.dto';
import { DpaDto } from '../dtos/compliance/dpa.dto';
import { ProcessingActivityLogQueryDto } from '../dtos/compliance/processing-activity-log-query.dto';
import { ProcessingActivityLogDto } from '../dtos/compliance/processing-activity-log.dto';
import { AuditTrailQueryDto } from '../dtos/compliance/audit-trail-query.dto';
import { AuditTrailEntryDto } from '../dtos/compliance/audit-trail-entry.dto';
import { UserAccessReportQueryDto } from '../dtos/admin/compliance/user-access-report-query.dto';
import { UserAccessReportDto } from '../dtos/admin/compliance/user-access-report.dto';
import { ChangeManagementReportQueryDto } from '../dtos/admin/compliance/change-management-report-query.dto';
import { ChangeManagementReportDto } from '../dtos/admin/compliance/change-management-report.dto';
import { SecurityIncidentReportQueryDto } from '../dtos/admin/compliance/security-incident-report-query.dto';
import { SecurityIncidentReportDto } from '../dtos/admin/compliance/security-incident-report.dto';
import { GdprCcpaExtractQueryDto } from '../dtos/admin/compliance/gdpr-ccpa-extract-query.dto';
import { GdprCcpaExtractDto } from '../dtos/admin/compliance/gdpr-ccpa-extract.dto';


export interface IDataGovernanceComplianceService {
  manageMerchantConsent(
    merchantId: string,
    consentData: ManageConsentDto,
  ): Promise<ConsentRecordDto>;

  getMerchantConsentRecords(
    merchantId: string,
    query: ConsentReportQueryDto,
  ): Promise<PagedResponseDto<ConsentRecordDto>>;

  getDefaultPrivacySettings(feature: string): Promise<any>; // Consider defining a DefaultConsentSettingDto

  handleDsrRequest(
    userId: string,
    requestData: SubmitDsrDto,
  ): Promise<DsrRequestDto>;

  getDsrRequestStatus(requestId: string): Promise<DsrRequestDto>;

  exportDsrData(requestId: string): Promise<DsrDataExportDto>;

  fulfillDsrRequestAction(
    adminUserId: string,
    actionData: DsrActionDto,
  ): Promise<DsrRequestDto>;

  configureRetentionPolicy(
    adminUserId: string,
    policyData: ConfigureRetentionPolicyDto,
  ): Promise<RetentionPolicyDto>;

  getRetentionPolicy(policyType: string): Promise<RetentionPolicyDto>;

  triggerDataLifecycleAction(
    adminUserId: string,
    actionData: DataLifecycleActionDto,
  ): Promise<void | any>; // Response might be 202 or 204

  getDefaultRetentionSettings(dataType: string): Promise<any>; // Consider defining a DefaultRetentionSettingDto or using RetentionPolicyDto

  getDpaStatusForMerchant(merchantId: string): Promise<DpaDto>;

  acknowledgeDpaForMerchant(
    merchantId: string,
    userId: string,
  ): Promise<DpaDto>;

  generateDataProcessingActivityLog(
    merchantId: string,
    query: ProcessingActivityLogQueryDto,
  ): Promise<ProcessingActivityLogDto>;

  getAuditTrailEntries(
    query: AuditTrailQueryDto, // Service might need merchantId if not globally scoped in query
  ): Promise<PagedResponseDto<AuditTrailEntryDto>>;

  generatePlatformComplianceReport(
    adminUserId: string,
    reportType: 'user-access' | 'change-management' | 'security-incidents' | 'gdpr-ccpa-extract',
    query: UserAccessReportQueryDto | ChangeManagementReportQueryDto | SecurityIncidentReportQueryDto | GdprCcpaExtractQueryDto,
  ): Promise<UserAccessReportDto | ChangeManagementReportDto | SecurityIncidentReportDto | GdprCcpaExtractDto | any>;
}

export const IDataGovernanceComplianceServiceToken =
  'IDataGovernanceComplianceService';