import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min } from 'class-validator';
 
export class CreateMunicipalityDto {
  @ApiProperty({ example: 'Bhojpur Municipality' })
  @IsString()
  @Length(1, 150)
  name!: string;
 
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  districtId!: number;
}