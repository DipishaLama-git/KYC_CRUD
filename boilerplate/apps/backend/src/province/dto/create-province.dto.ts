import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
 

export class CreateProvinceDto {
  @ApiProperty({ example: 'Koshi Province' })
  @IsString()
  @Length(1, 100)
  name!: string;
}