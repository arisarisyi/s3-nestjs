import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nestjs-producer',
            brokers: process.env.KAFKA_BROKERS.split(',').map((broker) =>
              broker.trim(),
            ),
            ssl: true,
            sasl: {
              mechanism: 'oauthbearer',
              oauthBearerProvider: async () => {
                const { generateAuthToken } = await import(
                  'aws-msk-iam-sasl-signer-js'
                );
                const authTokenResponse = await generateAuthToken({
                  region: process.env.AWS_REGION,
                });
                return { value: authTokenResponse.token };
              },
            },
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
})
export class KafkaModule {}
