import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DashboardUsersModule } from './user-management/dashboard-users.module';
import { RolesModule } from './roles-management/roles.module';
import { PermissionsModule } from './permissions-management/permissions.module';
import { CompaniesModule } from './companies-management/companies.module';

@Module({
  imports: [
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
    DashboardUsersModule,
    RolesModule,
    PermissionsModule,
    CompaniesModule,
  ],

  providers: [AppService],
})
export class AppModule {}
