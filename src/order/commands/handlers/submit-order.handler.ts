import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { ShippingCompanyEntity } from '../../../shipping-company/entities/shipping-company.entity';
import { SubmitOrderCommand } from '../impl/submit-order.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(SubmitOrderCommand)
export class SubmitOrderHandler implements ICommandHandler<SubmitOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute(command: SubmitOrderCommand) {
    try {
      const { dto } = command;

      // Verify order exists
      const order = await this.orderRepo.findOne({
        where: { id: dto.orderId },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID "${dto.orderId}" not found`);
      }

      // Check if order is already confirmed
      if (order.orderStatus === 'confirmed') {
        throw new BadRequestException('Order is already confirmed');
      }

      // Verify shipping company exists
      const shippingCompany = await this.shippingCompanyRepo.findOne({
        where: { id: dto.shippingCompanyId },
      });
      if (!shippingCompany) {
        throw new NotFoundException(
          `Shipping company with ID "${dto.shippingCompanyId}" not found`,
        );
      }

      // Update order status to confirmed and assign shipping company
      order.shippingCompanyId = dto.shippingCompanyId;
      order.orderStatus = 'confirmed';
      order.paymentStatus = 'paid'; // Assuming payment is confirmed when shipping is selected

      const updatedOrder = await this.orderRepo.save(order);

      // Fetch complete order with relations
      const completeOrder = await this.orderRepo.findOne({
        where: { id: updatedOrder.id },
        relations: [
          'warehouse',
          'countryOrigin',
          'pickupAddress',
          'shippingCompany',
          'orderItems',
          'orderItems.warehouseItem',
        ],
      });

      return {
        message: 'Order submitted and confirmed successfully',
        result: completeOrder,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to submit order: ${error.message}`,
      );
    }
  }
}

