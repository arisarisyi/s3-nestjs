import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  // Buat instance HTTP server
  const app = await NestFactory.create(AppModule);
  const brokers = process.env.KAFKA_BROKERS.split(',').map((broker) =>
    broker.trim(),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: brokers,
        ssl: true, // Pastikan SSL diaktifkan
        sasl: {
          mechanism: 'scram-sha-512', // atau 'plain' tergantung konfigurasi MSK
          username: process.env.AWS_ACCESS_KEY,
          password: process.env.AWS_SECRET_KEY,
        },
      },
      consumer: {
        groupId: 'my-kafka-consumer-group', // Group ID consumer Anda
      },
    },
  });

  // Mulai microservice dan HTTP server
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Aplikasi berjalan pada port 3000');
}

bootstrap();
