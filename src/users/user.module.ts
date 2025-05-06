import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UserEntity } from './entities/users.entity';
import commandHandlers from './commands/handlers';
import { OtpEntity } from './entities/otp.entity';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, OtpEntity, CompanyEntity]),
  ],
  controllers: [UsersController],
  providers: [...commandHandlers],
})
export class UsersModule {}
