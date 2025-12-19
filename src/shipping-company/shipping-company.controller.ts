import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { CreateShippingCompanyCommand } from './commands/impl/create-shipping-company.command';
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { GetAllShippingCompaniesQuery } from './queries/impl/get-all-shipping-companies.query';
import { GetSingleShippingCompanyQuery } from './queries/impl/get-single-shipping-company.query';
import { DeleteShippingCompanyCommand } from './commands/impl/delete-shipping-company.command';
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';
import { UpdateShippingCompanyCommand } from './commands/impl/update-shipping-company.command';

@Controller('shipping-companies')
export class ShippingCompanyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-shipping-company')
  @ApiOperation({ summary: 'Create a new shipping company' })
  @ApiBody({ type: CreateShippingCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Shipping company created successfully',
  })
  async createShippingCompany(
    @Body() dto: CreateShippingCompanyDto,
  ): Promise<any> {
    return await this.commandBus.execute(
      new CreateShippingCompanyCommand(dto),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-shipping-companies')
  async getAllShippingCompanies(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(
      new GetAllShippingCompaniesQuery(page, size),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-shipping-company')
  async getSingleShippingCompany(
    @Query('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.queryBus.execute(new GetSingleShippingCompanyQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update shipping company' })
  @ApiBody({ type: UpdateShippingCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Shipping company updated successfully',
  })
  @Patch('update-shipping-company')
  async updateShippingCompany(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateShippingCompanyDto,
  ): Promise<any> {
    return this.commandBus.execute(
      new UpdateShippingCompanyCommand(id, dto),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('delete-shipping-company')
  async deleteShippingCompany(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(
      new DeleteShippingCompanyCommand(id),
    );
  }
}

