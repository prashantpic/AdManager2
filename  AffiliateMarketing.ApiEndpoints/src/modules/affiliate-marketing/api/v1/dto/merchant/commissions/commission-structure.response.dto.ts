import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommissionRuleResponseDto } from './commission-rule.response.dto';
import { ValidateNested } from 'class-validator';


export class CommissionStructureResponseDto {
  @ApiProperty({
    description: 'The default commission rule for the program.',
    type: () => CommissionRuleResponseDto,
  })
  @ValidateNested()
  @Type(() => CommissionRuleResponseDto)
  defaultRule: CommissionRuleResponseDto;

  @ApiPropertyOptional({
    description: 'Specific or overriding commission rules for the program.',
    type: () => [CommissionRuleResponseDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CommissionRuleResponseDto)
  specificRules?: CommissionRuleResponseDto[];
}