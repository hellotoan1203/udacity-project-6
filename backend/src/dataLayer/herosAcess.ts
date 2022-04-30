import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { HeroItem } from '../models/HeroItem'
import { HeroUpdate } from '../models/HeroUpdate';
const logger = createLogger('HerosAccess')
export class HerosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly HerosTable = process.env.HEROES_TABLE) {
  }

  async getAllHeros(userId: string): Promise<HeroItem[]> {
    logger.info('Getting all Heros for user ', userId)

    const result = await this.docClient.query({
      TableName: this.HerosTable,
      KeyConditionExpression: '#userId =:i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    }).promise();

    const items = result.Items
    return items as HeroItem[]
  }

  async createHero(Hero: HeroItem): Promise<HeroItem> {
    logger.info('Creating new Hero item')
    await this.docClient.put({
      TableName: this.HerosTable,
      Item: Hero
    }).promise()
    logger.info('Created new Hero item')
    return Hero
  }

  async updateHero(Hero: HeroUpdate, userId: string, heroId: string): Promise<HeroUpdate> {
    logger.info(`Updating Hero ${heroId} for user ${userId}`)
    const params = {
      TableName: this.HerosTable,
      Key: {
        userId: userId,
        heroId: heroId
      },
      ExpressionAttributeNames: {
        '#Hero_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': Hero.name,
        ':dueDate': Hero.dueDate,
        ':done': Hero.done,
      },
      UpdateExpression: 'SET #Hero_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();

    logger.info('Result of update statement', { result: result });

    return result.Attributes as HeroUpdate;
  }

  async updateAttachmentUrl(userId: string, heroId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for Hero ${heroId} of user ${userId} with URL ${attachmentUrl}`)
    const params = {
      TableName: this.HerosTable,
      Key: {
        userId: userId,
        heroId: heroId
      },
      ExpressionAttributeNames: {
        '#Hero_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      UpdateExpression: 'SET #Hero_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW',
    };

    const result = await this.docClient.update(params).promise();
    logger.info('Result of update statement', { result: result });
  }

  async deleteHero(heroId: string, userId: string) {
    logger.info(`Deleting Hero ${heroId} of user ${userId}`)

    await this.docClient.delete({
      TableName: this.HerosTable,
      Key: {
        userId: userId,
        heroId: heroId
      }
    }).promise();

    logger.info('Deleted Hero successfully');
  }
}

function createDynamoDBClient(): DocumentClient {
  const service = new AWS.DynamoDB();
  const client = new AWS.DynamoDB.DocumentClient({
    service: service
  });
  AWSXRay.captureAWSClient(service);
  return client;
}