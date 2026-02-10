import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { UpdateOrderCommand } from '../impl/update-order.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { CompanyOrigin } from '../../../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../../../pickup-address/entities/pickup-address.entity';
import { ShippingCompanyEntity } from '../../../shipping-company/entities/shipping-company.entity';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
    @InjectRepository(CompanyOrigin)
    private readonly companyOriginRepo: Repository<CompanyOrigin>,
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute(command: UpdateOrderCommand) {
    try {
      const { id, dto } = command;

      const order = await this.orderRepo.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with ID "${id}" not found`);
      }

      // Validate related entities if provided
      if (dto.warehouseId) {
        const warehouse = await this.warehouseRepo.findOne({
          where: { id: dto.warehouseId },
        });
        if (!warehouse) {
          throw new NotFoundException(
            `Warehouse with ID "${dto.warehouseId}" not found`,
          );
        }
      }

      if (dto.countryOriginId) {
        const countryOrigin = await this.companyOriginRepo.findOne({
          where: { id: dto.countryOriginId },
        });
        if (!countryOrigin) {
          throw new NotFoundException(
            `Country origin with ID "${dto.countryOriginId}" not found`,
          );
        }
      }

      if (dto.pickupAddressId) {
        const pickupAddress = await this.pickupAddressRepo.findOne({
          where: { id: dto.pickupAddressId },
        });
        if (!pickupAddress) {
          throw new NotFoundException(
            `Pickup address with ID "${dto.pickupAddressId}" not found`,
          );
        }
      }

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
      if (dto.warehouseId !== undefined) order.warehouseId = dto.warehouseId;
      if (dto.countryOriginId !== undefined) order.countryOriginId = dto.countryOriginId;
      if (dto.pickupAddressId !== undefined) order.pickupAddressId = dto.pickupAddressId;
      if (dto.receiver !== undefined) {
        order.receiverName = dto.receiver.name;
        order.receiverCompanyName = dto.receiver.companyName ?? null;
        order.receiverEmail = dto.receiver.email ?? null;
        order.receiverMobileNo = dto.receiver.mobileNo;
      }
      if (dto.cod !== undefined) order.cod = dto.cod;
      if (dto.referenceId !== undefined) order.referenceId = dto.referenceId;
      if (dto.codAmount !== undefined) order.codAmount = dto.codAmount;
      if (dto.instructions !== undefined) order.instructions = dto.instructions;
      if (dto.box !== undefined) {
        order.boxLength = dto.box.length;
        order.boxWidth = dto.box.width;
        order.boxHeight = dto.box.height;
        order.volumetricWeight = dto.box.volumetricWeight;
      }
      if (dto.shippingCompanyId !== undefined) order.shippingCompanyId = dto.shippingCompanyId;
      if (dto.orderStatus !== undefined) order.orderStatus = dto.orderStatus;
      if (dto.paymentStatus !== undefined) order.paymentStatus = dto.paymentStatus;
      if (dto.deliveryDate !== undefined) order.deliveryDate = new Date(dto.deliveryDate);

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
        message: 'Order updated successfully',
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
        `Failed to update order: ${error.message}`,
      );
    }
  }
}

