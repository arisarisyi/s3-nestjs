import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaAdminService implements OnModuleInit {
  private readonly kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-admin-client',
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
  }

  async onModuleInit() {
    try {
      await this.ensureTopicExists(process.env.KAFKA_TOPIC);
    } catch (error) {
      console.error('[KafkaAdminService] Error ensuring topic exists:', error);
    }
  }

  async ensureTopicExists(topicName: string) {
    const admin = this.kafka.admin();
    await admin.connect();

    // Periksa apakah topic sudah ada
    const topics = await admin.listTopics();
    if (!topics.includes(topicName)) {
      await admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 3,
            replicationFactor: 2,
          },
        ],
      });
      console.log(
        `[KafkaAdminService] Topic "${topicName}" created successfully`,
      );
    } else {
      console.log(`[KafkaAdminService] Topic "${topicName}" already exists`);
    }

    await admin.disconnect();
  }
}
