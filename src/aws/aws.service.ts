import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor() {
    // Inisialisasi S3Client dengan konfigurasi region dan credentials
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }

  async upload(dataBuffer: Buffer, fileName: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: fileName,
        Body: dataBuffer,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      return { key: fileName, url };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
