import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}
