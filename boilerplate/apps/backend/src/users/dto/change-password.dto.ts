import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsPasswordPolicyCompliant } from '../../common/decorators/is-password-policy-compliant.decorator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'At least 8 characters, with uppercase, lowercase, a number and a symbol',
  })
  @IsPasswordPolicyCompliant()
  newPassword: string;
}
