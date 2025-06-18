import { Express } from 'express'; // For Express.Multer.File
import { UpdateGiftOptionSettingsDto } from '../dtos/request/update-gift-option-settings.dto';
import { UploadBrandedCardDesignDto } from '../dtos/request/upload-branded-card-design.dto';
import { UpdateBrandedCardDesignDto } from '../dtos/request/update-branded-card-design.dto';
import { GiftOptionSettingsDto } from '../dtos/response/gift-option-settings.dto';
import { BrandedCardDesignDto } from '../dtos/response/branded-card-design.dto';
import { GiftOptionAdvertisingDetailsDto } from '../dtos/response/gift-option-advertising-details.dto';

/**
 * @interface IGiftOptionsService
 * @namespace AdManager.GiftOptions.Api.V1.Interfaces
 * @description Defines the contract for the GiftOptionsService.
 */
export interface IGiftOptionsService {
  /**
   * Retrieves the current gift option settings for a given merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @returns {Promise<GiftOptionSettingsDto>} The gift option settings.
   */
  getGiftOptionSettings(merchantId: string): Promise<GiftOptionSettingsDto>;

  /**
   * Updates the gift option settings for a given merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @param {UpdateGiftOptionSettingsDto} settingsDto - The settings to update.
   * @returns {Promise<GiftOptionSettingsDto>} The updated gift option settings.
   */
  updateGiftOptionSettings(
    merchantId: string,
    settingsDto: UpdateGiftOptionSettingsDto,
  ): Promise<GiftOptionSettingsDto>;

  /**
   * Uploads a new branded card design image and its metadata for a merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @param {UploadBrandedCardDesignDto} designDto - The metadata for the new design.
   * @param {Express.Multer.File} file - The uploaded image file.
   * @returns {Promise<BrandedCardDesignDto>} The created branded card design.
   */
  uploadBrandedCardDesign(
    merchantId: string,
    designDto: UploadBrandedCardDesignDto,
    file: Express.Multer.File,
  ): Promise<BrandedCardDesignDto>;

  /**
   * Lists all branded card designs for a given merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @returns {Promise<BrandedCardDesignDto[]>} A list of branded card designs.
   */
  listBrandedCardDesigns(merchantId: string): Promise<BrandedCardDesignDto[]>;

  /**
   * Retrieves a specific branded card design by its ID for a merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @param {string} designId - The ID of the design.
   * @returns {Promise<BrandedCardDesignDto>} The branded card design.
   */
  getBrandedCardDesign(
    merchantId: string,
    designId: string,
  ): Promise<BrandedCardDesignDto>;

  /**
   * Updates the metadata of an existing branded card design.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @param {string} designId - The ID of the design to update.
   * @param {UpdateBrandedCardDesignDto} updateDto - The data to update.
   * @returns {Promise<BrandedCardDesignDto>} The updated branded card design.
   */
  updateBrandedCardDesign(
    merchantId: string,
    designId: string,
    updateDto: UpdateBrandedCardDesignDto,
  ): Promise<BrandedCardDesignDto>;

  /**
   * Deletes a specific branded card design for a merchant.
   * Corresponds to REQ-GO-001.
   * @param {string} merchantId - The ID of the merchant.
   * @param {string} designId - The ID of the design to delete.
   * @returns {Promise<void>}
   */
  deleteBrandedCardDesign(
    merchantId: string,
    designId: string,
  ): Promise<void>;

  /**
   * Retrieves a summary of enabled gift options relevant for advertising purposes.
   * Corresponds to REQ-GO-004.
   * @param {string} merchantId - The ID of the merchant.
   * @returns {Promise<GiftOptionAdvertisingDetailsDto>} The gift option advertising details.
   */
  getGiftOptionAdvertisingDetails(
    merchantId: string,
  ): Promise<GiftOptionAdvertisingDetailsDto>;
}