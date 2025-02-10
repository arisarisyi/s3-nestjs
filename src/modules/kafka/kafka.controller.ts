import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('kafka')
export class KafkaController {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Post('publish')
  async publishMessage(
    @Body('topic') topic: string,
    @Body('message') message: string,
  ) {
    try {
      this.kafkaClient.emit(topic, message);
      return {
        success: true,
        message: `Message published to topic "${topic}"`,
      };
    } catch (error) {
      console.error('[API] Error publishing message:', error);
      return { success: false, message: 'Failed to publish message' };
    }
  }

  @MessagePattern('test-topic')
  handleIncomingMessage(@Payload() message: any) {
    console.log('[Consumer] Received message:', message.value.toString());
  }
}
