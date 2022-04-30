import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateHeroRequest } from '../../requests/CreateHeroRequest'
import { getUserId } from '../utils';
import { createHero } from '../../businessLogic/Heros'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newHero: CreateHeroRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createHero(newHero, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)