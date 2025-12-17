import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickupAddressController } from './pickup-address.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { PickupAddressEntity } from './entities/pickup-address.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PickupAddressEntity])],
  controllers: [PickupAddressController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class PickupAddressModule {}

