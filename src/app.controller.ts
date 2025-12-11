import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18nHelperService } from './i18n/i18n.service';
import { I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly i18nHelper: I18nHelperService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-i18n')
  testI18n() {
    const lang = I18nContext.current()?.lang || 'en';
    
    return {
      currentLanguage: lang,
      testMessages: {
        success: this.i18nHelper.translateSuccess('companyCreated', {}, lang),
        error: this.i18nHelper.translateError('companyNotFound', {}, lang),
        validation: this.i18nHelper.translateValidation('email', {}, lang),
      },
      note: lang === 'ar' 
        ? 'تم تعيين اللغة إلى العربية بنجاح!' 
        : 'Language is set to English successfully!',
    };
  }
}
