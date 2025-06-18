import { CreateCampaignDto, UpdateCampaignDto, UpdateCampaignStatusDto, CampaignResponseDto, AssociateProductCatalogDto, AssociateAudienceDto, AssociatePromotionCampaignDto } from '../../dto/campaign';
import { CreateAdSetDto, UpdateAdSetDto, AdSetResponseDto } from '../../dto/ad-set';
import { CreateAdDto, UpdateAdDto, AdResponseDto, AssociatePromotionAdDto } from '../../dto/ad';
import { UploadAdCreativeDto, UpdateAdCreativeDto, AdCreativeResponseDto } from '../../dto/ad-creative';
import { CreateABTestDto, UpdateABTestDto, ABTestResponseDto, ABTestResultResponseDto, ListABTestsQueryDto } from '../../dto/ab-test';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../../common/dto/paged.response.dto';
import { Express } from 'express'; // For Multer file type

export const ICampaignManagementService = Symbol('ICampaignManagementService');

export interface ICampaignManagementService {
  // Campaign Methods
  createCampaign(createCampaignDto: CreateCampaignDto, merchantId: string): Promise<CampaignResponseDto>;
  updateCampaign(campaignId: string, updateCampaignDto: UpdateCampaignDto, merchantId: string): Promise<CampaignResponseDto>;
  getCampaignById(campaignId: string, merchantId: string): Promise<CampaignResponseDto>;
  listCampaigns(merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<CampaignResponseDto>>;
  updateCampaignStatus(campaignId: string, statusDto: UpdateCampaignStatusDto, merchantId: string): Promise<CampaignResponseDto>;
  associateProductCatalogToCampaign(campaignId: string, catalogId: string, merchantId: string): Promise<void>;
  associateAudienceToCampaign(campaignId: string, audienceId: string, merchantId: string): Promise<void>;
  associatePromotionToCampaign(campaignId: string, promotionId: string, merchantId: string): Promise<void>;

  // AdSet Methods
  createAdSet(campaignId: string, createAdSetDto: CreateAdSetDto, merchantId: string): Promise<AdSetResponseDto>;
  updateAdSet(adSetId: string, updateAdSetDto: UpdateAdSetDto, merchantId: string): Promise<AdSetResponseDto>;
  getAdSetById(adSetId: string, merchantId: string): Promise<AdSetResponseDto>;
  listAdSetsByCampaign(campaignId: string, merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdSetResponseDto>>;

  // Ad Methods
  createAd(adSetId: string, createAdDto: CreateAdDto, merchantId: string): Promise<AdResponseDto>;
  updateAd(adId: string, updateAdDto: UpdateAdDto, merchantId: string): Promise<AdResponseDto>;
  getAdById(adId: string, merchantId: string): Promise<AdResponseDto>;
  listAdsByAdSet(adSetId: string, merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdResponseDto>>;
  associatePromotionToAd(adId: string, promotionId: string, merchantId: string): Promise<void>;

  // AdCreative Methods
  uploadAdCreative(uploadAdCreativeDto: UploadAdCreativeDto, merchantId: string, file?: Express.Multer.File): Promise<AdCreativeResponseDto>;
  getAdCreativeById(creativeId: string, merchantId: string): Promise<AdCreativeResponseDto>;
  listAdCreatives(merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdCreativeResponseDto>>;
  updateAdCreative(creativeId: string, updateAdCreativeDto: UpdateAdCreativeDto, merchantId: string, file?: Express.Multer.File): Promise<AdCreativeResponseDto>;

  // A/B Test Methods
  createABTest(createABTestDto: CreateABTestDto, merchantId: string): Promise<ABTestResponseDto>;
  updateABTest(abTestId: string, updateABTestDto: UpdateABTestDto, merchantId: string): Promise<ABTestResponseDto>;
  getABTestById(abTestId: string, merchantId: string): Promise<ABTestResponseDto>;
  getABTestResults(abTestId: string, merchantId: string): Promise<ABTestResultResponseDto>;
  listABTests(merchantId: string, listABTestsQueryDto: ListABTestsQueryDto): Promise<PagedResponseDto<ABTestResponseDto>>; // Modified based on SDS text, listABTestsQueryDto already extends PaginationQueryDto and has campaignId
}