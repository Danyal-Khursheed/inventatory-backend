import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationError } from 'class-validator';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  const useHttps = process.env.USE_HTTPS === 'true';
  const httpsOptions = useHttps
    ? {
        cert: fs.readFileSync(process.env.HTTPS_CERT_PATH || './certs/cert.pem'),
        key: fs.readFileSync(process.env.HTTPS_KEY_PATH || './certs/key.pem'),
      }
    : undefined;

  const app = await NestFactory.create(AppModule, {
    cors: true,
    httpsOptions,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription(
      'The backend api to connect with the Inventory Management app',
    )
    .setVersion('1.0')
    .addTag('Inventory Management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        // Format validation errors properly
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
          return {
            property: error.property,
            value: error.value,
            constraints: error.constraints || {},
            messages: constraints,
          };
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  const port = process.env.PORT ?? 8000;
  const host = process.env.SERVER_HOST || 'localhost';
  const protocol = useHttps ? 'https' : 'http';
  
  await app.listen(port, host, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║  Inventory Management API - NestJS Backend                ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  Server: ${protocol.toUpperCase()}://${process.env.SERVER_HOST || 'localhost'}:${port}             ║
    ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)}║
    ║  Swagger UI: ${protocol}://${process.env.SERVER_HOST || 'localhost'}:${port}/api     ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
  });
}

bootstrap();
