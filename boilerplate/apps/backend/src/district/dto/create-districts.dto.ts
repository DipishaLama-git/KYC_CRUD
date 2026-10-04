import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min } from 'class-validator';
 
export class CreateDistrictDto {
  @ApiProperty({ example: 'Bhojpur' })
  @IsString()
  @Length(1, 100)
  name: string;
 
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  provinceId: number;
}