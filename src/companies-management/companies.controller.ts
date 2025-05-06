// src/company/company.controller.ts
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { CreateCompanyCommand } from './commands/impl/create-company.command';
import { DeleteCompanyCommand } from './commands/impl/delete-company.commands';
import { Public } from 'src/auth/auth.guard';

@Controller('companies')
export class CompanyController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('create-company')
  async create(@Body() dto: CreateCompanyDto): Promise<any> {
    return await this.commandBus.execute(new CreateCompanyCommand(dto));
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteCompanyCommand(id));
  }
}
