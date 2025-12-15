import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { RegisterUserCommand } from '../impl/register-user.command';
import { UserEntity } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@CommandHandler(RegisterUserCommand)
export class CreateUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const { dto } = command;

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      countryCode: dto.countryCode,
      phoneNumber: dto.phoneNumber,
      role: 'admin',
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return this.authService.login(user);
  }
}
