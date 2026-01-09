import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { SubmitOrderCommand } from './commands/impl/submit-order.command';
import { SubmitOrderDto } from './dto/submit-order.dto';
import { UpdateOrderCommand } from './commands/impl/update-order.command';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DeleteOrderCommand } from './commands/impl/delete-order.command';
import { GetAllOrdersQuery } from './queries/impl/get-all-orders.query';
import { GetSingleOrderQuery } from './queries/impl/get-single-order.query';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('create-order')
  @ApiOperation({ summary: 'Create a new order with pending status' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully with pending status',
  })
  async createOrder(@Body() dto: CreateOrderDto): Promise<any> {
    return await this.commandBus.execute(new CreateOrderCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Post('submit-order')
  @ApiOperation({ summary: 'Submit order with shipping company (confirms order)' })
  @ApiBody({ type: SubmitOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order submitted and confirmed successfully',
  })
  async submitOrder(@Body() dto: SubmitOrderDto): Promise<any> {
    return await this.commandBus.execute(new SubmitOrderCommand(dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all orders with optional filtering and pagination' })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'orderStatus', required: false, type: String })
  @ApiQuery({ name: 'paymentStatus', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
  })
  async getAllOrders(
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderStatus') orderStatus?: string,
    @Query('paymentStatus') paymentStatus?: string,
  ): Promise<any> {
    return await this.queryBus.execute(
      new GetAllOrdersQuery(
        pageNumber ? Number(pageNumber) : undefined,
        pageSize ? Number(pageSize) : undefined,
        orderStatus,
        paymentStatus,
      ),
    );
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async getSingleOrder(@Param('id') id: string): Promise<any> {
    return await this.queryBus.execute(new GetSingleOrderQuery(id));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<any> {
    return await this.commandBus.execute(new UpdateOrderCommand(id, dto));
  }

  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async deleteOrder(@Param('id') id: string): Promise<any> {
    return await this.commandBus.execute(new DeleteOrderCommand(id));
  }
}
