import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from '../impl/create-company.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/companies-management/entity/create-company.entity';
import { BadRequestException } from '@nestjs/common';
import { I18nHelperService } from 'src/i18n/i18n.service';
import { I18nContext } from 'nestjs-i18n';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler
  implements ICommandHandler<CreateCompanyCommand>
{
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly i18nHelper: I18nHelperService,
  ) {}

  async execute(command: CreateCompanyCommand): Promise<any> {
    const { dto } = command;

    const existingCompany = await this.companyRepository.findOne({
      where: { companyName: dto.companyName },
    });

    if (existingCompany) {
      const lang = I18nContext.current()?.lang || 'en';
      const message = this.i18nHelper.translateError('companyNameExist', {}, lang);
      throw new BadRequestException(message);
    }

    const company = this.companyRepository.create({
      logo: dto.logo,
      companyName: dto.companyName,
      description: dto.description,
      email: dto.email,
      address: dto.address,
      countryCode: dto.countryCode,
      phoneNumber: dto.phoneNumber,
    });

    await this.companyRepository.save(company);

    const lang = I18nContext.current()?.lang || 'en';
    const message = this.i18nHelper.translateSuccess('companyCreated', {}, lang);

    return { message };
  }
}
