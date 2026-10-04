import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  Matches,
} from 'class-validator';
 
export class CreateKycDto {
  @ApiProperty({ example: 'Ram Bahadur Thapa' })
  @IsString()
  @Length(1, 200)
  fullName!: string;
 
  @ApiProperty({ example: 'Male', enum: ['Male', 'Female', 'Other'] })
  @IsIn(['Male', 'Female', 'Other'])
  gender!: 'Male' | 'Female' | 'Other';
 
  
  @ApiPropertyOptional({
  example: '2047-03-12',
  description: 'Date of birth in Bikram Sambat', })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'dobBs must be in YYYY-MM-DD format',
  })
  dobBs?: string;
 
  @ApiProperty({ example: '1990-06-25', description: 'Date of birth (Gregorian)' })
  @IsDateString()
  dobAd!: string;
 
  @ApiProperty({ example: '12-34-56-78901' })
  @IsString()
  @Length(1, 50)
  citizenshipNumber!: string;
 
  @ApiPropertyOptional({ example: 'Bhojpur' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  citizenshipIssuedDistrict?: string;
 
  @ApiPropertyOptional({ example: '2010-01-15' })
  @IsOptional()
  @IsDateString()
  citizenshipIssuedDate?: string;
 
  @ApiProperty({ example: '9801234567' })
  @IsString()
  @Length(1, 20)
  phoneNumber!: string;
 
  @ApiPropertyOptional({ example: 'ram.thapa@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
 
  // Permanent address (required)
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  permanentProvinceId!: number;
 
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  permanentDistrictId!: number;
 
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  permanentMunicipalityId!: number;
 
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  permanentWardNo!: number;
 
  // Temporary address (optional)
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  temporaryProvinceId?: number;
 
  @ApiPropertyOptional({ example: 27 })
  @IsOptional()
  @IsInt()
  @Min(1)
  temporaryDistrictId?: number;
 
  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Min(1)
  temporaryMunicipalityId?: number;
 
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  temporaryWardNo?: number;
 
  @ApiPropertyOptional({ example: 'Hari Bahadur Thapa' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  fatherName?: string;
 
  @ApiPropertyOptional({ example: 'Sita Thapa' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  motherName?: string;
 
  @ApiPropertyOptional({ example: 'Krishna Bahadur Thapa' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  grandfatherName?: string;
 
  @ApiPropertyOptional({ example: 'Kamala Thapa' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  grandmotherName?: string;
 
  @ApiPropertyOptional({ example: 'Business' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  occupation?: string;
 
  @ApiPropertyOptional({ example: 'ABCDE1234F' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  panNumber?: string;
}