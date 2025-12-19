import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingCompanyController } from './shipping-company.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { ShippingCompanyEntity } from './entities/shipping-company.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ShippingCompanyEntity])],
  controllers: [ShippingCompanyController],
  providers: [...commandHandlers, ...queryHandlers],
  exports: [TypeOrmModule],
})
export class ShippingCompanyModule {}

