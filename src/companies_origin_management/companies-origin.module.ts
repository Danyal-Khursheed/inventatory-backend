import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesOrigin } from './companies-origin.controller';
import { CompanyOrigin } from './entity/companies.entity';
import { WarehouseEntity } from '../warehouse/entities/warehouse.entity';
import CommandHandlers from './commands/handler';
import QueryHandlers from './queries/handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CompanyOrigin, WarehouseEntity]),
  ],
  controllers: [CountriesOrigin],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class CompanyOriginModule {}
