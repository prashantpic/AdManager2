import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class ProductSyncRequestDto {
  @IsString()
  @IsDefined()
  readonly merchantId: string;

  @IsBoolean()
  @IsDefined()
  readonly forceFullSync: boolean;
}