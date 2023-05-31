import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  async upload(dataBuffer: Buffer, fileName: string) {
    try {
      const s3 = new S3();

      const uploadResult = await s3
        .upload({
          Bucket: process.env.BUCKET_NAME,
          Body: dataBuffer,
          Key: `${fileName}`,
        })
        .promise();

      return { key: uploadResult.Key, url: uploadResult.Location };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
