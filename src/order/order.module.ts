import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { OrderEntity } from './entities/order.entity';
import { OrderPackageEntity } from './entities/order-package.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ReceiverEntity } from './entities/receiver.entity';
import { SenderEntity } from './entities/sender.entity';
import { SenderAddressEntity } from './entities/sender-address.entity';
import { ShippingCompanyEntity } from '../shipping-company/entities/shipping-company.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderPackageEntity,
      OrderItemEntity,
      ReceiverEntity,
      SenderEntity,
      SenderAddressEntity,
      ShippingCompanyEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class OrderModule {}

