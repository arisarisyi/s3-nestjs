import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { generateAuthToken } from 'aws-msk-iam-sasl-signer-js';
import * as dotenv from 'dotenv';
dotenv.config();

async function oauthBearerTokenProvider() {
  const authTokenResponse = await generateAuthToken({
    region: process.env.AWS_REGION,
    logger: console,
    awsDebugCreds: true, // Hanya untuk troubleshooting, hapus di production
  });
  return {
    value: authTokenResponse.token,
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const brokers = process.env.KAFKA_BROKERS.split(',').map((broker) =>
    broker.trim(),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nestjs-consumer-client',
        brokers: brokers,
        ssl: true,
        sasl: {
          mechanism: 'oauthbearer',
          oauthBearerProvider: () => oauthBearerTokenProvider(),
        },
        connectionTimeout: 30000,
        authenticationTimeout: 30000,
      },
      consumer: {
        groupId: 'my-kafka-consumer-group',
        allowAutoTopicCreation: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Aplikasi berjalan pada port 3000');
}

bootstrap();
