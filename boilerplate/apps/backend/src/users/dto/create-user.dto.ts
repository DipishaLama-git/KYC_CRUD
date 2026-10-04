import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { IsPasswordPolicyCompliant } from '../../common/decorators/is-password-policy-compliant.decorator';
import { IsUsername } from '../../common/decorators/is-username.decorator';

export class CreateUserDto {
  @ApiProperty({ description: 'Alphanumeric only, 3-50 characters', example: 'jdoe1' })
  @IsUsername()
  username: string;

  @ApiProperty({
    description: 'At least 8 characters, with uppercase, lowercase, a number and a symbol',
    example: 'Str0ng!Pass',
  })
  @IsPasswordPolicyCompliant()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiPropertyOptional({ example: 'Q' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  middleName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
