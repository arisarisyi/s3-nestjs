import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload-image')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const upload = await this.awsService.upload(
        file.buffer,
        file.originalname,
      );
      return upload;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
