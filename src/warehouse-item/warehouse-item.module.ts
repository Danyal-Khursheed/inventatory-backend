import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseItemController } from './warehouse-item.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { WarehouseItemEntity } from './entities/warehouse-item.entity';
import { WarehouseEntity } from '../warehouse/entities/warehouse.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([WarehouseItemEntity, WarehouseEntity]),
  ],
  controllers: [WarehouseItemController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class WarehouseItemModule {}

