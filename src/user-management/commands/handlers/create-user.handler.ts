import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/users.entity';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from '../impl/create-user.command';

function generateRandomPassword(length = 8): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { dto } = command;

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const company = await this.companyRepository.findOne({
      where: { companyName: dto.companyName },
      select: ['id'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const randomPassword = generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = this.userRepository.create({
      ...dto,
      role: dto.role ?? 'user',
      password: hashedPassword,
      companyId: company.id,
    });

    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      message: 'User Created Successfully',
      user: rest,
      plainPassword: randomPassword,
    };
  }
}
