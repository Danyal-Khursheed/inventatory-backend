import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderStatisticsQuery } from '../impl/get-order-statistics.query';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { WarehouseEntity } from '../../../warehouse/entities/warehouse.entity';
import { WarehouseItemEntity } from '../../../warehouse-item/entities/warehouse-item.entity';
import { CompanyOrigin } from '../../../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../../../pickup-address/entities/pickup-address.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(GetOrderStatisticsQuery)
export class GetOrderStatisticsHandler
  implements IQueryHandler<GetOrderStatisticsQuery>
{
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
    @InjectRepository(WarehouseEntity)
    private warehouseRepo: Repository<WarehouseEntity>,
    @InjectRepository(WarehouseItemEntity)
    private warehouseItemRepo: Repository<WarehouseItemEntity>,
    @InjectRepository(CompanyOrigin)
    private companyOriginRepo: Repository<CompanyOrigin>,
    @InjectRepository(PickupAddressEntity)
    private pickupAddressRepo: Repository<PickupAddressEntity>,
  ) {}

  async execute(): Promise<any> {
    try {
      const [
        totalOrders,
        pendingOrders,
        completedOrders,
        totalWarehouses,
        totalWarehouseItems,
        totalCountryOrigins,
        totalPickupAddresses,
      ] = await Promise.all([
        this.orderRepo.count(),
        this.orderRepo.count({ where: { orderStatus: 'pending' } }),
        this.orderRepo.count({ where: { orderStatus: 'delivered' } }),
        this.warehouseRepo.count(),
        this.warehouseItemRepo.count(),
        this.companyOriginRepo.count(),
        this.pickupAddressRepo.count(),
      ]);

      return {
        statistics: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalWarehouses,
          totalWarehouseItems,
          totalCountryOrigins,
          totalPickupAddresses,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve statistics: ${error.message}`,
      );
    }
  }
}

