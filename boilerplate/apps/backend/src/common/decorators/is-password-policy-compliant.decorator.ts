import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword, MaxLength } from 'class-validator';

/**
 * Password policy: at least 8 characters, one uppercase, one lowercase,
 * one number and one symbol.
 */
export function IsPasswordPolicyCompliant() {
  return applyDecorators(
    MaxLength(128),
    IsStrongPassword(
      {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      {
        message:
          'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol',
      },
    ),
  );
}
