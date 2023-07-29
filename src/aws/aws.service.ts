import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async upload(fileName: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: fileName,
        Body: file,
      }),
    );
    return { status: 'Success', msg: 'File uploaded' };
  }

  async getImageFromS3(fileName: string) {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
          Key: fileName,
        }),
      );

      return response.Body.transformToString();
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      return error.message;
    }
  }
}
