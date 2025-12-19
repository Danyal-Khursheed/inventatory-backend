import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { OrderPackageEntity } from '../../entities/order-package.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
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
    @InjectRepository(OrderPackageEntity)
    private readonly orderPackageRepo: Repository<OrderPackageEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
  ) {}

  async execute(command: DeleteOrderCommand) {
    try {
      const { id } = command;

      const order = await this.orderRepo.findOne({
        where: { id },
        relations: ['packages'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      // Delete items and packages (cascade should handle this, but being explicit)
      for (const pkg of order.packages) {
        await this.orderItemRepo.delete({ packageId: pkg.id });
        await this.orderPackageRepo.remove(pkg);
      }

      // Delete order (cascade will delete receiver, sender, senderAddress)
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

