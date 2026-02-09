import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './warehouse.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { WarehouseEntity } from './entities/warehouse.entity';
import { WarehouseItemEntity } from '../warehouse-item/entities/warehouse-item.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([WarehouseEntity, WarehouseItemEntity]),
  ],
  controllers: [WarehouseController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class WarehouseModule {}

