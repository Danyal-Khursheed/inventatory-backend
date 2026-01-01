import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyOriginCommand } from '../impl/create-company-origin.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyOrigin } from 'src/companies_origin_management/entity/companies.entity';
import { WarehouseEntity } from 'src/warehouse/entities/warehouse.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateCompanyOriginCommand)
export class CreateCompanyOriginHandler
  implements ICommandHandler<CreateCompanyOriginCommand>
{
  constructor(
    @InjectRepository(CompanyOrigin)
    private readonly companyOriginRepo: Repository<CompanyOrigin>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
  ) {}

  async execute(command: CreateCompanyOriginCommand): Promise<any> {
    try {
      const { dto } = command;

      // Verify warehouse exists
      const warehouse = await this.warehouseRepo.findOne({
        where: { id: dto.warehouseId },
      });
      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse with ID "${dto.warehouseId}" not found`,
        );
      }

      const create = await this.companyOriginRepo.create(dto);
      await this.companyOriginRepo.save(create);

      return { message: 'Company created successfully', result: create };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create company origin: ${error.message}`,
      );
    }
  }
}
