import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDiscountCodeDto } from './create-discount-code.dto';

export class UpdateDiscountCodeDto extends PartialType(
  OmitType(CreateDiscountCodeDto, ['codePattern', 'codes', 'isUniquePerMerchant'] as const),
) {}