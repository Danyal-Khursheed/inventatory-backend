import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/roles.gaurd';
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { CreateOrderDto } from './dto/create-order.dto';
import { SubmitOrderCommand } from './commands/impl/submit-order.command';
import { SubmitOrderDto } from './dto/submit-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
