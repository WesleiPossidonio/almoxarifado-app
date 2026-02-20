import Jwt from 'jsonwebtoken'
import authConfig from '../../config/auth.js'

export default (request, response, next) => {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authToken.split(' ')

  try {
    const decoded = Jwt.verify(token, authConfig.secret)

    request.userId = decoded.id
    request.userName = decoded.name

    return next()
  } catch {
    return response.status(401).json({ error: 'Token is invalid' })
  }
}
