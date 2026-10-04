import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jdoe1' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Str0ng!Pass' })
  @IsString()
  password: string;
}