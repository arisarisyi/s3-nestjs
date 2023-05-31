import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as awsConfig } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

awsConfig.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
bootstrap();
