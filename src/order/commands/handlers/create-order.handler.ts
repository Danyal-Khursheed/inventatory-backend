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
import { CreateOrderCommand } from '../impl/create-order.command';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
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

  async execute(command: CreateOrderCommand) {
    try {
      const { dto } = command;

      // Check if hash already exists
      const existingOrder = await this.orderRepo.findOne({
        where: { hash: dto.hash },
      });
      if (existingOrder) {
        throw new ConflictException(
          `Order with hash "${dto.hash}" already exists`,
        );
      }

      // Verify shipping company exists if provided
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

      // Create order
      const orderData: Partial<OrderEntity> = {
        hash: dto.hash,
        serviceName: dto.serviceName,
        serviceType: dto.serviceType,
        notes: dto.notes,
        orderTotal: dto.orderTotal,
        paymentCurrency: dto.paymentCurrency,
        paymentMethod: dto.paymentMethod,
        preferredDate: dto.preferredDate
          ? new Date(dto.preferredDate)
          : null,
        referenceId: dto.referenceId,
        shippingCompanyId: dto.shippingCompanyId,
      };

      const order = this.orderRepo.create(orderData);
      const savedOrder = await this.orderRepo.save(order);

      // Create receiver
      const receiver = this.receiverRepo.create({
        ...dto.receiver,
        orderId: savedOrder.id,
      });
      await this.receiverRepo.save(receiver);

      // Create sender
      const sender = this.senderRepo.create({
        ...dto.sender,
        orderId: savedOrder.id,
      });
      await this.senderRepo.save(sender);

      // Create sender address
      const senderAddressData: Partial<SenderAddressEntity> = {
        mobileNo: dto.senderAddress.mobileNo,
        addressLine1: dto.senderAddress.addressLine1,
        addressLine2: dto.senderAddress.addressLine2,
        cityName: dto.senderAddress.cityName,
        countryName: dto.senderAddress.countryName,
        countryCode: dto.senderAddress.countryCode,
        zipCode: dto.senderAddress.zipCode,
        latitude: dto.senderAddress.latitude?.toString(),
        longitude: dto.senderAddress.longitude?.toString(),
        orderId: savedOrder.id,
      };
      const senderAddress = this.senderAddressRepo.create(senderAddressData);
      await this.senderAddressRepo.save(senderAddress);

      // Create packages and items
      for (const packageDto of dto.packages) {
        const orderPackage = this.orderPackageRepo.create({
          length: packageDto.length,
          width: packageDto.width,
          height: packageDto.height,
          isDocument: packageDto.isDocument,
          deadWeight: packageDto.deadWeight,
          orderId: savedOrder.id,
        });
        const savedPackage = await this.orderPackageRepo.save(orderPackage);

        // Create items for this package
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

      // Fetch complete order with relations
      const completeOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id },
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
        message: 'Order created successfully',
        result: completeOrder,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create order: ${error.message}`,
      );
    }
  }
}

