import { Router } from 'express'

const routes = new Router()
console.log('Routes file loaded')

// Defina suas rotas aqui
routes.get('/', (req, res) => {
  res.send('Hello World!')
})
export default routes
