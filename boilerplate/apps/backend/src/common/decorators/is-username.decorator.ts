import { applyDecorators } from '@nestjs/common';
import { IsString, Length, Matches } from 'class-validator';

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;

export function IsUsername() {
  return applyDecorators(
    IsString(),
    Length(3, 50, { message: 'Username must be between 3 and 50 characters' }),
    Matches(USERNAME_REGEX, { message: 'Username must contain letters and numbers only (no spaces or symbols)' }),
  );
}
