import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingCompanyEntity } from '../../entities/shipping-company.entity';
import { DeleteShippingCompanyCommand } from '../impl/delete-shipping-company.command';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(DeleteShippingCompanyCommand)
export class DeleteShippingCompanyHandler
  implements ICommandHandler<DeleteShippingCompanyCommand>
{
  constructor(
    @InjectRepository(ShippingCompanyEntity)
    private readonly shippingCompanyRepo: Repository<ShippingCompanyEntity>,
  ) {}

  async execute(command: DeleteShippingCompanyCommand) {
    try {
      const { id } = command;

      const shippingCompany = await this.shippingCompanyRepo.findOne({
        where: { id },
      });
      if (!shippingCompany) {
        throw new NotFoundException(
          `Shipping company with ID "${id}" not found`,
        );
      }

      await this.shippingCompanyRepo.remove(shippingCompany);

      return { message: 'Shipping company deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete shipping company: ${error.message}`,
      );
    }
  }
}

