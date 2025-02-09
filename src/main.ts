import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Buat instance HTTP server
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [
          'b-2.democluster1.kw4wm2.c3.kafka.ap-southeast-1.amazonaws.com:9098',
          'b-1.democluster1.kw4wm2.c3.kafka.ap-southeast-1.amazonaws.com:9098',
          'b-3.democluster1.kw4wm2.c3.kafka.ap-southeast-1.amazonaws.com:9098',
        ],
        ssl: true, // Pastikan SSL diaktifkan
        sasl: {
          mechanism: 'scram-sha-256',
          username: 'imamalarisyi',
          password: 'Lamb0fGod!',
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
