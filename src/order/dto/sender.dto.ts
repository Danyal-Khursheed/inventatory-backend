import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SenderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;
}

