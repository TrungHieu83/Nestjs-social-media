import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
import { config } from 'dotenv';

config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('NestJs project')
    .setDescription('NestJs project API - ver 1.0')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'refresh-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const adminConfig: ServiceAccount = {
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "privateKey": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: process.env.STORAGE_BUCKET
  });
  await app.listen(process.env.PORT || 3000)
}
bootstrap();
