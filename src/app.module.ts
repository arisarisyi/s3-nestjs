import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AwsModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
