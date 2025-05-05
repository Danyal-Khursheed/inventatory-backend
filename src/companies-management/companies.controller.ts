// src/company/company.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { CreateCompanyCommand } from './commands/impl/create-company.command';

@Controller('companies')
export class CompanyController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('create-company')
  async create(@Body() dto: CreateCompanyDto): Promise<any> {
    return await this.commandBus.execute(new CreateCompanyCommand(dto));
  }
}
