import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'dummyuser',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
