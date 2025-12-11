import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nHelperService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, args?: Record<string, any>, lang?: string): string {
    if (lang) {
      return this.i18n.translate(key, { lang, args });
    }
    const context = I18nContext.current();
    return context
      ? context.translate(key, { args })
      : this.i18n.translate(key, { args });
  }

  translateError(key: string, args?: Record<string, any>, lang?: string): string {
    return this.translate(`errors.${key}`, args, lang);
  }

  translateSuccess(key: string, args?: Record<string, any>, lang?: string): string {
    return this.translate(`success.${key}`, args, lang);
  }

  translateValidation(key: string, args?: Record<string, any>, lang?: string): string {
    return this.translate(`validation.${key}`, args, lang);
  }
}

