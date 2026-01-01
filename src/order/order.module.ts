import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ShippingCompanyEntity } from '../shipping-company/entities/shipping-company.entity';
import { WarehouseEntity } from '../warehouse/entities/warehouse.entity';
import { WarehouseItemEntity } from '../warehouse-item/entities/warehouse-item.entity';
import { CompanyOrigin } from '../companies_origin_management/entity/companies.entity';
import { PickupAddressEntity } from '../pickup-address/entities/pickup-address.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ShippingCompanyEntity,
      WarehouseEntity,
      WarehouseItemEntity,
      CompanyOrigin,
      PickupAddressEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [...commandHandlers],
})
export class OrderModule {}

