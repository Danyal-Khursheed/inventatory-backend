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
  @ApiOperation({ 
    summary: 'Create a new warehouse',
    description: 'Creates a new warehouse with the provided details. Name is required, all other fields are optional.',
  })
  @ApiBody({ 
    type: CreateWarehouseDto,
    description: 'Warehouse creation data',
    examples: {
      minimal: {
        summary: 'Minimal request (only required field)',
        value: {
          name: 'Main Warehouse',
        },
      },
      full: {
        summary: 'Full request (all fields)',
        value: {
          name: 'Main Warehouse',
          address: '123 Main Street',
          city: 'Dubai',
          countryName: 'United Arab Emirates',
          countryCode: 'AE',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Warehouse created successfully' 
        },
        result: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'Main Warehouse' },
            address: { type: 'string', example: '123 Main Street', nullable: true },
            city: { type: 'string', example: 'Dubai', nullable: true },
            countryName: { type: 'string', example: 'United Arab Emirates', nullable: true },
            countryCode: { type: 'string', example: 'AE', nullable: true },
            createdAt: { type: 'string', format: 'date-time', example: '2026-01-01T09:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-01-01T09:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'name' },
              messages: { 
                type: 'array', 
                items: { type: 'string' },
                example: ['name should not be empty', 'name must be a string'],
              },
              value: { type: 'string', example: '', nullable: true },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
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

