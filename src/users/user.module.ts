import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UserEntity } from './entity/users.entity';
import commandHandlers from './commands/handlers';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [...commandHandlers],
})
export class UsersModule {}
