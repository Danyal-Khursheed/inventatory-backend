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
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetAllOrdersQuery } from './queries/impl/get-all-orders.query';
import { GetSingleOrderQuery } from './queries/impl/get-single-order.query';
import { DeleteOrderCommand } from './commands/impl/delete-order.command';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderCommand } from './commands/impl/update-order.command';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-order')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  async createOrder(@Body() dto: CreateOrderDto): Promise<any> {
    return await this.commandBus.execute(new CreateOrderCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-all-orders')
  async getAllOrders(
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
    const size = pageSize ? parseInt(pageSize, 10) : undefined;
    return await this.queryBus.execute(new GetAllOrdersQuery(page, size));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get('get-single-order')
  async getSingleOrder(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.queryBus.execute(new GetSingleOrderQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update order' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @Patch('update-order')
  async updateOrder(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<any> {
    return this.commandBus.execute(new UpdateOrderCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete('delete-order')
  async deleteOrder(@Query('id', new ParseUUIDPipe()) id: string) {
    return await this.commandBus.execute(new DeleteOrderCommand(id));
  }
}

