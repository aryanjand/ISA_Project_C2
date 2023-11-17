import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 10, minSymbols: 1, minUppercase: 1 })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;


}
