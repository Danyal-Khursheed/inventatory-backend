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
import { CreateWarehouseItemCommand } from './commands/impl/create-warehouse-item.command';
import { CreateWarehouseItemDto } from './dto/create-warehouse-item.dto';
import { CreateBulkWarehouseItemCommand } from './commands/impl/create-bulk-warehouse-item.command';
import { CreateBulkWarehouseItemDto } from './dto/create-bulk-warehouse-item.dto';
import { GetAllWarehouseItemsQuery } from './queries/impl/get-all-warehouse-items.query';
import { GetSingleWarehouseItemQuery } from './queries/impl/get-single-warehouse-item.query';
import { DeleteWarehouseItemCommand } from './commands/impl/delete-warehouse-item.command';
import { UpdateWarehouseItemDto } from './dto/update-warehouse-item.dto';
import { UpdateWarehouseItemCommand } from './commands/impl/update-warehouse-item.command';

@Controller('warehouse-items')
export class WarehouseItemController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-warehouse-item')
  @ApiOperation({ summary: 'Create a new warehouse item' })
  @ApiBody({ type: CreateWarehouseItemDto })
  @ApiResponse({
    status: 201,
    description: 'Warehouse item created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Warehouse item created' },
      },
    },
  })
  async createWarehouseItem(
    @Body() dto: CreateWarehouseItemDto,
  ): Promise<any> {
    return await this.commandBus.execute(new CreateWarehouseItemCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-warehouse-items-bulk')
  @ApiOperation({ summary: 'Create warehouse items in bulk' })
  @ApiBody({ type: CreateBulkWarehouseItemDto })
  @ApiResponse({
    status: 201,
    description: 'Warehouse items created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully created X warehouse item(s)' },
        count: { type: 'number', example: 5 },
      },
    },
  })
  async createWarehouseItemsBulk(
    @Body() dto: CreateBulkWarehouseItemDto,
  ): Promise<any> {
    return await this.commandBus.execute(
      new CreateBulkWarehouseItemCommand(dto),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-warehouse-items')
  async getAllWarehouseItems(
    @Query('warehouseId') warehouseId?: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(
      new GetAllWarehouseItemsQuery(warehouseId, page, size),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-warehouse-item')
  async getSingleWarehouseItem(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.queryBus.execute(new GetSingleWarehouseItemQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update warehouse item' })
  @ApiBody({ type: UpdateWarehouseItemDto })
  @ApiResponse({
    status: 200,
    description: 'Warehouse item updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Warehouse item updated' },
      },
    },
  })
  @Patch('update-warehouse-item')
  async updateWarehouseItem(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWarehouseItemDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdateWarehouseItemCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('delete-warehouse-item')
  async deleteWarehouseItem(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(new DeleteWarehouseItemCommand(id));
  }
}

