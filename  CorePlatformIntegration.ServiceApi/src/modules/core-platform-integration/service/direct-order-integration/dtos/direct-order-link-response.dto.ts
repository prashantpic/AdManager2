import { IsDefined, IsUrl } from 'class-validator';

export class DirectOrderLinkResponseDto {
  @IsUrl()
  @IsDefined()
  readonly deepLinkUrl: string;
}