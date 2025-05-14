import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from '../impl/update-company.command';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyCommandHandler
  implements ICommandHandler<UpdateCompanyCommand>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async execute(command: UpdateCompanyCommand): Promise<any> {
    const { dto } = command;
    const { companyId, ...updateData } = dto;

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.update(companyId, updateData);

    return { message: 'Company updated successfully' };
  }
}
