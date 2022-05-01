// Hero: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3d9wqly9jl'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-kyjjqrvl.us.auth0.com',            // Auth0 domain
  clientId: 'HMCwKqJPXeueTEzkxIYEdVPz5iAKMiZw',          // Auth0 client id
  callbackUrl: 'http://udacity-capstone-frontend.s3-website-ap-southeast-1.amazonaws.com/callback'
}
