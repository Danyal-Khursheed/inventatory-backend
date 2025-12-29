import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { CreateShippingCompanyCommand } from '../impl/create-shipping-company.command';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateShippingCompanyCommand)
export class CreateShippingCompanyHandler
  implements ICommandHandler<CreateShippingCompanyCommand>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute(command: CreateShippingCompanyCommand) {
    try {
      const { dto } = command;

      const shippingCompany = this.shippingCompanyRepo.create(dto);
      const saved = await this.shippingCompanyRepo.save(shippingCompany);

      return {
        message: 'Shipping company created successfully',
        result: saved,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create shipping company: ${error.message}`,
      );
    }
  }
}

