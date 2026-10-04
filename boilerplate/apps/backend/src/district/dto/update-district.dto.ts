import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
 
export class UpdateDistrictDto {
  @ApiPropertyOptional({ example: 'Bhojpur' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;
 
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  provinceId?: number;
}