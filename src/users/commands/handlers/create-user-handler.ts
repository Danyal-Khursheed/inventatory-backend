/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateUserCommand } from '../impl/createUser.command';
import { UserEntity } from 'src/users/entity/users.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CreateUserCommand): Promise<Partial<UserEntity>> {
    const existingUserWithEmail = await this.userRepository.findOne({
      where: { email: command.email },
    });

    if (existingUserWithEmail)
      throw new BadRequestException('Email already exist');

    const existingUserWithUsername = await this.userRepository.findOne({
      where: { userName: command.userName },
    });

    if (existingUserWithUsername)
      throw new BadRequestException('Username already exist');



    const user = this.userRepository.create(command);
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
}