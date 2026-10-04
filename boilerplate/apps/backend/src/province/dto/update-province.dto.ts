import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
 
export class UpdateProvinceDto {
  @ApiPropertyOptional({ example: 'Koshi Province' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;
}