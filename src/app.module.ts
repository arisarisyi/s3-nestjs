import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AwsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
