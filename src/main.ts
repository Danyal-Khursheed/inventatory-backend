import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription('The backend api to connect with the Inventory Management app')
    .setVersion('1.0')
    .addTag('Inventory Management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
}
bootstrap();