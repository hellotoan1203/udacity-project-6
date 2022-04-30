import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('AttachmentUtils')


export class AttachmentUtils {

  constructor(
    private readonly s3: S3 = createS3Client(),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getUploadUrl(heroId: string): Promise<string> {
    logger.info(`Get presigned URL url for Hero ${heroId} with bucket ${this.bucketName}`)
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: heroId,
      Expires: parseInt(this.urlExpiration)
    })
    return url;
  }

  getAttachmentUrl(heroId: string): string {
    logger.info(`Get attachment URL for Hero ${heroId} on bucket ${this.bucketName}`)
    return `https://${this.bucketName}.s3.amazonaws.com/${heroId}`;
  }
}

function createS3Client(): S3 {

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });
  return s3;
}