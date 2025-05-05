import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import commandHandlers from './commands/handlers';
import { UserEntity } from 'src/users/entities/users.entity';
import { CompanyEntity } from './entity/create-company.entity';
import { CompanyController } from './companies.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity, CompanyEntity])],
  controllers: [CompanyController],
  providers: [...commandHandlers],
})
export class CompaniesModule {}
