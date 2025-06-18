import { PartialType } from '@nestjs/mapped-types';
import { CreateBogoPromotionDto } from './create-bogo-promotion.dto';

export class UpdateBogoPromotionDto extends PartialType(CreateBogoPromotionDto) {}