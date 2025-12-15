import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  role?: string;
}
