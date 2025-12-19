import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { OrderPackageEntity } from '../../entities/order-package.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
import { ReceiverEntity } from '../../entities/receiver.entity';
import { SenderEntity } from '../../entities/sender.entity';
import { SenderAddressEntity } from '../../entities/sender-address.entity';
import { ShippingCompanyEntity } from '../../../shipping-company/entities/shipping-company.entity';
import { UpdateOrderCommand } from '../impl/update-order.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderPackageEntity)
    private readonly orderPackageRepo: Repository<OrderPackageEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @InjectRepository(ReceiverEntity)
    private readonly receiverRepo: Repository<ReceiverEntity>,
    @InjectRepository(SenderEntity)
    private readonly senderRepo: Repository<SenderEntity>,
    @InjectRepository(SenderAddressEntity)
    private readonly senderAddressRepo: Repository<SenderAddressEntity>,
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute(command: UpdateOrderCommand) {
    try {
      const { id, dto } = command;

      const order = await this.orderRepo.findOne({
        where: { id },
        relations: ['packages', 'receiver', 'sender', 'senderAddress'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      // Verify shipping company if being updated
      if (dto.shippingCompanyId) {
        const shippingCompany = await this.shippingCompanyRepo.findOne({
          where: { id: dto.shippingCompanyId },
        });
        if (!shippingCompany) {
          throw new NotFoundException(
            `Shipping company with ID "${dto.shippingCompanyId}" not found`,
          );
        }
      }

      // Update order fields
      if (dto.hash) order.hash = dto.hash;
      if (dto.serviceName) order.serviceName = dto.serviceName;
      if (dto.serviceType) order.serviceType = dto.serviceType;
      if (dto.notes !== undefined) order.notes = dto.notes;
      if (dto.orderTotal !== undefined) order.orderTotal = dto.orderTotal;
      if (dto.paymentCurrency) order.paymentCurrency = dto.paymentCurrency;
      if (dto.paymentMethod) order.paymentMethod = dto.paymentMethod;
      if (dto.preferredDate !== undefined)
        order.preferredDate = dto.preferredDate
          ? new Date(dto.preferredDate)
          : null;
      if (dto.referenceId !== undefined) order.referenceId = dto.referenceId;
      if (dto.shippingCompanyId !== undefined)
        order.shippingCompanyId = dto.shippingCompanyId;

      await this.orderRepo.save(order);

      // Update receiver if provided
      if (dto.receiver) {
        Object.assign(order.receiver, dto.receiver);
        await this.receiverRepo.save(order.receiver);
      }

      // Update sender if provided
      if (dto.sender) {
        Object.assign(order.sender, dto.sender);
        await this.senderRepo.save(order.sender);
      }

      // Update sender address if provided
      if (dto.senderAddress) {
        if (dto.senderAddress.mobileNo)
          order.senderAddress.mobileNo = dto.senderAddress.mobileNo;
        if (dto.senderAddress.addressLine1)
          order.senderAddress.addressLine1 = dto.senderAddress.addressLine1;
        if (dto.senderAddress.addressLine2 !== undefined)
          order.senderAddress.addressLine2 = dto.senderAddress.addressLine2;
        if (dto.senderAddress.cityName !== undefined)
          order.senderAddress.cityName = dto.senderAddress.cityName;
        if (dto.senderAddress.countryName !== undefined)
          order.senderAddress.countryName = dto.senderAddress.countryName;
        if (dto.senderAddress.countryCode !== undefined)
          order.senderAddress.countryCode = dto.senderAddress.countryCode;
        if (dto.senderAddress.zipCode !== undefined)
          order.senderAddress.zipCode = dto.senderAddress.zipCode;
        if (dto.senderAddress.latitude !== undefined)
          order.senderAddress.latitude = dto.senderAddress.latitude?.toString();
        if (dto.senderAddress.longitude !== undefined)
          order.senderAddress.longitude =
            dto.senderAddress.longitude?.toString();
        await this.senderAddressRepo.save(order.senderAddress);
      }

      // Update packages if provided (delete old and create new)
      if (dto.packages) {
        // Delete existing packages and items
        for (const pkg of order.packages) {
          await this.orderItemRepo.delete({ packageId: pkg.id });
          await this.orderPackageRepo.remove(pkg);
        }

        // Create new packages and items
        for (const packageDto of dto.packages) {
          const orderPackage = this.orderPackageRepo.create({
            length: packageDto.length,
            width: packageDto.width,
            height: packageDto.height,
            isDocument: packageDto.isDocument,
            deadWeight: packageDto.deadWeight,
            orderId: order.id,
          });
          const savedPackage = await this.orderPackageRepo.save(orderPackage);

          for (const itemDto of packageDto.items) {
            const orderItem = this.orderItemRepo.create({
              name: itemDto.name,
              quantity: itemDto.quantity,
              weight: itemDto.weight,
              price: itemDto.price,
              packageId: savedPackage.id,
            });
            await this.orderItemRepo.save(orderItem);
          }
        }
      }

      // Fetch updated order with relations
      const updatedOrder = await this.orderRepo.findOne({
        where: { id },
        relations: [
          'packages',
          'packages.items',
          'receiver',
          'sender',
          'senderAddress',
          'shippingCompany',
        ],
      });

      return {
        message: 'Order updated successfully',
        result: updatedOrder,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update order: ${error.message}`,
      );
    }
  }
}

