import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private readonly kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
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
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async publishMessage(topic: string, message: string) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log(
        `[Producer] Message published to topic "${topic}": ${message}`,
      );
    } catch (error) {
      console.error('[Producer] Error publishing message:', error);
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
