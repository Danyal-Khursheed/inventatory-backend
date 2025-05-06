import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  logo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
