import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { CreateCompanyOriginDto } from './dto/create-companies-origin.dto';
import { CreatePackageCommand } from 'src/package/commands/impl/create-package.command';
import { CreateCompanyOriginCommand } from './commands/impl/create-company-origin.command';
import { GetAllCompaniesOriginQuery } from './queries/impl/get-all-companies-origin.query';

@Controller('companies_origin')
export class CountriesOrigin {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-company-origin')
  @ApiOperation({ summary: 'Create a new package' })
  async createPackage(@Body() dto: CreateCompanyOriginDto): Promise<any> {
    return await this.commandBus.execute(new CreateCompanyOriginCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-packages')
  async getAllPackages(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(
      new GetAllCompaniesOriginQuery(page, size),
    );
  }
}
