import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AUTH_MESSAGES } from '../auth.constants';

export class UserDto {
  @ApiProperty({
    example: AUTH_MESSAGES.DUMMY_USER,
    required: true,
  })
  @IsString({ message: AUTH_MESSAGES.USERNAME_REQUIRED })
  @IsNotEmpty({ message: AUTH_MESSAGES.USERNAME_REQUIRED })
  username: string;

  @ApiProperty({
    example: AUTH_MESSAGES.DUMMY_PASSWORD,
    required: true,
  })
  @IsString({ message: AUTH_MESSAGES.PASSWORD_REQUIRED })
  @IsNotEmpty({ message: AUTH_MESSAGES.PASSWORD_REQUIRED })
  password: string;
}
