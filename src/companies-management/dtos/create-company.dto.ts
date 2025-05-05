import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  logo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;
}
