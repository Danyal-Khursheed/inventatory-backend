import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesController } from './package.controller';
import commandHandlers from './commands/handlers';
import queryHandlers from './queries/handlers';
import { PackageEntity } from './entities/package.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PackageEntity])],
  controllers: [PackagesController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class packagesModule {}
