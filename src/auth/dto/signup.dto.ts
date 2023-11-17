import { ApiProperty } from '@nestjs/swagger';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends PartialType(
  OmitType(SignInDto, ['password'] as const),
) {
  
  @ApiProperty({
    example: 'John',
    required: true
 })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty({
    example: 'Smith',
    required: true
 })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
  @IsStrongPassword({ minLength: 10, minSymbols: 1, minUppercase: 1 })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '1234578910',
    required: true
 })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
