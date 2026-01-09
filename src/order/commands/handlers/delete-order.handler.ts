import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { DeleteOrderCommand } from '../impl/delete-order.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async execute(command: DeleteOrderCommand) {
    try {
      const { id } = command;

      const order = await this.orderRepo.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      await this.orderRepo.remove(order);

      return { message: 'Order deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete order: ${error.message}`,
      );
    }
  }
}

