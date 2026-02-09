import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { WarehouseItemEntity } from '../../../warehouse-item/entities/warehouse-item.entity';
import { CompanyOrigin } from '../../../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../../../pickup-address/entities/pickup-address.entity';
import { CreateOrderCommand } from '../impl/create-order.command';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
    @InjectRepository(WarehouseItemEntity)
    private readonly warehouseItemRepo: Repository<WarehouseItemEntity>,
    @InjectRepository(CompanyOrigin)
    private readonly companyOriginRepo: Repository<CompanyOrigin>,
    @InjectRepository(PickupAddressEntity)
    private readonly pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}

  async execute(command: CreateOrderCommand) {
    try {
      const { dto } = command;

      // Verify warehouse exists
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouseId },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouseId}" not found`,
        );
      }

      // Verify country origin exists
      const countryOrigin = await this.companyOriginRepo.findOne({
        where: { id: dto.countryOriginId },
      });
      if (!countryOrigin) {
        throw new NotFoundException(
          `Country origin with ID "${dto.countryOriginId}" not found`,
        );
      }

      // Verify pickup address exists
      const pickupAddress = await this.pickupAddressRepo.findOne({
        where: { id: dto.pickupAddressId },
      });
      if (!pickupAddress) {
        throw new NotFoundException(
          `Pickup address with ID "${dto.pickupAddressId}" not found`,
        );
      }

      // Verify all warehouse items exist and belong to the warehouse
      const warehouseItemIds = dto.items.map((item) => item.warehouseItemId);
      const warehouseItems = await this.warehouseItemRepo.find({
        where: warehouseItemIds.map((id) => ({ id })),
      });

      if (warehouseItems.length !== warehouseItemIds.length) {
        const foundIds = warehouseItems.map((item) => item.id);
        const missingIds = warehouseItemIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new NotFoundException(
          `Warehouse item(s) with ID(s) "${missingIds.join(', ')}" not found`,
        );
      }

      // Verify all items belong to the specified warehouse
      const invalidItems = warehouseItems.filter(
        (item) => item.warehouseId !== dto.warehouseId,
      );
      if (invalidItems.length > 0) {
        throw new BadRequestException(
          `Some warehouse items do not belong to the specified warehouse`,
        );
      }

      // Calculate order totals
      let totalQuantity = 0;
      let totalPrice = 0;
      let totalWeight = 0;
      const orderItemsData: Partial<OrderItemEntity>[] = [];

      for (const itemInput of dto.items) {
        const warehouseItem = warehouseItems.find(
          (wi) => wi.id === itemInput.warehouseItemId,
        );
        
        if (!warehouseItem) {
          throw new NotFoundException(
            `Warehouse item with ID "${itemInput.warehouseItemId}" not found`,
          );
        }

        const quantity = Number(itemInput.quantity);

        if (warehouseItem.quantity < quantity) {
          throw new BadRequestException(
            `Insufficient quantity for item "${warehouseItem.name}". Available: ${warehouseItem.quantity}, Requested: ${quantity}`,
          );
        }

        const unitPrice = Number(warehouseItem.pricePerItem);
        // Use provided totalPrice or calculate it
        const itemTotalPrice =
          itemInput.totalPrice !== undefined
            ? Number(itemInput.totalPrice)
            : unitPrice * quantity;
        // Use provided totalWeight or calculate from weightPerItem
        const itemTotalWeight =
          itemInput.totalWeight !== undefined
            ? Number(itemInput.totalWeight)
            : warehouseItem.weightPerItem
            ? Number(warehouseItem.weightPerItem) * quantity
            : 0;

        totalQuantity += quantity;
        totalPrice += itemTotalPrice;
        totalWeight += itemTotalWeight;

        orderItemsData.push({
          warehouseItemId: itemInput.warehouseItemId,
          quantity,
          unitPrice,
          totalPrice: itemTotalPrice,
          totalWeight: itemTotalWeight,
        });
      }

      // Create order with pending status
      const order = this.orderRepo.create({
        warehouseId: dto.warehouseId,
        countryOriginId: dto.countryOriginId,
        pickupAddressId: dto.pickupAddressId,
        quantityOrdered: totalQuantity,
        unitPrice: totalPrice / totalQuantity || 0,
        totalPrice,
        totalWeight,
        orderStatus: 'pending',
        paymentStatus: 'pending',
      });

      const savedOrder = await this.orderRepo.save(order);

      // Create order items
      const orderItems = orderItemsData.map((itemData) =>
        this.orderItemRepo.create({
          ...itemData,
          orderId: savedOrder.id,
        }),
      );
      await this.orderItemRepo.save(orderItems);

      // Fetch complete order with relations
      const completeOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: [
          'warehouse',
          'countryOrigin',
          'pickupAddress',
          'orderItems',
          'orderItems.warehouseItem',
        ],
      });

      return {
        message: 'Order created successfully with pending status',
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
        `Failed to create order: ${error.message}`,
      );
    }
  }
}
