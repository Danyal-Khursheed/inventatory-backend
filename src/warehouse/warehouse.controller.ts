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
import { CreateWarehouseCommand } from './commands/impl/create-warehouse.command';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { GetAllWarehousesQuery } from './queries/impl/get-all-warehouses.query';
import { GetSingleWarehouseQuery } from './queries/impl/get-single-warehouse.query';
import { DeleteWarehouseCommand } from './commands/impl/delete-warehouse.command';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { UpdateWarehouseCommand } from './commands/impl/update-warehouse.command';

@Controller('warehouses')
export class WarehouseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-warehouse')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiBody({ type: CreateWarehouseDto })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Warehouse created' },
      },
    },
  })
  async createWarehouse(@Body() dto: CreateWarehouseDto): Promise<any> {
    return await this.commandBus.execute(new CreateWarehouseCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-warehouses')
  async getAllWarehouses(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(new GetAllWarehousesQuery(page, size));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-warehouse')
  async getSingleWarehouse(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.queryBus.execute(new GetSingleWarehouseQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update warehouse' })
  @ApiBody({ type: UpdateWarehouseDto })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Warehouse updated' },
      },
    },
  })
  @Patch('update-warehouse')
  async updateWarehouse(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWarehouseDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdateWarehouseCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('delete-warehouse')
  async deleteWarehouse(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(new DeleteWarehouseCommand(id));
  }
}

