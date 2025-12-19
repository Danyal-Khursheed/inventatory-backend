import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DashboardUsersModule } from './user-management/dashboard-users.module';
import { RolesModule } from './roles-management/roles.module';
import { PermissionsModule } from './permissions-management/permissions.module';

import {
  I18nModule,
  I18nJsonLoader,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { I18nHelperModule } from './i18n/i18n.module';
import { packagesModule } from './package/package.module';
import { CompanyOriginModule } from './companies_origin_management/companies-origin.module';
import { PickupAddressModule } from './pickup-address/pickup-address.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [
        {
          use: AcceptLanguageResolver,
          options: {
            matchType: 'loose',
          },
        },
      ],
    }),
    I18nHelperModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    // DashboardUsersModule,
    // RolesModule,
    // PermissionsModule,
    packagesModule,
    CompanyOriginModule,
    PickupAddressModule,
  ],

  providers: [AppService],
})
export class AppModule {}
