import { PartialType } from '@nestjs/mapped-types';
import { CreateQuantityDiscountDto } from './create-quantity-discount.dto';

export class UpdateQuantityDiscountDto extends PartialType(CreateQuantityDiscountDto) {}