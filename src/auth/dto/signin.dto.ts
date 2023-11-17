import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {

  @ApiProperty({
    example: 'user@mail.com',
    required: true
 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  
  @ApiProperty({
    example: '1234578910',
    required: true
 })
  @IsString()
  @IsNotEmpty()
  password: string;
}
