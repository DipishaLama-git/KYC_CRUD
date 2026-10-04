import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
 
export class UpdateMunicipalityDto {
  @ApiPropertyOptional({ example: 'Bhojpur Municipality' })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;
 
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  districtId?: number;
}