import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllHeros } from '../../businessLogic/Heros'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const Heros = await getAllHeros(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: Heros
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)