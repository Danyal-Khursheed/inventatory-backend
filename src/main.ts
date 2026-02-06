import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

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
  await app.listen(port);
}
bootstrap();
