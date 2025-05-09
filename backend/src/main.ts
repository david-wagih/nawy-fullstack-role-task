import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Serving uploads from:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Apartment API')
    .setDescription('The apartment API description')
    .setVersion('1.0')
    .addTag('apartments')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
