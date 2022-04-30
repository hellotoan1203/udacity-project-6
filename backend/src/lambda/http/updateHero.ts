import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateHero } from '../../businessLogic/Heros'
import { UpdateHeroRequest } from '../../requests/UpdateHeroRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const heroId = event.pathParameters.heroId
    const updatedHero: UpdateHeroRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateHero(heroId, updatedHero, userId)
    return {
      statusCode: 204,
      body: ''
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )