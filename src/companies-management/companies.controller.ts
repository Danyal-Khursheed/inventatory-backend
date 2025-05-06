import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { CreateCompanyCommand } from './commands/impl/create-company.command';
import { DeleteCompanyCommand } from './commands/impl/delete-company.commands';
import { RequestWithUser } from 'src/auth/auth.guard';
import { Roles } from 'src/middlewares/roles.decorator';
import { Role } from 'src/middlewares/roles.enum';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { GetAllCompnaiesQuery } from './queries/impl/get-all-companies.query';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/get-all-companies')
  @Roles(Role.super_admin, Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAllUsers(
    @Request() req: RequestWithUser,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
    @Query('searchTerm') searchTerm?: string,
  ): Promise<any> {
    const { id, role } = req.user;
    return await this.queryBus.execute(
      new GetAllCompnaiesQuery(id, role, pageNumber, pageSize, searchTerm),
    );
  }

  @Post('create-company')
  @ApiBearerAuth()
  async create(@Body() dto: CreateCompanyDto): Promise<any> {
    return await this.commandBus.execute(new CreateCompanyCommand(dto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteCompanyCommand(id));
  }
}
